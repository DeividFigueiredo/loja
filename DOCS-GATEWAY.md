# Gateway — Documentação

## O que é

O **Gateway** é um BFF (Backend For Frontend) que age como intermediário entre o `frontend/` (porta 5000) e as fontes de dados (Medusa ou Shopify).

Ele é **API-only**: não serve nenhuma interface HTML. Toda a UI fica em `frontend/`.

## Onde está montado

- **Arquivo:** `gateway/server.js`
- **Porta:** `3000` (configurável via `PORT` no `gateway/.env`)
- **Como iniciar:** `cd gateway && npm start`

## Endpoints expostos

| Método | Rota              | Descrição                              |
|--------|-------------------|----------------------------------------|
| GET    | `/`               | Health check — retorna status e endpoints disponíveis |
| GET    | `/api/products`   | Lista produtos do catálogo             |
| POST   | `/api/checkout`   | Cria carrinho/pedido e retorna URL de checkout |

Documentação detalhada:
- [`DOCS-GATEWAY-API-PRODUCTS.md`](./DOCS-GATEWAY-API-PRODUCTS.md)
- [`DOCS-GATEWAY-API-CHECKOUT.md`](./DOCS-GATEWAY-API-CHECKOUT.md)

## Decisão de fonte: Medusa vs Shopify

O gateway lê as variáveis `MEDUSA_BACKEND_URL` e `MEDUSA_PUBLISHABLE_KEY` de `gateway/.env`.

```javascript
// gateway/server.js
const useMedusa = (() => {
  try {
    const medusa = require('./medusa-api.js');
    return medusa.isConfigured && medusa.isConfigured();
  } catch {
    return false;
  }
})();
```

- Se `MEDUSA_BACKEND_URL` e `MEDUSA_PUBLISHABLE_KEY` estão preenchidos → usa **Medusa**
- Caso contrário → usa **Shopify**

## CORS

O gateway permite chamadas apenas de `http://localhost:5000` (ou do valor de `FRONTEND_URL` no `.env`).

```javascript
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
```

## Para outra IA entender este gateway

1. Leia `gateway/server.js` — ponto de entrada, roteamento, CORS
2. Leia `gateway/medusa-api.js` — funções `fetchProducts` e `createCheckout` para Medusa
3. Leia `gateway/shopify-api.js` — funções `fetchProducts` e `createDraftOrder` para Shopify
4. Leia `gateway/.env` — decide qual fonte está ativa (`MEDUSA_BACKEND_URL` + `MEDUSA_PUBLISHABLE_KEY`)
5. O health check `GET /` retorna JSON com status atual e endpoints disponíveis
