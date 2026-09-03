#!/usr/bin/env node
/**
 * bootstrap-store.mjs — One-command store structure for the base theme.
 *
 * Creates (idempotently) everything a new store needs so the theme's metafield-
 * driven sections and footer menus work:
 *   • Metaobject definitions:  feature, faq_item, review
 *   • Product metafield defs:   custom.subtitle, badge_text, size_chart, usp,
 *                               benefits, faq, reviews
 *   • Navigation menus:         footer-shop, footer-help, footer-company
 *
 * Usage:
 *   SHOPIFY_STORE=your-store.myshopify.com \
 *   SHOPIFY_TOKEN=shpat_xxx \
 *   node scripts/bootstrap-store.mjs
 *
 * Get SHOPIFY_TOKEN: Admin → Settings → Apps and sales channels → Develop apps →
 *   Create an app → Admin API access scopes: write_products, write_content,
 *   write_online_store_navigation, write_metaobject_definitions, write_metaobjects →
 *   Install → reveal the Admin API access token.
 *
 * Safe to re-run: existing definitions/menus are detected and skipped.
 */

const STORE = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;
const API = '2025-01';

if (!STORE || !TOKEN) {
  console.error('✗ Set SHOPIFY_STORE and SHOPIFY_TOKEN env vars. See header for details.');
  process.exit(1);
}

