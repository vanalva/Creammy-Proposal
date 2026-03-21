#!/usr/bin/env node
/**
 * Van Alva Proposal Builder v2
 *
 * Reads a manifest.json, loads template blocks, generates dynamic content,
 * injects variables, and outputs a complete proposal HTML file.
 *
 * All creative copy comes from manifest.content (written by the skill).
 * Structural/catalog data comes from data/*.json files.
 *
 * Usage: node build/build.js [manifest.json] [--output dir]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');
const BLOCKS = path.join(TEMPLATES, 'blocks');
const DATA = path.join(ROOT, 'data');
const DEFAULT_OUTPUT = path.join(ROOT, 'output');

// ── Load helpers ─────────────────────────────────────────────────────────────

function loadJSON(filepath) {
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

function loadData() {
  return {
    services: loadJSON(path.join(DATA, 'catalog', 'services.json')),
    retainers: loadJSON(path.join(DATA, 'catalog', 'retainers.json')),
    discounts: loadJSON(path.join(DATA, 'catalog', 'discounts.json')),
    payments: loadJSON(path.join(DATA, 'catalog', 'payments.json')),
    methodology: loadJSON(path.join(DATA, 'content', 'methodology.json')),
    introductions: loadJSON(path.join(DATA, 'content', 'introductions.json')),
    valueProps: loadJSON(path.join(DATA, 'content', 'value-props.json')),
    projectContract: loadJSON(path.join(DATA, 'contracts', 'project-clauses.json')),
    retainerContract: loadJSON(path.join(DATA, 'contracts', 'retainer-clauses.json')),
  };
}

// ── Template engine ──────────────────────────────────────────────────────────

function substitute(html, vars) {
  return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] !== undefined ? String(vars[key]) : match;
  });
}

function loadBlock(name) {
  const filepath = path.join(BLOCKS, name + '.html');
  if (!fs.existsSync(filepath)) {
    console.warn(`  [WARN] Block not found: ${name}.html — skipping`);
    return '';
  }
  return fs.readFileSync(filepath, 'utf-8');
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Format price consistently with es-ES locale (matches pricing.js in browser)
function fmtPrice(n) {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('es-ES');
}

// Monkey-patch Number.prototype.toLocaleString to always use es-ES
// This ensures ALL .toLocaleString() calls in build.js match the browser
const _origToLocaleString = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function(locale, opts) {
  return _origToLocaleString.call(this, locale || 'es-ES', opts);
};

// ── Price override resolution ────────────────────────────────────────────────
// Resolves a pricing override to a numeric price.
// Supports: number (legacy), { variant: "name" } (resolves from catalog), or null.
function resolveOverride(override, catalogService) {
  if (override === undefined || override === null) return null;
  if (typeof override === 'number') return override;
  if (typeof override === 'object' && override.variant) {
    const pv = catalogService?.pricing?.priceVariants;
    if (!pv) return catalogService?.pricing?.basePrice || null;
    const variant = pv[override.variant];
    if (variant === undefined) return catalogService?.pricing?.basePrice || null;
    return typeof variant === 'object' ? variant.price : variant;
  }
  return null;
}

// Shorthand: get effective price for a service given overrides map
function getServicePrice(svcId, overrides, allServices) {
  const svc = allServices[svcId];
  if (!svc) return 0;
  const override = overrides?.[svcId];
  const resolved = resolveOverride(override, svc);
  return resolved !== null ? resolved : (svc.pricing.basePrice || 0);
}

// ── Structured item helpers (Phase 4) ────────────────────────────────────────
// Detects whether an include/deliverable item is a flat string or structured object.
// All functions handle both formats transparently for backwards compatibility.

function isStructuredItem(item) {
  return item !== null && typeof item === 'object' && typeof item.text === 'string';
}

// Get display text from an item (string or structured)
function itemText(item) {
  if (typeof item === 'string') return item;
  if (!isStructuredItem(item)) return String(item || '');
  // Apply quantity template if present
  if (item.quantityLabel && item.quantity != null) {
    return item.quantityLabel.replace('{{quantity}}', item.quantity);
  }
  return item.text;
}

// Evaluate a deliverable-level condition object
// Returns true if the item should be shown
function evaluateItemCondition(condition, activeVariant, selectedServices, context) {
  if (!condition) return true;

  // Variant condition: { "variant": ["full", "standard"] }
  if (condition.variant) {
    if (!activeVariant || !condition.variant.includes(activeVariant)) return false;
  }

  // Service dependency: { "service": "shakefront-full" }
  if (condition.service) {
    if (!selectedServices || !selectedServices.includes(condition.service)) return false;
  }

  // Negative service: { "notService": "shakefront-full" }
  if (condition.notService) {
    if (selectedServices && selectedServices.includes(condition.notService)) return false;
  }

  // Context: { "context": "retainer" }
  if (condition.context) {
    if (context?.type !== condition.context) return false;
  }

  // Tier level: { "tierLevel": { "min": 2 } }
  if (condition.tierLevel) {
    const lvl = context?.tierLevel ?? -1;
    if (condition.tierLevel.min != null && lvl < condition.tierLevel.min) return false;
    if (condition.tierLevel.max != null && lvl > condition.tierLevel.max) return false;
  }

  return true;
}

// Resolve an array of items (mixed flat strings + structured objects)
// Applies variant scaling, evaluates conditions, returns normalized items
function resolveItems(items, activeVariant, selectedServices, context) {
  if (!items) return [];
  return items.map(item => {
    // Flat string — pass through as-is
    if (typeof item === 'string') return { text: item, _legacy: true };

    // Structured object
    if (!isStructuredItem(item)) return null;

    let resolved = { ...item };

    // Apply variant scaling if present
    if (resolved.variantScaling && activeVariant && resolved.variantScaling[activeVariant]) {
      const scaled = resolved.variantScaling[activeVariant];
      if (scaled.hidden) return null; // hidden for this variant
      resolved = { ...resolved, ...scaled };
    }

    // Evaluate condition
    if (!evaluateItemCondition(resolved.condition, activeVariant, selectedServices, context)) {
      return null;
    }

    // Resolve quantity in text
    if (resolved.quantityLabel && resolved.quantity != null) {
      resolved.displayText = resolved.quantityLabel.replace('{{quantity}}', resolved.quantity);
    } else {
      resolved.displayText = resolved.text;
    }

    return resolved;
  }).filter(Boolean);
}

// ── Service content merge (3D) ───────────────────────────────────────────────
// Merges base includes/deliverables from catalog with per-proposal overrides.
// Handles both flat strings and structured objects (Phase 4 dual-format).

function mergeServiceContent(base, overrides, activeVariant, selectedServices, context) {
  // First resolve structured items
  let items = resolveItems(base, activeVariant, selectedServices, context);

  if (!overrides) return items;

  // Remove items matching removeIncludes (matches against display text)
  if (overrides.removeIncludes) {
    items = items.filter(item => {
      const text = item.displayText || item.text || '';
      return !overrides.removeIncludes.some(r => text.includes(r));
    });
  }

  // Add new items
  if (overrides.addIncludes) {
    const additions = overrides.addIncludes.map(i =>
      typeof i === 'string' ? { text: i, _legacy: true, displayText: i } : { ...i, displayText: i.text }
    );
    items = items.concat(additions);
  }

  return items;
}

function mergeDeliverables(base, overrides, activeVariant, selectedServices, context) {
  let items = resolveItems(base, activeVariant, selectedServices, context);

  if (!overrides) return items;

  if (overrides.removeDeliverables) {
    items = items.filter(item => {
      const text = item.displayText || item.text || '';
      return !overrides.removeDeliverables.some(r => text.includes(r));
    });
  }

  if (overrides.addDeliverables) {
    const additions = overrides.addDeliverables.map(i =>
      typeof i === 'string' ? { text: i, _legacy: true, displayText: i } : { ...i, displayText: i.text }
    );
    items = items.concat(additions);
  }

  return items;
}

// Get the active variant name for a service from the manifest overrides
function activeVariantFor(svcId, manifest) {
  const override = manifest?.pricing?.overrides?.[svcId];
  if (!override) return null;
  if (typeof override === 'object' && override.variant) return override.variant;
  return null; // numeric override = no variant name
}

// Get display-ready text from a resolved item (for HTML rendering)
function renderItemText(item) {
  if (typeof item === 'string') return item;
  return item.displayText || item.text || '';
}

// ── Clause condition evaluator (3A) ──────────────────────────────────────────

function evaluateClauseCondition(condition, selectedServices, retainerTier) {
  if (!condition || condition === 'always') return true;

  // Handle tier conditions
  if (condition.startsWith('tier.')) {
    if (!retainerTier) return false;
    if (condition.includes('tier.level')) {
      const match = condition.match(/tier\.level\s*([<>=!]+)\s*(\d+)/);
      if (match) {
        const op = match[1];
        const val = parseInt(match[2]);
        const level = retainerTier.level || 0;
        if (op === '<') return level < val;
        if (op === '<=') return level <= val;
        if (op === '>') return level > val;
        if (op === '>=') return level >= val;
        if (op === '===') return level === val;
      }
    }
    if (condition.includes('tier.id')) {
      const match = condition.match(/tier\.id\s*===\s*'([^']+)'/);
      if (match) return retainerTier.id === match[1];
    }
    return false;
  }

  // Handle service conditions: AND/OR with services.includes('x')
  const parts = condition.split(/\s+AND\s+/);
  return parts.every(part => {
    const orParts = part.split(/\s+OR\s+/);
    return orParts.some(expr => {
      const negated = expr.trim().startsWith('NOT ');
      const clean = expr.trim().replace(/^NOT\s+/, '');
      const match = clean.match(/services\.includes\('([^']+)'\)/);
      if (!match) return false;
      const pattern = match[1];
      let found;
      if (pattern.includes('*')) {
        const prefix = pattern.replace('*', '');
        found = selectedServices.some(s => s.startsWith(prefix));
      } else {
        found = selectedServices.includes(pattern);
      }
      return negated ? !found : found;
    });
  });
}

// ── Contract terms generator (3A) ────────────────────────────────────────────

function generateContractTerms(manifest, data) {
  const m = manifest;
  const selected = [...(m.services?.core || []), ...(m.services?.addons || [])];
  const hasRetainer = !!m.services?.retainer;
  const projectClauses = data.projectContract?.clauses || {};
  const retainerClauses = data.retainerContract?.clauses || {};
  const bank = data.payments?.bankInfo?.spain || {};
  const bankOther = data.payments?.bankInfo?.other || {};

  // Determine retainer tier if applicable
  let retainerTier = null;
  if (hasRetainer && m.services.retainer) {
    const templateId = m.retainerTemplate || 'standard';
    const template = data.retainers?.templates?.[templateId];
    if (template?.tiers) {
      retainerTier = template.tiers[m.services.retainer] || null;
    }
  }

  // Template vars for clause substitution
  const clauseVars = {
    clientName: `${m.client?.contactName || ''} ${m.client?.contactLastName || ''}`.trim(),
    clientOrg: m.client?.organization || m.client?.name || '',
    projectName: `${m.client?.name || ''} — ${m.brand?.tagline || 'Proyecto'} × Van Alva`,
    designerName: 'Juan Carlos Vannini Alvarez — Van Alva',
    date: m.date || new Date().toISOString().slice(0, 10),
  };

  let html = '';

  // Generate project contract clauses
  html += '<h3>Información del Contrato</h3>';
  html += `<p><strong>Nombre del Proyecto:</strong> ${esc(clauseVars.projectName)}</p>`;
  html += `<p><strong>Cliente / Representante:</strong> ${esc(clauseVars.clientName)} — ${esc(clauseVars.clientOrg)}</p>`;
  html += `<p><strong>Diseñador responsable:</strong> ${esc(clauseVars.designerName)}</p>`;
  html += '<hr class="terms-section-divider">';

  // Iterate project clauses (skip header, we did it manually)
  const clauseOrder = [
    'confidentiality', 'clientApproval', 'revisions',
    'terminationBranding', 'terminationWebDev', 'terminationDesigner',
    'webflowTerms', 'domainTerms', 'contentNotice',
    'communicationPause', 'intellectualProperty', 'fileDelivery',
    'postDelivery', 'clientIntervention', 'refunds',
  ];

  for (const clauseId of clauseOrder) {
    const clause = projectClauses[clauseId];
    if (!clause) continue;
    if (!evaluateClauseCondition(clause.condition, selected, retainerTier)) continue;

    // Title
    if (clause.title) html += `<h3>${esc(clause.title)}</h3>`;
    else if (clauseId === 'confidentiality') html += '<h3>Confidencialidad</h3>';
    else if (clauseId === 'clientApproval') html += '<h3>Aprobación del Cliente</h3>';
    else if (clauseId === 'revisions') html += '<h3>Revisiones y Expectativas</h3>';
    else if (clauseId === 'communicationPause') html += '<h3>Comunicación, Pausas y Finalización</h3>';
    else if (clauseId === 'intellectualProperty') html += '<h3>Propiedad Intelectual y Créditos</h3>';
    else if (clauseId === 'fileDelivery') html += '<h3>Entrega de Archivos</h3>';
    else if (clauseId === 'postDelivery') html += '<h3>Soporte Post-Entrega</h3>';
    else if (clauseId === 'refunds') html += '<h3>Reembolsos</h3>';
    else if (clauseId === 'contentNotice') html += '<h3>Aviso Importante — Contenido</h3>';
    else if (clauseId === 'clientIntervention') html += '<h3>Intervención del Cliente</h3>';

    // Content
    if (clause.variants) {
      const hasBroadcast = selected.includes('hot-press');
      const variant = hasBroadcast ? 'broadcast' : 'standard';
      html += `<p>${clause.variants[variant] || clause.variants.standard}</p>`;
    } else if (clause.perServiceDisplay) {
      // Dynamic revisions clause — show per-service table if services have revision data
      const allSvcCatalog = data.services?.services || {};
      const svcWithRevisions = selected.filter(id => allSvcCatalog[id]?.revisions);

      if (svcWithRevisions.length > 0) {
        html += `<p>${clause.templateIntro || ''}</p>`;
        html += '<table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:0.85rem;">';
        html += '<thead><tr style="border-bottom:1px solid rgba(255,255,255,0.15);"><th style="text-align:left;padding:0.5rem;">Servicio</th><th style="text-align:center;padding:0.5rem;">Rondas</th><th style="text-align:left;padding:0.5rem;">Alcance</th><th style="text-align:right;padding:0.5rem;">Extra</th></tr></thead><tbody>';

        for (const id of selected) {
          const svc = allSvcCatalog[id];
          if (!svc) continue;
          const rev = svc.revisions || { rounds: clause.defaultRounds || 3 };
          const overageText = rev.overagePrice ? `\u20AC${rev.overagePrice}/ronda` : '\u2014';
          html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
            <td style="padding:0.4rem 0.5rem;font-weight:500;">${esc(svc.name)}</td>
            <td style="padding:0.4rem 0.5rem;text-align:center;color:#f0ff3d;font-weight:600;">${rev.rounds}</td>
            <td style="padding:0.4rem 0.5rem;opacity:0.7;font-size:0.8rem;">${esc(rev.scope || 'Ajustes dentro del alcance original')}</td>
            <td style="padding:0.4rem 0.5rem;text-align:right;">${overageText}</td>
          </tr>`;
        }

        html += '</tbody></table>';
        html += `<p>${clause.templateOutro || ''}</p>`;
      } else {
        // No services have revision data — use fallback
        html += `<p>${clause.fallbackText || clause.text || ''}</p>`;
      }
    } else if (clause.text) {
      html += `<p>${clause.text}</p>`;
    } else if (clause.sections) {
      for (const [secId, secText] of Object.entries(clause.sections)) {
        html += `<h4>${esc(secId.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()))}</h4>`;
        html += `<p>${secText}</p>`;
      }
    }

    html += '<hr class="terms-section-divider">';
  }

  // Payment section — supports paymentSplits, paymentOverride, milestonePayments, and paymentStructure
  const paymentOverrideId = m.pricing?.paymentOverride || m.pricing?.paymentStructure;
  const paymentStructure = data.payments?.structures?.[paymentOverrideId];
  html += '<h3>Forma de Pago</h3>';
  html += '<div class="terms-highlight">';
  if (m.pricing?.milestonePayments?.length) {
    // Milestone-based payments linked to project phases
    for (const mp of m.pricing.milestonePayments) {
      const amount = mp.amount || (pricing.totalOneTime ? Math.round(pricing.totalOneTime * mp.percentage / 100) : null);
      html += `<p><strong>${mp.percentage}%</strong> — ${esc(mp.label)}${amount ? ` (\u20AC${amount.toLocaleString()})` : ''}</p>`;
    }
  } else if (m.pricing?.paymentSplits?.length) {
    for (const split of m.pricing.paymentSplits) {
      html += `<p><strong>${split.percentage}%</strong> — ${esc(split.trigger)}${split.amount ? ` (\u20AC${split.amount.toLocaleString()})` : ''}</p>`;
    }
  } else if (paymentStructure?.splits) {
    for (const split of paymentStructure.splits) {
      html += `<p><strong>${split.percentage}%</strong> — ${esc(split.label)}</p>`;
    }
  } else {
    html += '<p><strong>70%</strong> \u2014 Al comenzar el trabajo</p><p><strong>30%</strong> \u2014 Al finalizar y entregar el proyecto</p>';
  }
  html += '</div>';
  html += `<p>${projectClauses.payment?.template || ''}</p>`;
  html += '<hr class="terms-section-divider">';

  // Bank info
  html += '<h3>Métodos de Pago</h3>';
  html += '<dl class="terms-payment-grid">';
  html += `<dt>España (${esc(bank.bank || 'BBVA')})</dt><dd>${esc(bank.iban || '')}</dd>`;
  html += `<dt>BIC/SWIFT</dt><dd>${esc(bank.bic || '')} — a nombre de ${esc(bank.holder || '')}</dd>`;
  html += `<dt>Otros métodos</dt><dd>${esc(bankOther.note || 'Consultar')}</dd>`;
  html += '</dl>';

  // Timeline section from service catalog
  html += '<hr class="terms-section-divider">';
  html += '<h3>Tiempos de Entrega Estimados</h3>';
  html += '<ul>';
  const allSvc = data.services?.services || {};
  for (const id of selected) {
    const svc = allSvc[id];
    if (!svc || !svc.timeline) continue;
    const tl = svc.timeline;
    const timeStr = tl.unit === 'ongoing' ? 'Servicio continuo'
      : `${tl.min}-${tl.max} ${tl.unit === 'weeks' ? 'semanas' : tl.unit === 'days' ? 'días' : tl.unit}`;
    html += `<li><strong>${esc(svc.name)}:</strong> ${timeStr}</li>`;
  }
  html += '</ul>';

  // Retainer terms (if applicable)
  if (hasRetainer) {
    html += '<hr class="terms-section-divider">';
    html += '<h3>Términos del Retainer Mensual</h3>';
    for (const [clauseId, clause] of Object.entries(retainerClauses)) {
      if (clauseId === 'header' || clauseId === 'confidentiality' || clauseId === 'signature') continue;
      if (!evaluateClauseCondition(clause.condition, selected, retainerTier)) continue;
      if (clause.title) html += `<h4>${esc(clause.title)}</h4>`;
      if (clause.text) html += `<p>${clause.text}</p>`;
    }
  }

  return html;
}

// ── Bank info HTML (3B) ──────────────────────────────────────────────────────

function generateBankInfoHTML(data) {
  const bank = data.payments?.bankInfo?.spain || {};
  const other = data.payments?.bankInfo?.other || {};
  return `<dl class="terms-payment-grid">
    <dt>España (${esc(bank.bank || 'BBVA')})</dt>
    <dd>${esc(bank.iban || '')}</dd>
    <dt>BIC/SWIFT</dt>
    <dd>${esc(bank.bic || '')} — a nombre de ${esc(bank.holder || '')}</dd>
    <dt>Otros métodos</dt>
    <dd>${esc(other.note || 'Consultar')}</dd>
  </dl>`;
}

// ── Retainer modal generator (3E) ────────────────────────────────────────────

function tierIncludesToList(inc) {
  const items = [];
  if (inc.designPieces) items.push(`${inc.designPieces} piezas de diseño`);
  if (inc.vectorDesigns) items.push(`${inc.vectorDesigns} diseños vectoriales`);
  if (inc.vectorAlterations) items.push(`${inc.vectorAlterations} alteraciones vectoriales`);
  if (inc.photoRetouch === 'unlimited') items.push('Retoque fotográfico ilimitado');
  else if (inc.basicPhotoRetouch) items.push('Retoque fotográfico básico');
  if (inc.posts) items.push(`${inc.posts} publicaciones para Instagram`);
  if (inc.carousels) items.push(`${inc.carousels} carruseles (hasta ${inc.carouselMaxSlides || 10} slides)`);
  if (inc.storyAdaptations) items.push(`${inc.storyAdaptations} adaptaciones a historias`);
  if (inc.reels) items.push(`${inc.reels} videos/reels ${inc.reelFrequency || ''}`);
  if (inc.tca === 'unlimited') items.push('TCA ilimitadas');
  else if (inc.tca) items.push(`${inc.tca} TCA incluida(s)`);
  if (inc.tcc === 'unlimited') items.push('TCC ilimitadas');
  else if (inc.tcc) items.push(`${inc.tcc} TCC incluida(s)`);
  if (inc.webMaintenance) items.push('Mantenimiento web incluido');
  if (inc.adobeExpressScheduling) items.push('Programación en Adobe Express');
  if (inc.corporatePresentations) items.push(`${inc.corporatePresentations} presentaciones corporativas`);
  if (inc.stockLibrary) items.push('Librería de stock incluida');
  if (inc.printFilePrep) items.push('Preparación de archivos para imprenta');
  if (inc.aiPrompting) items.push('AI prompting incluido');
  if (inc.editableTemplates) items.push('Plantillas editables incluidas');
  if (inc.phase3WebDev) items.push('Desarrollo web avanzado incluido');
  return items;
}

function generateRetainerModal(manifest, data) {
  const templateId = manifest.retainerTemplate || 'standard';
  const template = data.retainers?.templates?.[templateId];
  if (!template) return '<!-- no retainer template -->';

  const tiers = template.tiers || {};
  const accent = '#f0ff3d';

  // Tier cards
  let tiersHtml = '';
  for (const [tierId, tier] of Object.entries(tiers)) {
    const includes = tierIncludesToList(tier.includes || {});
    tiersHtml += `
    <div class="tier-card">
      <div class="tier-level">Nivel ${tier.level} · ${esc(tier.subtitle || '')}</div>
      <div class="tier-name">${esc(tier.name)}</div>
      <div class="tier-price">€${tier.price.toLocaleString()}<span>/mes + IVA</span></div>
      <ul class="tier-list">
        ${includes.map(i => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
    </div>`;
  }

  // TCC services table
  const tccItems = data.retainers?.tccServices?.items || [];
  let tccHtml = '';
  if (tccItems.length) {
    tccHtml = `
    <div class="section-title">Tareas Creativas Complejas (TCC)</div>
    <div class="sub-section">
      <p>Proyectos de mayor envergadura que se contratan adicionalmente al paquete mensual:</p>
      <ul>${tccItems.map(t => `<li><strong>${esc(t.name)}</strong>: ${t.price === 'project' ? 'Según alcance' : '€' + t.price}</li>`).join('\n        ')}</ul>
    </div>`;
  }

  // TCA services table
  const tcaItems = data.retainers?.tcaServices?.items || [];
  let tcaHtml = '';
  if (tcaItems.length) {
    tcaHtml = `
    <div class="section-title">Tareas Creativas Adicionales (TCA)</div>
    <div class="sub-section">
      <ul>${tcaItems.map(t => `<li><strong>${esc(t.name)}</strong>: desde €${t.price}</li>`).join('\n        ')}</ul>
    </div>`;
  }

  // Volume discounts
  const volHtml = `
    <div class="section-title">Descuentos por Volumen (TCC)</div>
    <table class="discount-table">
      <tr><th>TCC en ventana de 2 meses</th><th>Descuento</th></tr>
      <tr><td>1ª TCC</td><td>5%</td></tr>
      <tr><td>2ª TCC</td><td>10%</td></tr>
      <tr><td>3ª TCC o más</td><td>20%</td></tr>
    </table>`;

  // Promo section
  let promoHtml = '';
  if (manifest.retainerPromo !== false && data.retainers?.launchPromotion) {
    const promo = data.retainers.launchPromotion;
    promoHtml = `
    <div class="section-title" style="color:${accent};">Promoción de Lanzamiento</div>
    <div class="sub-section" style="border-left: 3px solid ${accent}; padding-left: 1rem;">
      <p><strong>${promo.discount}% de descuento</strong> en el primer mes de cualquier paquete.</p>
      <p>Además incluye:</p>
      <ul>${(promo.bonusServices || []).map(s => `<li>${esc(s)}</li>`).join('\n        ')}</ul>
    </div>`;
  }

  return `
    <h2 style="font-size:1.8rem;margin-bottom:2rem;">Suscripción Mensual de Servicios Creativos</h2>
    <p class="paragraph-lg" style="opacity:0.7;margin-bottom:3rem;">Compromiso mínimo de ${template.minimumCommitment || 3} meses. Después, mes a mes con opción de cancelación.</p>
    ${tiersHtml}
    ${tccHtml}
    ${tcaHtml}
    ${volHtml}
    ${promoHtml}
    ${generateBankInfoHTML(data)}
  `;
}

// ── Pricing engine ───────────────────────────────────────────────────────────

function calculatePricing(manifest, data) {
  const allServices = { ...data.services.services };
  const selected = [...(manifest.services.core || []), ...(manifest.services.addons || [])];
  const discountRules = data.discounts.bundleDiscounts || [];

  const result = {};
  let totalOneTime = 0;
  let totalMonthly = 0;
  let totalSavings = 0;

  for (const id of selected) {
    const svc = allServices[id];
    if (!svc) {
      console.warn(`  [WARN] Service not in catalog: ${id}`);
      continue;
    }

    let price = svc.pricing.basePrice || 0;
    let status = 'normal';
    let original = price;
    let label = '';

    const resolvedOverride = manifest.pricing.overrides ? resolveOverride(manifest.pricing.overrides[id], svc) : null;
    if (resolvedOverride !== null) {
      price = resolvedOverride;
      original = svc.pricing.basePrice || 0;
      // Gap #9: Enforce minimum pricing floor
      const minPrice = svc.pricing.minimumPrice || svc.pricing.priceRange?.min || 0;
      if (minPrice && price < minPrice && !manifest.pricing.specialDiscount) {
        console.warn(`  [WARN] Override for ${id} (€${price}) below minimum (€${minPrice}). Using minimum.`);
        price = minPrice;
      }
      status = price < original ? 'discount' : 'normal';
    }

    for (const rule of discountRules) {
      if (rule.target !== id) continue;
      const trigger = rule.trigger;
      let applies = false;
      if (trigger.selected && selected.includes(trigger.selected)) applies = true;
      if (trigger.anySelected && trigger.anySelected.some(s => selected.includes(s))) applies = true;
      if (applies) {
        price = rule.effect.price;
        status = rule.effect.type;
        label = rule.effect.label || '';
        original = svc.pricing.basePrice || 0;
        if (price < original) totalSavings += (original - price);
      }
    }

    if (manifest.services.retainer && data.discounts.retainerDiscount) {
      const rd = data.discounts.retainerDiscount;
      if (rd.appliesTo.includes(id) && status === 'normal') {
        const discounted = Math.round(price * (1 - rd.percentage / 100));
        totalSavings += (price - discounted);
        original = price;
        price = discounted;
        status = 'discount';
      }
    }

    if (manifest.pricing.specialDiscount) {
      const sd = data.discounts.specialDiscounts[manifest.pricing.specialDiscount];
      if (sd && sd.percentage && status === 'normal') {
        const discounted = Math.round(price * (1 - sd.percentage / 100));
        totalSavings += (price - discounted);
        original = price;
        price = discounted;
        status = 'discount';
      }
    }

    result[id] = { name: svc.name, price, original, status, label, monthly: svc.pricing.monthly || false };
    if (svc.pricing.monthly) totalMonthly += price;
    else totalOneTime += price;
  }

  return { services: result, totalOneTime, totalMonthly, totalSavings };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HTML GENERATORS
// Each function takes manifest content and returns HTML using the design system.
// ═══════════════════════════════════════════════════════════════════════════════

// ── Utility: Tag chips ───────────────────────────────────────────────────────

function generateTags(tags) {
  if (!tags || !tags.length) return '';
  return tags.map(t => `<div class="tag"><div>${esc(t)}</div></div>`).join('\n                  ');
}

// ── Service Cards (sticky scroll) ────────────────────────────────────────────

function generateServiceCards(manifest) {
  const cards = manifest.content?.serviceCards;
  if (!cards || !cards.length) return '<!-- no service cards -->';

  const margins = ['0', '1rem', '2rem', '3rem', '4rem', '5rem', '6rem', '7rem'];
  return cards.map((card, i) => {
    const margin = margins[i] || `${i}rem`;
    const marginClass = i === 0 ? '' : ` utility-margin-top-${margin.replace('rem', '')}rem`;
    const marginStyle = i === 0 ? '' : '';
    return `
                <div class="utility-position-sticky top-120px">
                  <div class="card${i > 0 ? ` utility-margin-top-${i}rem` : ''} utility-backdrop-filter-blur card-on-secondary">
                    <div class="card-body utility-aspect-3x2">
                      <div class="eyebrow">${esc(card.eyebrow)}</div>
                      <h2>${esc(card.heading)}</h2>
                      <p class="paragraph-lg">${card.description}</p>
                    </div>
                  </div>
                </div>`;
  }).join('\n');
}

// ── Brief Tabs ───────────────────────────────────────────────────────────────

function generateBriefTabs(manifest, variant) {
  const brief = manifest.brief || {};
  const tabs = manifest.content?.briefTabs || [
    { title: 'Introducción', tags: ['Sobre el proyecto', 'Mi percepción', 'Oportunidad clara'], body: `<p>${brief.intro || ''}</p>` },
    { title: 'Brief Creativo', tags: ['Historia', 'Objetivo', 'Estrategia'], body: `<p>${brief.creativeBrief || ''}</p>` },
    { title: 'Necesidades', tags: ['Servicios', 'Entregables'], body: `<p>${brief.needs || ''}</p>` },
    { title: 'Puntos Clave', tags: ['Enfoque', 'USP', 'Diferenciación'], body: `<p>${brief.keyPoints || ''}</p>` },
  ];

  const clientName = manifest.client?.name || '';
  const isMobile = variant === 'mobile';
  const sectionClass = isMobile ? 'section mobile' : 'section desktop';
  const menuClass = isMobile
    ? 'grid-layout desktop-3-column mobile-portrait-1-column grid-gap-xs mobile w-tab-menu'
    : 'grid-layout desktop-3-column mobile-portrait-1-column grid-gap-xs w-tab-menu';

  const menuItems = tabs.map((tab, i) => {
    const current = i === 0 ? ' w--current' : '';
    const inline = i === tabs.length - 1 ? ' w-inline-block' : '';
    return `            <a data-w-tab="Tab ${i+1}" class="tab-menu-link-transparent${inline} w-tab-link${current}">
              <div class="paragraph-lg utility-text-align-center utility-margin-bottom-0">${esc(tab.title)}</div>
            </a>`;
  }).join('\n');

  const panes = tabs.map((tab, i) => {
    const active = i === 0 ? ' w--tab-active' : '';
    const tagsHtml = generateTags(tab.tags);
    return `            <div data-w-tab="Tab ${i+1}" class="w-tab-pane${active}">
              <div class="w-layout-grid grid-layout desktop-3-column grid-gap-lg">
                <div class="paragraph-xl utility-text-secondary">${esc(clientName)}</div>
                <div class="flex-vertical x-left flex-gap-xxs">
                  ${tagsHtml}
                </div>
                <h2 class="h1-heading utility-margin-bottom-0">${esc(tab.title)}</h2>
                <div>
                  <div class="rich-text paragraph-lg w-richtext">
                    ${tab.body}
                  </div>
                </div>
              </div>
            </div>`;
  }).join('\n');

  return `    <section class="${sectionClass}">
      <div class="container">
        <div data-duration-out="100" data-current="Tab 1" data-duration-in="300" class="grid-layout desktop-5-column grid-gap-md w-tabs">
          <div class="${menuClass}">
${menuItems}
          </div>
          <div class="tabs-content w-tab-content">
${panes}
          </div>
        </div>
      </div>
    </section>`;
}

// ── Complementary Cards ──────────────────────────────────────────────────────

function generateComplementaryCards(manifest) {
  const cards = manifest.content?.complementaryCards;
  if (!cards || !cards.length) return '<!-- no complementary cards -->';

  // Cloudinary video URLs for the alternating video cards
  const defaultVideos = [
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943440/everything-that-has-transpired-has-done-so-according-to-my-design_ql73lp.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943440/edit_povy09.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943441/i-think-santa-claus-left-you-a-little-something-extra-in-there-too_zcxlpy.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943442/silky_vu5iiy.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943441/nobody-panics-when-things-go-according-to-plan_rwkc7s.mp4',
  ];

  const items = [];
  cards.forEach((card, i) => {
    // Video before card
    const videoUrl = defaultVideos[i % defaultVideos.length];
    items.push(`
          <div class="card">
            <div class="video-container full w-embed">
              <div class="video-container">
                <video class="hover-video" muted="" loop="" playsinline="" preload="auto">
                  <source src="${videoUrl}">
                  Your browser does not support the video tag.
                </video>
                <button class="unmute-button">🔊 Unmute</button>
              </div>
            </div>
          </div>`);

    // Content card
    items.push(`
          <div class="card">
            <div class="card-body utility-aspect-3x2 middle">
              <div class="eyebrow">${esc(card.eyebrow)}</div>
              <h2>${esc(card.heading)}</h2>
              <p class="paragraph-lg">${card.description}</p>
              <div class="paragraph info">*Para saber que incluye, accedan al documento </div>
              <div class="sg-spacing"></div>
              <a href="#pricing-cart" class="button secondary-button w-button">Detalle y desglose</a>
            </div>
          </div>`);
  });

  // Optional retainer CTA card
  const accent = '#f0ff3d';
  items.push(`
          <div class="card" style="background: ${accent} !important; background-image: none !important; border: 2px solid ${accent};">
            <div class="card-body utility-aspect-3x2 middle">
              <div class="eyebrow" style="color: rgba(0,0,0,0.5);">Retainer / Suscripción Mensual Creativa</div>
              <h2 style="color: #000;">Un equipo creativo dedicado, todos los meses</h2>
              <p class="paragraph-lg" style="color: rgba(0,0,0,0.7);">¿Necesitas soporte continuo? Con el retainer obtienes horas mensuales de diseño, desarrollo, contenido y estrategia bajo un solo plan. Compromiso mínimo de 3 meses, con 15% de descuento en servicios principales. Desde €1,500/mes.</p>
              <div class="paragraph info" style="color: rgba(0,0,0,0.45);">*4 planes disponibles según tus necesidades</div>
              <div class="sg-spacing"></div>
              <a href="#" onclick="RetainerPage.open(); return false;" class="button secondary-button w-button" style="background: #000; color: ${accent}; border-color: #000;">Ver Estructura Completa</a>
            </div>
          </div>`);

  return items.join('\n');
}

// ── Methodology Cards (Load / Aim / Shoot) ───────────────────────────────────

function generateMethodologyCards(manifest, data) {
  // 3C: Use manifest content if provided, fall back to data/content/methodology.json
  let cards = manifest.content?.methodologyCards;
  if (!cards || !cards.length) {
    const phases = data?.methodology?.methodology?.phases;
    if (phases) {
      cards = Object.values(phases).map(p => ({
        eyebrow: p.subtitle, heading: p.name, description: p.description
      }));
    }
  }
  if (!cards || !cards.length) return '<!-- no methodology cards -->';

  // Auto-append Reload card if not present and project has maintenance services
  const hasReload = cards.some(c => (c.heading || '').toLowerCase() === 'reload');
  if (!hasReload) {
    const selected = [...(manifest.services?.core || []), ...(manifest.services?.addons || [])];
    const hasMaintenanceServices = selected.some(id => ['barista', 'the-grinder'].includes(id)) || manifest.services?.retainer;
    if (hasMaintenanceServices) {
      const reloadPhase = data?.methodology?.methodology?.phases?.reload;
      cards.push({
        eyebrow: reloadPhase?.subtitle || 'Refinamiento y Crecimiento',
        heading: 'Reload',
        description: reloadPhase?.description || 'El proyecto no termina en el lanzamiento. Refinamos, extendemos y mantenemos. Tu marca y tu plataforma evolucionan contigo.'
      });
    }
  }

  const animations = ['ix-card-slide-up-1', 'ix-card-slide-up-2', 'ix-card-slide-up-3'];
  const arrowSvg = `<svg width="100%" height="100%" viewbox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.65625 24.6796L25.0155 7.32037M25.0155 7.32037L8.35062 7.32037M25.0155 7.32037V23.9853" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

  return cards.map((card, i) => `
            <div class="card stack-card utility-backdrop-filter-blur">
              <div class="flex-vertical utility-height-100">
                <div class="utility-height-100">
                  <div class="card-header">
                    <div class="eyebrow">${esc(card.eyebrow)}</div>
                    <div class="icon-medium w-embed">${arrowSvg}</div>
                  </div>
                </div>
                <div class="card-body">
                  <h2>${esc(card.heading)}</h2>
                  <p class="paragraph-lg">${card.description}</p>
                </div>
              </div>
            </div>`).join('\n');
}

// ── Methodology Tabs (4-phase detailed) ──────────────────────────────────────

function generateMethodologyTabs(manifest, data) {
  // 3C: Use manifest content if provided, fall back to data/content/methodology.json
  let tabs = manifest.content?.methodologyTabs;
  if (!tabs || !tabs.length) {
    const dt = data?.methodology?.methodology?.detailedTabs;
    if (dt) {
      // Auto-filter tabs by project categories (from selected services)
      const allSvc = data.services?.services || {};
      const selected = [...(manifest.services?.core || []), ...(manifest.services?.addons || [])];
      const projectCategories = new Set();
      for (const id of selected) {
        const svc = allSvc[id];
        if (svc?.category) projectCategories.add(svc.category);
      }
      tabs = Object.values(dt)
        .filter(t => {
          if (!t.applicableTo) return true;
          return t.applicableTo.some(cat => projectCategories.has(cat));
        })
        .map(t => ({
          title: t.name,
          phase: t.phase || null,
          heading: t.name,
          body: `<p>${t.content}</p>`
        }));
    }
  }
  if (!tabs || !tabs.length) return '<!-- no methodology tabs -->';

  // Auto-inject phase tags by matching tab titles to known phases
  const phaseMap = {
    'investigación': 'Load', 'investigacion': 'Load', 'research': 'Load', 'estrategia': 'Load',
    'diseño': 'Aim', 'diseno': 'Aim', 'design': 'Aim',
    'desarrollo': 'Aim', 'construction': 'Aim', 'webflow': 'Aim',
    'producción': 'Shoot', 'produccion': 'Shoot', 'production': 'Shoot',
    'lanzamiento': 'Shoot', 'launch': 'Shoot', 'entrega': 'Shoot', 'migración': 'Shoot',
    'mantenimiento': 'Reload', 'reload': 'Reload', 'refinamiento': 'Reload', 'crecimiento': 'Reload',
  };
  tabs.forEach(function(tab) {
    if (!tab.phase) {
      const titleLower = (tab.title || '').toLowerCase();
      for (const [keyword, phase] of Object.entries(phaseMap)) {
        if (titleLower.includes(keyword)) { tab.phase = phase; break; }
      }
    }
  });

  // Auto-append Reload/Mantenimiento tab if project has web/maintenance services and no Reload tab exists
  const hasReloadTab = tabs.some(t => t.phase === 'Reload');
  if (!hasReloadTab) {
    const selected = [...(manifest.services?.core || []), ...(manifest.services?.addons || [])];
    const hasMaintenanceServices = selected.some(id => ['barista', 'the-grinder'].includes(id)) || manifest.services?.retainer;
    if (hasMaintenanceServices) {
      const reloadData = data?.methodology?.methodology?.detailedTabs?.mantenimiento;
      tabs.push({
        title: reloadData?.name || 'Mantenimiento',
        phase: 'Reload',
        heading: 'Refinamiento y Crecimiento',
        body: `<p>${reloadData?.content || 'El lanzamiento no es el final — es el principio de la siguiente fase. Refinamos, extendemos y mantenemos.'}</p>`
      });
    }
  }

  const defaultVideos = [
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943441/load_rli5hv.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742957745/aim-careful-and-look-the-devil-in-the-eye_hrz93m.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943442/shoot_zpwwoi.mp4',
    'https://res.cloudinary.com/dn53emznt/video/upload/v1742943441/oh-well-plan-b-let_s-just-kill-each-other_aioeev.mp4',
  ];

  const menuItems = tabs.map((tab, i) => {
    const current = i === tabs.length - 1 ? ' w--current' : '';
    const inline = i === tabs.length - 1 ? ' w-inline-block' : '';
    const phaseTag = tab.phase
      ? `<span style="display:inline-block;font-size:0.6rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#000;background:#f0ff3d;padding:2px 8px;border-radius:3px;margin-left:8px;vertical-align:middle;">${esc(tab.phase)}</span>`
      : '';
    return `            <a data-w-tab="Tab ${i+1}" class="tab-menu-link-transparent${inline} w-tab-link${current}">
              <div class="paragraph-lg utility-text-align-center utility-margin-bottom-0">${esc(tab.title)}${phaseTag}</div>
            </a>`;
  }).join('\n');

  const panes = tabs.map((tab, i) => {
    const active = i === tabs.length - 1 ? ' w--tab-active' : '';
    const video = tab.video || defaultVideos[i % defaultVideos.length];
    return `            <div data-w-tab="Tab ${i+1}" class="w-tab-pane${active}">
              <div class="w-layout-grid grid-layout desktop-5-column grid-gap-sm utility-padding-all-2rem">
                <h3 id="w-node-_9d6f0189-cba0-6c66-8c3b-f69d6b7185e2-3b2b8438" class="h2-heading utility-text-align-center w-node-_374e2ae7-c478-0599-3ced-a7476863290c-5b211c3a"><span>${esc(tab.title)}:</span> ${esc(tab.heading)}</h3>
                <div id="w-node-_255178d7-abbf-ce09-25fd-c51726928f9b-5b211c3a" class="video-container w-embed">
                  <div class="video-container">
                    <video class="hover-video" muted="" loop="" playsinline="" preload="auto">
                      <source src="${video}">
                      Your browser does not support the video tag.
                    </video>
                    <button class="unmute-button">🔊 Unmute</button>
                  </div>
                </div>
                <div id="w-node-c6b4a992-7490-4424-ba2d-e440acce12ed-5b211c3a" class="rich-text paragraph-lg w-richtext">
                  ${tab.body}
                </div>
              </div>
            </div>`;
  }).join('\n');

  return `        <div data-duration-out="100" data-current="Tab ${tabs.length}" data-duration-in="300" class="w-tabs">
          <div class="w-tab-menu" role="tablist" style="display:flex;justify-content:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:2.5rem;">
${menuItems}
          </div>
          <div class="w-tab-content">
${panes}
          </div>
        </div>`;
}

// ── Feature Cards (grid) ─────────────────────────────────────────────────────

function generateFeatureCards(manifest) {
  const features = manifest.content?.featureCards;
  if (!features || !features.length) return '<!-- no feature cards -->';

  // Default SVG icons for feature cards (rotate through them)
  const icons = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 24 24" fill="none"><path d="M4 12C8.41828 12 12 8.41828 12 4C12 8.41828 15.5817 12 20 12C15.5817 12 12 15.5817 12 20C12 15.5817 8.41828 12 4 12Z" stroke-width="1.5" stroke-linejoin="round" stroke="currentColor"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 24 24" fill="none"><path d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z" stroke="currentColor" stroke-width="1.5"></path><path d="M9 12L11 14L15.5 9.5" stroke="currentColor" stroke-width="1.5"></path></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 24 24" fill="none"><path d="M5.25 6.75H18.75V17.25H5.25V6.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><path d="M5.25 6.75L12 12L18.75 6.75" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>',
    '<svg width="100%" height="100%" viewbox="0 0 24 24" fill="none"><path d="M17.3654 5.32894C17.8831 5.54543 18.3534 5.86273 18.7495 6.26274C19.146 6.6625 19.4604 7.13723 19.675 7.65978C19.8895 8.18233 20 8.74246 20 9.30814C20 9.87384 19.8895 10.4339 19.675 10.9565C19.4604 11.4791 19.146 11.9538 18.7495 12.3535L12.0001 19L5.2496 12.3535C4.44951 11.5457 4 10.4501 4 9.3076C4 8.16516 4.44951 7.0695 5.2496 6.26166C6.04975 5.45384 7.13498 5 8.26647 5C9.39804 5 10.4833 5.45384 11.2833 6.26166L12.016 6.99843L12.7158 6.26274C13.112 5.86273 13.5823 5.54543 14.0999 5.32894C14.6176 5.11246 15.1724 5.00103 15.7327 5.00103C16.2929 5.00103 16.8478 5.11246 17.3654 5.32894Z" stroke-width="1.5" stroke-linejoin="round" stroke="currentColor"></path></svg>',
  ];

  return features.map((f, i) => `
          <div class="card secondary-card">
            <div class="card-body features">
              <div class="icon utility-margin-bottom-1rem">${icons[i % icons.length]}</div>
              <h3 class="h4-heading">${esc(f.heading)}</h3>
              <p class="paragraph-sm utility-margin-bottom-0">${f.description}</p>
            </div>
          </div>`).join('\n');
}

// ── Proposal Detail (the big one) ────────────────────────────────────────────
// Generates the entire proposal-detail section: tabs + pricing cart + contract

function generateProposalDetail(manifest, pricing, data) {
  const m = manifest;
  const c = m.content || {};
  const clientName = m.client?.name || '';
  const clientFirst = m.client?.contactName || '';

  // ── Proposal content tabs ──
  // 3A: Auto-append "Términos" tab from contract data (unless manifest already has one)
  const rawTabs = c.proposalTabs || [];
  const hasTermsTab = rawTabs.some(t => t.title === 'Términos');
  const allTabs = hasTermsTab ? rawTabs : [
    ...rawTabs,
    { title: 'Términos', body: generateContractTerms(m, data) }
  ];

  let tabMenuHtml = '';
  let tabPanesHtml = '';

  if (allTabs.length) {
    tabMenuHtml = allTabs.map((tab, i) => {
      const current = i === 0 ? ' w--current' : '';
      return `            <a data-w-tab="Tab ${i+1}" class="tab-menu-link-transparent w-inline-block w-tab-link${current}" role="tab">
              <div class="paragraph-lg utility-text-align-center utility-margin-bottom-0">${esc(tab.title)}</div>
            </a>`;
    }).join('\n');

    tabPanesHtml = allTabs.map((tab, i) => {
      const active = i === 0 ? ' w--tab-active' : '';
      return `            <div data-w-tab="Tab ${i+1}" class="w-tab-pane${active}">
              <div class="rich-text paragraph-lg w-richtext utility-padding-all-2rem">
                ${tab.body}
              </div>
            </div>`;
    }).join('\n');
  }

  // ── Package cards ──
  const packages = m.pricing?.packages || [];
  const allSvcCatalog = data.services.services || {};
  let packagesHtml = '';
  if (packages.length) {
    packagesHtml = `
          <div class="pricing-section-label">Paquetes Recomendados</div>
          <div class="pricing-section-subtitle">Mi selección pensada para ${esc(clientName)} — o personaliza más abajo</div>
          <div class="packages-grid utility-margin-bottom-4rem">
${packages.map(pkg => {
  const badge = pkg.badge ? `<div class="package-badge">${esc(pkg.badge)}</div>` : '';
  const monthly = pkg.totalMonthly ? `<div class="package-monthly">+ €${pkg.totalMonthly.toLocaleString()}/mes</div>` : '';
  const savings = pkg.savings ? `<div class="package-savings">Ahorro de €${pkg.savings.toLocaleString()} vs. servicios individuales</div>` : '<div class="package-savings">&nbsp;</div>';
  const promos = (pkg.promos || []).length
    ? `<div style="margin-top:0.75rem;margin-bottom:0.75rem;">${pkg.promos.map(p => `<div class="package-promo" style="font-size:0.8rem;opacity:0.7;padding:4px 0;">${esc(p)}</div>`).join('')}</div>`
    : '';

  // Build service breakdown like the OG
  const pkgServices = pkg.services || [];
  const pkgCustomItems = pkg.customItems || [];
  let includesHtml = '';
  if (pkgServices.length) {
    includesHtml = '<ul class="package-includes">' + pkgServices.map(svcId => {
      const svc = allSvcCatalog[svcId];
      if (!svc) return '';
      const basePrice = svc.pricing.basePrice || 0;
      const isMonthly = svc.pricing.monthly || false;
      const resolvedOvr = resolveOverride(m.pricing?.overrides?.[svcId], svc);

      // Check if this service is included free (bundled)
      const bundleRules = data.discounts?.bundleDiscounts || [];
      let effectivePrice = resolvedOvr !== null ? resolvedOvr : basePrice;
      let priceLabel = isMonthly ? `€${effectivePrice.toLocaleString()}/mes` : `€${effectivePrice.toLocaleString()}`;
      let priceClass = '';

      // Check bundle: is it included/free with another service in this package?
      for (const rule of bundleRules) {
        if (rule.target !== svcId) continue;
        const trigger = rule.trigger;
        const triggerInPkg = (trigger.selected && pkgServices.includes(trigger.selected)) ||
          (trigger.anySelected && trigger.anySelected.some(s => pkgServices.includes(s)));
        if (triggerInPkg) {
          if (rule.effect.type === 'included') { priceLabel = 'INCLUIDO'; priceClass = ' free'; }
          else if (rule.effect.type === 'free') { priceLabel = 'GRATIS'; priceClass = ' free'; }
          else if (rule.effect.type === 'discount') {
            if (rule.effect.price !== undefined) {
              effectivePrice = rule.effect.price;
            } else if (rule.effect.percentage) {
              effectivePrice = Math.round(effectivePrice * (1 - rule.effect.percentage / 100));
            }
            priceLabel = `<span class="strikethrough">€${basePrice.toLocaleString()}</span> €${effectivePrice.toLocaleString()}`;
            priceClass = ' discount';
          }
        }
      }

      return `<li><span class="inc-label">✓ ${esc(svc.name)}</span><span class="inc-price${priceClass}">${priceLabel}</span></li>`;
    }).filter(Boolean).join('\n') + '</ul>';
  }

  return `
            <div class="card package-card" id="pkg-${pkg.id}" onclick="PricingCart.selectPackage('${pkg.id}')">
              ${badge}
              <div class="card-body">
                <div class="package-eyebrow">${esc(pkg.subtitle)}</div>
                <div class="package-title">${esc(pkg.name)}</div>
                <div class="package-subtitle">${esc(pkg.description)}</div>
                ${includesHtml}
                <hr class="package-divider">${pkg.packageDiscount ? `
                <div class="package-total-row">
                  <span class="package-total-label">Total inversión</span>
                  <span class="package-total-price"><span class="strikethrough" style="opacity:0.4;font-size:0.7em;">€${pkg.totalOneTime.toLocaleString()}</span> €${Math.round(pkg.totalOneTime * (1 - pkg.packageDiscount / 100)).toLocaleString()}</span>
                </div>
                <div class="package-discount-badge">-${pkg.packageDiscount}% por paquete</div>` : `
                <div class="package-total-row">
                  <span class="package-total-label">Total inversión</span>
                  <span class="package-total-price">€${pkg.totalOneTime.toLocaleString()}</span>
                </div>`}
                ${monthly}
                ${savings}
                ${promos}
                <button class="package-cta">Seleccionar paquete</button>
              </div>
            </div>`;
}).join('\n')}

            <!-- Yellow compare CTA card -->
            <div class="card" style="background:#f0ff3d !important;background-image:none !important;border:2px solid #f0ff3d;cursor:pointer;display:flex;align-items:center;justify-content:center;" onclick="var el=document.getElementById('pkg-comparison-section');el.style.display='block';el.scrollIntoView({behavior:'smooth',block:'start'});">
              <div class="card-body" style="text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:2rem !important;">
                <div style="font-family:'Cascadia Code',monospace;font-size:1.3rem;font-weight:700;color:#000;margin-bottom:1rem;">Compara los paquetes</div>
                <span style="display:inline-block;background:#000;color:#f0ff3d;padding:0.5rem 1.5rem;border-radius:4px;font-family:'Cascadia Code',monospace;font-size:0.8rem;font-weight:600;">Ver comparativa ↓</span>
              </div>
            </div>

          </div>
          <div style="text-align:center;margin:3rem 0 2rem;"><span style="font-family:'Cascadia Code',monospace;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;opacity:0.6;padding:0.5rem 1.5rem;border-top:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);">o personaliza tu inversión servicio por servicio</span></div>`;
  }

  // ── Service pricing cards ──
  const allSvcData = data.services.services || {};
  const selected = [...(m.services?.core || []), ...(m.services?.addons || [])];

  function svcCard(id, svc, pricingInfo) {
    // Use the variant-resolved price as the base (before bundle effects).
    // This must match pricing-config.js so clicking doesn't change the price.
    const ovrResolved = resolveOverride(m.pricing?.overrides?.[id], svc);
    const baseCardPrice = ovrResolved !== null ? ovrResolved : (svc.pricing.basePrice || 0);
    const isMonthly = svc.pricing.monthly || false;
    const priceDisplay = isMonthly
      ? `€${baseCardPrice.toLocaleString()}<span style="font-size:0.7rem;opacity:0.6;">/mes</span>`
      : `€${baseCardPrice.toLocaleString()}`;
    const price = baseCardPrice;
    const monthlyAttr = isMonthly ? ' data-monthly="true"' : '';
    const type = (m.services?.core || []).includes(id) ? 'core' : 'addon';

    // Status badge (GRATIS / INCLUIDO)
    let statusBadge = '';
    if (pricingInfo?.status === 'free') statusBadge = '<div class="status-badge">GRATIS</div>';
    else if (pricingInfo?.status === 'included') statusBadge = '<div class="status-badge">INCLUIDO</div>';

    // Bundle tag (e.g., "INCLUYE BRANDING" on Shakefront Full)
    let cardTag = '';
    const bundleIncludes = svc.bundleRules?.includes || [];
    if (bundleIncludes.length) {
      const mainInclude = allSvcData[bundleIncludes[0]];
      if (mainInclude) {
        const tagText = bundleIncludes.length > 1
          ? `INCLUYE ${(mainInclude.category || mainInclude.name).toUpperCase()} +${bundleIncludes.length - 1}`
          : `INCLUYE ${(mainInclude.category || mainInclude.name).toUpperCase()}`;
        cardTag = `<div class="card-tag">${tagText}</div>`;
      }
    }

    // Subtitle (e.g., "CMS · 15+ páginas" or "One-pager · Sin branding")
    const subtitle = svc.subtitle ? `<p class="paragraph-sm" style="opacity:0.5;font-size:0.75rem;">${esc(svc.subtitle)}</p>` : '';

    // Eyebrow with number for core services
    const coreIdx = (m.services?.core || []).indexOf(id);
    const eyebrowNum = coreIdx >= 0 ? `${String(coreIdx + 1).padStart(2, '0')}// ` : '';
    const eyebrowText = `${eyebrowNum}${esc(svc.eyebrow || svc.category || '')}`.toUpperCase();

    const svcIncludes = mergeServiceContent(svc.includes, m.serviceOverrides?.[id], activeVariantFor(id, m), selected);
    const includesHtml = (svcIncludes || []).slice(0, 8).map(item => `<li>✓ ${esc(renderItemText(item))}</li>`).join('\n                  ');

    return `
            <div class="card pricing-card" data-service="${id}" data-price="${price}" data-type="${type}"${monthlyAttr} onclick="PricingCart.toggle('${id}')">
              ${cardTag}
              <div class="check-icon">✓</div>
              ${statusBadge}
              <div class="card-body">
                <div class="eyebrow">${eyebrowText}</div>
                <h4 class="h4-heading utility-margin-bottom-0">${esc(svc.name)}</h4>
                ${subtitle}
                <div class="spacer-small"></div>
                <div class="h3-heading utility-margin-bottom-1rem" data-price-display="${id}">${priceDisplay}</div>
                <p class="paragraph-sm utility-margin-bottom-1rem" style="opacity:0.7;">${esc(svc.description?.short || '')}</p>
                <ul class="paragraph-sm" style="list-style:none;padding:0;font-size:0.8rem;opacity:0.8;">
                  ${includesHtml}
                </ul>
                <button class="info-btn" onclick="event.stopPropagation();ServiceModal.open('${id}')">Más info</button>
                <div class="greyed-msg">Consulta la estructura del retainer</div>
              </div>
            </div>`;
  }

  // Separate core services from addons, then group addons by category
  const coreServices = (m.services?.core || []).map(id => {
    const svc = allSvcData[id];
    return svc ? { id, svc, pricing: pricing.services[id] } : null;
  }).filter(Boolean);

  // Consolidate granular categories into display groups (matching OG layout)
  const displayGroupMap = {
    social: 'design',      // Flashy Socials → Diseño group
    print: 'design',       // Glass Cup → Diseño group
    design: 'design',      // Foam Art, etc → Diseño group
    video: 'production',   // Cold Brew → Producción group
    production: 'production', // Buttery Frames → Producción group
    web: 'web',            // Barista, Grinder, Rosetta → Web group
    broadcast: 'broadcast', // Hot Press → Emisión group
    tech: 'tech',          // Brewery, Percolator, etc → Tecnología group
    branding: 'design',    // Latte Art if addon → Diseño group
  };

  const displayGroups = {
    design:     { label: 'Diseño', subtitle: 'Contenido visual y materiales de marca', order: 1 },
    broadcast:  { label: 'Emisión', subtitle: 'Activos gráficos para televisión y broadcast', order: 2 },
    production: { label: 'Producción', subtitle: 'Fotografía y video profesional', order: 3 },
    web:        { label: 'Web', subtitle: 'Infraestructura y mantenimiento digital', order: 4 },
    tech:       { label: 'Tecnología', subtitle: 'Desarrollo de software, automatización y AI', order: 5 },
  };

  const addonGroups = {};
  for (const id of (m.services?.addons || [])) {
    const svc = allSvcData[id];
    if (!svc) continue;
    const rawCat = svc.category || 'design';
    const group = displayGroupMap[rawCat] || 'design';
    if (!addonGroups[group]) addonGroups[group] = [];
    addonGroups[group].push({ id, svc, pricing: pricing.services[id] });
  }

  let serviceSectionsHtml = '';

  // Core services section
  if (coreServices.length) {
    serviceSectionsHtml += `
          <div class="pricing-section-label">Servicios Principales</div>
          <div class="pricing-section-subtitle">Selecciona uno o más servicios base</div>
          <div class="w-layout-grid grid-layout desktop-3-column tablet-2-column mobile-portrait-1-column grid-gap-md utility-margin-bottom-4rem">
            ${coreServices.map(s => svcCard(s.id, s.svc, s.pricing)).join('\n')}
          </div>`;
  }

  // Addon sections grouped by display group, sorted by order
  const sortedGroups = Object.entries(addonGroups)
    .sort((a, b) => (displayGroups[a[0]]?.order || 99) - (displayGroups[b[0]]?.order || 99));

  for (const [group, svcs] of sortedGroups) {
    const meta = displayGroups[group] || { label: group, subtitle: '' };
    serviceSectionsHtml += `
          <div class="pricing-section-label">${esc(meta.label)}</div>
          <div class="pricing-section-subtitle">${esc(meta.subtitle)}</div>
          <div class="w-layout-grid grid-layout desktop-3-column tablet-2-column mobile-portrait-1-column grid-gap-md utility-margin-bottom-2rem">
            ${svcs.map(s => svcCard(s.id, s.svc, s.pricing)).join('\n')}
          </div>`;
  }

  // ── Custom line items ──
  const customItems = m.pricing?.customLineItems || [];
  let customItemsHtml = '';
  if (customItems.length) {
    customItemsHtml = `
          <div class="pricing-section-label">Items Adicionales</div>
          <div class="w-layout-grid grid-layout desktop-3-column tablet-2-column mobile-portrait-1-column grid-gap-md utility-margin-bottom-2rem">
            ${customItems.map(item => `
            <div class="card pricing-card" data-service="${item.id}" data-price="${item.price}" data-type="addon" onclick="PricingCart.toggle('${item.id}')">
              <div class="check-icon">✓</div>
              <div class="card-body">
                <div class="eyebrow">Custom</div>
                <h4 class="h4-heading utility-margin-bottom-0">${esc(item.name)}</h4>
                <div class="spacer-small"></div>
                <div class="h3-heading utility-margin-bottom-1rem">€${item.price.toLocaleString()}</div>
                <p class="paragraph-sm" style="opacity:0.7;">${esc(item.description || '')}</p>
              </div>
            </div>`).join('\n')}
          </div>`;
  }

  // ── Retainer tiers ──
  const retainerTemplateId = m.retainerTemplate || 'standard';
  const retainerTemplate = data.retainers?.templates?.[retainerTemplateId];
  const retainerTiersObj = retainerTemplate?.tiers || {};
  const retainerTiersList = Object.entries(retainerTiersObj).map(([id, tier]) => ({ id, ...tier }));
  let retainerHtml = '';
  if (retainerTiersList.length) {
    const accent = '#f0ff3d';
    retainerHtml = `
          <div class="pricing-section-label">Suscripción Mensual <span class="retainer-badge">15% dto. en proyectos</span></div>
          <div class="pricing-section-subtitle">Mínimo ${retainerTemplate?.minimumCommitment || 3} meses · Incluye contenido, diseño y soporte recurrente · Los add-ons se gestionan dentro del retainer</div>
          <div class="w-layout-grid grid-layout desktop-4-column tablet-2-column mobile-portrait-1-column grid-gap-md utility-margin-bottom-4rem">
            ${retainerTiersList.map(tier => {
              const summary = tier.summary || tierIncludesToList(tier.includes || {}).slice(0, 4).join(', ');
              return `
            <div class="card pricing-card" data-service="${tier.id}" data-price="${tier.price}" data-type="retainer" data-monthly="true" onclick="PricingCart.toggle('${tier.id}')">
              <div class="check-icon">✓</div>
              <div class="card-body">
                <div class="eyebrow">${esc(tier.subtitle || 'Level ' + tier.level)}</div>
                <h4 class="h4-heading utility-margin-bottom-0" style="font-size:1rem;">${esc(tier.name)}</h4>
                <div class="h4-heading utility-margin-bottom-1rem" style="color:${accent};">€${tier.price.toLocaleString()}<span style="font-size:0.7rem;opacity:0.6;">/mes</span></div>
                <p class="paragraph-sm" style="font-size:0.7rem;opacity:0.6;">${esc(summary)}</p>
                <button class="info-btn" onclick="event.stopPropagation();RetainerPage.open()">Ver estructura</button>
              </div>
            </div>`;
            }).join('\n')}
          </div>`;
  }

  // ── Payment info ──
  const splits = m.pricing?.paymentSplits || [];
  let paymentHtml = '';
  if (splits.length) {
    paymentHtml = splits.map(s =>
      `<p><strong>${s.percentage}%</strong> — ${esc(s.trigger)}${s.amount ? ` (€${s.amount.toLocaleString()})` : ''}</p>`
    ).join('\n                      ');
  } else {
    paymentHtml = `<p><strong>70%</strong> — Al comenzar el trabajo</p>
                      <p><strong>20%</strong> — Al finalizar branding</p>
                      <p><strong>10%</strong> — Entrega final</p>`;
  }

  // ── Assemble ──
  return `
        <div class="utility-text-align-center utility-margin-bottom-4rem">
          <div class="eyebrow">${esc(m.id)}</div>
          <h2 class="h1-heading">Propuesta Completa</h2>
          <p class="subheading">${esc(clientName)} — Mi propuesta con amor para ti, ${esc(clientFirst)}</p>
        </div>

        ${allTabs.length ? `
        <div data-duration-in="300" data-duration-out="100" data-current="Tab 1" class="w-tabs">
          <div class="w-tab-menu" role="tablist" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 3rem;">
${tabMenuHtml}
          </div>
          <div class="w-tab-content">
${tabPanesHtml}
          </div>
        </div>` : ''}

        <!-- Dynamic Timeline (updates when services are selected) -->
        <div style="height:8rem;"></div>
        <div class="utility-text-align-center utility-margin-bottom-4rem">
          <div class="eyebrow">Cronograma</div>
          <h2 class="h2-heading">¿Cuánto tiempo tomará?</h2>
          <p class="subheading">Fases del proyecto y sus hitos</p>
        </div>
        <div id="dynamic-timeline"></div>

        <div style="height:8rem;"></div>
        <div class="utility-text-align-center utility-margin-bottom-4rem">
          <div class="eyebrow">Inversión</div>
          <h2 class="h2-heading">Tu Inversión</h2>
          <p class="subheading">Selecciona los servicios que necesitas y observa cómo se compone tu presupuesto</p>
        </div>

        <div id="pricing-cart">
          ${packagesHtml}
          ${serviceSectionsHtml}
          ${customItemsHtml}
          ${retainerHtml}

          <!-- Package Comparison Table (hidden by default, revealed by yellow CTA card) -->
          <div id="pkg-comparison-section" style="display:none;padding:3rem 0 4rem;">
            <h3 class="h3-heading utility-text-align-center utility-margin-bottom-1rem">Comparativa de Paquetes</h3>
            <p class="subheading utility-text-align-center utility-margin-bottom-2rem">Cada paquete incluye una combinación diferente de servicios</p>
            {{PACKAGE_COMPARISON}}
          </div>

          <h4 class="h4-heading utility-margin-bottom-2rem utility-text-align-center">Tu Presupuesto</h4>
          <div class="pricing-summary-box utility-margin-bottom-4rem" id="pricing-summary">
            <div class="summary-empty">Selecciona servicios para ver tu presupuesto</div>
            <div id="summary-items" style="display:none;">
              <div id="summary-lines"></div>
              <hr class="summary-divider">
              <div id="summary-onetime" class="summary-total" style="display:none;">
                <span class="total-label">Inversión única</span>
                <span class="total-price" id="total-onetime">€0</span>
              </div>
              <div id="summary-monthly" class="summary-total" style="display:none;">
                <span class="total-label">Mensual <span style="font-size:0.75rem;opacity:0.6;">(mín. 3 meses)</span></span>
                <span class="total-price" id="total-monthly">€0</span>
              </div>
              <hr class="summary-divider">
              <div class="summary-total">
                <span class="total-label">Total</span>
                <span class="total-price" id="total-combined">€0</span>
              </div>
              <div class="terms-highlight" style="margin-top:1rem;">
                ${paymentHtml}
              </div>
              <button class="pdf-download-btn" onclick="PricingCart.downloadPDF()">Descargar Presupuesto PDF</button>
            </div>
          </div>
        </div>

        <div style="height: 6rem;"></div>
        <div style="opacity: 0.35; font-size: 0.7rem; line-height: 1.6; max-width: 600px; margin: 0 auto; text-align: center;">
          <p style="font-weight: 600; margin-bottom: 0.5rem; font-size: 0.75rem;">Aviso Importante</p>
          <p style="margin-bottom: 0.4rem;">Todo el contenido multimedia, incluyendo fotos, videos, referencias visuales y texto, deben ser suministrados por el equipo de ${esc(clientName)} antes de iniciar el proceso de diseño. Cualquier contenido no disponible previamente será reemplazado por material de referencia o placeholder.</p>
          <p>Las piezas que requieran diseño sonoro o música se entregarán sin audio, a menos que se coordine directamente con el equipo del cliente para la sincronización.</p>
        </div>

        <div style="height: 10rem;"></div>
        <div class="utility-text-align-center">
          <div class="video-container w-embed">
            <div class="video-container">
              <video class="hover-video" muted="" loop="" playsinline="" preload="auto">
                <source src="https://res.cloudinary.com/dn53emznt/video/upload/v1742943440/here-at-the-end-of-all-things_numtfa.mp4">
                Your browser does not support the video tag.
              </video>
              <button class="unmute-button">🔊 Unmute</button>
            </div>
          </div>
          <div class="spacer-medium"></div>
          <h2 class="h2-heading">Gracias por llegar tan lejos, ${esc(clientFirst)}</h2>
        </div>`;
}

// ── Package Payment Mapping ──────────────────────────────────────────────────

function buildPackagePayments(manifest, data) {
  const packages = manifest.pricing?.packages || [];
  const structures = data.payments?.structures || {};
  const result = {};

  for (const pkg of packages) {
    if (pkg.paymentSplits) {
      // Explicit custom splits
      result[pkg.id] = {
        splits: pkg.paymentSplits,
        total: pkg.totalOneTime
      };
    } else if (pkg.paymentStructure && structures[pkg.paymentStructure]) {
      // Per-package structure from payments.json
      result[pkg.id] = {
        splits: structures[pkg.paymentStructure].splits,
        total: pkg.totalOneTime
      };
    } else if (manifest.pricing?.paymentStructure && structures[manifest.pricing.paymentStructure]) {
      // Fall back to global payment structure
      result[pkg.id] = {
        splits: structures[manifest.pricing.paymentStructure].splits,
        total: pkg.totalOneTime
      };
    }
  }
  return result;
}

// ── Timeline Visualization ───────────────────────────────────────────────────

function generateTimeline(manifest, data) {
  const timeline = manifest.timeline;
  if (!timeline || !timeline.phases || !timeline.phases.length) {
    // Auto-generate from selected services' timelines
    const allSvc = data.services?.services || {};
    const selected = [...(manifest.services?.core || []), ...(manifest.services?.addons || [])];
    const phases = [];
    for (const id of selected) {
      const svc = allSvc[id];
      if (!svc || !svc.timeline || svc.timeline.unit === 'ongoing') continue;
      phases.push({
        name: svc.name,
        weeks: svc.timeline.max || svc.timeline.min || 4,
        services: [id],
      });
    }
    if (!phases.length) return '<!-- no timeline data -->';
    // Merge phases that overlap (sequential for now)
    return renderTimeline(phases, manifest);
  }
  return renderTimeline(timeline.phases, manifest);
}

function renderTimeline(phases, manifest) {
  const totalWeeks = phases.reduce((sum, p) => sum + (p.weeks || 0), 0);
  if (!totalWeeks) return '<!-- no timeline -->';

  const phasesHtml = phases.map((phase, i) => {
    const payment = phase.payment ? `<div class="phase-payment">${phase.payment}%</div>` : '';
    const weekLabel = phase.weeks === 1 ? '1 semana' : `${phase.weeks} semanas`;
    const svcList = (phase.services || []).map(s => `<li>${esc(s)}</li>`).join('');
    const delay = `transition-delay:${0.3 + i * 0.15}s;`;

    return `
      <div class="timeline-phase" style="${delay}">
        <div class="phase-dot"></div>
        <div class="phase-name">${esc(phase.name)}</div>
        <div class="phase-duration">${weekLabel}</div>
        ${payment}
        <div class="phase-tooltip">
          <div class="tt-name">${esc(phase.name)}</div>
          <div class="tt-duration">${weekLabel}${phase.payment ? ` · ${phase.payment}% pago` : ''}</div>
          ${svcList ? `<ul class="tt-services">${svcList}</ul>` : ''}
        </div>
      </div>`;
  }).join('\n');

  return `
    <div class="timeline-track" id="project-timeline">
      <div class="timeline-line"><div class="timeline-line-fill"></div></div>
      <div class="timeline-phases">
        ${phasesHtml}
      </div>
    </div>
    <div class="timeline-total">Duración total estimada: ~${totalWeeks} semanas</div>
    <script>
    (function(){
      var tl = document.getElementById('project-timeline');
      if (!tl) return;
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            tl.classList.add('animated');
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      obs.observe(tl);
    })();
    </script>`;
}

// ── Custom Content Sections ──────────────────────────────────────────────────

function generateCustomSections(manifest) {
  const sections = manifest.content?.customSections;
  if (!sections || !sections.length) return '<!-- no custom sections -->';

  return sections.map(sec => `
    <section class="section${sec.variant ? ' ' + sec.variant : ''}">
      <div class="container${sec.narrow ? ' small-container' : ''}">
        ${sec.eyebrow ? `<div class="utility-text-align-center utility-margin-bottom-4rem"><div class="eyebrow">${esc(sec.eyebrow)}</div><h2 class="h1-heading">${esc(sec.heading || '')}</h2>${sec.subheading ? `<p class="subheading">${esc(sec.subheading)}</p>` : ''}</div>` : (sec.heading ? `<h2 class="h2-heading utility-margin-bottom-2rem">${esc(sec.heading)}</h2>` : '')}
        <div class="rich-text paragraph-lg w-richtext">
          ${sec.body || ''}
        </div>
      </div>
    </section>`).join('\n');
}

// ── Service Dependencies ─────────────────────────────────────────────────────

function buildServiceDeps(data) {
  const allSvc = data.services?.services || {};
  const deps = {};
  for (const [id, svc] of Object.entries(allSvc)) {
    if (svc.bundleRules?.requires || svc.bundleRules?.recommendedWith) {
      deps[id] = {
        requires: svc.bundleRules.requires || [],
        recommendedWith: svc.bundleRules.recommendedWith || [],
      };
    }
  }
  return deps;
}

// ── Service Timelines for runtime ────────────────────────────────────────────

function buildServiceTimelines(data) {
  const allSvc = data.services?.services || {};
  const timelines = {};
  for (const [id, svc] of Object.entries(allSvc)) {
    if (svc.timeline && svc.timeline.unit !== 'ongoing') {
      timelines[id] = {
        name: svc.name,
        weeks: svc.timeline.max || svc.timeline.min || 4,
        category: svc.category || '',
      };
    }
  }
  return timelines;
}

// ── CTA Buttons + WhatsApp Float ─────────────────────────────────────────────

function generateCtaButtons(manifest) {
  const cta = manifest.cta || {};
  const buttons = [];

  if (cta.whatsapp) {
    const msg = encodeURIComponent(cta.message || `Hola Juan Carlos, he visto la propuesta para ${manifest.client?.name || 'mi proyecto'} y me gustaría hablar.`);
    buttons.push(`<a href="https://wa.me/${cta.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}" target="_blank" class="cta-btn whatsapp">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.637l4.687-1.228A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.153 0-4.16-.655-5.828-1.777l-.246-.163-3.13.82.856-3.029-.177-.265A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
      WhatsApp
    </a>`);
  }

  if (cta.email) {
    buttons.push(`<a href="mailto:${esc(cta.email)}?subject=${encodeURIComponent('Re: Propuesta ' + (manifest.client?.name || ''))}" class="cta-btn primary">Enviar Email</a>`);
  }

  if (cta.calendly) {
    buttons.push(`<a href="${esc(cta.calendly)}" target="_blank" class="cta-btn secondary">Agendar Videollamada</a>`);
  }

  // Default if no CTA configured
  if (!buttons.length) {
    buttons.push(`<a href="mailto:hello@vanalva.io?subject=${encodeURIComponent('Re: Propuesta ' + (manifest.client?.name || ''))}" class="cta-btn primary">Hablemos</a>`);
  }

  return buttons.join('\n');
}

function generateWhatsAppFloat(manifest) {
  const cta = manifest.cta || {};
  if (!cta.whatsapp) return '';
  const msg = encodeURIComponent(cta.message || `Hola, he visto la propuesta para ${manifest.client?.name || 'mi proyecto'}.`);
  return `
    <a href="https://wa.me/${cta.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}" target="_blank" class="wa-float" title="WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.637l4.687-1.228A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.153 0-4.16-.655-5.828-1.777l-.246-.163-3.13.82.856-3.029-.177-.265A9.96 9.96 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
    </a>`;
}

// ── Package Comparison Matrix ─────────────────────────────────────────────────

function generatePackageComparison(manifest, data) {
  const packages = manifest.pricing?.packages;
  if (!packages || packages.length < 2) return '<!-- no comparison (need 2+ packages) -->';

  const allSvc = data.services?.services || {};
  const discountRules = data.discounts?.bundleDiscounts || [];

  // Collect all unique services across all packages
  const allServiceIds = [];
  for (const pkg of packages) {
    for (const svcId of (pkg.services || [])) {
      if (!allServiceIds.includes(svcId)) allServiceIds.push(svcId);
    }
  }

  // Header row
  let headerHtml = '<th>Servicio</th>';
  headerHtml += packages.map(pkg => {
    const recommended = pkg.badge ? ' recommended' : '';
    const badge = pkg.badge ? `<span class="pkg-header-badge">${esc(pkg.badge)}</span><br>` : '';
    const monthly = pkg.totalMonthly ? `<span class="pkg-header-monthly">+ €${pkg.totalMonthly.toLocaleString()}/mes</span>` : '';
    return `<th class="pkg-col${recommended}" onclick="PricingCart.selectPackage('${pkg.id}')">
      ${badge}<span class="pkg-header-name">${esc(pkg.name)}</span>
      <span class="pkg-header-price">€${pkg.totalOneTime.toLocaleString()}</span>
      ${monthly}
    </th>`;
  }).join('\n');

  // Body rows — one per service
  let rowsHtml = '';
  for (const svcId of allServiceIds) {
    const svc = allSvc[svcId];
    if (!svc) continue;
    const svcName = svc.name;

    const shortDesc = svc.description?.short || '';
    rowsHtml += '<tr>';
    rowsHtml += `<td class="svc-name-cell" data-svc-id="${svcId}">
      <span class="svc-name-hover">${esc(svcName)}</span>
      <div class="svc-tooltip">
        <div style="font-family:'Cascadia Code',monospace;font-weight:700;font-size:0.85rem;margin-bottom:0.25rem;">${esc(svcName)}</div>
        <div style="font-size:0.75rem;opacity:0.7;margin-bottom:0.5rem;">${esc(shortDesc)}</div>
        <button class="svc-tooltip-btn" onclick="event.stopPropagation();ServiceModal.open('${svcId}')">Más info →</button>
      </div>
    </td>`;

    for (const pkg of packages) {
      const inPkg = (pkg.services || []).includes(svcId);
      if (!inPkg) {
        rowsHtml += '<td><span class="cross">—</span></td>';
        continue;
      }

      // Determine effective price/status within this package
      const basePrice = svc.pricing.basePrice || 0;
      const resolvedCmpOvr = resolveOverride(manifest.pricing?.overrides?.[svcId], svc);
      let price = resolvedCmpOvr !== null ? resolvedCmpOvr : basePrice;
      let label = `€${price.toLocaleString()}`;
      let cssClass = '';

      // Check bundle rules within this package
      for (const rule of discountRules) {
        if (rule.target !== svcId) continue;
        const trigger = rule.trigger;
        const triggerInPkg = (trigger.selected && (pkg.services || []).includes(trigger.selected)) ||
          (trigger.anySelected && trigger.anySelected.some(s => (pkg.services || []).includes(s)));
        if (triggerInPkg) {
          if (rule.effect.type === 'included') { label = 'INCLUIDO'; cssClass = 'cell-free'; }
          else if (rule.effect.type === 'free') { label = 'GRATIS'; cssClass = 'cell-free'; }
          else if (rule.effect.type === 'discount') {
            if (rule.effect.price !== undefined) {
              label = `€${rule.effect.price.toLocaleString()}`;
            } else if (rule.effect.percentage) {
              label = `-${rule.effect.percentage}%`;
            }
            cssClass = 'cell-free';
          }
        }
      }

      if (svc.pricing.monthly) label = `€${price.toLocaleString()}/mes`;

      if (cssClass) {
        rowsHtml += `<td><span class="${cssClass}">${label}</span></td>`;
      } else {
        rowsHtml += `<td><span class="check">✓</span><span class="price-note">${label}</span></td>`;
      }
    }

    rowsHtml += '</tr>';
  }

  // Footer with CTA buttons
  let footerHtml = '<td></td>';
  footerHtml += packages.map(pkg => {
    const recommended = pkg.badge ? ' recommended' : '';
    return `<td class="${recommended}"><button class="pkg-cta" onclick="PricingCart.selectPackage('${pkg.id}');setTimeout(function(){document.getElementById('pricing-summary').scrollIntoView({behavior:'smooth',block:'center'})},300);">Seleccionar</button></td>`;
  }).join('\n');

  // Savings row
  let savingsHtml = '<td></td>';
  savingsHtml += packages.map(pkg => {
    if (pkg.savings) {
      return `<td style="font-size:0.7rem;opacity:0.5;padding-top:0;">Ahorras €${pkg.savings.toLocaleString()}</td>`;
    }
    return '<td></td>';
  }).join('\n');

  return `
        <div style="overflow-x:auto;">
          <table class="pkg-matrix">
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${rowsHtml}</tbody>
            <tfoot>
              <tr>${savingsHtml}</tr>
              <tr>${footerHtml}</tr>
            </tfoot>
          </table>
        </div>`;
}

// ── CTA Buttons ──────────────────────────────────────────────────────────────

function generateCtaButtons(manifest) {
  const cta = manifest.content?.cta || manifest.cta || {};
  const items = [];

  if (cta.whatsapp) {
    const msg = encodeURIComponent(cta.message || `Hola, me interesa la propuesta para ${manifest.client?.name || 'mi proyecto'}`);
    items.push(`<a href="https://wa.me/${cta.whatsapp.replace(/[^0-9]/g, '')}?text=${msg}" target="_blank" class="button big w-button">WhatsApp</a>`);
  }
  if (cta.email) {
    items.push(`<a href="mailto:${esc(cta.email)}?subject=Propuesta ${esc(manifest.client?.name || '')}" class="button big secondary-button w-button">Email</a>`);
  }
  if (cta.calendly) {
    items.push(`<a href="${esc(cta.calendly)}" target="_blank" class="button big secondary-button w-button">Agendar Llamada</a>`);
  }

  if (!items.length) return '<!-- no CTA buttons configured -->';
  return items.join('\n              ');
}

// ── WhatsApp Float ───────────────────────────────────────────────────────────

function generateWhatsAppFloat(manifest) {
  const cta = manifest.content?.cta || manifest.cta || {};
  if (!cta.whatsapp) return '<!-- no WhatsApp float -->';
  const msg = encodeURIComponent(cta.message || `Hola, me interesa la propuesta para ${manifest.client?.name || 'mi proyecto'}`);
  const phone = cta.whatsapp.replace(/[^0-9]/g, '');
  return `<a href="https://wa.me/${phone}?text=${msg}" target="_blank" class="whatsapp-float" title="WhatsApp">💬</a>`;
}

// ── Package Discounts ────────────────────────────────────────────────────────
// Extracts per-package discount percentages from the manifest.
// These only apply when a package is actively selected (lost on manual toggle).

function buildPackageDiscounts(manifest) {
  const packages = manifest.pricing?.packages || [];
  const result = {};
  for (const pkg of packages) {
    if (pkg.packageDiscount) {
      result[pkg.id] = pkg.packageDiscount;
    }
  }
  return result;
}

// ── Pricing Config Generator ─────────────────────────────────────────────────
// Generates a JS file that pricing.js reads at runtime. Contains all proposal-
// specific data: services, packages, modal content, discount rules, client info.

function generatePricingConfig(manifest, data, pricing) {
  const m = manifest;
  const allSvc = data.services.services || {};
  const selected = [...(m.services?.core || []), ...(m.services?.addons || [])];
  const cfgRetainerTemplateId = m.retainerTemplate || 'standard';
  const cfgRetainerTemplate = data.retainers?.templates?.[cfgRetainerTemplateId];
  const cfgRetainerTiersObj = cfgRetainerTemplate?.tiers || {};
  const retainerTiers = Object.entries(cfgRetainerTiersObj).map(([id, tier]) => ({ id, ...tier }));
  const retainerIds = retainerTiers.map(t => t.id);

  // Build services object for PricingCart
  // Use the OVERRIDE-RESOLVED price (not bundle-discounted) as the base for runtime calculations.
  // Bundle discounts (INCLUIDO/GRATIS/discount) are applied at runtime by pricing.js.
  const cartServices = {};
  for (const id of selected) {
    const svc = allSvc[id];
    if (!svc) continue;
    const cartOvr = resolveOverride(m.pricing?.overrides?.[id], svc);
    cartServices[id] = {
      name: svc.name,
      price: cartOvr !== null ? cartOvr : (svc.pricing.basePrice || 0),
      monthly: svc.pricing.monthly || false,
    };
  }
  // Add custom line items as services
  for (const item of (m.pricing?.customLineItems || [])) {
    cartServices[item.id] = {
      name: item.name,
      price: item.price,
      monthly: item.monthly || false,
    };
  }
  // Add retainer tiers
  for (const tier of retainerTiers) {
    cartServices[tier.id] = {
      name: tier.name,
      price: tier.price,
      monthly: true,
    };
  }

  // Build packages object (include customItems as addons)
  const cartPackages = {};
  for (const pkg of (m.pricing?.packages || [])) {
    const pkgAddons = (pkg.services || []).filter(id => (m.services?.addons || []).includes(id));
    // Add custom line items (e.g., sub-brands) to the package addons
    if (pkg.customItems) {
      for (const itemId of pkg.customItems) {
        if (pkgAddons.indexOf(itemId) === -1) pkgAddons.push(itemId);
      }
    }
    cartPackages[pkg.id] = {
      core: (pkg.services || []).filter(id => (m.services?.core || []).includes(id)),
      addons: pkgAddons,
    };
  }

  // Build service modal data — use pre-calculated prices to match HTML
  const modalData = {};
  for (const id of selected) {
    const svc = allSvc[id];
    if (!svc) continue;
    // Use override-resolved price (not bundle-discounted) for modal display
    const modalOvr = resolveOverride(m.pricing?.overrides?.[id], svc);
    const price = modalOvr !== null ? modalOvr : (svc.pricing.basePrice || 0);
    const monthly = svc.pricing.monthly || false;
    modalData[id] = {
      eyebrow: svc.category || '',
      title: svc.name,
      price: monthly ? `€${Number(price).toLocaleString()}/mes` : `€${Number(price).toLocaleString()}`,
      desc: svc.description?.medium || svc.description?.short || '',
      // 3D+4A: Apply service overrides, resolve structured items to text for modal
      // Pass the active variant so conditional items resolve correctly
      includes: mergeServiceContent(svc.includes, m.serviceOverrides?.[id], activeVariantFor(id, m), selected).map(i => renderItemText(i)),
      deliverables: mergeDeliverables(svc.deliverables, m.serviceOverrides?.[id], activeVariantFor(id, m), selected).map(i => renderItemText(i)),
      revisions: svc.revisions || null,
    };
  }

  // Client info for PDF
  const clientInfo = {
    name: m.client?.name || '',
    contactName: m.client?.contactName || '',
    tagline: m.brand?.tagline || '',
    accentColor: '#f0ff3d',
  };

  // Payment info for PDF
  const paymentSplits = m.pricing?.paymentSplits || [];
  const paymentText = paymentSplits.length
    ? paymentSplits.map(s => `${s.percentage}% ${s.trigger}`).join(' · ')
    : '70% al inicio · 20% entrega branding · 10% entrega final';

  // 3B: Bank info from data
  const bank = data.payments?.bankInfo?.spain || {};
  const bankInfo = {
    bank: bank.bank || 'BBVA',
    iban: bank.iban || '',
    bic: bank.bic || '',
    holder: bank.holder || '',
  };

  return `// Auto-generated by build.js — proposal-specific pricing config
window.ProposalConfig = {
  services: ${JSON.stringify(cartServices, null, 2)},
  packages: ${JSON.stringify(cartPackages, null, 2)},
  retainerIds: ${JSON.stringify(retainerIds)},
  webIds: ["shakefront-full", "shakefront-lite"],
  serviceModals: ${JSON.stringify(modalData, null, 2)},
  client: ${JSON.stringify(clientInfo, null, 2)},
  paymentText: ${JSON.stringify(paymentText)},
  bankInfo: ${JSON.stringify(bankInfo, null, 2)},
  paymentStructures: ${JSON.stringify(data.payments?.structures || {}, null, 2)},
  packagePayments: ${JSON.stringify(buildPackagePayments(m, data), null, 2)},
  serviceDeps: ${JSON.stringify(buildServiceDeps(data), null, 2)},
  serviceTimelines: ${JSON.stringify(buildServiceTimelines(data), null, 2)},
  packageDiscounts: ${JSON.stringify(buildPackageDiscounts(m), null, 2)}
};
`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUILD
// ═══════════════════════════════════════════════════════════════════════════════

function build(manifestPath, outputDir) {
  console.log('\n  Van Alva Proposal Builder v2');
  console.log('  ============================\n');

  const manifest = loadJSON(manifestPath).proposal;
  console.log(`  Client: ${manifest.client.name}`);
  console.log(`  ID: ${manifest.id}`);

  const data = loadData();
  console.log(`  Catalog: ${Object.keys(data.services.services).length} services loaded`);

  const pricing = calculatePricing(manifest, data);
  console.log(`  Pricing: ${Object.keys(pricing.services).length} services calculated`);
  console.log(`  Total one-time: EUR ${pricing.totalOneTime.toLocaleString()}`);
  if (pricing.totalMonthly > 0) console.log(`  Total monthly: EUR ${pricing.totalMonthly}/mo`);
  if (pricing.totalSavings > 0) console.log(`  Total savings: EUR ${pricing.totalSavings.toLocaleString()}`);

  // ── Build ALL template variables ──
  const content = manifest.content || {};
  const vars = {
    // Core identifiers
    language: manifest.language || 'es',
    clientName: manifest.client.name,
    clientFirstName: manifest.client.contactName,
    clientLastName: manifest.client.contactLastName || '',
    clientOrg: manifest.client.organization || '',
    clientIndustry: manifest.client.industry || '',
    clientLocation: manifest.client.location || '',
    proposalTagline: manifest.brand.tagline,
    proposalId: manifest.id,
    proposalDate: manifest.date,
    accentColor: '#f0ff3d',

    // Cover
    coverHeadline: content.coverHeadline || `${manifest.client.name} — ${manifest.brand.tagline}`,
    coverSubheading: content.coverSubheading || `Propuesta personalizada para ${manifest.client.name}`,

    // Intro
    introGreeting: content.introGreeting || `Hola... ${manifest.client.contactName}`,
    introCardDescription: content.introCardDescription || '',

    // Brief content
    briefIntro: manifest.brief?.intro || '',
    briefCreativeBrief: manifest.brief?.creativeBrief || '',
    briefNeeds: manifest.brief?.needs || '',
    briefKeyPoints: manifest.brief?.keyPoints || '',

    // Service hero content (for simple {{variable}} substitution in hero blocks)
    whyBrandingText: content.serviceContent?.branding?.whyText || '',
    WHY_BRANDING_TAGS: generateTags(content.serviceContent?.branding?.whyTags || ['Branding', 'Naming', 'Assets de Marca']),
    whyWebText: content.serviceContent?.web?.whyText || '',
    WHY_WEB_TAGS: generateTags(content.serviceContent?.web?.whyTags || ['Web', 'UI/UX', 'CMS']),
    whyBroadcastText: content.serviceContent?.broadcast?.whyText || '',
    WHY_BROADCAST_TAGS: generateTags(content.serviceContent?.broadcast?.whyTags || ['Broadcast', 'TV', 'Motion']),

    // Generic service deep-dive (for any highlighted service beyond branding/web/broadcast)
    genericHeroTitle: content.genericService?.heroTitle || '',
    genericHeroLine1: content.genericService?.heroLine1 || '',
    genericHeroLine2: content.genericService?.heroLine2 || '',
    genericHeroLine3: content.genericService?.heroLine3 || '',
    genericHeroSubtitle1: content.genericService?.heroSubtitle1 || '',
    genericHeroSubtitle2: content.genericService?.heroSubtitle2 || '',
    GENERIC_HERO_IMAGE: content.genericService?.heroImage
      ? `<div class="ix-hero-intro-slide-up step-5-hero-intro-slide-up"><img src="${esc(content.genericService.heroImage)}" loading="lazy" alt="${esc(content.genericService?.heroTitle || '')}" style="max-width:100%;"></div>`
      : '<!-- no generic hero image -->',
    genericWhyHeading: content.genericService?.whyHeading || '',
    genericWhyText: content.genericService?.whyText || '',
    GENERIC_WHY_TAGS: generateTags(content.genericService?.whyTags || []),
    GENERIC_FEATURES_CONTENT: generateFeatureCards({ content: { featureCards: content.genericService?.featureCards } }),

    // ── Generated HTML blocks ──
    SERVICE_CARDS_CONTENT: generateServiceCards(manifest),
    BRIEF_TABS_DESKTOP: generateBriefTabs(manifest, 'desktop'),
    BRIEF_TABS_MOBILE: generateBriefTabs(manifest, 'mobile'),
    COMPLEMENTARY_CONTENT: generateComplementaryCards(manifest),
    METHODOLOGY_CARDS: generateMethodologyCards(manifest, data),
    METHODOLOGY_TABS_CONTENT: generateMethodologyTabs(manifest, data),
    FEATURES_CONTENT: generateFeatureCards(manifest),
    PROPOSAL_DETAIL: generateProposalDetail(manifest, pricing, data),

    // 3E: Retainer modal generated from retainers.json
    RETAINER_MODAL_CONTENT: generateRetainerModal(manifest, data),
    PACKAGE_COMPARISON: generatePackageComparison(manifest, data),
    CUSTOM_SECTIONS: generateCustomSections(manifest),
    TIMELINE_CONTENT: generateTimeline(manifest, data),

    // CTA
    ctaHeading: content.ctaHeading || `¿Listo para empezar, ${manifest.client?.contactName}?`,
    ctaSubheading: content.ctaSubheading || 'Hablemos sobre tu proyecto — sin compromiso',
    CTA_BUTTONS: generateCtaButtons(manifest),
    WHATSAPP_FLOAT: generateWhatsAppFloat(manifest),
  };

  console.log(`  Variables: ${Object.keys(vars).length} template vars prepared`);

  // ── Load shell ──
  let shell = fs.readFileSync(path.join(TEMPLATES, 'shell.html'), 'utf-8');

  // ── Load and assemble blocks ──
  const sectionBlocks = (manifest.sections || []).map(name => {
    const block = loadBlock(name);
    return substitute(block, vars);
  });

  const modalBlocks = (manifest.modals || []).map(name => {
    const block = loadBlock(name);
    return substitute(block, vars);
  });

  shell = shell.replace('{{BLOCKS}}', sectionBlocks.join('\n'));
  shell = shell.replace('{{MODALS}}', modalBlocks.join('\n'));
  shell = substitute(shell, vars);

  // ── Write output ──
  const outDir = path.join(outputDir, manifest.id);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, 'index.html');
  fs.writeFileSync(outPath, shell, 'utf-8');

  // Copy shared assets to output root (once, not per proposal)
  const sharedDirs = ['css', 'js', 'images'];
  for (const dir of sharedDirs) {
    const src = path.join(ROOT, dir);
    const dest = path.join(outputDir, dir);
    if (fs.existsSync(src)) {
      fs.cpSync(src, dest, { recursive: true });
    }
  }

  // Write per-proposal files: pricing-config.js (proposal-specific JS)
  const proposalJsDir = path.join(outDir, 'js');
  fs.mkdirSync(proposalJsDir, { recursive: true });
  const pricingConfig = generatePricingConfig(manifest, data, pricing);
  fs.writeFileSync(path.join(proposalJsDir, 'pricing-config.js'), pricingConfig, 'utf-8');
  console.log('  Pricing config: js/pricing-config.js generated');

  // Write pricing data JSON (per-proposal reference)
  fs.writeFileSync(path.join(proposalJsDir, 'pricing-data.json'), JSON.stringify(pricing, null, 2), 'utf-8');

  // Write manifest copy for reference
  fs.writeFileSync(path.join(outDir, 'manifest.json'), fs.readFileSync(manifestPath, 'utf-8'));

  const outSize = fs.statSync(outPath).size;
  console.log(`\n  Output: ${outPath}`);
  console.log(`  Size: ${(outSize / 1024).toFixed(1)} KB`);
  console.log(`  Shared assets: ${sharedDirs.join(', ')} → output/`);
  console.log('\n  Done!\n');
}

// ── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const manifestPath = args[0] || path.join(TEMPLATES, 'manifest.example.json');
const outputIdx = args.indexOf('--output');
const outputDir = outputIdx !== -1 ? args[outputIdx + 1] : DEFAULT_OUTPUT;

if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}

build(manifestPath, outputDir);
