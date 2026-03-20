/**
 * Gateway (data gateway / BFF) — API-only, porta 3000.
 *
 * Responsabilidades:
 *  - Expõe `GET /api/products` e `POST /api/checkout`
 *  - Decide Medusa vs Shopify conforme variáveis de ambiente
 *  - Normaliza os dados para o formato esperado pelo frontend (porta 5000)
 *
 * NÃO serve nenhuma interface HTML — isso é responsabilidade do frontend/.
 *
 * Run: `node server.js` → API disponível em http://localhost:3000
 */
require('dotenv').config();
const express = require('express');

const useMedusa = (() => {
  try {
    const medusa = require('./medusa-api.js');
    return medusa.isConfigured && medusa.isConfigured();
  } catch {
    return false;
  }
})();

const shopifyApi = useMedusa ? null : require('./shopify-api.js');
const medusaApi = useMedusa ? require('./medusa-api.js') : null;

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/', (req, res) => {
  res.json({
    status: 'gateway',
    source: useMedusa ? 'Medusa' : 'Shopify',
    endpoints: [
      { method: 'GET',  path: '/api/products', description: 'Lista produtos do catálogo' },
      { method: 'POST', path: '/api/checkout', description: 'Cria pedido/checkout' },
    ],
  });
});

app.get('/api/products', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 24, 50);
    const products = useMedusa
      ? await medusaApi.fetchProducts(limit)
      : await shopifyApi.fetchProducts(limit);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Falha ao carregar produtos' });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const { lineItems, email } = req.body || {};
    if (!Array.isArray(lineItems) || !lineItems.length) {
      return res.status(400).json({ error: 'Envie lineItems: [{ variantId, quantity }]' });
    }
    const valid = lineItems.every(
      (item) => item && (item.variantId || item.variant_id) && Number(item.quantity ?? item.qty) > 0
    );
    if (!valid) {
      return res.status(400).json({ error: 'Cada item deve ter variantId e quantity (número > 0)' });
    }
    const normalized = lineItems.map((i) => ({ variantId: i.variantId || i.variant_id, quantity: i.quantity ?? i.qty }));

    if (useMedusa) {
      const { invoiceUrl } = await medusaApi.createCheckout({ lineItems: normalized, email });
      return res.json({ invoiceUrl });
    }
    const { invoiceUrl } = await shopifyApi.createDraftOrder({ lineItems: normalized, email });
    res.json({ invoiceUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Erro ao criar pedido' });
  }
});

app.listen(PORT, () => {
  console.log(
    `Gateway (API-only) em http://localhost:${PORT} | Fonte: ${useMedusa ? 'Medusa' : 'Shopify'}`
  );
});
