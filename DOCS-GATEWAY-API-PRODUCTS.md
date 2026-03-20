# Gateway — `GET /api/products`

## Descrição

Retorna a lista de produtos do catálogo. O gateway delega para Medusa ou Shopify conforme configuração.

## Request

```
GET http://localhost:3000/api/products?limit=24
```

| Query param | Tipo    | Padrão | Máximo | Descrição              |
|-------------|---------|--------|--------|------------------------|
| `limit`     | inteiro | `24`   | `50`   | Quantidade de produtos |

## Response (200 OK)

Array de produtos no formato unificado (compatível Shopify/Medusa):

```json
[
  {
    "id": "prod_01J...",
    "title": "Nome do Produto",
    "descriptionHtml": "<p>Descrição...</p>",
    "featuredImage": { "url": "https://..." },
    "variants": [
      {
        "id": "variant_01J...",
        "title": "Default Title",
        "price": "99.90",
        "compareAtPrice": null,
        "availableForSale": true,
        "selectedOptions": [{ "name": "Tamanho", "value": "M" }],
        "image": { "url": "https://..." }
      }
    ]
  }
]
```

## Response (500)

```json
{ "error": "Mensagem de erro" }
```

## Processamento

### Quando `useMedusa = true` (`gateway/medusa-api.js`)

1. Chama `GET /store/regions` no Medusa para obter o `region_id`
2. Chama `GET /store/products?region_id=...&fields=*variants,...` com o header `x-publishable-api-key`
3. Mapeia cada produto via `mapProduct()` para o formato unificado (preço em centavos → reais)

### Quando `useMedusa = false` (`gateway/shopify-api.js`)

1. Obtém access token (fixo via `SHOPIFY_ACCESS_TOKEN` ou via OAuth com `CLIENT_ID`/`CLIENT_SECRET`)
2. Executa query GraphQL `GetProducts` na API Admin do Shopify
3. Retorna os produtos diretamente no formato do Shopify (já compatível)
