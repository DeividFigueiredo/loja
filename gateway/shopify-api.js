/**
 * Shopify Admin API helpers (shared by api.js and server).
 */
require('dotenv').config();

const SHOP = process.env.SHOPIFY_SHOP || 'dindinhas';
const ACCESS_TOKEN_FIXO = process.env.SHOPIFY_ACCESS_TOKEN;
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

async function getAccessToken() {
  if (ACCESS_TOKEN_FIXO) return ACCESS_TOKEN_FIXO;
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Defina SHOPIFY_CLIENT_ID e SHOPIFY_CLIENT_SECRET ou SHOPIFY_ACCESS_TOKEN no .env');
  }
  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    }
  );
  if (!res.ok) throw new Error(`Token falhou (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.access_token;
}

async function fetchProducts(limit = 24) {
  const token = await getAccessToken();
  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `
          query GetProducts($first: Int!) {
            products(first: $first) {
              edges {
                node {
                  id
                  title
                  descriptionHtml
                  featuredImage { url }
                  variants(first: 100) {
                    edges {
                      node {
                        id
                        title
                        price
                        compareAtPrice
                        availableForSale
                        selectedOptions {
                          name
                          value
                        }
                        image { url }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { first: limit },
      }),
    }
  );
  if (!res.ok) throw new Error(`API falhou (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (json.errors?.length) throw new Error('GraphQL: ' + JSON.stringify(json.errors));
  return json.data.products.edges.map((e) => ({
    ...e.node,
    variants: (e.node.variants?.edges || []).map((v) => v.node),
  }));
}

async function graphqlAdmin(token, query, variables = {}) {
  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  if (!res.ok) throw new Error(`API falhou (${res.status}): ${await res.text()}`);
  return res.json();
}

async function getDraftOrderInvoiceUrl(token, draftOrderId) {
  const json = await graphqlAdmin(token, `
    query getDraftOrder($id: ID!) {
      draftOrder(id: $id) {
        invoiceUrl
      }
    }
  `, { id: draftOrderId });
  return json.data?.draftOrder?.invoiceUrl || null;
}

/**
 * Cria um draft order e retorna a URL de pagamento (invoice).
 * A Shopify pode gerar a invoiceUrl de forma assíncrona; tentamos obtê-la após criar e, se tiver e-mail, após enviar a fatura.
 * Requer escopo write_draft_orders no app.
 */
async function createDraftOrder(input) {
  const token = await getAccessToken();
  const inputPayload = {
    lineItems: input.lineItems.map((item) => ({
      variantId: String(item.variantId).trim(),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
    })),
    ...(input.email && { email: String(input.email).trim() }),
  };

  const createRes = await graphqlAdmin(token, `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id invoiceUrl }
        userErrors { field message }
      }
    }
  `, { input: inputPayload });

  if (createRes.errors?.length) {
    const msg = createRes.errors.map((e) => e.message).join('; ');
    throw new Error(msg || 'Erro ao criar pedido (GraphQL).');
  }

  const err = createRes.data?.draftOrderCreate?.userErrors;
  if (err?.length) throw new Error(err.map((e) => e.message).join('; '));
  const draft = createRes.data?.draftOrderCreate?.draftOrder;
  if (!draft?.id) {
    const extra = createRes.data?.draftOrderCreate ? '' : ' (verifique o escopo write_draft_orders no app)';
    throw new Error('Draft order não foi criado.' + extra);
  }

  let invoiceUrl = draft.invoiceUrl || null;

  if (!invoiceUrl) {
    await new Promise((r) => setTimeout(r, 800));
    invoiceUrl = await getDraftOrderInvoiceUrl(token, draft.id);
  }

  if (!invoiceUrl && input.email) {
    const sendRes = await graphqlAdmin(token, `
      mutation draftOrderInvoiceSend($id: ID!) {
        draftOrderInvoiceSend(id: $id) {
          draftOrder { invoiceUrl }
          userErrors { message }
        }
      }
    `, { id: draft.id });
    if (!sendRes.data?.draftOrderInvoiceSend?.userErrors?.length) {
      invoiceUrl = sendRes.data?.draftOrderInvoiceSend?.draftOrder?.invoiceUrl || null;
    }
    if (!invoiceUrl) {
      await new Promise((r) => setTimeout(r, 500));
      invoiceUrl = await getDraftOrderInvoiceUrl(token, draft.id);
    }
  }

  if (!invoiceUrl) {
    const adminDraftUrl = `https://${SHOP}.myshopify.com/admin/draft_orders/${draft.id.replace('gid://shopify/DraftOrder/', '')}`;
    throw new Error(
      'A URL de pagamento ainda não está disponível. ' +
      (input.email
        ? 'O link de checkout foi enviado para o e-mail informado. Confira a caixa de entrada.'
        : 'Informe seu e-mail no carrinho e clique em "Ir para pagamento" de novo para receber o link por e-mail. ' +
          'Ou acesse o pedido rascunho no admin: ' + adminDraftUrl)
    );
  }

  return { invoiceUrl, draftOrderId: draft.id };
}

module.exports = { getAccessToken, fetchProducts, createDraftOrder };
