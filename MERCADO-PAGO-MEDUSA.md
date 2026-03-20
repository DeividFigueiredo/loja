# Pagamento com Mercado Pago no Medusa

O Medusa não traz Mercado Pago nativo. É preciso usar um **plugin de payment provider** de terceiros.

## Opções de plugins

1. **@minskylab/medusa-payment-mercadopago**  
   - Checkout Pro (redireciona para o Mercado Pago).  
   - Instalação: `npm install @minskylab/medusa-payment-mercadopago` (no projeto **shopteste**, Medusa).  
   - Variáveis: `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_SUCCESS_BACKURL`, `MERCADOPAGO_WEBHOOK_URL`.  
   - Documentação: [Medusa Integrations](https://medusajs.com/integrations/@minskylabmedusa-payment-mercadopago/).

2. **Outros** (ex.: `medusa-payment-mercadopago` no GitHub)  
   - Podem oferecer PIX, cartão, boleto. Verifique se são compatíveis com a versão do Medusa que você usa (v2).

## Passos gerais

1. **Conta Mercado Pago**  
   - Acesse [desenvolvedores.mercadopago.com](https://www.mercadopago.com.br/developers) e crie um app para obter **Access Token** (produção ou teste).

2. **Instalar o plugin no backend**  
   - No projeto **shopteste** (pasta do Medusa):  
     `npm install @minskylab/medusa-payment-mercadopago`  
   - Registrar o plugin no `medusa-config.ts` (veja a doc do plugin).

3. **Configurar no Admin**  
   - No Admin do Medusa: **Settings → Payment Providers** (ou Payment).  
   - Ative o provedor Mercado Pago e preencha as credenciais (ou use as variáveis de ambiente).

4. **frontend-site**  
   - O checkout do frontend-site (porta 5000) usa os payment providers configurados na Medusa. Quando o Mercado Pago estiver ativo e associado à região, ele aparecerá como opção no checkout.

5. **Webhook**  
   - Para o Mercado Pago avisar o Medusa quando o pagamento for aprovado, configure a URL de webhook no painel do Mercado Pago apontando para o seu backend (ex.: `https://seu-dominio.com/webhooks/mercadopago`). Em desenvolvimento local use ferramentas como **ngrok** para expor a URL.

## Resumo

- Medusa: instalar plugin Mercado Pago no **shopteste**, configurar no Admin e definir variáveis (token, URLs).
- Gateway (index.html na porta 3000): ao clicar em “Ir para pagamento”, o usuário é redirecionado para o frontend-site (porta 5000), onde o pagamento é processado com os providers configurados (incluindo Mercado Pago, se ativo).
