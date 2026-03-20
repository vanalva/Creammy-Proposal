# Proposal System — Gap Analysis & Implementation Status

**Date:** 2026-03-20 (updated)
**Context:** Analysis based on Pakei & Azorica client proposals, build system v2 architecture, and real-world proposal generation workflow.
**Status:** 8 of 16 items fully implemented, 3 partially implemented, 5 not yet implemented.

---

## Implementation Status

| # | Item | Status | Key Location |
|---|---|---|---|
| 1 | Package Comparison Matrix | DONE | `build.js:1386` → `generatePackageComparison()` |
| 2 | Timeline Visualization | DONE | `build.js:1259` → `generateTimeline()` |
| 3 | ROI Calculator | NOT DONE | — |
| 4 | Direct CTA / Next Step | DONE | `build.js:1346` → `generateCtaButtons()`, `generateWhatsAppFloat()` |
| 5 | Service Dependencies | PARTIAL | `pricing.js:60` auto-selects deps; no deselect warnings |
| 6 | Pricing Variants from Catalog | PARTIAL | Data exists in `services.json`; build doesn't resolve variant IDs |
| 7 | Proposal Versioning | NOT DONE | — |
| 8 | Budget-Aware Recommendations | NOT DONE | — |
| 9 | Minimum Pricing Floors | PARTIAL | Framework in `build.js:437`; `minimumPrice` not in catalog |
| 10 | Required Contract Clauses | DONE | `project-clauses.json` has `required: true` fields |
| 11 | Visual Theming | NOT DONE | — |
| 12 | Custom Content Sections | DONE | `build.js:1313` → `generateCustomSections()` |
| 13 | Multi-Currency Display | NOT DONE | — |
| 14 | Proposal Analytics | NOT DONE | — |
| 15 | PDF Export Per Package | NOT DONE | — |
| 16 | Dynamic Payment Structures | DONE | `build.js:1242` + `pricing.js:435` → three-layer approach |

---

## DONE — Implemented Items

### 1. Package Comparison Matrix

**Location:** `build.js:1386`, `templates/blocks/package-comparison.html`

`generatePackageComparison()` renders a side-by-side matrix with:
- Header row: package names, prices, badges ("Recomendado"), clickable headers
- Service rows: checkmarks/dashes with prices (including overrides and bundle discounts)
- Footer: "Seleccionar" buttons per package, savings row
- Integrates with `PricingCart.selectPackage()` for interactive selection

### 2. Timeline Visualization

**Location:** `build.js:1259`, `templates/blocks/timeline.html`

`generateTimeline()` auto-generates or reads from `manifest.timeline.phases`:
- Horizontal bar visualization with phase names, duration (weeks), service lists
- Payment percentage display per phase
- Auto-calculates total project duration from service catalog `timeline.min/max`
- Manifest schema: `timeline.phases[]: { name, weeks, services[], payment }`

### 4. Direct CTA / Next Step

**Location:** `build.js:1346`, `templates/blocks/cta-final.html`

- `generateCtaButtons()`: renders WhatsApp, email, Calendly links
- `generateWhatsAppFloat()`: floating WhatsApp button (bottom-right)
- Manifest schema: `cta: { whatsapp, email, calendly, message }`
- Template vars: `{{CTA_BUTTONS}}`, `{{WHATSAPP_FLOAT}}`, `{{ctaHeading}}`, `{{ctaSubheading}}`

### 10. Required Contract Clauses

**Location:** `data/contracts/project-clauses.json`, `data/contracts/retainer-clauses.json`

Clauses have `required: true` fields. Required clauses: header, serviceChecklist, confidentiality, clientApproval, revisions, terminationDesigner, communicationPause. Build always includes them regardless of condition evaluation.

### 12. Custom Content Sections

**Location:** `build.js:1313`, `templates/blocks/custom-section.html`

`generateCustomSections()` reads `manifest.content.customSections[]`:
```json
"customSections": [
  {
    "id": "phase-roadmap",
    "eyebrow": "Visión a Futuro",
    "heading": "Roadmap: De Fase 1 a Fase 3",
    "body": "<p>...</p>",
    "position": "after:methodology-tabs"
  }
]
```
Supports `variant` and `narrow` modifiers. Skill can add project-specific sections without new template files.

### 16. Dynamic Payment Structures Per Package

**Location:** `build.js:1242`, `pricing.js:435`

