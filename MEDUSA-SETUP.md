# Migrar para Medusa (produtos + pagamentos)

Você vai usar **Medusa** como backend: cadastro de produtos e gestão de pagamentos. O `create-medusa-app` cria um projeto novo (backend + opcionalmente storefront).

## Pré-requisitos

1. **Node.js** 18+ (recomendado 20+)
2. **PostgreSQL** instalado e rodando (o Medusa usa Postgres)
3. **Git**

## 1. Criar o projeto Medusa

Rode **fora** da pasta `shopfytestes` (para não misturar com o projeto atual):

```bash
cd C:\Users\weslan.siqueira\Projetos
npx create-medusa-app@latest
```

Quando perguntar:

- **Project name:** por exemplo `medusa-loja` (ou o nome que quiser)
- **Admin email:** e-mail para acessar o painel admin (ex.: seu@email.com)
- **Starter storefront (Next.js):** pode escolher **No** se quiser usar depois o front que já temos; ou **Yes** para um storefront pronto
- **Database:** se tiver PostgreSQL local, use as credenciais (usuário/senha). Senha padrão costuma ser `postgres`

## 2. O que o Medusa instala

- **Backend** (API): produtos, carrinhos, checkout, pagamentos, admin
- **Admin dashboard:** em `http://localhost:9000/app` (após subir o projeto)
- **Storefront (opcional):** se escolheu o starter Next.js

## 3. Depois de criar o projeto

```bash
cd medusa-loja   # ou o nome que você deu
npm run dev      # ou pnpm dev / yarn dev
```

- **API:** normalmente em `http://localhost:9000`
- **Admin:** `http://localhost:9000/app`

No admin você:
- Cadastra produtos e variantes
- Configura regiões, frete e **formas de pagamento** (Stripe, manual, etc.)

## 4. Integrar com o frontend atual (shopfytestes)

Quando o Medusa estiver rodando, dá para **trocar** as chamadas da Shopify pelas do Medusa no seu app:

- **Produtos:** `GET http://localhost:9000/store/products`
- **Carrinho / checkout:** API Store do Medusa (criar cart, adicionar itens, completar pagamento)

Se quiser, no próximo passo podemos adaptar o `server.js` e o front para usar a API do Medusa em vez da Shopify.

## 5. Interface em português (pt-BR)

### Admin (painel)
O painel do Medusa suporta **português (pt-BR)**. Para usar:
1. Acesse o Admin (ex.: `http://localhost:9000/app`) e faça login.
2. Vá em **Configurações** (Settings) da loja.
3. Escolha **Português** na lista de idiomas. A preferência fica salva no navegador para o seu usuário.

### frontend-site
O frontend-site do projeto **shopteste-storefront** foi traduzido para pt-BR: navegação, carrinho, checkout, pedidos, formulários e mensagens estão em português.

## 6. Se não tiver PostgreSQL

- **Windows:** instale pelo [site do PostgreSQL](https://www.postgresql.org/download/windows/) ou use [Docker](https://docs.docker.com/desktop/install/windows-install/) e um container Postgres.
- **Alternativa na nuvem:** Supabase ou Vercel Postgres (grátis) e use `--db-url` no create-medusa-app (veja a doc do Medusa).
