const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/catalog/services.json', 'utf8'));
const s = data.services;

// Milky Branding — 3 rounds, design-focused
s['milky-branding'].revisions = {
  rounds: 3,
  scope: "Ajustes de color, tipografia, composicion y layout dentro del concepto aprobado",
  outOfScope: "Cambio de direccion creativa, concepto o estructura del sistema de marca",
  overagePrice: 150,
  overageUnit: "per-round",
  goodFaithAdjustments: true,
  goodFaithExamples: "color, tipografia, alineacion, tamano"
};

// Shakefront Full — 3 rounds overall, with milestone-specific revision budgets
s['shakefront-full'].revisions = {
  rounds: 3,
  scope: "Ajustes de diseno, layout, contenido e interacciones dentro del wireframe aprobado",
  outOfScope: "Rediseno de la arquitectura web, cambio de plataforma, paginas fuera del sitemap original",
  overagePrice: 250,
  overageUnit: "per-round",
  milestoneRevisions: {
    wireframe: { rounds: 2, scope: "Estructura, navegacion y jerarquia de contenido" },
    design: { rounds: 3, scope: "Diseno visual, UI, colores, tipografia, imagenes" },
    development: { rounds: 2, scope: "Funcionalidad, responsive, animaciones, interacciones" }
  }
};

// Flashy Socials — fewer rounds (2), smaller scope
s['flashy-socials'].revisions = {
  rounds: 2,
  scope: "Ajustes de diseno, copy y composicion de las publicaciones",
  outOfScope: "Cambio total de concepto visual, adicion de plataformas no incluidas",
  overagePrice: 80,
  overageUnit: "per-round"
};

data.lastUpdated = '2026-03-20';
fs.writeFileSync('data/catalog/services.json', JSON.stringify(data, null, 2));
console.log('Added revisions to: milky-branding, shakefront-full, flashy-socials');
