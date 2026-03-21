const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/catalog/services.json', 'utf8'));
const s = data.services;

// ═══ MILKY BRANDING ═══
s['milky-branding'].includes = [
  // Always included (all variants)
  {
    id: "logo-system",
    text: "Logotipo y sistema de identidad visual adaptable (todos los formatos y escalas)",
    shared: "brandbook"
  },
  {
    id: "naming",
    text: "Naming Creativo para concepto principal o subdivisiones",
    condition: { variant: ["standard", "full"] }
  },
  "Eslogan corto y concreto que transmita la voz de la marca",
  "Paleta cromatica funcional y expresiva",
  "Seleccion tipografica principal y secundaria optimizada",
  "Copywriting creativo",
  {
    id: "graphic-system",
    text: "Sistema grafico complementario: patrones, tramas e ilustraciones",
    condition: { variant: ["standard", "full"] }
  },
  "Acompanamiento, asesoria y estrategia de desarrollo de la marca",
  {
    id: "packaging-application",
    text: "Aplicacion del sistema de marca sobre el producto (packaging)",
    condition: { variant: ["full"] }
  },
  {
    id: "mockups",
    text: "Mockups realistas de producto (consumo, delivery, RRSS)",
    condition: { variant: ["standard", "full"] }
  },
  "Lineamientos de uso del sistema visual",
  {
    id: "brandbook-creation",
    text: "Brandbook detallado con logica, reglas y criterios",
    shared: "brandbook",
    condition: { variant: ["standard", "full"] }
  },
  {
    id: "packaging-variants",
    text: "Variantes graficas de packaging o etiqueta",
    quantity: 2,
    quantityLabel: "Hasta {{quantity}} variantes graficas de packaging o etiqueta",
    condition: { variant: ["full"] }
  },
  {
    id: "menu-variants",
    text: "Variantes graficas de carta (Menu)",
    quantity: 2,
    quantityLabel: "Hasta {{quantity}} variantes graficas de carta (Menu)",
    condition: { variant: ["full"] }
  },
  "Papeleria basica: tarjetas de presentacion y firma electronica",
  // Cross-service conditional items
  {
    id: "web-brand-assets",
    text: "Assets optimizados para web: favicon, OG image, header backgrounds",
    condition: { service: "shakefront-full" }
  },
  {
    id: "social-brandbook-section",
    text: "Seccion de RRSS incluida en el brandbook (lineamientos de uso social)",
    condition: { service: "flashy-socials" }
  }
];

s['milky-branding'].deliverables = [
  {
    id: "brandbook-doc",
    text: "Brandbook completo y detallado",
    format: "PDF + Figma",
    shared: "brandbook",
    condition: { variant: ["standard", "full"] }
  },
  {
    id: "drive-repo",
    text: "Repositorio digital organizado (Google Drive)",
    shared: "google-drive"
  },
  {
    id: "logo-masters",
    text: "Archivos maestros del logotipo y sistema visual",
    format: "AI/SVG/PNG/PDF"
  },
  {
    id: "mockup-visuals",
    text: "Mockups y visuales de producto para presentaciones",
    condition: { variant: ["standard", "full"] }
  },
  {
    id: "print-ready-assets",
    text: "Assets listos para imprenta",
    shared: "print-ready",
    condition: { variant: ["standard", "full"] }
  },
  {
    id: "revision-rounds",
    text: "Hasta 3 rondas de revision durante el proceso creativo",
    quantity: 3,
    quantityLabel: "Hasta {{quantity}} rondas de revision durante el proceso creativo"
  }
];


// ═══ SHAKEFRONT FULL ═══
s['shakefront-full'].includes = [
  {
    id: "milky-branding-included",
    text: "Milky Branding incluido (identidad de marca completa)",
    shared: "brandbook"
  },
  {
    id: "silky-edits-included",
    text: "Silky Edits incluido (retoque fotografico profesional)"
  },
  "Diseno UI/UX responsive (desktop, tablet, movil, horizontal)",
  "Prototipo interactivo de navegacion",
  {
    id: "pages-development",
    text: "Desarrollo en Webflow con diseno pixel-perfect",
    quantity: 15,
    quantityLabel: "Desarrollo en Webflow: {{quantity}}+ paginas con diseno pixel-perfect",
    variantScaling: {
      "standard-10pages": { quantity: 10 },
      "with-booking": { quantity: 10 },
      "full-cms-15pages": { quantity: 15 },
      "webflow-ecommerce": { quantity: 15 },
      "webflow-shopify": { quantity: 15 },
      "shopify-basic": { quantity: 0, hidden: true },
      "shopify-branded": { quantity: 0, hidden: true },
      "custom-headless": { quantity: 0, hidden: true }
    }
  },
  {
    id: "cms",
    text: "CMS personalizado para gestion de contenidos",
    condition: { variant: ["standard-10pages", "full-cms-15pages", "webflow-ecommerce", "webflow-shopify"] }
  },
  "Sitemap jerarquico + Styleguide digital",
  "Sistema de componentes reutilizables",
  "CTAs claros, pop-ups, modals y pestanas dinamicas",
  "Animaciones y microinteracciones sutiles",
  "SEO avanzado: estructura semantica, metaetiquetas, URLs limpias",
  "Diseno 100% adaptativo (responsive total)",
  "Formularios de contacto con envio a correos corporativos",
  {
    id: "hosting-included",
    text: "Hosting, dominio, SSL y correos corporativos",
    shared: "google-drive"
  },
  "Cumplimiento legal: RGPD, CCPA, cookies",
  "Accesibilidad (WCAG)",
  "Mapa interactivo",
  "Integracion con APIs de terceros",
  "Herramientas de marketing (email, remarketing, blog)",
  "Funcionalidad multilinguee dinamica",
  "Pruebas de compatibilidad y optimizacion",
  "Soporte post-lanzamiento",
  // Variant-specific items
  {
    id: "shopify-bridge",
    text: "Integracion Shopify via Smooftify bridge (carrito + inventario + checkout)",
    condition: { variant: ["webflow-shopify"] }
  },
  {
    id: "ecommerce-native",
    text: "E-commerce nativo de Webflow (catalogo, carrito, checkout)",
    condition: { variant: ["webflow-ecommerce"] }
  },
  {
    id: "shopify-theme",
    text: "Tema Shopify personalizado desde cero",
    condition: { variant: ["shopify-branded"] }
  },
  {
    id: "shopify-config",
    text: "Configuracion y personalizacion de tema Shopify",
    condition: { variant: ["shopify-basic"] }
  },
  {
    id: "headless-dev",
    text: "Desarrollo Next.js con API headless (Shopify/Saleor)",
    condition: { variant: ["custom-headless"] }
  },
  {
    id: "booking-system",
    text: "Sistema de reservas y agenda integrado",
    condition: { variant: ["with-booking"] }
  }
];

