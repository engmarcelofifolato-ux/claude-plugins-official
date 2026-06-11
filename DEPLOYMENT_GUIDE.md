# 🚀 Guia de Deploy em Produção - GeoRadar Agro

**Data:** 11 de Junho de 2026  
**Status:** ✅ Pronto para Produção  
**Versão:** 1.0.0 - Production Ready

---

## 📋 Pré-requisitos

- ✅ Node.js 20.x instalado
- ✅ npm ou yarn
- ✅ Conta Vercel (backend)
- ✅ Conta GitHub Pages (frontend)
- ✅ Domínio personalizado (opcional)

---

## 🔧 Processo de Deploy

### 1️⃣ Deploy Backend - Vercel

#### Opção A: Interface Web

```bash
# 1. Acessar Vercel
https://vercel.com

# 2. Conectar repositório GitHub
# - Selecionar: engmarcelofifolato-ux/claude-plugins-official
# - Branch: claude/georadar-agro-spa-y6ZYS

# 3. Configurar Build
- Framework: Other (Node.js)
- Build Command: npm install
- Output Directory: /api
- Environment Variables: Nenhuma necessária

# 4. Deploy
Clicar em "Deploy" e aguardar conclusão (~2 min)

# 5. Acessar
https://claude-plugins-official-xxxx.vercel.app
```

#### Opção B: CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /home/user/claude-plugins-official
vercel --prod

# Resultado
Production: https://seu-dominio.vercel.app
API: https://seu-dominio.vercel.app/api/*
```

### 2️⃣ Deploy Frontend - GitHub Pages

#### Opção A: Automático via GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [ main, claude/georadar-agro-spa-y6ZYS ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Update API URL
        run: |
          sed -i 's|YOUR_API_URL|https://seu-dominio.vercel.app|g' \
            GeoRadar-Agro-Advanced.html
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
          include_files: GeoRadar-Agro-Advanced.html
```

#### Opção B: Manual

```bash
# 1. Atualizar URL da API no HTML
sed -i 's|http://localhost:3000|https://seu-vercel-app.vercel.app|g' \
  GeoRadar-Agro-Advanced.html

# 2. Commit e push
git add GeoRadar-Agro-Advanced.html
git commit -m "Update API URL for production"
git push origin claude/georadar-agro-spa-y6ZYS

# 3. Ativar GitHub Pages
# Ir em: Settings > Pages
# - Source: Deploy from a branch
# - Branch: claude/georadar-agro-spa-y6ZYS
# - Folder: / (root)

# 4. Acessar
https://seu-usuario.github.io/claude-plugins-official
```

---

## 📌 Configurações Importantes

### Arquivo: vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Variáveis de Ambiente (se necessário)

```bash
# .env.production
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

### CORS para Produção

Atualmente configurado para aceitar qualquer origem:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```

**Para restringir em produção:**
```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://seu-dominio.com');
```

---

## 📊 URLs de Produção

### Backend (Vercel)
```
API Base:     https://seu-vercel-app.vercel.app
Health:       https://seu-vercel-app.vercel.app/health
Stats:        https://seu-vercel-app.vercel.app/api/stats
Leads SP:     https://seu-vercel-app.vercel.app/api/leads/SP
```

### Frontend (GitHub Pages)
```
Website:      https://seu-usuario.github.io/claude-plugins-official
Index:        https://seu-usuario.github.io/claude-plugins-official/
Domínio:      https://seu-dominio.com (com CNAME)
```

### Domínio Personalizado

```bash
# 1. Adicionar arquivo CNAME no root
echo "seu-dominio.com" > CNAME

# 2. Configurar DNS
CNAME seu-dominio.com seu-usuario.github.io

# 3. Em GitHub Settings > Pages
# Custom domain: seu-dominio.com
```

---

## 🧪 Testes Pré-Deploy

```bash
# 1. Teste Backend
curl https://seu-vercel-app.vercel.app/health

# Resposta esperada:
# {"status":"ok","database":"connected","totalLeads":9600}

# 2. Teste Endpoints
curl https://seu-vercel-app.vercel.app/api/stats
curl https://seu-vercel-app.vercel.app/api/leads/SP?limit=5

# 3. Teste CAR Integration
curl "https://seu-vercel-app.vercel.app/api/car/matching?lat=-21.1753&lon=-47.8102"

# 4. Teste Frontend
# Acessar: https://seu-usuario.github.io/seu-projeto
# Validar: Carregamento de dados, filtros, CAR matching
```

