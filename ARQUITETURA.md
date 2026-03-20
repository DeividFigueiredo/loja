# Arquitetura do Projeto — LojaVirtual

Este projeto tem 3 partes independentes:

| Parte       | Pasta        | Porta | Tecnologia            | Função                                    |
|-------------|--------------|-------|-----------------------|-------------------------------------------|
| **gateway** | `gateway/`   | 3000  | Express.js (Node)     | API-only: decide Medusa vs Shopify, normaliza dados |
| **backend** | `backend/`   | 9000  | Medusa v2 (Node/TS)   | Motor de e-commerce headless, banco de dados, admin |
| **frontend**| `frontend/`  | 5000  | Express.js (estático) | Serve a UI da loja (`public/index.html`)  |

## Estrutura de pastas

```
shopfytestes/               ← package name: "lojavirtual"
├── gateway/                ← porta 3000 — só API
│   ├── server.js           ← ponto de entrada
│   ├── medusa-api.js       ← helpers Medusa Store API
│   ├── shopify-api.js      ← helpers Shopify Admin API
│   ├── api.js              ← script de teste (node api.js)
│   ├── package.json        ← name: "gateway"
│   └── .env                ← variáveis do gateway
├── backend/                ← porta 9000 — Medusa
│   ├── src/
│   ├── medusa-config.ts
│   ├── package.json        ← name: "backend"
│   └── .env                ← DATABASE_URL, CORS, secrets
├── frontend/               ← porta 5000 — UI customizada
│   ├── server.js           ← Express estático simples
│   ├── public/
│   │   └── index.html      ← interface da loja
│   ├── package.json        ← name: "frontend"
│   └── .env                ← PORT=5000
└── package.json            ← name: "lojavirtual", scripts raiz
```

## Fluxo de dados

```
Usuário (browser :5000)
    │
    │  GET / (HTML)
    ▼
frontend/ (Express :5000)
    │
    │  GET http://localhost:3000/api/products
    │  POST http://localhost:3000/api/checkout
    ▼
gateway/ (Express :3000)
    │
    ├── useMedusa=true  ──▶  backend/ (Medusa :9000)
    └── useMedusa=false ──▶  Shopify API (cloud)
```

## Como rodar

```powershell
# Terminal 1 — backend Medusa (porta 9000)
cd "c:\Users\weslan.siqueira\Projetos\shopfytestes\backend"
npm run dev

# Terminal 2 — gateway API (porta 3000)
cd "c:\Users\weslan.siqueira\Projetos\shopfytestes\gateway"
npm install   # apenas na primeira vez
npm start

# Terminal 3 — frontend (porta 5000)
cd "c:\Users\weslan.siqueira\Projetos\shopfytestes\frontend"
npm install   # apenas na primeira vez
npm start
```

Acesso:
- **Loja (UI):** `http://localhost:5000`
- **Gateway (health check):** `http://localhost:3000`
- **Gateway API produtos:** `http://localhost:3000/api/products`
- **Medusa Admin:** `http://localhost:9000/app`

## Decisão Medusa vs Shopify

O gateway lê as variáveis `MEDUSA_BACKEND_URL` e `MEDUSA_PUBLISHABLE_KEY` do `gateway/.env`.
Se ambas estiverem preenchidas e a função `isConfigured()` retornar `true`, usa Medusa.
Caso contrário, cai para Shopify.

## Documentação detalhada

- [`DOCS-GATEWAY.md`](./DOCS-GATEWAY.md) — Gateway: papel, montagem, decisão de fonte
- [`DOCS-GATEWAY-API-PRODUCTS.md`](./DOCS-GATEWAY-API-PRODUCTS.md) — Endpoint `GET /api/products`
- [`DOCS-GATEWAY-API-CHECKOUT.md`](./DOCS-GATEWAY-API-CHECKOUT.md) — Endpoint `POST /api/checkout`
- [`ENV-ONDE-FICA.md`](./ENV-ONDE-FICA.md) — Onde fica cada `.env` e sua função
- [`MEDUSA-SETUP.md`](./MEDUSA-SETUP.md) — Guia de setup do Medusa
- [`MERCADO-PAGO-MEDUSA.md`](./MERCADO-PAGO-MEDUSA.md) — Integração Mercado Pago
