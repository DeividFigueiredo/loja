# Onde fica cada `.env`

## Estrutura

```
shopfytestes/
├── gateway/
│   ├── .env             ← variáveis do Gateway (porta 3000)
│   └── .env.example     ← modelo sem segredos
│
├── backend/             ← Medusa (e-commerce, porta 9000)
│   └── .env             ← DATABASE_URL, JWT_SECRET, CORS, etc.
│
└── frontend/
    └── .env             ← PORT=5000
```

## O que vai em cada arquivo

### `gateway/.env`

```env
# Fonte de dados: Medusa tem prioridade se ambas estiverem preenchidas
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=pk_xxxxx
MEDUSA_STOREFRONT_URL=http://localhost:5000

# Shopify (usado quando Medusa não está configurado)
SHOPIFY_SHOP=nomeDaLoja
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx
# ou SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET
```

### `backend/.env`

```env
DATABASE_URL=postgresql://medusa:senha@localhost:5432/medusa
REDIS_URL=redis://localhost:6379
JWT_SECRET=segredo_forte
COOKIE_SECRET=segredo_forte

# CORS — quem pode chamar o Medusa
STORE_CORS=http://localhost:5000,http://localhost:8000
ADMIN_CORS=http://localhost:5000,http://localhost:5173,http://localhost:9000
AUTH_CORS=http://localhost:5000,http://localhost:5173,http://localhost:9000,http://localhost:8000
```

### `frontend/.env`

```env
PORT=5000
```

## Regras rápidas

| Variável             | Onde fica          | Commitar? |
|----------------------|--------------------|-----------|
| `DATABASE_URL`       | `backend/.env`     | **NÃO**   |
| `JWT_SECRET`         | `backend/.env`     | **NÃO**   |
| `MEDUSA_PUBLISHABLE_KEY` | `gateway/.env` | **NÃO**   |
| `SHOPIFY_ACCESS_TOKEN` | `gateway/.env`   | **NÃO**   |
| `SHOPIFY_CLIENT_SECRET` | `gateway/.env`  | **NÃO**   |
| `PORT=5000`          | `frontend/.env`    | pode      |
| `.env.example`       | `gateway/`         | **SIM**   |
