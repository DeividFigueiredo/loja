/**
 * Lista produtos da loja Shopify (script de teste).
 * Rode: node api.js
 */
const { fetchProducts } = require('./shopify-api.js');

fetchProducts(5)
  .then((products) => {
    console.log('Produtos:', JSON.stringify(products, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
