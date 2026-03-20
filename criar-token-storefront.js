/**
 * Rode UMA VEZ com o token da Admin API para criar um token da Storefront API.
 * Uso: node criar-token-storefront.js SEU_ADMIN_TOKEN
 *
 * O token da Admin API você pega em: loja → Configurações → Apps → Desenvolver apps
 * → criar app → Admin API integration → Instalar app → copiar o token.
 */

const ADMIN_TOKEN = process.argv[2];
if (!ADMIN_TOKEN) {
  console.log('Uso: node criar-token-storefront.js SEU_ADMIN_TOKEN');
  console.log('Pegue o Admin token em: Configurações → Apps → Desenvolver apps → seu app → Instalar app');
  process.exit(1);
}

const SHOP = 'dindinhas.myshopify.com';

fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ADMIN_TOKEN,
  },
  body: JSON.stringify({
    query: `
      mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
        storefrontAccessTokenCreate(input: $input) {
          userErrors { field message }
          storefrontAccessToken {
            accessToken
            title
          }
        }
      }
    `,
    variables: {
      input: { title: 'Token para api.js' },
    },
  }),
})
  .then((res) => res.json())
  .then((data) => {
    const err = data?.data?.storefrontAccessTokenCreate?.userErrors;
    const token = data?.data?.storefrontAccessTokenCreate?.storefrontAccessToken;
    if (err?.length) {
      console.error('Erro:', err);
      process.exit(1);
    }
    if (token?.accessToken) {
      console.log('\n--- Token da Storefront API (cole no api.js) ---\n');
      console.log(token.accessToken);
      console.log('\n--- Coloque no header: X-Shopify-Storefront-Access-Token ---\n');
    } else {
      console.error('Resposta inesperada:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error('Falha na requisição:', e.message);
    process.exit(1);
  });
