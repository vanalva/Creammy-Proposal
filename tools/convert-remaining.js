const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/catalog/services.json', 'utf8'));
const s = data.services;

// Already done: milky-branding, shakefront-full, flashy-socials
const done = ['milky-branding', 'shakefront-full', 'flashy-socials'];

// ═══ ADD REVISIONS TO ALL REMAINING SERVICES ═══

const revisionDefaults = {
  // Web services
  'shakefront-lite': { rounds: 3, scope: "Ajustes de diseno, layout y contenido dentro del wireframe aprobado", outOfScope: "Cambio de plataforma, paginas adicionales fuera del sitemap", overagePrice: 200, overageUnit: "per-round" },
  'espresso-shot': { rounds: 2, scope: "Ajustes de diseno y contenido de la landing", outOfScope: "Cambio de plataforma o alcance", overagePrice: 100, overageUnit: "per-round" },
  'barista': { rounds: null, scope: "Servicio continuo mensual — modificaciones incluidas en el plan", outOfScope: "N/A — cambios se gestionan dentro del retainer" },
  'the-grinder': { rounds: 1, scope: "Verificacion de configuracion de hosting, dominio y correos", outOfScope: "Migracion de plataforma", overagePrice: 50, overageUnit: "per-round" },
  'rosetta': { rounds: 2, scope: "Ajustes de traduccion y configuracion multilinguee", outOfScope: "Idiomas adicionales no incluidos", overagePrice: 100, overageUnit: "per-round" },
  'the-counter': { rounds: 2, scope: "Ajustes de funcionalidad y configuracion del sistema de reservas", outOfScope: "Integraciones adicionales no previstas", overagePrice: 150, overageUnit: "per-round" },

  // Design services
  'glass-cup': { rounds: 3, scope: "Ajustes de diseno, composicion y contenido de materiales impresos", outOfScope: "Nuevos productos no incluidos en el alcance original", overagePrice: 100, overageUnit: "per-round" },
  'silky-edits': { rounds: 2, scope: "Ajustes de retoque, color, recorte y composicion", outOfScope: "Fotos adicionales no incluidas en la seleccion original", overagePrice: 60, overageUnit: "per-round" },
  'foam-art': { rounds: 3, scope: "Ajustes de diseno 3D, texturas, iluminacion y composicion", outOfScope: "Cambio de concepto o direccion creativa", overagePrice: 200, overageUnit: "per-round" },
  'latte-art': { rounds: 3, scope: "Ajustes de estilo, color y composicion de ilustraciones", outOfScope: "Ilustraciones adicionales no incluidas", overagePrice: 120, overageUnit: "per-round" },

  // Production
  'buttery-1day': { rounds: 0, scope: "Sesion fotografica — sin revisiones (produccion en vivo)", outOfScope: "Sesiones adicionales" },
  'buttery-3days': { rounds: 0, scope: "Sesion fotografica extendida — sin revisiones (produccion en vivo)", outOfScope: "Sesiones o dias adicionales" },
  'cold-brew': { rounds: 2, scope: "Ajustes de edicion, color, ritmo y musica del brand video", outOfScope: "Re-filmacion o cambio de concepto", overagePrice: 150, overageUnit: "per-round" },

  // Broadcast & Animation
  'hot-press': { rounds: 3, scope: "Ajustes de animacion, timing, colores y composicion de graficos", outOfScope: "Nuevos elementos graficos fuera del paquete original", overagePrice: 200, overageUnit: "per-round" },
  'pour-over': { rounds: 2, scope: "Ajustes de animacion, timing y transiciones", outOfScope: "Animaciones adicionales o cambio de concepto", overagePrice: 150, overageUnit: "per-round" },

  // Social & Specialized
  'sprinkles': { rounds: 2, scope: "Ajustes de diseno y efectos del filtro AR", outOfScope: "Filtros adicionales no incluidos", overagePrice: 80, overageUnit: "per-round" },
  'punch-card': { rounds: 3, scope: "Ajustes de diseno, mecanicas y contenido del programa de fidelizacion", outOfScope: "Cambio de estructura de tiers o plataforma", overagePrice: 150, overageUnit: "per-round" },

  // Tech services
  'the-percolator': { rounds: 2, scope: "Ajustes de flujos de automatizacion y configuracion", outOfScope: "Integraciones no previstas o cambio de plataforma", overagePrice: 200, overageUnit: "per-round" },
  'robo-barista': { rounds: 2, scope: "Ajustes de comportamiento, integraciones y entrenamiento del agente", outOfScope: "Cambio de arquitectura o plataforma base", overagePrice: 300, overageUnit: "per-round" },
  'the-brewery': { rounds: 3, scope: "Ajustes de funcionalidad, UI y flujo de la aplicacion", outOfScope: "Funcionalidades fuera del scope original", overagePrice: 400, overageUnit: "per-round",
    milestoneRevisions: {
      design: { rounds: 2, scope: "UI/UX y arquitectura" },
      development: { rounds: 3, scope: "Funcionalidad y bugs" },
      testing: { rounds: 2, scope: "QA y ajustes finales" }
    }
  },
  'coffee-lab': { rounds: 2, scope: "Ajustes de funcionalidad y UI de la herramienta", outOfScope: "Funcionalidades fuera del scope original", overagePrice: 250, overageUnit: "per-round" },
  'the-full-pot': { rounds: 3, scope: "Revisiones por fase del proyecto segun servicios individuales", outOfScope: "Cambio de alcance general", overagePrice: 500, overageUnit: "per-round" },
};