Three-layer approach fully implemented:
- **Layer 1 (build-time):** `buildPackagePayments()` evaluates `payments.json` rules against services/totals
- **Layer 2 (runtime):** Each package supports `paymentStructure` field; `updatePaymentDisplay(pkgId)` swaps payment display on package click
- **Layer 3 (override):** Skill can set custom `paymentSplits` per package

---

## PARTIAL — Needs Completion

### 5. Service Dependencies

**What works:** `pricing.js` auto-selects required dependencies when a service is toggled on. `services.json` has `bundleRules.requires` and `bundleRules.recommendedWith`. `buildServiceDeps()` extracts deps into pricing config.

**Still missing:**
- Auto-deselect dependents when a required service is removed
- Visual dependency warnings/tooltips on cards
- Dependency lines or visual indicators between related cards

### 6. Pricing Variants from Catalog

**What works:** `services.json` has `priceVariants` defined (e.g., shakefront-full has standard-10pages €5,550, full-cms-15pages €13,500, etc.).

**Still missing:**
- Manifest `pricing.variants` object not recognized by build
- Build doesn't resolve variant IDs to prices
- Skill still requires manual `overrides` instead of `variants: { "shakefront-full": "full-cms-15pages" }`

### 9. Minimum Pricing Floors

**What works:** Build checks `svc.pricing.minimumPrice || svc.pricing.priceRange?.min` at line 437.

**Still missing:**
- No `minimumPrice` field actually defined in `services.json`
- No warning/rejection when override < minimum
- No special discount bypass mechanism

---

## NOT DONE — Remaining Items

### 3. ROI Calculator

**Impact: HIGH** — Justifies tech spend (€13,700 for brewery+percolator+robo-barista).

**Needs:**
- `generateROI()` function in build.js
- `roi-calculator.html` block
- Manifest schema: `roi: { "the-brewery": { hoursSavedPerMonth: 80, costPerHour: 8 } }`
- Renders: hours saved, cost equivalent, break-even timeline
- Optional: interactive slider for volume adjustment

### 7. Proposal Versioning

**Impact: MEDIUM** — Prevents overwriting proposals during client back-and-forth.

**Needs:**
- `proposal.version` field in manifest
- Build outputs to `output/P-XXX/v{version}/`
- Skill increments version on revision
- Optional: changelog field

### 8. Budget-Aware Recommendations

**Impact: MEDIUM** — Helps skill calibrate tone and package emphasis.

**Needs:**
- `budgetSignal` field in manifest (minimal/tight/moderate/comfortable/solid/generous/enterprise/unknown)
- `budgetRange: [min, max]` optional
- Skill uses it to set "Recomendado" badge and adjust upsell aggressiveness

### 11. Visual Theming

**Impact: LOW-MEDIUM** — All proposals currently dark theme.

**Needs:**
- `brand.theme` field in manifest (dark/light/minimal)
- Theme CSS files: `css/theme-dark.css`, `css/theme-light.css`
- CSS custom properties for theme switching
- Shell loads theme CSS based on manifest

### 13. Multi-Currency Display

**Impact: MEDIUM** for international clients (Pakei thinks in USD).

**Needs:**
- `displayCurrencies: ["EUR", "USD"]` + `exchangeRate: { USD: 1.08 }` in manifest
- Secondary currency display in pricing cards: `€13,500 (~$14,580)`
- PDF export includes both currencies

### 14. Proposal Analytics

**Impact: LOW** — Nice for follow-up timing.

**Needs:**
- `analytics: true` manifest field
- Lightweight script tracking: page open, scroll depth, package clicks, PDF downloads
- Sends to webhook (Slack, PostHog, or simple endpoint)

### 15. PDF Export Per Package

**Impact: LOW-MEDIUM** — Useful when client shares with partner.

**Needs:**
- Download button on each package card
- `downloadPDFByPackage(pkgId)` in pricing.js
- PDF contains only that package's services, savings, payment structure

---

## Priority Recommendation (Updated)

**Next to implement (highest impact for remaining effort):**

1. **ROI Calculator** (#3) — Only unimplemented high-impact item. Critical for tech-heavy proposals
2. **Pricing Variants** (#6) — Data already exists; just needs build wiring. Removes manual overrides
3. **Minimum Floors** (#9) — Framework exists; just needs `minimumPrice` in catalog. Safety net

**Defer (nice-to-have, lower ROI):**

4. Versioning (#7) — Low frequency need
5. Budget-Aware (#8) — Skill can infer from context
6. Multi-Currency (#13) — Manual note in proposal suffices
7. Theming (#11) — Dark theme works well for current brand
8. Analytics (#14) — Can ask client directly
9. PDF Per Package (#15) — Client can screenshot