const endpoint = `https://${STORE.replace(/^https?:\/\//, '')}/admin/api/${API}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

// ---- Metaobject definitions -------------------------------------------------
const METAOBJECTS = [
  { type: 'feature', name: 'Feature', fields: [
    { key: 'icon', name: 'Icon', type: 'single_line_text_field' },
    { key: 'title', name: 'Title', type: 'single_line_text_field' },
    { key: 'text', name: 'Text', type: 'multi_line_text_field' },
  ]},
  { type: 'faq_item', name: 'FAQ item', fields: [
    { key: 'question', name: 'Question', type: 'single_line_text_field' },
    { key: 'answer', name: 'Answer', type: 'multi_line_text_field' },
  ]},
  { type: 'review', name: 'Review', fields: [
    { key: 'author', name: 'Author', type: 'single_line_text_field' },
    { key: 'rating', name: 'Rating', type: 'number_decimal' },
    { key: 'text', name: 'Text', type: 'multi_line_text_field' },
    { key: 'avatar', name: 'Avatar', type: 'file_reference' },
    { key: 'badge', name: 'Badge', type: 'single_line_text_field' },
  ]},
];

async function ensureMetaobjectDefs() {
  const ids = {};
  for (const def of METAOBJECTS) {
    const existing = await gql(
      `query($t:String!){ metaobjectDefinitionByType(type:$t){ id } }`, { t: def.type });
    if (existing.metaobjectDefinitionByType) {
      ids[def.type] = existing.metaobjectDefinitionByType.id;
      console.log(`= metaobject '${def.type}' exists`);
      continue;
    }
    const r = await gql(
      `mutation($d:MetaobjectDefinitionCreateInput!){ metaobjectDefinitionCreate(definition:$d){ metaobjectDefinition{ id } userErrors{ message } } }`,
      { d: { name: def.name, type: def.type, fieldDefinitions: def.fields } });
    const err = r.metaobjectDefinitionCreate.userErrors;
    if (err.length) { console.log(`! metaobject '${def.type}': ${err[0].message}`); continue; }
    ids[def.type] = r.metaobjectDefinitionCreate.metaobjectDefinition.id;
    console.log(`+ metaobject '${def.type}' created`);
  }
  return ids;
}

// ---- Product metafield definitions ------------------------------------------
function metafieldDefs(moIds) {
  return [
    { name: 'Subtitle', key: 'subtitle', type: 'single_line_text_field' },
    { name: 'Badge text', key: 'badge_text', type: 'single_line_text_field' },
    { name: 'Size chart', key: 'size_chart', type: 'json' },
    { name: 'USP list', key: 'usp', type: 'list.single_line_text_field' },
    { name: 'Benefits', key: 'benefits', type: 'list.metaobject_reference',
      validations: [{ name: 'metaobject_definition_id', value: moIds.feature }] },
    { name: 'FAQ items', key: 'faq', type: 'list.metaobject_reference',
      validations: [{ name: 'metaobject_definition_id', value: moIds.faq_item }] },
    { name: 'Reviews', key: 'reviews', type: 'list.metaobject_reference',
      validations: [{ name: 'metaobject_definition_id', value: moIds.review }] },
  ];
}

async function ensureMetafieldDefs(moIds) {
  for (const def of metafieldDefs(moIds)) {
    const input = { name: def.name, namespace: 'custom', key: def.key, type: def.type, ownerType: 'PRODUCT' };
    if (def.validations) input.validations = def.validations;
    const r = await gql(
      `mutation($d:MetafieldDefinitionInput!){ metafieldDefinitionCreate(definition:$d){ createdDefinition{ id } userErrors{ code message } } }`,
      { d: input });
    const err = r.metafieldDefinitionCreate.userErrors;
    if (err.length) {
      console.log(err[0].code === 'TAKEN'
        ? `= metafield 'custom.${def.key}' exists`
        : `! metafield 'custom.${def.key}': ${err[0].message}`);
    } else {
      console.log(`+ metafield 'custom.${def.key}' created`);
    }
  }
}

// ---- Navigation menus -------------------------------------------------------
const MENUS = [
  { title: 'Shop', handle: 'footer-shop', items: [
    { title: 'All Products', type: 'HTTP', url: '/collections/all' },
    { title: 'Best Sellers', type: 'HTTP', url: '/collections/all' },
    { title: 'New Arrivals', type: 'HTTP', url: '/collections/all' },
    { title: 'Track Your Order', type: 'HTTP', url: '/pages/contact' },
  ]},
  { title: 'Customer Care', handle: 'footer-help', items: [
    { title: 'FAQ', type: 'HTTP', url: '/pages/faq' },
    { title: 'Shipping & Returns', type: 'HTTP', url: '/pages/shipping-returns' },
    { title: 'Size Guide', type: 'HTTP', url: '/pages/size-guide' },
    { title: 'Contact Support', type: 'HTTP', url: '/pages/contact' },
  ]},
  { title: 'About', handle: 'footer-company', items: [
    { title: 'Our Story', type: 'HTTP', url: '/pages/about-us' },
    { title: 'Reviews', type: 'HTTP', url: '/collections/all' },
    { title: 'Contact', type: 'HTTP', url: '/pages/contact' },
  ]},
];

async function ensureMenus() {
  const existing = await gql(`{ menus(first:50){ nodes{ handle } } }`);
  const have = new Set(existing.menus.nodes.map((m) => m.handle));
  for (const menu of MENUS) {
    if (have.has(menu.handle)) { console.log(`= menu '${menu.handle}' exists`); continue; }
    const r = await gql(
      `mutation($t:String!,$h:String!,$i:[MenuItemCreateInput!]!){ menuCreate(title:$t,handle:$h,items:$i){ menu{ handle } userErrors{ message } } }`,
      { t: menu.title, h: menu.handle, i: menu.items });
    const err = r.menuCreate.userErrors;
    console.log(err.length ? `! menu '${menu.handle}': ${err[0].message}` : `+ menu '${menu.handle}' created`);
  }
}

// ---- Run --------------------------------------------------------------------
(async () => {
  console.log(`\nBootstrapping ${STORE} …\n`);
  console.log('Metaobject definitions:');
  const moIds = await ensureMetaobjectDefs();
  console.log('\nProduct metafield definitions:');
  await ensureMetafieldDefs(moIds);
  console.log('\nNavigation menus:');
  await ensureMenus();
  console.log('\n✓ Done. Next: import products (CSV), assign product Theme templates,\n  connect products/collections to sections, pick a color preset, add media.\n');
})().catch((e) => { console.error('✗', e.message); process.exit(1); });
