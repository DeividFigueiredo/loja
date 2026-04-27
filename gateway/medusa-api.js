/**
 * Medusa Store API: produtos e carrinho para o frontend.
 * Use com server.js quando MEDUSA_BACKEND_URL e MEDUSA_PUBLISHABLE_KEY estiverem no .env.
 */
require('dotenv').config();

const BACKEND = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const PUBLISHABLE_KEY = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
const STOREFRONT_URL = process.env.MEDUSA_STOREFRONT_URL || 'http://localhost:5000';
const DEFAULT_COUNTRY = (process.env.NEXT_PUBLIC_DEFAULT_REGION || 'br').toLowerCase();

function normalizeAssetUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url, BACKEND || undefined);
    const backend = BACKEND ? new URL(BACKEND) : null;

    if (backend && parsed.origin === backend.origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-publishable-api-key': PUBLISHABLE_KEY || '',
});

async function getRegions() {
  const res = await fetch(`${BACKEND}/store/regions`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Regiões: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.regions || [];
}

async function getFirstRegionId() {
  const regions = await getRegions();
  if (!regions.length) return null;
  const byCountry = regions.find((r) =>
    r.countries?.some((c) => (c.iso_2 || '').toLowerCase() === DEFAULT_COUNTRY)
  );
  const region = byCountry || regions[0];
  return region?.id;
}

/**
 * Formato esperado pelo frontend (compatível com Shopify):
 * { id, title, descriptionHtml, featuredImage?: { url }, variants: [ { id, title, price, compareAtPrice, availableForSale, selectedOptions: [ { name, value } ], image?: { url } } ] }
 */
function toImageUrl(img) {
  if (!img) return null;
  if (typeof img === 'string') return normalizeAssetUrl(img);
  return normalizeAssetUrl(img.url || img.src || null);
}

function pickVariantImageUrl(variant, product, fallbackIndex) {
  const vImages = Array.isArray(variant?.images) ? variant.images : [];
  const pImages = Array.isArray(product?.images) ? product.images : [];

  // Fonte de verdade: imagem explicitamente vinculada à variante.
  const explicitVariantImage = vImages.find((img) =>
    Array.isArray(img?.variants) && img.variants.some((ref) => ref?.id === variant?.id)
  );
  if (explicitVariantImage) {
    const url = toImageUrl(explicitVariantImage);
    if (url) return url;
  }

  // Fallback 1: primeira imagem já retornada para a variante.
  const firstVariantImage = toImageUrl(vImages[0]);
  if (firstVariantImage) return firstVariantImage;

  // Fallback 2: imagem do produto por rank/índice.
  const rankedProductImage = toImageUrl(pImages[fallbackIndex]);
  if (rankedProductImage) return rankedProductImage;

  // Fallback 3: primeira imagem do produto.
  return toImageUrl(pImages[0]) || null;
}

function mapProduct(p) {
  const thumbnail = p.thumbnail || p.images?.[0];
  const featuredUrl = toImageUrl(thumbnail);
  const featuredImage = featuredUrl ? { url: featuredUrl } : null;

  const images = (p.images || [])
    .map((img) => toImageUrl(img))
    .filter(Boolean)
    .map((url) => ({ url }));
  if (!images.length && featuredUrl) {
    images.push({ url: featuredUrl });
  }

  const variants = (p.variants || []).map((v, idx) => {
    const calc = v.calculated_price;
    let amount = calc?.calculated_amount ?? calc?.amount;
    if (amount == null && Array.isArray(v.prices) && v.prices.length > 0) {
      amount = v.prices[0].amount ?? v.prices[0].calculated_amount;
    }
    amount = Number(amount) || 0;
    const price = amount > 0 ? String((amount / 100).toFixed(2)) : '0.00';
    const optList = (v.options || []).map((o) => ({
      name: (o.option && (o.option.title || o.option.name)) || 'Option',
      value: o.value || '',
    }));
    const title = optList.length ? optList.map((o) => o.value).join(' / ') : 'Default Title';
    const inStock = v.manage_inventory
      ? (v.inventory_quantity ?? 0) > 0 || v.allow_backorder
      : true;
    const imageIndex = Number.isInteger(v.variant_rank) ? v.variant_rank : idx;
    const imgUrl = pickVariantImageUrl(v, p, imageIndex) || featuredUrl;
    return {
      id: v.id,
      title,
      price,
      prices: [{ amount }],
      compareAtPrice: null,
      availableForSale: inStock,
      selectedOptions: optList,
      variantRank: imageIndex,
      image: imgUrl ? { url: imgUrl } : null,
    };
  });

  return {
    id: p.id,
    title: p.title || '',
    description: p.description || '',
    descriptionHtml: p.description || '',
    images,
    collection: p.collection ? { title: p.collection.title || '' } : null,
    type: p.type ? { value: p.type.value || '' } : null,
    featuredImage,
    variants,
  };
}

async function fetchProducts(limit = 24) {
  const regionId = await getFirstRegionId();
  const url = new URL(`${BACKEND}/store/products`);
  url.searchParams.set('limit', String(Math.min(limit, 50)));
  if (regionId) {
    url.searchParams.set('region_id', regionId);
  }
  url.searchParams.set(
    'fields',
    '*collection,*type,*images,*variants,*variants.calculated_price,*variants.prices,*variants.options,*variants.images,*options,+variants.inventory_quantity'
  );

  const res = await fetch(url.toString(), {
    headers: headers(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Produtos: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const products = data.products || [];
  return products.map((p) => mapProduct(p));
}

async function createCart(regionId) {
  const res = await fetch(`${BACKEND}/store/carts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ region_id: regionId }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Criar carrinho: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const cart = data.cart || data;
  if (!cart.id) throw new Error('Resposta do carrinho sem id');
  return cart.id;
}

async function addLineItem(cartId, variantId, quantity) {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const body = { variant_id: String(variantId).trim(), quantity: qty };
  const res = await fetch(`${BACKEND}/store/carts/${cartId}/line-items`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = text;
    try {
      const j = JSON.parse(text);
      msg = j.message || j.code || text;
    } catch (_) {}
    throw new Error(`Adicionar item ao carrinho: ${msg}. Verifique se o produto está no sales channel da chave e se a região do carrinho tem a moeda do produto.`);
  }
}

/**
 * Cria carrinho no Medusa, adiciona itens e retorna URL do checkout no frontend.
 */
async function createCheckout({ lineItems, email }) {
  if (!Array.isArray(lineItems) || !lineItems.length) {
    throw new Error('lineItems é obrigatório e deve ser um array não vazio.');
  }
  const regionId = await getFirstRegionId();
  const cartId = await createCart(regionId);

  for (const item of lineItems) {
    const variantId = item.variantId || item.variant_id;
    const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
    if (variantId) await addLineItem(cartId, variantId, qty);
  }

  const country = DEFAULT_COUNTRY;
  const checkoutPath = `/${country}/checkout`;
  const checkoutUrl = `${STOREFRONT_URL}${checkoutPath}?cart_id=${encodeURIComponent(cartId)}`;
  return { invoiceUrl: checkoutUrl, cartId };
}

function isConfigured() {
  return !!(BACKEND && PUBLISHABLE_KEY);
}

module.exports = {
  isConfigured,
  fetchProducts,
  createCheckout,
  getRegions,
};