let count = 0;
for (const [id, rev] of Object.entries(revisionDefaults)) {
  if (done.includes(id)) continue;
  if (!s[id]) { console.warn('  [SKIP] Service not found:', id); continue; }
  s[id].revisions = rev;
  count++;
}

// ═══ CONVERT KEY STRUCTURED ITEMS IN REMAINING SERVICES ═══

// Shakefront Lite — variant scaling for pages
if (s['shakefront-lite']) {
  const includes = s['shakefront-lite'].includes;
  const pageIdx = includes.findIndex(i => typeof i === 'string' && i.includes('one-pager'));
  if (pageIdx >= 0) {
    includes[pageIdx] = {
      id: "onepager-development",
      text: "Desarrollo en Webflow: one-pager multi-seccion",
      variantScaling: {
        "basic-onepager": { text: "Desarrollo en Webflow: one-pager basico" },
        "standard-10sections": { text: "Desarrollo en Webflow: one-pager con 10+ secciones" },
        "full-lite": { text: "Desarrollo en Webflow: multi-seccion premium con animaciones" }
      }
    };
  }
}

// Buttery 1-day — quantity for photos
if (s['buttery-1day']) {
  const includes = s['buttery-1day'].includes;
  const photoIdx = includes.findIndex(i => typeof i === 'string' && i.includes('50+'));
  if (photoIdx >= 0) {
    includes[photoIdx] = {
      id: "photo-delivery",
      text: "Entrega de fotos seleccionadas",
      quantity: 50,
      quantityLabel: "Entrega de al menos {{quantity}}+ fotos",
      variantScaling: {
        "staff-only": { quantity: 20, quantityLabel: "Entrega de {{quantity}}+ fotos de equipo" },
        "standard": { quantity: 50 },
        "premium": { quantity: 80, quantityLabel: "Entrega de {{quantity}}+ fotos premium" }
      }
    };
  }

  // Add shared deliverables refs
  const deliverables = s['buttery-1day'].deliverables;
  if (deliverables) {
    for (let i = 0; i < deliverables.length; i++) {
      if (typeof deliverables[i] === 'string') {
        if (deliverables[i].includes('JPG')) deliverables[i] = { id: "photo-jpg", text: deliverables[i], shared: "photo-jpg" };
        else if (deliverables[i].includes('RAW')) deliverables[i] = { id: "photo-raw", text: deliverables[i], shared: "photo-raw" };
        else if (deliverables[i].includes('Google Drive')) deliverables[i] = { id: "drive", text: deliverables[i], shared: "google-drive" };
      }
    }
  }
}

// Cold Brew — shared deliverables
if (s['cold-brew']?.deliverables) {
  const deliverables = s['cold-brew'].deliverables;
  for (let i = 0; i < deliverables.length; i++) {
    if (typeof deliverables[i] !== 'string') continue;
    if (deliverables[i].includes('4K') || deliverables[i].includes('HD')) {
      deliverables[i] = { id: "video-main", text: deliverables[i], shared: "video-4k" };
    } else if (deliverables[i].includes('fuente')) {
      deliverables[i] = { id: "source", text: deliverables[i], shared: "source-files" };
    }
  }
}

// Glass Cup — shared deliverables
if (s['glass-cup']?.deliverables) {
  const deliverables = s['glass-cup'].deliverables;
  for (let i = 0; i < deliverables.length; i++) {
    if (typeof deliverables[i] !== 'string') continue;
    if (deliverables[i].includes('imprimir')) deliverables[i] = { id: "print", text: deliverables[i], shared: "print-ready" };
    else if (deliverables[i].includes('editables')) deliverables[i] = { id: "source", text: deliverables[i], shared: "source-files" };
  }
}

// Tech services — shared deliverables (documentation + training)
for (const techId of ['the-brewery', 'coffee-lab', 'the-percolator', 'robo-barista', 'the-full-pot']) {
  const svc = s[techId];
  if (!svc?.deliverables) continue;
  for (let i = 0; i < svc.deliverables.length; i++) {
    if (typeof svc.deliverables[i] !== 'string') continue;
    if (svc.deliverables[i].includes('Documentacion') || svc.deliverables[i].includes('documentacion')) {
      svc.deliverables[i] = { id: "docs", text: svc.deliverables[i], shared: "documentation" };
    } else if (svc.deliverables[i].includes('entrenamiento') || svc.deliverables[i].includes('Sesion')) {
      svc.deliverables[i] = { id: "training", text: svc.deliverables[i], shared: "training-session" };
    }
  }
}

data.lastUpdated = '2026-03-21';
fs.writeFileSync('data/catalog/services.json', JSON.stringify(data, null, 2));

// Summary
const withRevisions = Object.values(s).filter(svc => svc.revisions).length;
const withStructured = Object.values(s).filter(svc =>
  (svc.includes || []).some(i => typeof i === 'object') ||
  (svc.deliverables || []).some(i => typeof i === 'object')
).length;
console.log(`Done! ${count} services got revisions (total: ${withRevisions}/25)`);
console.log(`${withStructured}/25 services have structured includes/deliverables`);