s['shakefront-full'].deliverables = [
  {
    id: "wireframe-doc",
    text: "Wireframe 99% funcional",
    shared: "wireframe"
  },
  {
    id: "brand-assets-export",
    text: "Activos de marca optimizados y exportados"
  },
  "Sitio web funcional y listo para lanzamiento",
  {
    id: "cms-training",
    text: "Introduccion al portal de usuarios y modificacion del contenido",
    shared: "training-session"
  }
];


// ═══ FLASHY SOCIALS ═══
s['flashy-socials'].includes = [
  "Firmas digitales para correo electronico",
  "Configuracion de Google Workspace para correos empresariales",
  "Tono, voz y valores de la marca y su comportamiento digital",
  "Copywriting y asesoramiento creativo para biografias en distintas plataformas",
  {
    id: "instagram-grid",
    text: "Diseno de las primeras publicaciones de la grilla de Instagram",
    quantity: 12,
    quantityLabel: "Diseno de las primeras {{quantity}} publicaciones de la grilla de Instagram",
    variantScaling: {
      "lite": { quantity: 6 },
      "standard": { quantity: 12 },
      "discounted-with-full": { quantity: 12 }
    }
  },
  {
    id: "tiktok-launch",
    text: "Creacion de 1 TikTok con sound original para campana de lanzamiento",
    condition: { variant: ["standard", "discounted-with-full"] }
  },
  "Creacion de plantillas en Adobe Express",
  "Gestor de Marca en Adobe Express: acceso a recursos vectoriales, tipografias, paletas",
  {
    id: "scheduling",
    text: "Programacion semanal del contenido en Adobe Express",
    condition: { variant: ["standard", "discounted-with-full"] }
  },
  "Fotos de perfil y banners para distintas plataformas de social media",
  {
    id: "social-brandbook",
    text: "Social BrandBook: manual de tonalidad e implementacion grafica para RRSS",
    shared: "brandbook",
    condition: { variant: ["standard", "discounted-with-full"] }
  }
];

s['flashy-socials'].deliverables = [
  {
    id: "social-templates-delivery",
    text: "Plantillas editables en Adobe Express",
    format: "Adobe Express",
    shared: "social-templates"
  },
  {
    id: "social-grid-delivery",
    text: "Primeras publicaciones disenadas y programadas",
    quantity: 12,
    quantityLabel: "{{quantity}} publicaciones disenadas y programadas",
    variantScaling: {
      "lite": { quantity: 6 },
      "standard": { quantity: 12 },
      "discounted-with-full": { quantity: 12 }
    }
  },
  {
    id: "social-brandbook-doc",
    text: "Social BrandBook completo",
    format: "PDF",
    shared: "brandbook",
    condition: { variant: ["standard", "discounted-with-full"] }
  },
  {
    id: "drive-social",
    text: "Google Drive con todos los recursos sociales",
    shared: "google-drive"
  }
];

fs.writeFileSync('data/catalog/services.json', JSON.stringify(data, null, 2));
console.log('Converted includes/deliverables for: milky-branding, shakefront-full, flashy-socials');

// Verify counts
for (const id of ['milky-branding', 'shakefront-full', 'flashy-socials']) {
  const svc = data.services[id];
  const structured = svc.includes.filter(i => typeof i === 'object').length;
  const flat = svc.includes.filter(i => typeof i === 'string').length;
  const delStructured = (svc.deliverables || []).filter(i => typeof i === 'object').length;
  const delFlat = (svc.deliverables || []).filter(i => typeof i === 'string').length;
  console.log(`  ${id}: ${flat} flat + ${structured} structured includes, ${delFlat} flat + ${delStructured} structured deliverables`);
}
