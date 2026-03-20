# Component Library — Van Alva Proposal Template

CSS design system reference for composing custom HTML sections.

## Layout

- `.section` — full-width section wrapper. Variant: `.secondary-section` (lighter bg)
- `.container` — centered max-width. Variants: `.small-container`, `.large-container`, `.full-width-container`
- `.grid-layout` — CSS grid. Columns: `.desktop-1-column`, `.desktop-3-column`, `.desktop-4-column`, `.desktop-5-column`, `.desktop-6-column`. Gap: `.grid-gap-xs`, `.grid-gap-sm`, `.grid-gap-md`, `.grid-gap-lg`. Responsive: `.tablet-1-column`, `.mobile-portrait-1-column`. Alignment: `.y-center`, `.y-top`, `.x-center`
- `.w-layout-grid` — Webflow grid base

## Typography

- `.h1-heading`, `.h2-heading`, `.h3-heading`, `.h4-heading`
- `.heading-responsive-lg`, `.heading-responsive-xl` — scales with viewport
- `.paragraph-sm`, `.paragraph-lg`, `.paragraph-xl`
- `.eyebrow` — small uppercase label
- `.subheading` — supporting text under headings
- `.rich-text.paragraph-lg.w-richtext` — formatted content block (use for long-form HTML)

## Cards

- `.card` — base card. Variants: `.secondary-card`, `.card-on-secondary`, `.accent-primary-card`
- `.card-body` — inner content. Add `.utility-aspect-3x2` or `.utility-aspect-16x9` for aspect ratio. Add `.middle` for vertical centering. Add `.features` for feature grid cards
- `.card-header` — top section with eyebrow + icon
- `.card-link` — clickable card wrapper (wraps the entire card in an `<a>`)

## Pricing Cards (Interactive)

- `.pricing-card` — selectable service card. Attributes: `data-service="id"`, `data-price="0"`, `data-type="core|addon|retainer"`, `data-monthly="true"`. States: `.selected`, `.included`, `.free`, `.greyed`
- `.check-icon` — checkmark overlay
- `.status-badge` — "GRATIS" / "INCLUIDO" badge
- `.info-btn` — small "Mas info" button, triggers `ServiceModal.open('id')`

## Package Cards

- `.package-card` — recommended package. Elements: `.package-badge`, `.package-eyebrow`, `.package-title`, `.package-subtitle`, `.package-includes` (ul), `.package-divider`, `.package-total-row`, `.package-total-price`, `.package-savings`, `.package-cta` (button)
- State: `.package-card.selected`

## Buttons

- `.button` — primary. Variants: `.secondary-button`, `.small-button`, `.inverse-button`
- `.button.full` — full width
- `.button.big` — larger padding
- `.w-button` — Webflow button base (combine with `.button`)

## Tags

- `.tag` — inline pill/badge: `<div class="tag"><div>Label</div></div>`
- `.large-tag` — bigger variant

## Tabs

- `.w-tabs` — tab container
- `.w-tab-menu` — tab navigation bar
- `.tab-menu-link-transparent` — individual tab link. Active: `.w--current`
- `.w-tab-content` — tab content wrapper
- `.w-tab-pane` — individual tab panel. Active: `.w--tab-active`

## Flex

- `.flex-vertical` — column layout
- `.flex-horizontal` — row layout
- Gaps: `.flex-gap-xxs`, `.flex-gap-xs`, `.flex-gap-sm`, `.flex-gap-md`, `.flex-gap-lg`
- Alignment: `.x-left`, `.x-center`, `.y-center`, `.y-bottom`
- `.utility-height-100` — full height child

## Terms / Contract

- `.terms-subtabs` — subtab navigation for project/retainer terms
- `.terms-subtab` — individual subtab button. Active: `.terms-subtab.active`
- `.terms-panel` — content panel. Active: `.terms-panel.active`
- `.terms-section-divider` — `<hr>` between clause groups
- `.terms-highlight` — highlighted callout box (for payment splits, important notices)
- `.terms-payment-grid` — `<dl>` for bank info (dt/dd pairs)

## Retainer Overlay

