# Deploy em Produção — LojaVirtual

## Arquitetura Geral

```
seudominio.com.br
│
├── /                        → front_loja (loja do cliente final)
├── /painel                  → painel customizado (admin do lojista)
├── /api                     → gateway (porta 3000)
└── api.seudominio.com.br    → Medusa API (porta 9000) — só admin acessa
```

---

## Quem acessa o quê

| Quem | URL | O que vê |
|---|---|---|
| Você (dono da plataforma) | `admin.seudominio.com.br` | Painel completo do Medusa |
| Cliente/lojista admin | `seudominio.com.br/painel` | Financeiro, produtos, pedidos, estoque |
| Funcionário do cliente | `seudominio.com.br/painel` | Só o que o perfil dele permite |
| Cliente final | `seudominio.com.br` | Loja (front_loja) |

---

## Infraestrutura necessária

- **VPS**: DigitalOcean, Hetzner, Contabo, etc. (mínimo 2GB RAM)
- **Nginx** ou **Caddy**: roteamento dos domínios
- **PM2** ou **Docker**: manter os processos rodando
- **SSL**: Let's Encrypt (grátis, via Certbot)
- **PostgreSQL**: banco de dados do Medusa (pode ser no mesmo servidor ou separado)

---

## Configuração do Nginx

```nginx
# Medusa API (só admin acessa)
server {
    listen 443 ssl;
    server_name api.seudominio.com.br;

    ssl_certificate /etc/letsencrypt/live/api.seudominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.seudominio.com.br/privkey.pem;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Painel admin do Medusa (só você)
server {
    listen 443 ssl;
    server_name admin.seudominio.com.br;

    ssl_certificate /etc/letsencrypt/live/admin.seudominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.seudominio.com.br/privkey.pem;

    location / {
        proxy_pass http://localhost:9000/app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}

# Site principal (loja + painel do cliente + gateway)
server {
    listen 443 ssl;
    server_name seudominio.com.br;

    ssl_certificate /etc/letsencrypt/live/seudominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com.br/privkey.pem;

    # Painel customizado do cliente
    location /painel {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Gateway
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Loja (front_loja)
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

---

## Variáveis de ambiente em produção

### `backend_medusa/.env` (produção)
```env
DATABASE_URL=postgres://user:senha@localhost:5432/loja_db
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=https://seudominio.com.br
ADMIN_CORS=https://admin.seudominio.com.br
AUTH_CORS=https://seudominio.com.br,https://admin.seudominio.com.br,https://seudominio.com.br/painel
JWT_SECRET=seu_segredo_aqui_troque_isso
COOKIE_SECRET=outro_segredo_aqui_troque_isso
MEDUSA_FF_RBAC=false
```

### `front_loja/.env` (produção)
```env
VITE_MEDUSA_BACKEND_URL=https://api.seudominio.com.br
VITE_GATEWAY_URL=https://seudominio.com.br/api
```

---

## Rodando os processos com PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Medusa backend
cd /var/www/loja/backend_medusa
pm2 start npm --name "medusa" -- run start

# Gateway
cd /var/www/loja/gateway
pm2 start npm --name "gateway" -- run start

# Painel customizado (se não for build estático)
cd /var/www/loja/painel_admin
pm2 start npm --name "painel" -- run start

# Salvar para reiniciar automaticamente
pm2 save
pm2 startup
```

---

## Build dos projetos front-end

```bash
# front_loja
cd front_loja
npm run build
# arquivos gerados em: dist/

# painel_admin (quando criar)
cd painel_admin
npm run build
# arquivos gerados em: dist/
```

Para servir o build estático no Nginx, troque o `proxy_pass` por:
```nginx
location / {
    root /var/www/loja/front_loja/dist;
    try_files $uri $uri/ /index.html;
}
```

---

## Fluxo para adicionar novo cliente/funcionário

1. Acesse o painel do Medusa (`admin.seudominio.com.br`)
2. Vá em **Settings → Users → Invite**
3. Crie o convite com o e-mail do usuário
4. Após ele aceitar, vá no usuário e adicione o `metadata` com o perfil:

```json
// Admin do cliente
{ "is_super_admin": false, "can_manage_products": true, "can_view_orders": true, "can_view_stock": true }

// Só pedidos
{ "is_super_admin": false, "can_manage_products": false, "can_view_orders": true, "can_view_stock": false }

// Só estoque
{ "is_super_admin": false, "can_manage_products": false, "can_view_orders": false, "can_view_stock": true }
```

5. Passe o link `seudominio.com.br/painel` para o usuário

---

## SSL com Certbot (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Gerar certificados
sudo certbot --nginx -d seudominio.com.br -d api.seudominio.com.br -d admin.seudominio.com.br

# Renovação automática (já configurada pelo Certbot)
sudo certbot renew --dry-run
```

---

## Checklist antes de subir em produção

- [ ] Trocar `JWT_SECRET` e `COOKIE_SECRET` por valores seguros
- [ ] Configurar `DATABASE_URL` apontando para o banco de produção
- [ ] Rodar `npx medusa db:migrate` no servidor
- [ ] Criar o usuário admin inicial: `npx medusa user -e seu@email.com -p senha`
- [ ] Configurar CORS com os domínios reais
- [ ] Testar SSL em todos os subdomínios
- [ ] Configurar backup automático do banco de dados
- [ ] Ativar o PM2 startup para reiniciar em caso de reboot
