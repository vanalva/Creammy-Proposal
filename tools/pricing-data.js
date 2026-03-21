const EMBEDDED_SERVICES = {
  "version": "3.0",
  "lastUpdated": "2026-03-21",
  "currency": "EUR",
  "taxNote": "+ IVA where applicable",
  "services": {
    "milky-branding": {
      "id": "milky-branding",
      "name": "Milky Branding",
      "category": "branding",
      "eyebrow": "Branding",
      "subtitle": "Identidad de marca completa",
      "pricing": {
        "type": "fixed",
        "basePrice": 3500,
        "monthly": false,
        "priceRange": {
          "min": 750,
          "max": 3500
        },
        "priceVariants": {
          "basic": {
            "price": 750,
            "description": "Logo refresh only, no brandbook",
            "criteria": "Existing brand needing minor update"
          },
          "tcc-retainer": {
            "price": 1200,
            "description": "Within active retainer TCC allocation",
            "criteria": "Active retainer client using TCC"
          },
          "standard": {
            "price": 1500,
            "description": "Full identity, single brand, no packaging/sub-brands",
            "criteria": "New single-brand business"
          },
          "full": {
            "price": 3500,
            "description": "Complete system + packaging + sub-brands + brandbook",
            "criteria": "DEFAULT for standalone projects"
          }
        },
        "defaultVariant": "full"
      },
      "timeline": {
        "min": 2,
        "max": 4,
        "unit": "weeks"
      },
      "description": {
        "short": "Sistema visual completo, capaz de crecer junto al negocio y adaptarse a distintos formatos.",
        "medium": "Identidad de marca completa. Sistema visual solido, capaz de crecer junto al negocio y adaptarse a distintos formatos, contextos y etapas. Cada decision de diseno respondera a una estrategia clara de posicionamiento y diferenciacion.",
        "long": "whyMilkyBranding"
      },
      "includes": [
        {
          "id": "logo-system",
          "text": "Logotipo y sistema de identidad visual adaptable (todos los formatos y escalas)",
          "shared": "brandbook"
        },
        {
          "id": "naming",
          "text": "Naming Creativo para concepto principal o subdivisiones",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        "Eslogan corto y concreto que transmita la voz de la marca",
        "Paleta cromatica funcional y expresiva",
        "Seleccion tipografica principal y secundaria optimizada",
        "Copywriting creativo",
        {
          "id": "graphic-system",
          "text": "Sistema grafico complementario: patrones, tramas e ilustraciones",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        "Acompanamiento, asesoria y estrategia de desarrollo de la marca",
        {
          "id": "packaging-application",
          "text": "Aplicacion del sistema de marca sobre el producto (packaging)",
          "condition": {
            "variant": [
              "full"
            ]
          }
        },
        {
          "id": "mockups",
          "text": "Mockups realistas de producto (consumo, delivery, RRSS)",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        "Lineamientos de uso del sistema visual",
        {
          "id": "brandbook-creation",
          "text": "Brandbook detallado con logica, reglas y criterios",
          "shared": "brandbook",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        {
          "id": "packaging-variants",
          "text": "Variantes graficas de packaging o etiqueta",
          "quantity": 2,
          "quantityLabel": "Hasta {{quantity}} variantes graficas de packaging o etiqueta",
          "condition": {
            "variant": [
              "full"
            ]
          }
        },
        {
          "id": "menu-variants",
          "text": "Variantes graficas de carta (Menu)",
          "quantity": 2,
          "quantityLabel": "Hasta {{quantity}} variantes graficas de carta (Menu)",
          "condition": {
            "variant": [
              "full"
            ]
          }
        },
        "Papeleria basica: tarjetas de presentacion y firma electronica",
        {
          "id": "web-brand-assets",
          "text": "Assets optimizados para web: favicon, OG image, header backgrounds",
          "condition": {
            "service": "shakefront-full"
          }
        },
        {
          "id": "social-brandbook-section",
          "text": "Seccion de RRSS incluida en el brandbook (lineamientos de uso social)",
          "condition": {
            "service": "flashy-socials"
          }
        }
      ],
      "deliverables": [
        {
          "id": "brandbook-doc",
          "text": "Brandbook completo y detallado",
          "format": "PDF + Figma",
          "shared": "brandbook",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        {
          "id": "drive-repo",
          "text": "Repositorio digital organizado (Google Drive)",
          "shared": "google-drive"
        },
        {
          "id": "logo-masters",
          "text": "Archivos maestros del logotipo y sistema visual",
          "format": "AI/SVG/PNG/PDF"
        },
        {
          "id": "mockup-visuals",
          "text": "Mockups y visuales de producto para presentaciones",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        {
          "id": "print-ready-assets",
          "text": "Assets listos para imprenta",
          "shared": "print-ready",
          "condition": {
            "variant": [
              "standard",
              "full"
            ]
          }
        },
        {
          "id": "revision-rounds",
          "text": "Hasta 3 rondas de revision durante el proceso creativo",
          "quantity": 3,
          "quantityLabel": "Hasta {{quantity}} rondas de revision durante el proceso creativo"
        }
      ],
      "tags": [
        "branding",
        "naming",
        "brandbook",
        "logo",
        "identidad"
      ],
      "bundleRules": {
        "includedWith": [
          "shakefront-full"
        ],
        "freeWith": []
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de color, tipografia, composicion y layout dentro del concepto aprobado",
        "outOfScope": "Cambio de direccion creativa, concepto o estructura del sistema de marca",
        "overagePrice": 150,
        "overageUnit": "per-round",
        "goodFaithAdjustments": true,
        "goodFaithExamples": "color, tipografia, alineacion, tamano"
      }
    },
    "shakefront-full": {
      "id": "shakefront-full",
      "name": "Shakefront Full",
      "category": "web",
      "eyebrow": "Web Full - CMS",
      "subtitle": "Sitio web completo en Webflow con CMS integrado",
      "pricing": {
        "type": "fixed",
        "basePrice": 13500,
        "monthly": false,
        "priceRange": {
          "min": 4500,
          "max": 18000
        },
        "priceVariants": {
          "standard-10pages": {
            "price": 5550,
            "description": "Simple site, 10 pages, basic CMS",
            "criteria": "Small business, informational site"
          },
          "with-booking": {
            "price": 7750,
            "description": "Site + booking/reservation system (The Counter included)",
            "criteria": "Hospitality, tourism, services businesses"
          },
          "full-cms-15pages": {
            "price": 13500,
            "description": "Full CMS, 15+ pages, animations, SEO avanzado",
            "criteria": "DEFAULT for standalone projects"
          },
          "webflow-ecommerce": {
            "price": 15265,
            "description": "Webflow native e-commerce, <50 products",
            "criteria": "Small catalog, visual-first brand"
          },
          "webflow-shopify": {
            "price": 12000,
            "description": "Webflow design + Shopify via Smooftify bridge",
            "criteria": "Best of both: design freedom + real e-commerce"
          },
          "shopify-basic": {
            "price": 4500,
            "description": "Shopify standalone + theme customization",
            "criteria": "Client wants/has Shopify, no Webflow needed"
          },
          "shopify-branded": {
            "price": 8500,
            "description": "Shopify + fully custom theme from scratch",
            "criteria": "Full brand experience on Shopify platform"
          },
          "custom-headless": {
            "price": 18000,
            "description": "Next.js + headless Shopify/Saleor API, via The Brewery",
            "criteria": "Complex logic, subscriptions, custom checkout"
          }
        },
        "defaultVariant": "full-cms-15pages"
      },
      "timeline": {
        "min": 6,
        "max": 12,
        "unit": "weeks"
      },
      "description": {
        "short": "Sitio web completo en Webflow con CMS, 15+ paginas, animaciones y SEO avanzado.",
        "medium": "Sitio web completo en Webflow con CMS integrado. Incluye Milky Branding y Silky Edits. Mas de 15 paginas unicas, diseno pixel-perfect, animaciones, SEO avanzado y soporte post-lanzamiento.",
        "long": "whyShakefront"
      },
      "includes": [
        {
          "id": "milky-branding-included",
          "text": "Milky Branding incluido (identidad de marca completa)",
          "shared": "brandbook"
        },
        {
          "id": "silky-edits-included",
          "text": "Silky Edits incluido (retoque fotografico profesional)"
        },
        "Diseno UI/UX responsive (desktop, tablet, movil, horizontal)",
        "Prototipo interactivo de navegacion",
        {
          "id": "pages-development",
          "text": "Desarrollo en Webflow con diseno pixel-perfect",
          "quantity": 15,
          "quantityLabel": "Desarrollo en Webflow: {{quantity}}+ paginas con diseno pixel-perfect",
          "variantScaling": {
            "standard-10pages": {
              "quantity": 10
            },
            "with-booking": {
              "quantity": 10
            },
            "full-cms-15pages": {
              "quantity": 15
            },
            "webflow-ecommerce": {
              "quantity": 15
            },
            "webflow-shopify": {
              "quantity": 15
            },
            "shopify-basic": {
              "quantity": 0,
              "hidden": true
            },
            "shopify-branded": {
              "quantity": 0,
              "hidden": true
            },
            "custom-headless": {
              "quantity": 0,
              "hidden": true
            }
          }
        },
        {
          "id": "cms",
          "text": "CMS personalizado para gestion de contenidos",
          "condition": {
            "variant": [
              "standard-10pages",
              "full-cms-15pages",
              "webflow-ecommerce",
              "webflow-shopify"
            ]
          }
        },
        "Sitemap jerarquico + Styleguide digital",
        "Sistema de componentes reutilizables",
        "CTAs claros, pop-ups, modals y pestanas dinamicas",
        "Animaciones y microinteracciones sutiles",
        "SEO avanzado: estructura semantica, metaetiquetas, URLs limpias",
        "Diseno 100% adaptativo (responsive total)",
        "Formularios de contacto con envio a correos corporativos",
        {
          "id": "hosting-included",
          "text": "Hosting, dominio, SSL y correos corporativos",
          "shared": "google-drive"
        },
        "Cumplimiento legal: RGPD, CCPA, cookies",
        "Accesibilidad (WCAG)",
        "Mapa interactivo",
        "Integracion con APIs de terceros",
        "Herramientas de marketing (email, remarketing, blog)",
        "Funcionalidad multilinguee dinamica",
        "Pruebas de compatibilidad y optimizacion",
        "Soporte post-lanzamiento",
        {
          "id": "shopify-bridge",
          "text": "Integracion Shopify via Smooftify bridge (carrito + inventario + checkout)",
          "condition": {
            "variant": [
              "webflow-shopify"
            ]
          }
        },
        {
          "id": "ecommerce-native",
          "text": "E-commerce nativo de Webflow (catalogo, carrito, checkout)",
          "condition": {
            "variant": [
              "webflow-ecommerce"
            ]
          }
        },
        {
          "id": "shopify-theme",
          "text": "Tema Shopify personalizado desde cero",
          "condition": {
            "variant": [
              "shopify-branded"
            ]
          }
        },
        {
          "id": "shopify-config",
          "text": "Configuracion y personalizacion de tema Shopify",
          "condition": {
            "variant": [
              "shopify-basic"
            ]
          }
        },
        {
          "id": "headless-dev",
          "text": "Desarrollo Next.js con API headless (Shopify/Saleor)",
          "condition": {
            "variant": [
              "custom-headless"
            ]
          }
        },
        {
          "id": "booking-system",
          "text": "Sistema de reservas y agenda integrado",
          "condition": {
            "variant": [
              "with-booking"
            ]
          }
        }
      ],
      "deliverables": [
        {
          "id": "wireframe-doc",
          "text": "Wireframe 99% funcional",
          "shared": "wireframe"
        },
        {
          "id": "brand-assets-export",
          "text": "Activos de marca optimizados y exportados"
        },
        "Sitio web funcional y listo para lanzamiento",
        {
          "id": "cms-training",
          "text": "Introduccion al portal de usuarios y modificacion del contenido",
          "shared": "training-session"
        }
      ],
      "tags": [
        "web",
        "webflow",
        "cms",
        "fullsite",
        "responsive",
        "seo"
      ],
      "bundleRules": {
        "includedWith": [],
        "includes": [
          "milky-branding",
          "silky-edits",
          "the-grinder",
          "rosetta"
        ],
        "freeWith": []
      },
      "mutuallyExclusiveWith": [
        "shakefront-lite",
        "espresso-shot"
      ],
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de diseno, layout, contenido e interacciones dentro del wireframe aprobado",
        "outOfScope": "Rediseno de la arquitectura web, cambio de plataforma, paginas fuera del sitemap original",
        "overagePrice": 250,
        "overageUnit": "per-round",
        "milestoneRevisions": {
          "wireframe": {
            "rounds": 2,
            "scope": "Estructura, navegacion y jerarquia de contenido"
          },
          "design": {
            "rounds": 3,
            "scope": "Diseno visual, UI, colores, tipografia, imagenes"
          },
          "development": {
            "rounds": 2,
            "scope": "Funcionalidad, responsive, animaciones, interacciones"
          }
        }
      }
    },
    "shakefront-lite": {
      "id": "shakefront-lite",
      "name": "Shakefront Lite",
      "category": "web",
      "eyebrow": "Web Lite",
      "subtitle": "One-pager elegante y funcional en Webflow",
      "pricing": {
        "type": "fixed",
        "basePrice": 10500,
        "monthly": false,
        "priceRange": {
          "min": 2100,
          "max": 10500
        },
        "priceVariants": {
          "basic-onepager": {
            "price": 2100,
            "description": "Single scroll page, minimal sections",
            "criteria": "MVP, quick launch, tight budget"
          },
          "standard-10sections": {
            "price": 3750,
            "description": "One-pager with 10+ sections, animations",
            "criteria": "DEFAULT for one-pager projects"
          },
          "full-lite": {
            "price": 10500,
            "description": "Multi-section, full animations, SEO, multilingual",
            "criteria": "Premium one-pager, near-full-site scope"
          }
        },
        "defaultVariant": "standard-10sections"
      },
      "timeline": {
        "min": 4,
        "max": 8,
        "unit": "weeks"
      },
      "description": {
        "short": "One-pager elegante y funcional en Webflow. Sin CMS.",
        "medium": "One-pager elegante y funcional en Webflow. No incluye branding ni CMS. Ideal para una presencia web directa, rapida y con impacto visual.",
        "long": "whyShakefrontLite"
      },
      "includes": [
        "Diseno UI/UX responsive (desktop, tablet, movil, horizontal)",
        {
          "id": "onepager-development",
          "text": "Desarrollo en Webflow: one-pager multi-seccion",
          "variantScaling": {
            "basic-onepager": {
              "text": "Desarrollo en Webflow: one-pager basico"
            },
            "standard-10sections": {
              "text": "Desarrollo en Webflow: one-pager con 10+ secciones"
            },
            "full-lite": {
              "text": "Desarrollo en Webflow: multi-seccion premium con animaciones"
            }
          }
        },
        "SEO avanzado",
        "Hosting, dominio, SSL y correos corporativos",
        "Formularios de contacto",
        "Funcionalidad multilinguee",
        "Diseno 100% adaptativo",
        "Paginas funcionales (politicas, 404, terminos, cookies)",
        "Iconografia personalizada",
        "Videografia integrada",
        "Pruebas y optimizacion",
        "Cumplimiento legal y accesibilidad (WCAG)",
        "Soporte post-lanzamiento"
      ],
      "deliverables": null,
      "tags": [
        "web",
        "webflow",
        "onepager",
        "responsive",
        "lite"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": []
      },
      "mutuallyExclusiveWith": [
        "shakefront-full",
        "espresso-shot"
      ],
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de diseno, layout y contenido dentro del wireframe aprobado",
        "outOfScope": "Cambio de plataforma, paginas adicionales fuera del sitemap",
        "overagePrice": 200,
        "overageUnit": "per-round"
      }
    },
    "flashy-socials": {
      "id": "flashy-socials",
      "name": "Flashy Socials",
      "category": "social",
      "eyebrow": "Redes - Pack Social",
      "subtitle": "Pack completo de contenido para redes sociales",
      "pricing": {
        "type": "fixed",
        "basePrice": 1200,
        "monthly": false,
        "priceRange": {
          "min": 780,
          "max": 1200
        },
        "priceVariants": {
          "lite": {
            "price": 780,
            "description": "6 posts only, no TikTok, no scheduling",
            "criteria": "Minimal social presence setup"
          },
          "standard": {
            "price": 1200,
            "description": "Full pack: 12 posts, TikTok, plantillas, scheduling",
            "criteria": "DEFAULT for standalone projects"
          },
          "discounted-with-full": {
            "price": 870,
            "description": "Auto-applied discount with Shakefront Full",
            "criteria": "Auto: do not select manually"
          }
        },
        "defaultVariant": "standard"
      },
      "timeline": {
        "min": 2,
        "max": 3,
        "unit": "weeks"
      },
      "description": {
        "short": "Configuracion de redes, plantillas, contenido inicial y brandbook social.",
        "medium": "Pack completo de contenido para redes sociales. Configuracion de perfiles, plantillas editables, y las primeras publicaciones con la nueva estetica de marca.",
        "long": "whyFlashySocials"
      },
      "includes": [
        "Firmas digitales para correo electronico",
        "Configuracion de Google Workspace para correos empresariales",
        "Tono, voz y valores de la marca y su comportamiento digital",
        "Copywriting y asesoramiento creativo para biografias en distintas plataformas",
        {
          "id": "instagram-grid",
          "text": "Diseno de las primeras publicaciones de la grilla de Instagram",
          "quantity": 12,
          "quantityLabel": "Diseno de las primeras {{quantity}} publicaciones de la grilla de Instagram",
          "variantScaling": {
            "lite": {
              "quantity": 6
            },
            "standard": {
              "quantity": 12
            },
            "discounted-with-full": {
              "quantity": 12
            }
          }
        },
        {
          "id": "tiktok-launch",
          "text": "Creacion de 1 TikTok con sound original para campana de lanzamiento",
          "condition": {
            "variant": [
              "standard",
              "discounted-with-full"
            ]
          }
        },
        "Creacion de plantillas en Adobe Express",
        "Gestor de Marca en Adobe Express: acceso a recursos vectoriales, tipografias, paletas",
        {
          "id": "scheduling",
          "text": "Programacion semanal del contenido en Adobe Express",
          "condition": {
            "variant": [
              "standard",
              "discounted-with-full"
            ]
          }
        },
        "Fotos de perfil y banners para distintas plataformas de social media",
        {
          "id": "social-brandbook",
          "text": "Social BrandBook: manual de tonalidad e implementacion grafica para RRSS",
          "shared": "brandbook",
          "condition": {
            "variant": [
              "standard",
              "discounted-with-full"
            ]
          }
        }
      ],
      "deliverables": [
        {
          "id": "social-templates-delivery",
          "text": "Plantillas editables en Adobe Express",
          "format": "Adobe Express",
          "shared": "social-templates"
        },
        {
          "id": "social-grid-delivery",
          "text": "Primeras publicaciones disenadas y programadas",
          "quantity": 12,
          "quantityLabel": "{{quantity}} publicaciones disenadas y programadas",
          "variantScaling": {
            "lite": {
              "quantity": 6
            },
            "standard": {
              "quantity": 12
            },
            "discounted-with-full": {
              "quantity": 12
            }
          }
        },
        {
          "id": "social-brandbook-doc",
          "text": "Social BrandBook completo",
          "format": "PDF",
          "shared": "brandbook",
          "condition": {
            "variant": [
              "standard",
              "discounted-with-full"
            ]
          }
        },
        {
          "id": "drive-social",
          "text": "Google Drive con todos los recursos sociales",
          "shared": "google-drive"
        }
      ],
      "tags": [
        "social",
        "instagram",
        "tiktok",
        "contenido",
        "plantillas"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "discountedWith": {
          "shakefront-full": 870
        }
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de diseno, copy y composicion de las publicaciones",
        "outOfScope": "Cambio total de concepto visual, adicion de plataformas no incluidas",
        "overagePrice": 80,
        "overageUnit": "per-round"
      }
    },
    "buttery-1day": {
      "id": "buttery-1day",
      "name": "Buttery Frames (1 dia)",
      "category": "production",
      "eyebrow": "Produccion - Foto",
      "subtitle": "Sesion fotografica profesional de 1 dia",
      "pricing": {
        "type": "fixed",
        "basePrice": 1200,
        "monthly": false,
        "priceRange": {
          "min": 350,
          "max": 1800
        },
        "priceVariants": {
          "staff-only": {
            "price": 350,
            "description": "Team headshots only, 2 hours max",
            "criteria": "Headshots for team page / LinkedIn"
          },
          "standard": {
            "price": 1200,
            "description": "Full day (4-6h), products + people, 50+ photos",
            "criteria": "DEFAULT for most projects"
          },
          "premium": {
            "price": 1800,
            "description": "Multiple setups, styled, art direction, premium equipment",
            "criteria": "High-end brand, editorial quality"
          }
        },
        "defaultVariant": "standard"
      },
      "timeline": {
        "min": 1,
        "max": 1,
        "unit": "days"
      },
      "description": {
        "short": "Sesion fotografica profesional de 4 a 6 horas con entrega de 50+ fotos.",
        "medium": "Registro fotografico y produccion profesional para personal y productos. Una sesion completa con planificacion previa y material de video incluido.",
        "long": "whyButteryFrames"
      },
      "includes": [
        "Sesion de 4 a 6 horas",
        "Sin limite de capturas",
        {
          "id": "photo-delivery",
          "text": "Entrega de fotos seleccionadas",
          "quantity": 50,
          "quantityLabel": "Entrega de al menos {{quantity}}+ fotos",
          "variantScaling": {
            "staff-only": {
              "quantity": 20,
              "quantityLabel": "Entrega de {{quantity}}+ fotos de equipo"
            },
            "standard": {
              "quantity": 50
            },
            "premium": {
              "quantity": 80,
              "quantityLabel": "Entrega de {{quantity}}+ fotos premium"
            }
          }
        },
        "Planificacion previa y asesoria",
        "Transporte y equipamiento",
        "Estilo y enfoque personalizables segun necesidades de marca",
        "Entrega en formato digital de alta resolucion 4K Horizontal 16:9 Log 4/2/2 10 Bit",
        "Material de video suficiente para realizar 4 capsulas de 1 minuto"
      ],
      "deliverables": [
        {
          "id": "photo-jpg",
          "text": "Fotos exportadas en JPG",
          "shared": "photo-jpg"
        },
        {
          "id": "photo-raw",
          "text": "Fotos en bruto (RAW) para futura utilizacion",
          "shared": "photo-raw"
        },
        {
          "id": "drive",
          "text": "Google Drive personal con todos los recursos",
          "shared": "google-drive"
        }
      ],
      "tags": [
        "foto",
        "produccion",
        "sesion",
        "4k",
        "video"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": []
      },
      "revisions": {
        "rounds": 0,
        "scope": "Sesion fotografica — sin revisiones (produccion en vivo)",
        "outOfScope": "Sesiones adicionales"
      }
    },
    "buttery-3days": {
      "id": "buttery-3days",
      "name": "Buttery Frames (3 dias)",
      "category": "production",
      "eyebrow": "Produccion - Foto",
      "subtitle": "Produccion fotografica extendida: 3 dias, 3 localizaciones",
      "pricing": {
        "type": "fixed",
        "basePrice": 2180,
        "monthly": false,
        "priceRange": {
          "min": 2180,
          "max": 2550
        }
      },
      "timeline": {
        "min": 3,
        "max": 3,
        "unit": "days"
      },
      "description": {
        "short": "Produccion fotografica extendida: 3 sesiones en 3 localizaciones distintas.",
        "medium": "Produccion fotografica extendida: 3 sesiones en 3 localizaciones distintas. Material abundante para marca, RRSS y web.",
        "long": "whyButteryFrames3Days"
      },
      "includes": [
        "Sesion de 4 a 6 horas diarias (3 dias)",
        "Sin limite de capturas",
        "Dentro y fuera de las instalaciones y alrededores",
        "Entrega de al menos 300+ fotos",
        "Planificacion previa y asesoria",
        "Transporte y equipamiento",
        "Estilo y enfoque personalizables segun necesidades de marca",
        "Entrega en formato digital 4K Horizontal 16:9 Log 4/2/2 10 Bit",
        "Material de video para distintas capsulas y propositos"
      ],
      "deliverables": null,
      "tags": [
        "foto",
        "produccion",
        "sesion",
        "4k",
        "video",
        "extendido"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": []
      },
      "revisions": {
        "rounds": 0,
        "scope": "Sesion fotografica extendida — sin revisiones (produccion en vivo)",
        "outOfScope": "Sesiones o dias adicionales"
      }
    },
    "cold-brew": {
      "id": "cold-brew",
      "name": "Cold Brew",
      "category": "video",
      "eyebrow": "Brand Video - AI + Motion",
      "subtitle": "Brand video aspiracional con AI y motion graphics",
      "pricing": {
        "type": "fixed",
        "basePrice": 1200,
        "monthly": false,
        "priceRange": {
          "min": 1200,
          "max": 1200
        }
      },
      "timeline": {
        "min": 2,
        "max": 4,
        "unit": "weeks"
      },
      "description": {
        "short": "Brand video con AI generativa, motion graphics y stock footage.",
        "medium": "Brand video aspiracional creado con AI, motion graphics y stock footage. Disenado para definir visualmente la marca y presentarla a inversores, patrocinadores y audiencia.",
        "long": "whyColdBrew"
      },
      "includes": [
        "Brand video con AI generativa + motion graphics + stock footage",
        "Direccion creativa y storyboard conceptual",
        "Diseno visual alineado con la identidad de marca",
        "Correccion de color y post-produccion",
        "Seleccion musical y SFX (ArtList)",
        "Adaptaciones para web header, redes sociales e inversores",
        "Silky Edits Pack (Retoque fotografico de hasta 30+ fotos)"
      ],
      "deliverables": [
        "1 brand video principal (60-90 seg)",
        "Version corta para redes (15-30 seg)",
        "Version header web (loop optimizado)",
        {
          "id": "video-main",
          "text": "HD/4K en formatos horizontal, vertical (9:16) y cuadrado (1:1)",
          "shared": "video-4k"
        },
        {
          "id": "source",
          "text": "Archivos fuente tras pago final",
          "shared": "source-files"
        }
      ],
      "tags": [
        "video",
        "motion",
        "ai",
        "brand-video",
        "produccion"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [
          "silky-edits"
        ],
        "discountedWith": {
          "buttery-1day": 900,
          "buttery-3days": 900
        }
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de edicion, color, ritmo y musica del brand video",
        "outOfScope": "Re-filmacion o cambio de concepto",
        "overagePrice": 150,
        "overageUnit": "per-round"
      }
    },
    "glass-cup": {
      "id": "glass-cup",
      "name": "The Glass Cup",
      "category": "print",
      "eyebrow": "Diseno - Impresos",
      "subtitle": "Packaging, papeleria y materiales impresos",
      "pricing": {
        "type": "fixed",
        "basePrice": 750,
        "monthly": false,
        "priceRange": {
          "min": 450,
          "max": 750
        }
      },
      "timeline": {
        "min": 1,
        "max": 3,
        "unit": "weeks"
      },
      "description": {
        "short": "Packaging, papeleria y materiales impresos para tu marca.",
        "medium": "Packaging, papeleria y materiales impresos. Todo lo tangible que necesita tu marca para dejar huella fuera de lo digital.",
        "long": "whyGlassCup"
      },
      "includes": [
        "Diseno de presentacion, pitch deck o sales book",
        "Diseno de Packaging",
        "Dossier publicitario",
        "Folleto/Flyer comercial (diptico-triptico)",
        "Carpeta de producto",
        "Tarjetas de visita: hasta 3 modelos diferentes",
        "Sellos, sello al seco, etiquetas o pegatinas",
        "Otros elementos que puedan reemplazar productos listados"
      ],
      "deliverables": [
        {
          "id": "print",
          "text": "Archivos listos para imprimir",
          "shared": "print-ready"
        },
        {
          "id": "source",
          "text": "Archivos editables con lineas de corte, doblez, registros y todos los formatos de color",
          "shared": "source-files"
        }
      ],
      "tags": [
        "print",
        "packaging",
        "papeleria",
        "tarjetas",
        "flyers"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [
          "shakefront-full"
        ]
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de diseno, composicion y contenido de materiales impresos",
        "outOfScope": "Nuevos productos no incluidos en el alcance original",
        "overagePrice": 100,
        "overageUnit": "per-round"
      }
    },
    "silky-edits": {
      "id": "silky-edits",
      "name": "Silky Edits",
      "category": "production",
      "eyebrow": "Diseno - Retoque",
      "subtitle": "Retoque fotografico profesional con AI",
      "pricing": {
        "type": "fixed",
        "basePrice": 350,
        "monthly": false,
        "priceRange": {
          "min": 200,
          "max": 680
        }
      },
      "timeline": {
        "min": 1,
        "max": 2,
        "unit": "weeks"
      },
      "description": {
        "short": "Retoque fotografico profesional para cohesion y consistencia visual.",
        "medium": "Retoque fotografico profesional para la cohesion y consistencia visual de tu marca. Cada imagen tratada para reflejar tu identidad.",
        "long": "whySilkyEdits"
      },
      "includes": [
        "Recreacion de fotografias profesionales con IA para la web",
        "Retoque fotografico de hasta 30+ fotos seleccionadas",
        "Maquillaje digital",
        "Correccion de color y exposicion",
        "Eliminacion de imperfecciones",
        "Enfoque y nitidez",
        "Recorte y redimensionamiento",
        "Ajustes de perspectiva",
        "Fondo de reemplazo",
        "AI enhancement"
      ],
      "deliverables": [
        "Fotos exportadas en JPG",
        "Fotos en bruto (RAW) para futura utilizacion",
        "Google Drive personal con todos los recursos"
      ],
      "tags": [
        "retoque",
        "foto",
        "ai",
        "edicion"
      ],
      "bundleRules": {
        "includedWith": [
          "shakefront-full"
        ],
        "freeWith": [
          "shakefront-full",
          "flashy-socials",
          "buttery-1day",
          "buttery-3days"
        ]
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de retoque, color, recorte y composicion",
        "outOfScope": "Fotos adicionales no incluidas en la seleccion original",
        "overagePrice": 60,
        "overageUnit": "per-round"
      }
    },
    "barista": {
      "id": "barista",
      "name": "Barista",
      "category": "web",
      "eyebrow": "Web - Mantenimiento",
      "subtitle": "Mantenimiento web continuo mensual",
      "pricing": {
        "type": "fixed",
        "basePrice": 450,
        "monthly": true,
        "priceRange": {
          "min": 450,
          "max": 450
        }
      },
      "timeline": {
        "min": 0,
        "max": 0,
        "unit": "ongoing"
      },
      "description": {
        "short": "Mantenimiento web, actualizacion de contenido y soporte tecnico mensual.",
        "medium": "Mantenimiento web continuo. Actualizacion de contenido, modificaciones, optimizacion y soporte tecnico para que tu web este siempre al dia.",
        "long": "whyBarista"
      },
      "includes": [
        "Actualizacion de contenido (textos, imagenes, secciones)",
        "Modificaciones de estructura y diseno",
        "Optimizacion de rendimiento y velocidad",
        "Actualizaciones de seguridad",
        "Soporte tecnico continuo",
        "Monitoreo de uptime y funcionamiento"
      ],
      "deliverables": null,
      "tags": [
        "web",
        "mantenimiento",
        "soporte",
        "mensual"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "promoWith": {
          "shakefront-full": {
            "freeMonths": 2,
            "description": "2 primeros meses gratis"
          },
          "shakefront-lite": {
            "freeMonths": 1,
            "description": "Primer mes gratis"
          }
        }
      },
      "revisions": {
        "rounds": null,
        "scope": "Servicio continuo mensual — modificaciones incluidas en el plan",
        "outOfScope": "N/A — cambios se gestionan dentro del retainer"
      }
    },
    "the-grinder": {
      "id": "the-grinder",
      "name": "The Grinder",
      "category": "web",
      "eyebrow": "Web - Infraestructura",
      "subtitle": "Hosting, dominio y correos corporativos",
      "pricing": {
        "type": "fixed",
        "basePrice": 320,
        "monthly": false,
        "priceRange": {
          "min": 320,
          "max": 320
        }
      },
      "timeline": {
        "min": 1,
        "max": 2,
        "unit": "days"
      },
      "description": {
        "short": "Hosting profesional, dominio personalizado y correos corporativos.",
        "medium": "Configuracion completa de la infraestructura digital: hosting profesional, dominio personalizado y correos corporativos bajo tu dominio.",
        "long": "whyTheGrinder"
      },
      "includes": [
        "Configuracion de hosting profesional (Webflow)",
        "Registro y configuracion de dominio",
        "Certificado SSL incluido",
        "Configuracion de correos electronicos corporativos",
        "DNS y configuracion tecnica",
        "Respaldo y seguridad integrada"
      ],
      "deliverables": null,
      "tags": [
        "hosting",
        "dominio",
        "email",
        "ssl",
        "infraestructura"
      ],
      "bundleRules": {
        "includedWith": [
          "shakefront-full",
          "the-brewery",
          "coffee-lab"
        ],
        "freeWith": [
          "espresso-shot"
        ],
        "includes": []
      },
      "revisions": {
        "rounds": 1,
        "scope": "Verificacion de configuracion de hosting, dominio y correos",
        "outOfScope": "Migracion de plataforma",
        "overagePrice": 50,
        "overageUnit": "per-round"
      }
    },
    "rosetta": {
      "id": "rosetta",
      "name": "Rosetta",
      "category": "web",
      "eyebrow": "Web - Funcionalidad",
      "subtitle": "Implementacion multilinguee dinamica",
      "pricing": {
        "type": "fixed",
        "basePrice": 450,
        "monthly": false,
        "priceRange": {
          "min": 450,
          "max": 450
        }
      },
      "timeline": {
        "min": 1,
        "max": 2,
        "unit": "weeks"
      },
      "description": {
        "short": "Version bilinguee del sitio con deteccion automatica de idioma.",
        "medium": "Implementacion de version bilinguee del sitio web con deteccion automatica de idioma y arquitectura preparada para futuros idiomas.",
        "long": "whyRosetta"
      },
      "includes": [
        "Version bilinguee del sitio (espanol / ingles)",
        "Deteccion automatica del idioma del navegador",
        "Seleccion manual de idioma",
        "Sistema multilinguee integrado desde la estructura base",
        "Coherencia visual y tipografica en ambos idiomas",
        "Arquitectura preparada para anadir nuevos idiomas sin comprometer diseno"
      ],
      "deliverables": null,
      "tags": [
        "multilinguee",
        "idiomas",
        "internacionalizacion",
        "i18n"
      ],
      "bundleRules": {
        "includedWith": [
          "shakefront-full"
        ],
        "freeWith": [],
        "includes": []
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de traduccion y configuracion multilinguee",
        "outOfScope": "Idiomas adicionales no incluidos",
        "overagePrice": 100,
        "overageUnit": "per-round"
      }
    },
    "hot-press": {
      "id": "hot-press",
      "name": "Hot Press",
      "category": "broadcast",
      "eyebrow": "TV - Emision",
      "subtitle": "Activos graficos animados para emision televisiva",
      "pricing": {
        "type": "fixed",
        "basePrice": 3200,
        "monthly": false,
        "priceRange": {
          "min": 3200,
          "max": 3200
        }
      },
      "timeline": {
        "min": 3,
        "max": 6,
        "unit": "weeks"
      },
      "description": {
        "short": "Paquete completo de graficos animados para emision televisiva.",
        "medium": "Paquete completo de activos graficos animados para la emision televisiva. Disenados para mantener coherencia visual con la identidad de marca en pantalla.",
        "long": "whyHotPress"
      },
      "includes": [
        "Lower thirds animados (nombre, cargo, ubicacion)",
        "Bumpers y cortinillas de entrada/salida",
        "Transiciones animadas entre segmentos",
        "Mosca / Bug del programa",
        "Intro y outro animados del programa",
        "Placas informativas y de datos",
        "Graficos para encuestas y resultados en pantalla",
        "Adaptaciones para diferentes segmentos del programa",
        "Archivos exportados para broadcast (resolucion TV)"
      ],
      "deliverables": [
        "Archivos de animacion (After Effects / exportados)",
        "Versiones con y sin canal alpha",
        "Guia de uso para el equipo de produccion",
        "Archivos fuente editables tras pago final"
      ],
      "tags": [
        "broadcast",
        "tv",
        "animacion",
        "graficos",
        "emision"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "discountedWith": {
          "shakefront-full": 1600
        }
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de animacion, timing, colores y composicion de graficos",
        "outOfScope": "Nuevos elementos graficos fuera del paquete original",
        "overagePrice": 200,
        "overageUnit": "per-round"
      }
    },
    "foam-art": {
      "id": "foam-art",
      "name": "Foam Art",
      "category": "design",
      "eyebrow": "Diseno - 3D",
      "subtitle": "Campana creativa con diseno 3D",
      "pricing": {
        "type": "fixed",
        "basePrice": 1800,
        "monthly": false,
        "priceRange": {
          "min": 1800,
          "max": 1800
        }
      },
      "timeline": {
        "min": 2,
        "max": 3,
        "unit": "weeks"
      },
      "description": {
        "short": "Diseno 3D de logo y creatividades para campanas visuales de alto impacto.",
        "medium": "Campana creativa con diseno 3D. Logo 3D, creatividades estaticas en multiples formatos, enfoque mixed-media con elementos 3D y copywriting estrategico.",
        "long": "whyFoamArt"
      },
      "includes": [
        "Logo 3D con variaciones (todos los formatos/tamanos)",
        "7 creatividades estaticas (formatos 4:4, 4:5, 9:16)",
        "Enfoque mixed-media con elementos 3D",
        "Copywriting y estrategia",
        "Posible fase de animacion posterior",
        "Documentacion en brandbook",
        "Hasta 3 revisiones"
      ],
      "deliverables": null,
      "tags": [
        "3d",
        "diseno",
        "campana",
        "creatividades",
        "mixed-media"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "discountedWith": {
          "milky-branding": 1400
        }
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de diseno 3D, texturas, iluminacion y composicion",
        "outOfScope": "Cambio de concepto o direccion creativa",
        "overagePrice": 200,
        "overageUnit": "per-round"
      }
    },
    "latte-art": {
      "id": "latte-art",
      "name": "Latte Art",
      "category": "design",
      "eyebrow": "Diseno - Ilustracion",
      "subtitle": "Pack de ilustraciones personalizadas",
      "pricing": {
        "type": "fixed",
        "basePrice": 620,
        "monthly": false,
        "priceRange": {
          "min": 480,
          "max": 620
        },
        "priceVariants": {
          "single": {
            "price": 480,
            "description": "1 illustration with identity",
            "criteria": "Single hero illustration"
          },
          "full-pack": {
            "price": 620,
            "description": "Up to 3 illustrations + naming + lettering",
            "criteria": "DEFAULT for standalone projects"
          }
        },
        "defaultVariant": "full-pack"
      },
      "timeline": {
        "min": 1,
        "max": 2,
        "unit": "weeks"
      },
      "description": {
        "short": "Pack de hasta 3 ilustraciones personalizadas con identidad visual.",
        "medium": "Pack de ilustraciones personalizadas. Identidad visual del proyecto, naming creativo, lettering a mano y preparacion para impresion.",
        "long": "whyLatteArt"
      },
      "includes": [
        "Identidad visual del proyecto de ilustracion",
        "Hasta 3 ilustraciones con proposito especifico",
        "Naming creativo y backstory para personajes",
        "Lettering a mano si es necesario",
        "Preparacion para impresion",
        "Hasta 3 revisiones",
        "Google Drive personal con recursos"
      ],
      "deliverables": null,
      "tags": [
        "ilustracion",
        "personajes",
        "lettering",
        "arte"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [
          "milky-branding",
          "punch-card"
        ]
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de estilo, color y composicion de ilustraciones",
        "outOfScope": "Ilustraciones adicionales no incluidas",
        "overagePrice": 120,
        "overageUnit": "per-round"
      }
    },
    "punch-card": {
      "id": "punch-card",
      "name": "Punch Card",
      "category": "specialized",
      "eyebrow": "Fidelizacion",
      "subtitle": "Diseno de programa de fidelizacion",
      "pricing": {
        "type": "fixed",
        "basePrice": 1800,
        "monthly": false,
        "priceRange": {
          "min": 1500,
          "max": 2500
        },
        "priceVariants": {
          "plan-a": {
            "price": 1800,
            "description": "Digital loyalty program: tiers, characters, copywriting",
            "criteria": "DEFAULT - digital-only loyalty"
          },
          "plan-b-stickers": {
            "price": 2500,
            "description": "Digital + physical: sticker system, printed cards, POS materials",
            "criteria": "Physical retail with sticker collection"
          }
        },
        "defaultVariant": "plan-a"
      },
      "timeline": {
        "min": 6,
        "max": 8,
        "unit": "weeks"
      },
      "description": {
        "short": "Diseno integral de programa de fidelizacion con identidad visual y mecanicas.",
        "medium": "Conceptualizacion y diseno completo de programa de lealtad. Rangos, tiers, personajes, tarjetas, copywriting motivacional y manual de uso.",
        "long": "whyPunchCard"
      },
      "includes": [
        "Conceptualizacion de programa de fidelizacion (Rangos/Tiers)",
        "Sesion de discovery creativo",
        "Naming creativo y eslogan",
        "Identidad visual de campana",
        "Diseno de personajes e iconos",
        "Paleta cromatica y tipografia",
        "Diseno de tarjeta de fidelidad",
        "Copywriting para implementacion digital",
        "Mensajes de bienvenida, logro de tier, recompensas",
        "Manual de uso",
        "Google Drive con todos los recursos"
      ],
      "deliverables": null,
      "tags": [
        "loyalty",
        "fidelizacion",
        "gamification",
        "tiers"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [
          "latte-art"
        ],
        "discountedWith": {
          "milky-branding": 1500
        }
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de diseno, mecanicas y contenido del programa de fidelizacion",
        "outOfScope": "Cambio de estructura de tiers o plataforma",
        "overagePrice": 150,
        "overageUnit": "per-round"
      }
    },
    "pour-over": {
      "id": "pour-over",
      "name": "Pour Over",
      "category": "animation",
      "eyebrow": "Animacion - Motion",
      "subtitle": "Motion graphics e infografias animadas",
      "pricing": {
        "type": "custom",
        "basePrice": 2500,
        "monthly": false,
        "priceRange": {
          "min": 350,
          "max": 12649
        },
        "priceVariants": {
          "single-animation": {
            "price": 350,
            "description": "1 Lottie animation or motion graphic",
            "criteria": "Web micro-interaction or icon animation"
          },
          "campaign-3-animations": {
            "price": 2500,
            "description": "3 animations for multi-channel campaign",
            "criteria": "DEFAULT - social + web animation set"
          },
          "campaign-8-animations": {
            "price": 12649,
            "description": "8 animations, full 4K campaign package",
            "criteria": "Full broadcast/digital campaign"
          }
        },
        "defaultVariant": "campaign-3-animations"
      },
      "timeline": {
        "min": 2,
        "max": 8,
        "unit": "weeks"
      },
      "description": {
        "short": "Motion graphics, infografias animadas y animaciones Lottie para campanas.",
        "medium": "Motion graphics de alto impacto. Desde animaciones Lottie para web hasta campanas completas de infografias animadas en 4K para difusion multicanal.",
        "long": "whyPourOver"
      },
      "includes": [
        "Investigacion y conceptualizacion",
        "Storyboard para cada animacion",
        "Diseno personalizado alineado con marca",
        "Animacion de alta calidad (sujetos, entornos, texturas)",
        "Sincronizacion con voiceover si aplica",
        "Renderizado final (4K 16:9)",
        "Colaboracion y comunicacion continua",
        "Revisiones y ajustes"
      ],
      "deliverables": [
        "Animaciones H264 / .mov / equivalente 4K UHD",
        "Google Drive personal con todos los activos"
      ],
      "tags": [
        "motion",
        "animacion",
        "lottie",
        "infografia",
        "4k"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "discountedWith": {
          "hot-press": "15%",
          "cold-brew": "15%"
        }
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de animacion, timing y transiciones",
        "outOfScope": "Animaciones adicionales o cambio de concepto",
        "overagePrice": 150,
        "overageUnit": "per-round"
      }
    },
    "sprinkles": {
      "id": "sprinkles",
      "name": "Sprinkles",
      "category": "social",
      "eyebrow": "Social - AR",
      "subtitle": "Filtros de realidad aumentada para Instagram y TikTok",
      "pricing": {
        "type": "fixed",
        "basePrice": 500,
        "monthly": false,
        "priceRange": {
          "min": 500,
          "max": 500
        }
      },
      "timeline": {
        "min": 1,
        "max": 2,
        "unit": "weeks"
      },
      "description": {
        "short": "Filtro AR personalizado para Instagram Stories y TikTok.",
        "medium": "Filtro de realidad aumentada personalizado para Instagram Stories y TikTok. Engagement interactivo con la marca a traves de camaras sociales.",
        "long": "whySprinkles"
      },
      "includes": [
        "Diseno de filtro AR personalizado",
        "Publicacion en Instagram Stories y/o TikTok",
        "Pruebas en multiples dispositivos"
      ],
      "deliverables": null,
      "tags": [
        "ar",
        "filtro",
        "instagram",
        "tiktok",
        "interactivo"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "discountedWith": {
          "flashy-socials": 350
        }
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de diseno y efectos del filtro AR",
        "outOfScope": "Filtros adicionales no incluidos",
        "overagePrice": 80,
        "overageUnit": "per-round"
      }
    },
    "espresso-shot": {
      "id": "espresso-shot",
      "name": "Espresso Shot",
      "category": "web",
      "eyebrow": "Web - Landing",
      "subtitle": "Landing page rapida y funcional",
      "pricing": {
        "type": "fixed",
        "basePrice": 550,
        "monthly": false,
        "priceRange": {
          "min": 550,
          "max": 1200
        },
        "priceVariants": {
          "flodesk": {
            "price": 550,
            "description": "Simple Flodesk landing, lead capture, Mailchimp",
            "criteria": "DEFAULT - quick campaign landing"
          },
          "webflow-landing": {
            "price": 1200,
            "description": "Webflow landing with animations + custom design",
            "criteria": "Premium landing, brand showcase"
          }
        },
        "defaultVariant": "flodesk"
      },
      "timeline": {
        "min": 1,
        "max": 2,
        "unit": "weeks"
      },
      "description": {
        "short": "Landing page rapida y directa para captacion o lanzamientos.",
        "medium": "Landing page concentrada y potente. Ideal para lanzamientos, captacion de leads o campanas especificas. Rapida de implementar, alta conversion.",
        "long": "whyEspressoShot"
      },
      "includes": [
        "Diseno UI/UX responsive",
        "Desarrollo en Flodesk o Webflow",
        "Formulario de captacion / lead capture",
        "Integracion Mailchimp",
        "SEO basico",
        "SSL incluido",
        "Paginas adicionales: +150 EUR cada una"
      ],
      "deliverables": null,
      "tags": [
        "landing",
        "captacion",
        "leads",
        "campana"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [
          "the-grinder"
        ]
      },
      "mutuallyExclusiveWith": [
        "shakefront-full",
        "shakefront-lite"
      ],
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de diseno y contenido de la landing",
        "outOfScope": "Cambio de plataforma o alcance",
        "overagePrice": 100,
        "overageUnit": "per-round"
      }
    },
    "the-counter": {
      "id": "the-counter",
      "name": "The Counter",
      "category": "web",
      "eyebrow": "Web - Reservas",
      "subtitle": "Sistema de reservas y agenda integrado",
      "pricing": {
        "type": "custom",
        "basePrice": null,
        "monthly": false,
        "priceRange": {
          "min": 500,
          "max": 2000
        },
        "note": "Price depends on platform integration complexity"
      },
      "timeline": {
        "min": 1,
        "max": 3,
        "unit": "weeks"
      },
      "description": {
        "short": "Integracion de sistema de reservas y agenda en tu sitio web.",
        "medium": "Sistema de reservas online integrado en tu web. Gestion de citas, disponibilidad de espacios y flujo de inscripcion para clases o eventos.",
        "long": "whyTheCounter"
      },
      "includes": [
        "Booking y agenda dinamica integrada",
        "Gestion de disponibilidad",
        "Formulario de inscripcion",
        "Confirmaciones automaticas",
        "Integracion con pasarelas de pago si aplica"
      ],
      "deliverables": null,
      "tags": [
        "booking",
        "reservas",
        "agenda",
        "citas"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "discountedWith": {
          "shakefront-full": "15%"
        },
        "requiresOneOf": [
          "shakefront-full",
          "shakefront-lite",
          "espresso-shot"
        ]
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de funcionalidad y configuracion del sistema de reservas",
        "outOfScope": "Integraciones adicionales no previstas",
        "overagePrice": 150,
        "overageUnit": "per-round"
      }
    },
    "the-percolator": {
      "id": "the-percolator",
      "name": "The Percolator",
      "category": "tech",
      "eyebrow": "Tech - Automatizacion",
      "subtitle": "Automatizacion de flujos con n8n, Zapier, OpenClaw y bots",
      "pricing": {
        "type": "custom",
        "basePrice": null,
        "monthly": false,
        "priceRange": {
          "min": 500,
          "max": 5000
        },
        "note": "Quoted per project based on workflow complexity"
      },
      "timeline": {
        "min": 1,
        "max": 6,
        "unit": "weeks"
      },
      "description": {
        "short": "Automatizacion de procesos con n8n, Zapier, OpenClaw y Telegram bots.",
        "medium": "Flujos de trabajo automatizados para tu negocio. Desde integraciones simples con Zapier hasta orquestacion compleja con n8n, OpenClaw y bots de Telegram. Elimina tareas repetitivas y conecta tus herramientas.",
        "long": "whyThePercolator"
      },
      "includes": [
        "Auditoria de procesos actuales y oportunidades de automatizacion",
        "Diseno de flujos de trabajo (workflow mapping)",
        "Implementacion en n8n / Zapier segun necesidad",
        "Integracion OpenClaw para orquestacion de agentes",
        "Desarrollo de bots de Telegram personalizados",
        "Pipelines de webhooks personalizados",
        "Integraciones API entre servicios",
        "Tareas automatizadas programadas (cron jobs)",
        "Documentacion y entrenamiento basico"
      ],
      "deliverables": [
        "Flujos de trabajo configurados y activos",
        {
          "id": "docs",
          "text": "Documentacion tecnica de cada automatizacion",
          "shared": "documentation"
        },
        "Acceso y credenciales al cliente",
        {
          "id": "training",
          "text": "Sesion de entrenamiento",
          "shared": "training-session"
        }
      ],
      "tags": [
        "automatizacion",
        "n8n",
        "zapier",
        "openclaw",
        "telegram",
        "bots",
        "api"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "discountedWith": {
          "the-brewery": "20%",
          "robo-barista": "20%"
        }
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de flujos de automatizacion y configuracion",
        "outOfScope": "Integraciones no previstas o cambio de plataforma",
        "overagePrice": 200,
        "overageUnit": "per-round"
      }
    },
    "robo-barista": {
      "id": "robo-barista",
      "name": "Robo Barista",
      "category": "tech",
      "eyebrow": "Tech - AI",
      "subtitle": "Creacion de agentes de inteligencia artificial",
      "pricing": {
        "type": "custom",
        "basePrice": null,
        "monthly": false,
        "priceRange": {
          "min": 1000,
          "max": 10000
        },
        "note": "Quoted per project based on agent complexity"
      },
      "timeline": {
        "min": 2,
        "max": 8,
        "unit": "weeks"
      },
      "description": {
        "short": "Agentes AI personalizados que trabajan para tu negocio 24/7.",
        "medium": "Agentes de inteligencia artificial personalizados. Chatbots, asistentes de ventas, automatizadores de contenido, agentes de soporte y mas. Disenados para trabajar para tu negocio 24/7.",
        "long": "whyRoboBarista"
      },
      "includes": [
        "Analisis de necesidades y casos de uso",
        "Diseno de la arquitectura del agente",
        "Desarrollo e implementacion del agente AI",
        "Integracion con herramientas existentes (CRM, email, RRSS)",
        "Entrenamiento con datos/contexto del negocio",
        "Testing y refinamiento",
        "Documentacion y entrenamiento para el equipo"
      ],
      "deliverables": [
        "Agente AI funcional y desplegado",
        {
          "id": "docs",
          "text": "Documentacion tecnica",
          "shared": "documentation"
        },
        "Acceso y credenciales",
        {
          "id": "training",
          "text": "Sesion de entrenamiento",
          "shared": "training-session"
        }
      ],
      "tags": [
        "ai",
        "agente",
        "chatbot",
        "asistente",
        "automatizacion"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [],
        "discountedWith": {
          "the-brewery": "15%",
          "the-percolator": "20%"
        }
      },
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de comportamiento, integraciones y entrenamiento del agente",
        "outOfScope": "Cambio de arquitectura o plataforma base",
        "overagePrice": 300,
        "overageUnit": "per-round"
      }
    },
    "the-brewery": {
      "id": "the-brewery",
      "name": "The Brewery",
      "category": "tech",
      "eyebrow": "Tech - Software",
      "subtitle": "Desarrollo de software a medida con Next.js y Vercel",
      "pricing": {
        "type": "custom",
        "basePrice": null,
        "monthly": false,
        "priceRange": {
          "min": 3000,
          "max": 25000
        },
        "note": "Quoted per project based on scope"
      },
      "timeline": {
        "min": 4,
        "max": 16,
        "unit": "weeks"
      },
      "description": {
        "short": "Desarrollo de software y aplicaciones web con Next.js y Vercel.",
        "medium": "Desarrollo de software a medida. Aplicaciones web, plataformas SaaS, dashboards y herramientas internas construidas con Next.js, Vercel y tecnologias modernas.",
        "long": "whyTheBrewery"
      },
      "includes": [
        "Analisis de requerimientos y arquitectura",
        "Diseno UI/UX de la aplicacion",
        "Desarrollo frontend (Next.js / React)",
        "Desarrollo backend y API",
        "Base de datos y almacenamiento",
        "Despliegue en Vercel / infraestructura cloud",
        "Autenticacion y seguridad",
        "Testing y QA",
        "Documentacion tecnica"
      ],
      "deliverables": [
        "Aplicacion funcional desplegada",
        "Codigo fuente en repositorio",
        {
          "id": "docs",
          "text": "Documentacion tecnica",
          "shared": "documentation"
        },
        {
          "id": "training",
          "text": "Sesion de entrenamiento",
          "shared": "training-session"
        }
      ],
      "tags": [
        "software",
        "nextjs",
        "vercel",
        "react",
        "fullstack",
        "saas"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [
          "the-grinder"
        ]
      },
      "revisions": {
        "rounds": 3,
        "scope": "Ajustes de funcionalidad, UI y flujo de la aplicacion",
        "outOfScope": "Funcionalidades fuera del scope original",
        "overagePrice": 400,
        "overageUnit": "per-round",
        "milestoneRevisions": {
          "design": {
            "rounds": 2,
            "scope": "UI/UX y arquitectura"
          },
          "development": {
            "rounds": 3,
            "scope": "Funcionalidad y bugs"
          },
          "testing": {
            "rounds": 2,
            "scope": "QA y ajustes finales"
          }
        }
      }
    },
    "coffee-lab": {
      "id": "coffee-lab",
      "name": "Coffee Lab",
      "category": "tech",
      "eyebrow": "Tech - Herramientas",
      "subtitle": "Herramientas web experimentales y a medida",
      "pricing": {
        "type": "custom",
        "basePrice": null,
        "monthly": false,
        "priceRange": {
          "min": 1000,
          "max": 8000
        },
        "note": "Quoted per tool based on complexity"
      },
      "timeline": {
        "min": 2,
        "max": 8,
        "unit": "weeks"
      },
      "description": {
        "short": "Herramientas web a medida: calculadoras, generadores, dashboards internos.",
        "medium": "Herramientas web experimentales y a medida. Calculadoras, generadores, configuradores de producto, dashboards internos y cualquier herramienta digital que tu negocio necesite.",
        "long": "whyCoffeeLab"
      },
      "includes": [
        "Analisis de necesidades y flujo de uso",
        "Diseno UI/UX de la herramienta",
        "Desarrollo frontend y backend",
        "Integracion con APIs y servicios existentes",
        "Testing y optimizacion",
        "Despliegue y hosting"
      ],
      "deliverables": [
        "Herramienta funcional y desplegada",
        "Codigo fuente",
        {
          "id": "docs",
          "text": "Documentacion de uso",
          "shared": "documentation"
        }
      ],
      "tags": [
        "tools",
        "herramientas",
        "web-app",
        "dashboard",
        "calculadora"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [
          "the-grinder"
        ]
      },
      "mutuallyExclusiveWith": [
        "the-brewery"
      ],
      "revisions": {
        "rounds": 2,
        "scope": "Ajustes de funcionalidad y UI de la herramienta",
        "outOfScope": "Funcionalidades fuera del scope original",
        "overagePrice": 250,
        "overageUnit": "per-round"
      }
    },
    "the-full-pot": {
      "id": "the-full-pot",
      "name": "The Full Pot",
      "category": "tech",
      "eyebrow": "Tech - End to End",
      "subtitle": "Solucion integral de principio a fin",
      "pricing": {
        "type": "custom",
        "basePrice": null,
        "monthly": false,
        "priceRange": {
          "min": 5000,
          "max": 50000
        },
        "note": "Quoted per project — combines multiple services"
      },
      "timeline": {
        "min": 8,
        "max": 24,
        "unit": "weeks"
      },
      "description": {
        "short": "Solucion completa: branding + web + automatizacion + AI + soporte continuo.",
        "medium": "Solucion integral de principio a fin. Combina branding, desarrollo web, automatizacion, agentes AI y soporte continuo en un solo paquete. Para negocios que quieren hacerlo todo bien desde el dia uno.",
        "long": "whyTheFullPot"
      },
      "includes": [
        "Auditoria completa del negocio digital",
        "Estrategia de marca y posicionamiento",
        "Diseno y desarrollo web",
        "Automatizacion de procesos clave",
        "Implementacion de agentes AI",
        "Produccion de contenido (foto/video)",
        "Setup de redes sociales",
        "Soporte post-lanzamiento incluido",
        "Iteracion y mejora continua"
      ],
      "deliverables": [
        "Todo lo incluido en los servicios individuales seleccionados",
        "Roadmap estrategico personalizado",
        {
          "id": "docs",
          "text": "Documentacion integral del proyecto",
          "shared": "documentation"
        }
      ],
      "tags": [
        "integral",
        "end-to-end",
        "paquete-completo",
        "todo"
      ],
      "bundleRules": {
        "includedWith": [],
        "freeWith": [],
        "includes": [
          "milky-branding",
          "shakefront-full",
          "the-grinder",
          "silky-edits",
          "glass-cup"
        ],
        "globalDiscount": {
          "percentage": 20,
          "description": "20% off all other services when added to The Full Pot"
        }
      },
      "revisions": {
        "rounds": 3,
        "scope": "Revisiones por fase del proyecto segun servicios individuales",
        "outOfScope": "Cambio de alcance general",
        "overagePrice": 500,
        "overageUnit": "per-round"
      }
    }
  }
};
const EMBEDDED_RETAINERS = {
  "version": "2.0",
  "lastUpdated": "2026-03-19",
  "currency": "EUR",
  "taxNote": "+ IVA where applicable",
  "defaultMinimumCommitment": { "months": 3 },
  "templates": {
    "standard": {
      "id": "standard",
      "name": "Van Alva Standard Retainer",
      "source": "Piri Piri (latest, most evolved)",
      "minimumCommitment": 3,
      "tiers": {
        "just-water": {
          "level": 0,
          "name": "Just Water",
          "price": 480,
          "subtitle": "Paquete Basico",
          "includes": {
            "designPieces": 3,
            "printFilePrep": true,
            "exports": "JPEG/PNG (no editables)",
            "vectorDesigns": 3,
            "vectorAlterations": 3,
            "aiPrompting": true,
            "basicPhotoRetouch": true,
            "posts": 0,
            "carousels": 0,
            "storyAdaptations": 0,
            "reels": 0,
            "tca": 0,
            "tcc": 0,
            "webMaintenance": false,
            "adobeExpressScheduling": false,
            "corporatePresentations": 0,
            "stockLibrary": false
          }
        },
        "sip-starter": {
          "level": 1,
          "name": "Sip Starter",
          "price": 1000,
          "subtitle": "Paquete Esencial",
          "includes": {
            "designPieces": 6,
            "printFilePrep": true,
            "exports": "JPEG/PNG (no editables)",
            "vectorDesigns": 6,
            "vectorAlterations": 6,
            "aiPrompting": true,
            "photoRetouch": "unlimited",
            "posts": 0,
            "carousels": 0,
            "storyAdaptations": 0,
            "reels": 0,
            "tca": 1,
            "tcc": 0,
            "webMaintenance": true,
            "webSupport": [
              "Modificacion de contenido en paginas existentes",
              "Nuevas secciones promocionales",
              "Actualizacion de menu/catalogo",
              "Implementacion de banners",
              "Modals/popups para promociones",
              "Cambios menores de layout visual"
            ],
            "newsletterDesign": true,
            "designReview": true,
            "adobeExpressScheduling": false,
            "corporatePresentations": 0,
            "stockLibrary": false
          }
        },
        "double-shot": {
          "level": 2,
          "name": "Double Shot",
          "price": 1500,
          "subtitle": "Paquete Social",
          "includes": {
            "designPieces": 10,
            "printFilePrep": true,
            "exports": "JPEG/PNG + MP4 (no editables)",
            "vectorDesigns": 5,
            "vectorAlterations": 5,
            "aiPrompting": true,
            "photoRetouch": "unlimited",
            "posts": 10,
            "carousels": 2,
            "carouselMaxSlides": 10,
            "storyAdaptations": 10,
            "reels": 2,
            "reelFrequency": "biweekly",
            "igCovers": 2,
            "tca": 2,
            "tcc": 0,
            "webMaintenance": true,
            "adobeExpressScheduling": false,
            "corporatePresentations": 0,
            "stockLibrary": false
          }
        },
        "nutty-blend": {
          "level": 3,
          "name": "Nutty Blend",
          "price": 2100,
          "subtitle": "Paquete Avanzado",
          "includes": {
            "designPieces": 16,
            "printFilePrep": true,
            "exports": "JPEG/PNG + MP4 (no editables)",
            "vectorDesigns": 10,
            "vectorAlterations": 10,
            "aiPrompting": true,
            "photoRetouch": "unlimited",
            "posts": 16,
            "carousels": 5,
            "carouselMaxSlides": 10,
            "storyAdaptations": 16,
            "reels": 4,
            "reelFrequency": "weekly",
            "reelFeatures": "SFX, musica, transiciones creativas",
            "igCovers": 4,
            "tca": 3,
            "tcc": 1,
            "webMaintenance": true,
            "phase3WebDev": true,
            "adobeExpressScheduling": true,
            "corporatePresentations": 2,
            "editableTemplates": true,
            "stockLibrary": false
          }
        },
        "milkshake": {
          "level": 4,
          "name": "$5 Milkshake",
          "price": 2900,
          "subtitle": "Paquete Premium",
          "includes": {
            "designPieces": 20,
            "printFilePrep": true,
            "exports": "JPEG/PNG + MP4 (no editables)",
            "vectorDesigns": 10,
            "vectorAlterations": 10,
            "aiPrompting": true,
            "photoRetouch": "unlimited",
            "posts": 20,
            "carousels": 8,
            "carouselMaxSlides": 10,
            "storyAdaptations": 20,
            "reels": 8,
            "reelFrequency": "2x weekly",
            "igCovers": 6,
            "tca": 6,
            "tcc": 2,
            "webMaintenance": true,
            "phase3WebDev": true,
            "adobeExpressScheduling": true,
            "corporatePresentations": 4,
            "editableTemplates": true,
            "stockLibrary": true
          }
        },
        "a-por-todo": {
          "level": 5,
          "name": "A por todo",
          "price": 5500,
          "subtitle": "Todo Incluido",
          "includes": {
            "unlimited": true,
            "tca": "unlimited",
            "tcc": "unlimited",
            "photoRetouch": "unlimited",
            "printFilePrep": true,
            "stockLibrary": true,
            "customHtmlCssJs": true,
            "adobeExpressTemplates": true,
            "adobeExpressScheduling": true,
            "adobeExpressPro": true,
            "allCreativeServices": true,
            "note": "Everything included, limited only by time and complexity. Designer prioritizes collaboratively with client."
          }
        }
      }
    },
    "insular": {
      "id": "insular",
      "name": "Insular Retainer",
      "source": "Retainer Insular proposal",
      "minimumCommitment": 3,
      "note": "4 tiers only, starts at Sip Starter level. Higher base prices than standard.",
      "tiers": {
        "sip-starter": {
          "level": 1,
          "name": "Sip Starter",
          "price": 1500,
          "includes": {
            "posts": 10,
            "carousels": 2,
            "storyAdaptations": 10,
            "reels": 1,
            "tca": 2,
            "tcc": 0,
            "vectorDesigns": 5,
            "photoRetouch": "unlimited",
            "webMaintenance": true,
            "designReview": true,
            "aiPrompting": true
          }
        },
        "nutty-blend": {
          "level": 2,
          "name": "Nutty Blend",
          "price": 2100,
          "includes": {
            "posts": 16,
            "carousels": 5,
            "storyAdaptations": 16,
            "reels": 4,
            "tca": 3,
            "tcc": 1,
            "vectorDesigns": 10,
            "photoRetouch": "unlimited",
            "webMaintenance": true,
            "phase3WebDev": true,
            "adobeExpressScheduling": true,
            "corporatePresentations": 2,
            "editableTemplates": true,
            "aiPrompting": true
          }
        },
        "milkshake": {
          "level": 3,
          "name": "$5 Milkshake",
          "price": 2900,
          "includes": {
            "posts": 20,
            "carousels": 8,
            "storyAdaptations": 20,
            "reels": 8,
            "tca": 6,
            "tcc": 2,
            "vectorDesigns": 10,
            "photoRetouch": "unlimited",
            "webMaintenance": true,
            "phase3WebDev": true,
            "adobeExpressScheduling": true,
            "corporatePresentations": 4,
            "editableTemplates": true,
            "stockLibrary": true,
            "aiPrompting": true
          }
        },
        "a-por-todo": {
          "level": 4,
          "name": "A por todo",
          "price": 5500,
          "includes": {
            "unlimited": true,
            "tca": "unlimited",
            "tcc": "unlimited",
            "allCreativeServices": true
          }
        }
      }
    },
    "just-pearly-things": {
      "id": "just-pearly-things",
      "name": "JPT Premium Retainer",
      "source": "Just Pearly Things proposal",
      "minimumCommitment": 3,
      "note": "Content-creator focused. Very high volume, clip editing, YouTube optimization.",
      "tiers": {
        "essential": {
          "level": 1,
          "name": "Essential Content & Design",
          "price": 3800,
          "includes": {
            "editedClips": 60,
            "clipThumbnails": 60,
            "liveStreamThumbnails": 20,
            "youtubeShorts": 100,
            "uploadsPerWeek": 5,
            "spotifyIntegration": 20,
            "transcription": true,
            "posts": 8,
            "carousels": 2,
            "websiteBanners": 5,
            "newsletters": 2,
            "vectorGraphics": 5,
            "barista": true
          }
        },
        "advanced": {
          "level": 2,
          "name": "Advanced Design",
          "price": 4580,
          "includes": {
            "allEssentialPlus": true,
            "posts": 12,
            "carousels": 4,
            "websiteBanners": 8,
            "newsletters": 2,
            "vectorGraphics": 10,
            "newsletterDesignAndPublish": true
          }
        },
        "premium": {
          "level": 3,
          "name": "Premium Design",
          "price": 6350,
          "includes": {
            "allAdvancedPlus": true,
            "posts": 18,
            "carousels": 6,
            "websiteBanners": 12,
            "newsletters": 4,
            "vectorGraphics": 15,
            "googleAnalytics": true,
            "monthlyAnalyticsReview": true,
            "emailFormSetup": true,
            "mailchimpIntegration": true
          }
        },
        "all-in": {
          "level": 4,
          "name": "All-In",
          "price": 15000,
          "includes": {
            "unlimited": true,
            "tca": "unlimited",
            "tcc": "unlimited",
            "fullCreativeFreedom": true
          }
        }
      }
    }
  },
  "tccServices": {
    "description": "Tareas Creativas Complejas (TCC) - Complex Creative Tasks",
    "items": {
      "print-small": { "name": "Diseno impreso pequeno formato", "price": 150, "examples": "dossiers, flyers, posters" },
      "print-large": { "name": "Diseno impreso gran formato", "price": 150, "examples": "banners, roll-ups, photocalls" },
      "milky-branding-tcc": { "name": "Milky Branding (Logo + Guidelines)", "price": 1200 },
      "landing-design": { "name": "Diseno Landing Page (UI only)", "price": 550 },
      "multipage-design": { "name": "Diseno Multi-Pagina 3-5 pags (UI only)", "price": 850 },
      "landing-dev": { "name": "Desarrollo Landing Page", "price": 950 },
      "multipage-dev": { "name": "Desarrollo Multi-Pagina 3-5 pags", "price": 1700 },
      "animation": { "name": "Animacion y Motion Graphics", "price": 350 },
      "video-production": { "name": "Produccion de Video", "price": 675 },
      "content-creation": { "name": "Creacion de Contenido", "price": null, "note": "per project" },
      "video-editing": { "name": "Edicion de Video", "price": null, "note": "per scope" },
      "sound-design": { "name": "Diseno de Sonido", "price": null, "note": "per scope" },
      "documentary-research": { "name": "Investigacion Documental para RRSS", "price": null, "note": "per scope" }
    }
  },
  "tcaServices": {
    "description": "Tareas Creativas Adicionales (TCA) - Additional Creative Tasks",
    "items": {
      "design-tasks": { "name": "Thumbnails, banners, newsletters, 5 vectores", "price": 180 },
      "naming": { "name": "Naming creativo", "price": 180 },
      "illustration": { "name": "Arte, ilustracion, diseno 3D", "price": 180 },
      "product-design": { "name": "Diseno de producto", "price": 280 },
      "stationery": { "name": "Papeleria, POP, merchandising", "price": 80 },
      "print-prep": { "name": "Preparacion de archivos para imprenta", "price": 60 },
      "presentations": { "name": "Presentaciones (PPT/Slides/PDF/Keynote, 5-15 slides)", "price": 315 },
      "copywriting": { "name": "Copywriting y contenido", "price": 180 },
      "adobe-templates": { "name": "Plantillas Adobe Express", "price": 180 },
      "content-scheduling": { "name": "Programacion de contenido via Adobe Express", "price": 220 }
    }
  },
  "launchPromotion": {
    "discount": 30,
    "discountUnit": "percent",
    "appliesTo": "first-month",
    "oneTime": true,
    "bonusServices": [
      "Sesion de discovery",
      "Analisis competitivo",
      "Revision de tendencias",
      "Estrategia de contenido personalizada",
      "Plan de accion para el lanzamiento"
    ]
  },
  "generalTerms": {
    "minimumCommitment": "3 meses",
    "noRollover": "Items no utilizados no se acumulan al mes siguiente",
    "taskExecution": "Ejecucion secuencial (no 2+ tareas simultaneas salvo dependencias)",
    "contentPlanning": "Documento de planificacion mensual con 1 semana de antelacion",
    "gridApproval": "Grillas deben disenarse 3 semanas antes de publicacion, 1 semana de aprobacion",
    "urgentSurcharge": { "amount": 25, "currency": "EUR", "threshold": "menos de 7 dias de aviso" },
    "videoRequirements": "Cliente debe proveer musica/stock video (excepto Milkshake o A por todo)",
    "aPorTodoNote": "Aunque los servicios son ilimitados, el tiempo y la complejidad se gestionan colaborativamente"
  }
};
const EMBEDDED_DISCOUNTS = {
  "version": "3.0",
  "lastUpdated": "2026-03-20",
  "bundleDiscounts": [
    {
      "id": "full-includes-branding",
      "trigger": { "selected": "shakefront-full" },
      "target": "milky-branding",
      "effect": { "type": "included", "price": 0, "label": "INCLUIDO" },
      "description": "Shakefront Full incluye Milky Branding"
    },
    {
      "id": "full-includes-silky",
      "trigger": { "selected": "shakefront-full" },
      "target": "silky-edits",
      "effect": { "type": "included", "price": 0, "label": "INCLUIDO" },
      "description": "Shakefront Full incluye Silky Edits"
    },
    {
      "id": "full-includes-grinder",
      "trigger": { "selected": "shakefront-full" },
      "target": "the-grinder",
      "effect": { "type": "included", "price": 0, "label": "INCLUIDO" },
      "description": "Shakefront Full incluye hosting, dominio y correos (The Grinder)"
    },
    {
      "id": "full-includes-rosetta",
      "trigger": { "selected": "shakefront-full" },
      "target": "rosetta",
      "effect": { "type": "included", "price": 0, "label": "INCLUIDO" },
      "description": "Shakefront Full incluye funcionalidad multilingue (Rosetta)"
    },
    {
      "id": "full-free-glass-cup",
      "trigger": { "selected": "shakefront-full" },
      "target": "glass-cup",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "The Glass Cup gratis con Shakefront Full"
    },
    {
      "id": "full-discount-flashy",
      "trigger": { "selected": "shakefront-full" },
      "target": "flashy-socials",
      "effect": { "type": "discount", "price": 870, "original": 1200 },
      "description": "Flashy Socials de 1200 a 870 con Shakefront Full"
    },
    {
      "id": "full-discount-hot-press",
      "trigger": { "selected": "shakefront-full" },
      "target": "hot-press",
      "effect": { "type": "discount", "price": 1600, "original": 3200 },
      "description": "Hot Press a mitad de precio con Shakefront Full"
    },
    {
      "id": "full-discount-counter",
      "trigger": { "selected": "shakefront-full" },
      "target": "the-counter",
      "effect": { "type": "discount", "percentage": 15 },
      "description": "The Counter 15% dto con Shakefront Full"
    },
    {
      "id": "silky-free-with-flashy",
      "trigger": { "selected": "flashy-socials" },
      "target": "silky-edits",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Silky Edits gratis con Flashy Socials"
    },
    {
      "id": "silky-free-with-buttery-1day",
      "trigger": { "selected": "buttery-1day" },
      "target": "silky-edits",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Silky Edits gratis con Buttery Frames (1 dia)"
    },
    {
      "id": "silky-free-with-buttery-3days",
      "trigger": { "selected": "buttery-3days" },
      "target": "silky-edits",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Silky Edits gratis con Buttery Frames (3 dias)"
    },
    {
      "id": "latte-art-free-with-branding",
      "trigger": { "selected": "milky-branding" },
      "target": "latte-art",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Latte Art gratis con Milky Branding"
    },
    {
      "id": "latte-art-free-with-punch-card",
      "trigger": { "selected": "punch-card" },
      "target": "latte-art",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Latte Art incluida en Punch Card"
    },
    {
      "id": "cold-brew-discount-with-buttery-1day",
      "trigger": { "selected": "buttery-1day" },
      "target": "cold-brew",
      "effect": { "type": "discount", "price": 900, "original": 1200 },
      "description": "Cold Brew de 1200 a 900 con Buttery Frames (produccion compartida)"
    },
    {
      "id": "cold-brew-discount-with-buttery-3days",
      "trigger": { "selected": "buttery-3days" },
      "target": "cold-brew",
      "effect": { "type": "discount", "price": 900, "original": 1200 },
      "description": "Cold Brew de 1200 a 900 con Buttery Frames 3 dias"
    },
    {
      "id": "cold-brew-includes-silky",
      "trigger": { "selected": "cold-brew" },
      "target": "silky-edits",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Cold Brew incluye Silky Edits (retoque fotografico)"
    },
    {
      "id": "sprinkles-discount-with-flashy",
      "trigger": { "selected": "flashy-socials" },
      "target": "sprinkles",
      "effect": { "type": "discount", "price": 350, "original": 500 },
      "description": "Sprinkles (AR filter) de 500 a 350 con Flashy Socials"
    },
    {
      "id": "foam-art-discount-with-branding",
      "trigger": { "selected": "milky-branding" },
      "target": "foam-art",
      "effect": { "type": "discount", "price": 1400, "original": 1800 },
      "description": "Foam Art (3D) de 1800 a 1400 con Milky Branding"
    },
    {
      "id": "punch-card-discount-with-branding",
      "trigger": { "selected": "milky-branding" },
      "target": "punch-card",
      "effect": { "type": "discount", "price": 1500, "original": 1800 },
      "description": "Punch Card de 1800 a 1500 con Milky Branding"
    },
    {
      "id": "pour-over-discount-with-hot-press",
      "trigger": { "selected": "hot-press" },
      "target": "pour-over",
      "effect": { "type": "discount", "percentage": 15 },
      "description": "Pour Over 15% dto con Hot Press (pipeline de animacion compartida)"
    },
    {
      "id": "pour-over-discount-with-cold-brew",
      "trigger": { "selected": "cold-brew" },
      "target": "pour-over",
      "effect": { "type": "discount", "percentage": 15 },
      "description": "Pour Over 15% dto con Cold Brew (elementos motion para video)"
    },
    {
      "id": "espresso-includes-grinder",
      "trigger": { "selected": "espresso-shot" },
      "target": "the-grinder",
      "effect": { "type": "free", "price": 0, "label": "GRATIS" },
      "description": "Espresso Shot incluye hosting (The Grinder)"
    },
    {
      "id": "brewery-includes-grinder",
      "trigger": { "selected": "the-brewery" },
      "target": "the-grinder",
      "effect": { "type": "included", "price": 0, "label": "INCLUIDO" },
      "description": "The Brewery incluye hosting (The Grinder)"
    },
    {
      "id": "coffee-lab-includes-grinder",
      "trigger": { "selected": "coffee-lab" },
      "target": "the-grinder",
      "effect": { "type": "included", "price": 0, "label": "INCLUIDO" },
      "description": "Coffee Lab incluye hosting (The Grinder)"
    },
    {
      "id": "percolator-discount-with-brewery",
      "trigger": { "selected": "the-brewery" },
      "target": "the-percolator",
      "effect": { "type": "discount", "percentage": 20 },
      "description": "The Percolator 20% dto con The Brewery (mismo scope de desarrollo)"
    },
    {
      "id": "percolator-discount-with-robo",
      "trigger": { "selected": "robo-barista" },
      "target": "the-percolator",
      "effect": { "type": "discount", "percentage": 20 },
      "description": "The Percolator 20% dto con Robo Barista (agentes necesitan automatizacion)"
    },
    {
      "id": "robo-discount-with-brewery",
      "trigger": { "selected": "the-brewery" },
      "target": "robo-barista",
      "effect": { "type": "discount", "percentage": 15 },
      "description": "Robo Barista 15% dto con The Brewery (codebase compartido)"
    },
    {
      "id": "robo-discount-with-percolator",
      "trigger": { "selected": "the-percolator" },
      "target": "robo-barista",
      "effect": { "type": "discount", "percentage": 20 },
      "description": "Robo Barista 20% dto con The Percolator"
    },
    {
      "id": "barista-promo-with-full",
      "trigger": { "selected": "shakefront-full" },
      "target": "barista",
      "effect": { "type": "promo", "freeMonths": 2, "label": "2 meses gratis" },
      "description": "Barista: 2 primeros meses gratis con Shakefront Full"
    },
    {
      "id": "barista-promo-with-lite",
      "trigger": { "selected": "shakefront-lite" },
      "target": "barista",
      "effect": { "type": "promo", "freeMonths": 1, "label": "Primer mes gratis" },
      "description": "Barista: primer mes gratis con Shakefront Lite"
    }
  ],
  "mutualExclusions": [
    {
      "services": ["shakefront-full", "shakefront-lite"],
      "description": "No se pueden seleccionar ambos Shakefront Full y Lite"
    },
    {
      "services": ["shakefront-full", "espresso-shot"],
      "description": "Espresso Shot es alternativa a Shakefront Full, no complemento"
    },
    {
      "services": ["shakefront-lite", "espresso-shot"],
      "description": "Espresso Shot es alternativa a Shakefront Lite, no complemento"
    },
    {
      "services": ["the-brewery", "coffee-lab"],
      "description": "Coffee Lab es version ligera de The Brewery, no se combinan"
    }
  ],
  "retainerDiscount": {
    "id": "retainer-core-discount",
    "percentage": 15,
    "appliesTo": ["milky-branding", "shakefront-full", "shakefront-lite"],
    "condition": "Any retainer tier active (min 3 months commitment)",
    "description": "15% de descuento en proyectos core cuando el retainer esta activo"
  },
  "volumeDiscounts": {
    "description": "Descuentos por volumen en Tareas Creativas Complejas (TCC)",
    "window": "2 months rolling",
    "tiers": [
      { "nth": 1, "discount": 5, "label": "1a TCC en ventana de 2 meses: -5%" },
      { "nth": 2, "discount": 10, "label": "2a TCC en ventana de 2 meses: -10%" },
      { "nth": 3, "discount": 20, "label": "3a+ TCC en ventana de 2 meses: -20%" }
    ]
  },
  "specialDiscounts": {
    "family-friends": {
      "id": "family-friends",
      "percentage": 35,
      "description": "Descuento Family & Friends",
      "note": "Applied to Mr Dumpling. At designer discretion for close personal relationships.",
      "appliesTo": "all-services"
    },
    "launch-promo": {
      "id": "launch-promo",
      "percentage": 30,
      "description": "Promocion de lanzamiento: 30% primer mes de retainer",
      "appliesTo": "first-month-retainer",
      "oneTime": true,
      "includesBonus": true
    },
    "referral": {
      "id": "referral",
      "type": "fixed-amount",
      "range": { "min": 200, "max": 700 },
      "description": "Descuento por referido antes de completar el proyecto",
      "note": "Amount varies by project size. Bohemia Group structure: 200-700 EUR depending on package."
    }
  },
  "packageDiscounts": {
    "description": "Descuento exclusivo por seleccionar un paquete completo. Se pierde si se modifica la seleccion manualmente.",
    "tiers": [
      { "minServices": 3, "discount": 5, "label": "5% descuento de paquete" },
      { "minServices": 5, "discount": 8, "label": "8% descuento de paquete" },
      { "minServices": 8, "discount": 10, "label": "10% descuento de paquete" }
    ],
    "appliesTo": "non-discounted-services",
    "note": "Only applies to services at full price (not already INCLUDED/FREE/discounted). Incentivizes committing to a package rather than cherry-picking."
  }
};
const EMBEDDED_PACKAGES = {
  "version": "1.0",
  "lastUpdated": "2026-03-20",
  "templates": [
    {
      "id": "test",
      "name": "Test",
      "subtitle": "Test",
      "eyebrow": "Test",
      "badge": null,
      "promo": null,
      "services": [
        "rosetta",
        "the-grinder",
        "barista"
      ],
      "variants": {
        "rosetta": {
          "variant": "default",
          "overridePrice": null
        },
        "the-grinder": {
          "variant": "default",
          "overridePrice": null
        },
        "barista": {
          "variant": "default",
          "overridePrice": null
        }
      },
      "overrides": {},
      "totalOneTime": 770,
      "totalMonthly": 450,
      "savings": 450,
      "source": "manual",
      "createdAt": "2026-03-20T22:03:35.604Z"
    }
  ]
};