- `.retainer-overlay` — full-page overlay. Active: `.retainer-overlay.active`
- `.retainer-header` — sticky header with back button
- `.retainer-back` — "Volver al presupuesto" button
- `.retainer-content` — centered content area (max-width: 900px)
- `.tier-card` — retainer tier card. Elements: `.tier-level`, `.tier-name`, `.tier-price`, `.tier-list`
- `.section-title` — major section divider in retainer
- `.sub-section` — subsection with h4 and content
- `.discount-table` — volume discount table

## Service Modal

- `.service-modal-overlay` — overlay backdrop. Active: `.active`
- `.service-modal` — modal container (max-width: 560px)
- `.service-modal-close` — X close button
- `.modal-eyebrow`, `.modal-title`, `.modal-price`, `.modal-desc`
- `.modal-list` — feature list (checkmarks via CSS `::before`)
- `.modal-deliverables` — numbered list
- `.modal-cta` — "Anadir al presupuesto" button

## Sticky Price Bar

- `.sticky-price-bar` — fixed bottom bar. Visible: `.sticky-price-bar.visible`
- `.sticky-price-inner` — inner flex container
- `.sticky-price-label`, `.sticky-price-value`, `.sticky-price-count`

## Video

- `.video-container` — wrapper. Variants: `.slim`, `.full`
- `.hover-video` — video element (plays on hover via JS)
- `.unmute-button` — audio toggle overlay

## Utilities

- Margin: `.utility-margin-top-{0..8}rem`, `.utility-margin-bottom-{0..8}rem`
- Padding: `.utility-padding-all-{0..4}rem`, `.utility-padding-top-{0..4}rem`
- Text: `.utility-text-align-center`, `.utility-text-align-right`, `.utility-text-secondary`, `.utility-text-all-caps`
- Display: `.utility-display-none`, `.utility-display-block`
- Position: `.utility-position-sticky.top-120px`, `.utility-position-relative`
- Sizing: `.utility-width-100`, `.utility-max-width-sm`, `.utility-max-width-90`
- Aspect: `.utility-aspect-1x1`, `.utility-aspect-2x3`, `.utility-aspect-3x2`, `.utility-aspect-16x9`
- Effects: `.utility-backdrop-filter-blur`, `.utility-overflow-hidden`
- Spacing: `.spacer-small`, `.spacer-medium`, `.spacer-large`, `.sg-spacing`

## Design Tokens

- Primary accent: `#f0ff3d` (yellow) — used in pricing highlights, scrollbar, selection
- Per-proposal accent: set via `manifest.brand.accentColor` — used in retainer CTA, package badges
- Fonts: Montserrat (body), Cascadia Code (monospace/headings), Inter, Syne
- Dark theme: `#000` background, `#fff`/`rgba(255,255,255,...)` text
- Border radius: cards use 12px default

## Common Section Patterns

### Full-width hero
```html
<header class="section">
  <div class="container full-width-container">
    <h1 class="heading-responsive-xl">Title</h1>
  </div>
</header>
```

### Card grid section
```html
<section class="section">
  <div class="container">
    <div class="w-layout-grid grid-layout desktop-3-column grid-gap-md">
      <div class="card"><div class="card-body">...</div></div>
    </div>
  </div>
</section>
```

### Sticky scroll cards
```html
<div class="utility-position-sticky top-120px">
  <div class="card utility-backdrop-filter-blur card-on-secondary">
    <div class="card-body utility-aspect-3x2">
      <div class="eyebrow">Category</div>
      <h2>Heading</h2>
      <p class="paragraph-lg">Description</p>
    </div>
  </div>
</div>
```

### Tab section
```html
<div class="w-tabs">
  <div class="w-tab-menu">
    <a data-w-tab="Tab 1" class="tab-menu-link-transparent w-tab-link w--current">Tab</a>
  </div>
  <div class="w-tab-content">
    <div data-w-tab="Tab 1" class="w-tab-pane w--tab-active">Content</div>
  </div>
</div>
```

### Video card
```html
<div class="card">
  <div class="video-container full w-embed">
    <div class="video-container">
      <video class="hover-video" muted loop playsinline preload="auto">
        <source src="URL" type="video/mp4">
      </video>
      <button class="unmute-button">Unmute</button>
    </div>
  </div>
</div>
```