---

## 🔒 Segurança

### Recomendações

1. **HTTPS obrigatório**
   - GitHub Pages: Automático
   - Vercel: Automático

2. **Headers de Segurança**
   ```javascript
   res.setHeader('X-Content-Type-Options', 'nosniff');
   res.setHeader('X-Frame-Options', 'DENY');
   res.setHeader('X-XSS-Protection', '1; mode=block');
   ```

3. **Rate Limiting**
   - Implementar em produção para APIs públicas
   - Limitar a 100 requests/min por IP

4. **Monitoramento**
   - Habilitar Vercel Analytics
   - Configurar alertas de erro
   - Monitorar taxa de matching CAR

---

## 📈 Monitoramento em Produção

### Vercel Dashboard

```
https://vercel.com/dashboard
→ seu-projeto
→ Analytics
→ Logs
→ Monitoring
```

**Métricas a Monitorar:**
- Response time: < 200ms
- Erro rate: < 0.1%
- Database hits: Otimizados
- CAR matching: > 20%

### Logs

```bash
# Acessar logs Vercel
vercel logs seu-vercel-app.vercel.app --follow

# Filtrar por tipo
vercel logs seu-vercel-app.vercel.app --filter="error"
```

---

## 🔄 Atualizações Futuras

### Adicionar Dados Reais do CAR

```bash
# 1. Descarregar dados
# https://consultapublica.car.gov.br/publico/downloads

# 2. Processar e inserir em car-data-gateway.js
# Expandir carSampleDatabase com dados reais

# 3. Commit e push
git add api/car-data-gateway.js
git commit -m "Update CAR database with real data"
git push origin claude/georadar-agro-spa-y6ZYS

# 4. Vercel redeploy automático
# (ao fazer push)
```

### Melhorias Recomendadas

1. **Cache de Imagens**
   - Adicionar CDN (CloudFlare)
   - Comprimir assets

2. **Banco de Dados Real**
   - Migrar de seeded random para PostgreSQL
   - Implementar persistência
   - Adicionar busca full-text

3. **Autenticação**
   - Adicionar login para vendedores
   - Histórico de leads consultados
   - Relatórios personalizados

4. **Mobile App**
   - React Native version
   - Sincronização offline
   - Push notifications

---

## ⚠️ Troubleshooting

### Problema: CORS Error

**Solução:**
```javascript
// Em api/index.js, linha 4-5
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
```

### Problema: Dados Não Carregam

**Verificar:**
```bash
# 1. Health check
curl https://seu-vercel-app.vercel.app/health

# 2. Logs
vercel logs seu-vercel-app.vercel.app

# 3. URL no frontend
# Editar GeoRadar-Agro-Advanced.html
# Linha 50: `const apiUrl = 'https://seu-vercel-app.vercel.app';`
```

### Problema: CAR Matching Baixo

**Razão:** Apenas 10 registros de exemplo
**Solução:** Carregar dados reais (ver seção acima)

---

## 📞 Suporte

### Documentação de Referência
- Vercel Docs: https://vercel.com/docs
- GitHub Pages: https://pages.github.com
- Node.js: https://nodejs.org/docs

### Contato
- Email: eng.marcelofifolato@gmail.com
- WhatsApp: +55 16 99378-4631

---

## ✅ Checklist de Deploy

- [ ] Backend testado localmente
- [ ] Frontend testado localmente
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] API URL atualizada no frontend
- [ ] vercel.json configurado
- [ ] GitHub Pages habilitado
- [ ] Domínio personalizado (opcional)
- [ ] HTTPS habilitado
- [ ] Testes pré-deploy passando
- [ ] Monitoramento configurado
- [ ] Backup de dados

---

## 🎉 Deploy Completo!

Parabéns! Sistema GeoRadar Agro está em produção!

**URLs Finais:**
- Frontend: https://seu-usuario.github.io/claude-plugins-official
- Backend API: https://seu-vercel-app.vercel.app
- Saúde da API: https://seu-vercel-app.vercel.app/health

**Próximos Passos:**
1. Monitorar performance
2. Coletar feedback de usuários
3. Integrar dados reais do CAR
4. Implementar autenticação
5. Adicionar mais funcionalidades

Sucesso! 🚀
