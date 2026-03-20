# Van Alva — Universal Intake Form Architecture

**Date:** 2026-03-19
**Purpose:** Design a single conversational intake form that qualifies clients, discovers scope, routes to relevant service paths, and outputs structured data the proposal skill can consume directly.

**Platform:** Typeform (leveraging logic jumps, variables, calculated fields)

---

## Design Principles

1. **One form, many paths** — Every client enters the same door but sees only relevant questions
2. **Progressive disclosure** — Start broad (who are you?), narrow (what do you need?), then deep-dive (specifics)
3. **Under 5 minutes** — No path should exceed ~20 questions. Kill rate spikes after 5 min on Typeform
4. **Data-first** — Every answer maps to a manifest field. No decorative questions
5. **Bilingual ready** — Form in Spanish with English option (matches client base)
6. **Warm tone** — Conversational, uses {{name}}, personality of Van Alva (coffee metaphors welcome)

---

## Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: DISCOVERY                           │
│              (Everyone — 6 questions)                           │
│                                                                 │
│  Q1  Name                                                       │
│  Q2  Email                                                      │
│  Q3  Company/Project name                                       │
│  Q4  Industry (dropdown)                                        │
│  Q5  Business stage (new / rebrand / scaling)                   │
│  Q6  "Tell me about your project" (free text)                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PHASE 2: NEEDS MAP                              │
│           (Everyone — 2-3 questions)                            │
│                                                                 │
│  Q7  "What do you need?" (multi-select categories)              │
│      □ Brand identity / logo / naming                           │
│      □ Website                                                  │
│      □ Social media presence                                    │
│      □ Photography / video                                      │
│      □ Print / packaging / materials                            │
│      □ Software / platform / app                                │
│      □ Automation / workflows                                   │
│      □ AI tools / chatbots                                      │
│      □ Ongoing creative support (retainer)                      │
│      □ Not sure — I need guidance                               │
│                                                                 │
│  Q8  "How would you describe the scope?" (single choice)        │
│      ○ One specific thing                                       │
│      ○ A few related services                                   │
│      ○ A complete digital transformation                        │
│      ○ I just need to talk to someone first                     │
│                                                                 │
│  Q9  Team size (number) — "How many people in your team?"       │
└────────────────────────┬────────────────────────────────────────┘
                         │
              ┌──────────┼──────────┐
              │ Logic Jump based on  │
              │ Q7 selections + Q8   │
              └──┬───┬───┬───┬───┬──┘
                 │   │   │   │   │
    ┌────────────┘   │   │   │   └────────────┐
    ▼                ▼   ▼   ▼                ▼
 BRANDING        WEB  TECH  CONTENT      FULL ECOSYSTEM
  PATH          PATH  PATH   PATH            PATH
