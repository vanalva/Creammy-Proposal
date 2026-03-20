const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/catalog/services.json','utf8'));
const s = data.services;

// ═══ 1. VARIANT DESCRIPTIONS ═══

// Milky Branding
s['milky-branding'].pricing.priceVariants = {
  'basic':        { price: 750,  description: 'Logo refresh only, no brandbook', criteria: 'Existing brand needing minor update' },
  'tcc-retainer': { price: 1200, description: 'Within active retainer TCC allocation', criteria: 'Active retainer client using TCC' },
  'standard':     { price: 1500, description: 'Full identity, single brand, no packaging/sub-brands', criteria: 'New single-brand business' },
  'full':         { price: 3500, description: 'Complete system + packaging + sub-brands + brandbook', criteria: 'DEFAULT for standalone projects' }
};
s['milky-branding'].pricing.defaultVariant = 'full';

// Shakefront Full — add e-commerce variants
s['shakefront-full'].pricing.priceVariants = {
  'standard-10pages':  { price: 5550,  description: 'Simple site, 10 pages, basic CMS', criteria: 'Small business, informational site' },
  'with-booking':      { price: 7750,  description: 'Site + booking/reservation system (The Counter included)', criteria: 'Hospitality, tourism, services businesses' },
  'full-cms-15pages':  { price: 13500, description: 'Full CMS, 15+ pages, animations, SEO avanzado', criteria: 'DEFAULT for standalone projects' },
  'webflow-ecommerce': { price: 15265, description: 'Webflow native e-commerce, <50 products', criteria: 'Small catalog, visual-first brand' },
  'webflow-shopify':   { price: 12000, description: 'Webflow design + Shopify via Smooftify bridge', criteria: 'Best of both: design freedom + real e-commerce' },
  'shopify-basic':     { price: 4500,  description: 'Shopify standalone + theme customization', criteria: 'Client wants/has Shopify, no Webflow needed' },
  'shopify-branded':   { price: 8500,  description: 'Shopify + fully custom theme from scratch', criteria: 'Full brand experience on Shopify platform' },
  'custom-headless':   { price: 18000, description: 'Next.js + headless Shopify/Saleor API, via The Brewery', criteria: 'Complex logic, subscriptions, custom checkout' }
};
s['shakefront-full'].pricing.defaultVariant = 'full-cms-15pages';
s['shakefront-full'].pricing.priceRange = { min: 4500, max: 18000 };

// Shakefront Lite
s['shakefront-lite'].pricing.priceVariants = {
  'basic-onepager':      { price: 2100,  description: 'Single scroll page, minimal sections', criteria: 'MVP, quick launch, tight budget' },
  'standard-10sections': { price: 3750,  description: 'One-pager with 10+ sections, animations', criteria: 'DEFAULT for one-pager projects' },
  'full-lite':           { price: 10500, description: 'Multi-section, full animations, SEO, multilingual', criteria: 'Premium one-pager, near-full-site scope' }
};
s['shakefront-lite'].pricing.defaultVariant = 'standard-10sections';

// Flashy Socials
s['flashy-socials'].pricing.priceVariants = {
  'lite':                 { price: 780,  description: '6 posts only, no TikTok, no scheduling', criteria: 'Minimal social presence setup' },
  'standard':             { price: 1200, description: 'Full pack: 12 posts, TikTok, plantillas, scheduling', criteria: 'DEFAULT for standalone projects' },
  'discounted-with-full': { price: 870,  description: 'Auto-applied discount with Shakefront Full', criteria: 'Auto: do not select manually' }
};
s['flashy-socials'].pricing.defaultVariant = 'standard';

// Buttery Frames 1 day
s['buttery-1day'].pricing.priceVariants = {
  'staff-only': { price: 350,  description: 'Team headshots only, 2 hours max', criteria: 'Headshots for team page / LinkedIn' },
  'standard':   { price: 1200, description: 'Full day (4-6h), products + people, 50+ photos', criteria: 'DEFAULT for most projects' },
  'premium':    { price: 1800, description: 'Multiple setups, styled, art direction, premium equipment', criteria: 'High-end brand, editorial quality' }
};
s['buttery-1day'].pricing.defaultVariant = 'standard';

// Latte Art
s['latte-art'].pricing.priceVariants = {
  'single':    { price: 480, description: '1 illustration with identity', criteria: 'Single hero illustration' },
  'full-pack': { price: 620, description: 'Up to 3 illustrations + naming + lettering', criteria: 'DEFAULT for standalone projects' }
};
s['latte-art'].pricing.defaultVariant = 'full-pack';

// Punch Card
s['punch-card'].pricing.priceVariants = {
  'plan-a':          { price: 1800, description: 'Digital loyalty program: tiers, characters, copywriting', criteria: 'DEFAULT - digital-only loyalty' },
  'plan-b-stickers': { price: 2500, description: 'Digital + physical: sticker system, printed cards, POS materials', criteria: 'Physical retail with sticker collection' }
};
s['punch-card'].pricing.defaultVariant = 'plan-a';

// Pour Over — give it a base price now
s['pour-over'].pricing.priceVariants = {
  'single-animation':      { price: 350,   description: '1 Lottie animation or motion graphic', criteria: 'Web micro-interaction or icon animation' },
  'campaign-3-animations': { price: 2500,  description: '3 animations for multi-channel campaign', criteria: 'DEFAULT - social + web animation set' },
  'campaign-8-animations': { price: 12649, description: '8 animations, full 4K campaign package', criteria: 'Full broadcast/digital campaign' }
};
s['pour-over'].pricing.defaultVariant = 'campaign-3-animations';
s['pour-over'].pricing.basePrice = 2500;

