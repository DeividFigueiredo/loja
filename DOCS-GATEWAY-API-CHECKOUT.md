# Gateway — `POST /api/checkout`

## Descrição

Cria um pedido/carrinho e retorna a URL de redirecionamento para o checkout.

## Request

```
POST http://localhost:3000/api/checkout
Content-Type: application/json
```

```json
{
  "lineItems": [
    { "variantId": "variant_01J...", "quantity": 2 }
  ],
  "email": "cliente@exemplo.com"
}
```

| Campo        | Tipo   | Obrigatório | Descrição                          |
|--------------|--------|-------------|-------------------------------------|
| `lineItems`  | array  | **sim**     | Lista de itens (mín. 1 elemento)   |
| `lineItems[].variantId` | string | **sim** | ID da variante do produto |
| `lineItems[].quantity`  | number | **sim** | Quantidade (> 0)          |
| `email`      | string | não         | E-mail do cliente (opcional)       |

## Response (200 OK)

```json
{ "invoiceUrl": "https://..." }
```

O frontend redireciona o usuário para `invoiceUrl`.

## Response (400)

```json
{ "error": "Envie lineItems: [{ variantId, quantity }]" }
```

## Response (500)

```json
{ "error": "Mensagem de erro" }
```

## Processamento

### Quando `useMedusa = true` (`gateway/medusa-api.js`)

1. Obtém `region_id` via `GET /store/regions`
2. Cria carrinho via `POST /store/carts` com o `region_id`
3. Adiciona cada item via `POST /store/carts/:id/line-items`
4. Retorna URL: `http://localhost:5000/br/checkout?cart_id=<cartId>`

### Quando `useMedusa = false` (`gateway/shopify-api.js`)

1. Obtém access token
2. Cria draft order via mutation GraphQL `draftOrderCreate`
3. Aguarda `invoiceUrl` (pode ser assíncrono — tenta até 3 vezes incluindo `draftOrderInvoiceSend`)
4. Retorna `invoiceUrl` da Shopify

## Validações no gateway (`gateway/server.js`)

```javascript
if (!Array.isArray(lineItems) || !lineItems.length) → 400
if (!item.variantId || quantity <= 0) → 400
```