```

---

## Phase 1: Discovery (Everyone sees this)

### Q1 — Name
- **Type:** Short text
- **Text:** "Primero lo primero — ¿cómo te llamas?"
- **Required:** Yes
- **Maps to:** `client.contactName`
- **Variable:** `{{name}}`

### Q2 — Email
- **Type:** Email
- **Text:** "Perfecto, {{name}}. ¿Cuál es tu email?"
- **Required:** Yes
- **Maps to:** `client.email`

### Q3 — Company/Project Name
- **Type:** Short text
- **Text:** "¿Cómo se llama tu empresa o proyecto?"
- **Subtitle:** "Si todavía no tiene nombre, escribe el nombre provisional o 'por definir'"
- **Required:** Yes
- **Maps to:** `client.name`

### Q4 — Industry
- **Type:** Dropdown
- **Text:** "¿En qué sector opera {{company}}?"
- **Options:**
  - Restaurante / Food & Beverage
  - Tecnología / Software
  - Trading / Comercio Internacional
  - Real Estate / Inmobiliaria
  - Salud / Wellness
  - Media / Entretenimiento
  - Educación
  - Moda / Retail
  - Servicios Profesionales / Consultoría
  - Industria / Manufactura
  - Otro (especificar)
- **Required:** Yes
- **Maps to:** `client.industry`

### Q5 — Business Stage
- **Type:** Multiple choice (single)
- **Text:** "¿En qué etapa está tu proyecto?"
- **Options:**
  - 🚀 **Empezando desde cero** — "Necesito crear todo: marca, presencia digital, herramientas"
  - 🔄 **Rebrand / Renovación** — "Ya tengo algo pero necesita un upgrade serio"
  - 📈 **Escalando** — "El negocio funciona pero necesito sistematizar y crecer"
  - 🔧 **Proyecto puntual** — "Necesito algo específico, ya tengo lo demás resuelto"
- **Required:** Yes
- **Maps to:** `client.stage` → influences package recommendations
- **Logic:**
  - "Empezando" → likely needs full ecosystem, weight toward larger packages
  - "Rebrand" → likely branding + web, check existing assets
  - "Escalando" → likely tech/automation, platform focus
  - "Puntual" → likely single service, skip deep-dives

### Q6 — Project Description
- **Type:** Long text
- **Text:** "Cuéntame sobre {{company}} — ¿qué hacen, qué necesitan, y qué te gustaría lograr?"
- **Subtitle:** "No te preocupes por ser preciso. Esto me ayuda a entender tu mundo antes de hablar."
- **Required:** No (but encouraged)
- **Maps to:** `brief.intro` seed + skill context

---

## Phase 2: Needs Map (Everyone sees this)

### Q7 — Service Categories
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Qué necesitas? Selecciona todo lo que aplique."
- **Options:**

  | Option | Label | Service Mapping |
  |---|---|---|
  | A | Identidad de marca / logo / naming | `milky-branding` |
  | B | Sitio web | `shakefront-full` or `shakefront-lite` |
  | C | Presencia en redes sociales | `flashy-socials` |
  | D | Fotografía o video profesional | `buttery-*` or `cold-brew` |
  | E | Material impreso / packaging | `glass-cup` |
  | F | Software / plataforma / app a medida | `the-brewery` |
  | G | Automatización de procesos | `the-percolator` |
  | H | Chatbots / AI / herramientas inteligentes | `robo-barista` |
  | I | Soporte creativo continuo (mensual) | retainer |
  | J | No estoy seguro — necesito orientación | triggers "guidance" path |

- **Required:** Yes
- **Maps to:** Initial service selection for the skill
- **Logic jumps:** Each selection activates its corresponding deep-dive path

### Q8 — Scope Perception
- **Type:** Multiple choice (single)
- **Text:** "¿Cómo describirías el alcance de lo que necesitas?"
- **Options:**
  - **Algo puntual** — "Un servicio específico, bien definido"
  - **Varios servicios relacionados** — "Necesito varias cosas que se conectan entre sí"
  - **Una transformación digital completa** — "Quiero profesionalizarlo todo"
  - **Primero quiero hablar** — "Prefiero una conversación antes de decidir"
- **Maps to:** `budgetSignal` calibration + package emphasis
- **Logic:**
  - "Puntual" → skip package pitching, focus on individual service
  - "Varios" → show mid-tier package
  - "Transformación" → recommend full ecosystem
  - "Hablar" → short form, end with CTA to schedule call

### Q9 — Team Size
- **Type:** Number
- **Text:** "¿Cuántas personas trabajan en {{company}}?"
- **Subtitle:** "Inclúyete. Si eres solo tú, pon 1. Esto me ayuda a calibrar herramientas y automatización."
- **Required:** No
- **Maps to:** `client.teamSize` → influences automation/platform recommendations
- **Logic:** If teamSize <= 3 AND Q7 includes F/G/H → strong automation pitch

---

## Phase 3: Deep-Dive Paths (Conditional)

Each path activates based on Q7 selections. A client can trigger multiple paths — Typeform chains them sequentially.

---

### PATH A: Branding (if Q7 includes "Identidad de marca")

#### A1 — Has Name?
- **Type:** Multiple choice
- **Text:** "¿Ya tienes nombre definitivo para tu marca?"
- **Options:**
  - Sí, estoy seguro → skip naming
  - Sí, pero no estoy convencido → note for skill
  - No, necesito ayuda con el naming → adds naming to scope
- **Maps to:** Skill decision on naming scope

#### A2 — Has Logo?
- **Type:** Yes/No
- **Text:** "¿Ya tienes un logo?"
- **Subtitle:** "Si es un rebrand, pon sí"
- **Maps to:** Skill context (new brand vs. evolution)

#### A3 — Sub-brands?
- **Type:** Yes/No
- **Text:** "¿Tu negocio tiene productos o líneas que necesiten su propia identidad visual?"
- **Subtitle:** "Por ejemplo: diferentes líneas de producto, sub-marcas, o variantes"

#### A4 — How Many Sub-brands? (if A3 = Yes)
- **Type:** Number
- **Text:** "¿Cuántas variaciones o sub-marcas necesitas?"
- **Maps to:** `pricing.customLineItems` → sub-brand line item with calculated price

#### A5 — Brand References
- **Type:** Long text
- **Text:** "¿Hay marcas que admires o que te gustaría que {{company}} se pareciera visualmente?"
- **Subtitle:** "Pueden ser de tu sector o de cualquier otro. Links, nombres, lo que sea."
- **Maps to:** `brief.creativeBrief` enrichment

#### A6 — Brand Personality
- **Type:** Multiple choice (multi-select, max 3)
- **Text:** "Si tu marca fuera una persona, ¿cómo sería? Elige máximo 3."
- **Options:**
  - Profesional y seria
  - Moderna y tech
  - Cálida y cercana
  - Lujosa y premium
  - Divertida y creativa
  - Minimalista y limpia
  - Artesanal y auténtica
  - Audaz y disruptiva
- **Maps to:** `brief.creativeBrief` personality tags

---

### PATH B: Website (if Q7 includes "Sitio web")

#### B1 — Current Website?
- **Type:** Yes/No
- **Text:** "¿{{company}} tiene sitio web actualmente?"

#### B2 — Website URL (if B1 = Yes)
- **Type:** URL
- **Text:** "¿Cuál es la dirección?"
- **Maps to:** Skill context for redesign scope

#### B3 — Website Scope
- **Type:** Multiple choice
- **Text:** "¿Qué tipo de web necesitas?"
- **Options:**
  - **Landing page simple** — "Una página, directa al punto" → `espresso-shot`
  - **Sitio completo (5-10 páginas)** — "Varias secciones, info del negocio" → `shakefront-full` (standard)
  - **Sitio con catálogo / CMS** — "Necesito gestionar productos o contenido dinámico" → `shakefront-full` (full-cms)
  - **E-commerce / tienda online** — "Quiero vender directamente" → `shakefront-full` (ecommerce)
  - **Plataforma / webapp** — "Algo más complejo que un sitio web" → `the-brewery`
  - **No estoy seguro** → skill decides based on context
- **Maps to:** Service ID + pricing variant selection

#### B4 — Multilingual?
- **Type:** Yes/No
- **Text:** "¿Necesitas el sitio en más de un idioma?"
- **Maps to:** Toggles `rosetta` service

#### B5 — Booking/Reservations?
- **Type:** Yes/No
- **Text:** "¿Necesitas que los clientes puedan reservar o agendar desde la web?"
- **Maps to:** Toggles `the-counter` service

---

### PATH C: Tech / Platform (if Q7 includes Software, Automation, or AI)

#### C1 — Current Tools
- **Type:** Long text
- **Text:** "¿Qué herramientas usa tu equipo actualmente para gestionar el negocio?"
- **Subtitle:** "Excel, WhatsApp, email, algún CRM, software específico... todo cuenta."
- **Maps to:** Skill context for integration scope

#### C2 — Pain Points
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Cuáles de estos problemas te suenan familiares?"
- **Options:**
  - Paso demasiado tiempo en tareas repetitivas
  - No tengo visibilidad clara de mis pedidos/clientes/inventario
  - La comunicación con clientes es manual y lenta
  - No puedo delegar porque todo depende de mí
  - Uso demasiadas herramientas desconectadas entre sí
  - Mis clientes no tienen forma de ver el estado de sus pedidos
  - No tengo datos para tomar decisiones
  - Quiero escalar pero no puedo contratar más gente
- **Maps to:** `brief.needs` enrichment + service recommendations
- **Logic:**
  - "tareas repetitivas" + "delegar" → strong `the-percolator` signal
  - "pedidos/clientes/inventario" → `the-brewery` signal
  - "comunicación manual" → `robo-barista` signal
  - "escalar sin contratar" → full tech bundle signal

#### C3 — Platform Scope (if Q7 includes Software)
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Qué debería poder hacer tu plataforma?"
- **Options:**
  - Gestionar clientes (CRM)
  - Gestionar pedidos / órdenes
  - Controlar inventario / almacén
  - Seguimiento de envíos / logística
  - Portal para que mis clientes vean sus datos
  - Generación de cotizaciones / facturas
  - Dashboard con métricas del negocio
  - Gestión de proveedores
  - Gestión de tareas / proyectos internos
  - Otro (especificar)
- **Maps to:** `brief.needs` for platform scope definition

#### C4 — Automation Specifics (if Q7 includes Automation)
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Qué te gustaría automatizar?"
- **Options:**
  - Notificaciones automáticas a clientes (WhatsApp, email)
  - Alertas internas para el equipo
  - Generación automática de documentos / cotizaciones
  - Sincronización de datos entre herramientas
  - Publicación automática en redes sociales
  - Seguimiento de leads / oportunidades
  - Gestión de inventario y alertas de stock
  - Otro (especificar)
- **Maps to:** `the-percolator` scope definition

#### C5 — AI Interest (if Q7 includes AI)
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Qué tipo de inteligencia artificial te interesa?"
- **Options:**
  - Chatbot para atención al cliente (24/7)
  - Generación automática de cotizaciones
  - Asistente interno para el equipo
  - Análisis inteligente de datos
  - Automatización de respuestas por WhatsApp/email
  - No estoy seguro, pero me interesa explorar
- **Maps to:** `robo-barista` scope definition

---

### PATH D: Content & Production (if Q7 includes Social/Photo/Video)

#### D1 — Photography Needs
- **Type:** Multiple choice (if Q7 includes Photography)
- **Text:** "¿Qué tipo de fotografía necesitas?"
- **Options:**
  - Producto (para catálogo / web / e-commerce) → `buttery-1day`
  - Espacios / arquitectura / interiores → `buttery-1day`
  - Equipo / retratos corporativos → `buttery-1day`
  - Evento o sesión especial → `buttery-3days`
  - Varias sesiones / cobertura extendida → `buttery-3days`
- **Maps to:** `buttery-1day` vs `buttery-3days`

#### D2 — Video Needs
- **Type:** Multiple choice (if Q7 includes Video)
- **Text:** "¿Qué tipo de video necesitas?"
- **Options:**
  - Brand video / presentación de marca → `cold-brew`
  - Motion graphics / animación → `pour-over`
  - Contenido para redes (reels, TikTok) → part of retainer or `flashy-socials`
  - Video para TV / broadcast → `hot-press` consideration
- **Maps to:** Video service selection

#### D3 — Social Media Status (if Q7 includes Social)
- **Type:** Multiple choice
- **Text:** "¿En qué estado están las redes sociales de {{company}}?"
- **Options:**
  - No tengo nada — empezar de cero
  - Tengo perfiles pero sin estrategia
  - Tengo presencia pero necesito mejorarla
  - Necesito mantenimiento continuo → retainer signal
- **Maps to:** `flashy-socials` scope + potential retainer

#### D4 — Print/Packaging (if Q7 includes Print)
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Qué materiales impresos necesitas?"
- **Options:**
  - Tarjetas de presentación
  - Packaging de producto
  - Catálogo / dossier comercial
  - Flyers / posters
  - Stickers / etiquetas
  - Material POP / merchandising
  - Señalética / rótulos
- **Maps to:** `glass-cup` scope definition

---

### PATH E: Retainer (if Q7 includes "Soporte continuo")

#### E1 — Retainer Needs
- **Type:** Multiple choice (multi-select)
- **Text:** "¿Qué tipo de soporte mensual necesitas?"
- **Options:**
  - Diseño gráfico recurrente (posts, banners, presentaciones)
  - Gestión y publicación de contenido en redes
  - Mantenimiento y actualizaciones de sitio web
  - Creación de contenido (copywriting, blog, newsletter)
  - Edición de video / reels
  - Estrategia de marca y consultoría
  - Desarrollo web continuo (nuevas funciones, páginas)
  - Todo lo anterior — necesito un equipo creativo dedicado
- **Maps to:** Retainer tier recommendation (Sip Starter → A por todo)

#### E2 — Content Volume
- **Type:** Multiple choice
- **Text:** "¿Cuánto contenido necesitas al mes aproximadamente?"
- **Options:**
  - Poco (5-10 piezas) → Sip Starter / Just Water
  - Moderado (15-20 piezas) → Nutty Blend
  - Bastante (20-30 piezas) → 5$ Milkshake
  - Todo lo que se pueda — soy intenso → A por todo
- **Maps to:** Retainer tier selection

---

## Phase 4: Closing (Everyone sees this)

### Q-FINAL-1 — Budget
- **Type:** Dropdown
- **Text:** "{{name}}, con toda sinceridad... ¿cuál es tu presupuesto para este proyecto?"
- **Subtitle:** "No hay respuesta incorrecta. Esto me ayuda a calibrar la propuesta para que tenga sentido para ti."
- **Options:**
  - Menos de €1,500
  - €1,500 - €3,000
  - €3,000 - €5,000
  - €5,000 - €10,000
  - €10,000 - €20,000
  - €20,000 - €35,000
  - Más de €35,000
  - Prefiero no decir — háblame tú
- **Required:** Yes
- **Maps to:** `budgetSignal` + `budgetRange`
- **Logic for skill:**

  | Budget | Signal | Package emphasis |
  |---|---|---|
  | < €1,500 | `minimal` | Basic branding only, flag for conversation |
  | €1,500 - €3,000 | `tight` | Single service, no upsell |
  | €3,000 - €5,000 | `moderate` | Small bundle, lead with essentials |
  | €5,000 - €10,000 | `comfortable` | Mid package, show savings |
  | €10,000 - €20,000 | `solid` | Full creative package |
  | €20,000 - €35,000 | `generous` | Full ecosystem with tech |
  | > €35,000 | `enterprise` | Everything, premium positioning |
  | "Prefiero no decir" | `unknown` | Show all tiers, let them choose |

### Q-FINAL-2 — Timeline Urgency
- **Type:** Multiple choice
- **Text:** "¿Para cuándo necesitas esto?"
- **Options:**
  - Lo antes posible (tengo prisa)
  - En 1-2 meses
  - En 3-6 meses (estoy planificando)
  - Sin fecha fija — cuando esté listo
- **Maps to:** `timeline.urgency` → affects delivery estimates and potential rush pricing

### Q-FINAL-3 — How They Found You
- **Type:** Multiple choice
- **Text:** "¿Cómo llegaste a Van Alva?"
- **Options:**
  - Recomendación de alguien → triggers `referral` discount eligibility
  - Instagram / redes sociales
  - Google / búsqueda web
  - Portfolio / Behance / Dribbble
  - Ya nos conocemos → triggers `family-friends` discount consideration
  - Otro
- **Maps to:** `client.source` + potential `pricing.specialDiscount`

### Q-FINAL-4 — Readiness
- **Type:** Multiple choice
- **Text:** "¿Cuál es tu siguiente paso ideal?"
- **Options:**
  - **"Mándame la propuesta"** — "Confío en ti, quiero ver números y alcance"
  - **"Quiero hablar primero"** — "Prefiero una videollamada o reunión antes de decidir"
  - **"Solo estoy explorando"** — "Todavía estoy viendo opciones"
- **Maps to:** `client.readiness`
- **Logic:**
  - "Mándame la propuesta" → skill generates full proposal immediately
  - "Quiero hablar" → skill generates brief summary + CTA to schedule call
  - "Explorando" → skill generates lighter overview, less aggressive pricing

### Q-FINAL-5 — Anything Else
- **Type:** Long text
- **Text:** "¿Hay algo más que quieras contarme antes de que prepare tu propuesta?"
- **Subtitle:** "Referencias, preocupaciones, ideas locas, lo que sea. Todo suma."
- **Required:** No
- **Maps to:** Additional skill context

---

## Thank You Screen

**Text:**
> ¡Gracias, {{name}}! Ya tengo lo que necesito.
>
> En las próximas 24-48 horas recibirás una propuesta personalizada con todo lo que hemos hablado.
>
> Si mientras tanto quieres ver mi trabajo: [vanalva.io](https://www.vanalva.io)
>
> O si prefieres hablar directamente: [WhatsApp](https://wa.me/34XXXXXXXXX)

---

## Output: Form → Manifest Mapping

When the form is submitted, the data should be structured as a JSON payload that the proposal skill can consume:

```json
{
  "source": "typeform",
  "formId": "intake-general",
  "submittedAt": "2026-03-20T14:30:00Z",

  "client": {
    "contactName": "{{Q1}}",
    "email": "{{Q2}}",
    "name": "{{Q3}}",
    "industry": "{{Q4}}",
    "stage": "{{Q5}}",
    "teamSize": "{{Q9}}",
    "source": "{{Q-FINAL-3}}",
    "readiness": "{{Q-FINAL-4}}"
  },

  "brief": {
    "description": "{{Q6}}",
    "brandReferences": "{{A5}}",
    "brandPersonality": ["{{A6 selections}}"],
    "currentTools": "{{C1}}",
    "painPoints": ["{{C2 selections}}"],
    "additionalNotes": "{{Q-FINAL-5}}"
  },

  "needs": {
    "categories": ["{{Q7 selections}}"],
    "scopePerception": "{{Q8}}",
    "branding": {
      "hasName": "{{A1}}",
      "hasLogo": "{{A2}}",
      "needsSubBrands": "{{A3}}",
      "subBrandCount": "{{A4}}"
    },
    "web": {
      "hasWebsite": "{{B1}}",
      "currentUrl": "{{B2}}",
      "webScope": "{{B3}}",
      "multilingual": "{{B4}}",
      "booking": "{{B5}}"
    },
    "tech": {
      "platformFeatures": ["{{C3 selections}}"],
      "automationNeeds": ["{{C4 selections}}"],
      "aiInterests": ["{{C5 selections}}"]
    },
    "content": {
      "photoType": "{{D1}}",
      "videoType": "{{D2}}",
      "socialStatus": "{{D3}}",
      "printNeeds": ["{{D4 selections}}"]
    },
    "retainer": {
      "supportNeeds": ["{{E1 selections}}"],
      "contentVolume": "{{E2}}"
    }
  },

  "budget": {
    "range": "{{Q-FINAL-1}}",
    "signal": "computed from range"
  },

  "timeline": {
    "urgency": "{{Q-FINAL-2}}"
  }
}
```

---

## Question Count by Path

| Path | Questions | Condition |
|---|---|---|
| Phase 1: Discovery | 6 | Always |
| Phase 2: Needs Map | 3 | Always |
| Path A: Branding | 6 | Q7 includes branding |
| Path B: Website | 5 | Q7 includes website |
| Path C: Tech | 5 | Q7 includes software/automation/AI |
| Path D: Content | 4 | Q7 includes social/photo/video/print |
| Path E: Retainer | 2 | Q7 includes retainer |
| Phase 4: Closing | 5 | Always |
| **Total range** | **14 - 31** | Depends on selections |

**Typical client paths:**
- Branding only: 6 + 3 + 6 + 5 = **20 questions** (~3 min)
- Branding + Web: 6 + 3 + 6 + 5 + 5 = **25 questions** (~4 min)
- Full ecosystem: 6 + 3 + 6 + 5 + 5 + 2 + 5 = **32 questions** (~5 min) — acceptable for a €30k+ project
- "Just exploring": 6 + 3 + 5 = **14 questions** (~2 min)

---

## Integration with Proposal Skill

### Option A: Manual (Current)
1. Client fills form
2. JC reviews Typeform responses
3. JC feeds key info to the proposal skill as instructions
4. Skill generates manifest + builds proposal

### Option B: Semi-Automated (Recommended)
1. Client fills form
2. Typeform webhook sends JSON to n8n
3. n8n formats the data as a structured brief
4. JC reviews the structured brief, adjusts if needed
5. JC feeds the brief to the proposal skill
6. Skill generates manifest + builds proposal

### Option C: Fully Automated (Future)
1. Client fills form
2. Typeform webhook → n8n → Claude API
3. Skill auto-generates manifest from form data
4. Build runs automatically
5. Proposal URL emailed to JC for review
6. JC approves → proposal sent to client

---

## Existing Milky Branding Form

The current Typeform (XqwNgadi) should be **retired or redirected** to this universal form. The universal form covers everything the branding form does (Path A) plus all other services. One intake, one flow, one system.

Alternatively, keep the branding form as a **lightweight entry point** that redirects to the full form if the client selects "Continue with the process" at Q13.