// Espresso Shot
s['espresso-shot'].pricing.priceVariants = {
  'flodesk':         { price: 550,  description: 'Simple Flodesk landing, lead capture, Mailchimp', criteria: 'DEFAULT - quick campaign landing' },
  'webflow-landing': { price: 1200, description: 'Webflow landing with animations + custom design', criteria: 'Premium landing, brand showcase' }
};
s['espresso-shot'].pricing.defaultVariant = 'flodesk';


// ═══ 2. BUNDLE RULES FOR ORPHANS ═══

// Shakefront Full now includes Grinder and Rosetta
s['shakefront-full'].bundleRules.includes = ['milky-branding', 'silky-edits', 'the-grinder', 'rosetta'];
s['shakefront-full'].mutuallyExclusiveWith = ['shakefront-lite', 'espresso-shot'];

// Shakefront Lite
s['shakefront-lite'].mutuallyExclusiveWith = ['shakefront-full', 'espresso-shot'];

// The Grinder — included with Shakefront Full, The Brewery, Coffee Lab, free with Espresso Shot
s['the-grinder'].bundleRules = {
  includedWith: ['shakefront-full', 'the-brewery', 'coffee-lab'],
  freeWith: ['espresso-shot'],
  includes: []
};

// Rosetta — included with Shakefront Full
s['rosetta'].bundleRules = {
  includedWith: ['shakefront-full'],
  freeWith: [],
  includes: []
};

// Barista — promo with Shakefront
s['barista'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  promoWith: {
    'shakefront-full': { freeMonths: 2, description: '2 primeros meses gratis' },
    'shakefront-lite': { freeMonths: 1, description: 'Primer mes gratis' }
  }
};

// Cold Brew — discounted with Buttery, includes Silky Edits
s['cold-brew'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: ['silky-edits'],
  discountedWith: { 'buttery-1day': 900, 'buttery-3days': 900 }
};

// Espresso Shot — mutually exclusive with Shakefront, includes Grinder
s['espresso-shot'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: ['the-grinder']
};
s['espresso-shot'].mutuallyExclusiveWith = ['shakefront-full', 'shakefront-lite'];

// Sprinkles — discounted with Flashy Socials
s['sprinkles'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  discountedWith: { 'flashy-socials': 350 }
};

// Foam Art — discounted with Milky Branding
s['foam-art'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  discountedWith: { 'milky-branding': 1400 }
};

// Punch Card — includes Latte Art, discounted with Milky Branding
s['punch-card'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: ['latte-art'],
  discountedWith: { 'milky-branding': 1500 }
};

// Latte Art — freeWith Punch Card too
s['latte-art'].bundleRules.freeWith = ['milky-branding', 'punch-card'];

// Pour Over — discounted with Hot Press and Cold Brew
s['pour-over'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  discountedWith: { 'hot-press': '15%', 'cold-brew': '15%' }
};

// The Counter — addon to Shakefront, discounted
s['the-counter'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  discountedWith: { 'shakefront-full': '15%' },
  requiresOneOf: ['shakefront-full', 'shakefront-lite', 'espresso-shot']
};

// The Percolator — discounted with Brewery and Robo Barista
s['the-percolator'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  discountedWith: { 'the-brewery': '20%', 'robo-barista': '20%' }
};

// Robo Barista — discounted with Brewery and Percolator
s['robo-barista'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: [],
  discountedWith: { 'the-brewery': '15%', 'the-percolator': '20%' }
};

// The Brewery — includes The Grinder
s['the-brewery'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: ['the-grinder']
};

// Coffee Lab — includes Grinder, excludes Brewery
s['coffee-lab'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: ['the-grinder']
};
s['coffee-lab'].mutuallyExclusiveWith = ['the-brewery'];

// The Full Pot — includes core services, global 20% discount
s['the-full-pot'].bundleRules = {
  includedWith: [],
  freeWith: [],
  includes: ['milky-branding', 'shakefront-full', 'the-grinder', 'silky-edits', 'glass-cup'],
  globalDiscount: { percentage: 20, description: '20% off all other services when added to The Full Pot' }
};


// ═══ 3. UPDATE METADATA ═══
data.lastUpdated = '2026-03-20';
data.version = '3.0';

fs.writeFileSync('data/catalog/services.json', JSON.stringify(data, null, 2));
console.log('services.json updated to v3.0');
console.log('Total services:', Object.keys(s).length);

// Verify — count connections
let connected = new Set();
for (const [id, svc] of Object.entries(s)) {
  const br = svc.bundleRules || {};
  (br.includedWith || []).forEach(x => { connected.add(id); connected.add(x); });
  (br.freeWith || []).forEach(x => { connected.add(id); connected.add(x); });
  (br.includes || []).forEach(x => { connected.add(id); connected.add(x); });
  if (br.discountedWith) Object.keys(br.discountedWith).forEach(x => { connected.add(id); connected.add(x); });
  if (br.promoWith) Object.keys(br.promoWith).forEach(x => { connected.add(id); connected.add(x); });
  if (br.requiresOneOf) br.requiresOneOf.forEach(x => { connected.add(id); connected.add(x); });
  if (svc.mutuallyExclusiveWith) svc.mutuallyExclusiveWith.forEach(x => { connected.add(id); connected.add(x); });
}
const orphans = Object.keys(s).filter(id => !connected.has(id));
console.log('Connected:', connected.size, '/', Object.keys(s).length);
console.log('Remaining orphans:', orphans.length, orphans);
