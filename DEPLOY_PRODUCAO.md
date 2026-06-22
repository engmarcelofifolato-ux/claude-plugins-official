# 🚀 DEPLOY EM PRODUÇÃO - GeoRadar Agro v2.0

**Sistema pronto! Agora vamos colocar ONLINE!**

---

## ⚡ OPÇÃO 1: DEPLOY RÁPIDO EM VERCEL (Recomendado)

### **PASSO 1: Instalar Vercel CLI**
```bash
npm install -g vercel
```

### **PASSO 2: Login no Vercel**
```bash
vercel login
```
(Vai abrir navegador para autenticar)

### **PASSO 3: Deploy**
```bash
# Na pasta do projeto:
cd Desktop/claude-plugins-official

# Deploy para produção:
vercel --prod
```

**Resultado esperado:**
```
✅ Deployed to https://seu-projeto-xxxxx.vercel.app
```

**Copie a URL!** 📋

---

## ⚡ OPÇÃO 2: DEPLOY EM RAILWAY (Alternativa)

### **PASSO 1: Criar conta**
https://railway.app

### **PASSO 2: Conectar GitHub**
- Dashboard → New Project → GitHub Repo
- Selecione: `engmarcelofifolato-ux/claude-plugins-official`
- Branch: `claude/georadar-agro-spa-y6ZYS`

### **PASSO 3: Deploy automático**
Railway faz deploy automaticamente a cada push!

---

## 📱 DEPOIS DO DEPLOY: Atualizar Frontend

Após conseguir URL de produção (ex: `https://seu-projeto.vercel.app`):

**Abra o arquivo:** `GeoRadar-Agro-Advanced.html`

**Procure por:**
```javascript
let backendUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://claude-plugins-official-jbn6.vercel.app';
```

**Substitua por sua URL:**
```javascript
let backendUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://seu-projeto-xxxxx.vercel.app';
```

Depois: `git add`, `git commit`, `git push`

---

## 🎯 ATIVAR GITHUB PAGES (Frontend Online)

1. Vá em: https://github.com/engmarcelofifolato-ux/claude-plugins-official/settings/pages
2. Source: **Deploy from a branch**
3. Branch: **claude/georadar-agro-spa-y6ZYS**
4. Folder: **/ (root)**
5. Save

**Seu link será:**
```
https://engmarcelofifolato-ux.github.io/claude-plugins-official
```

---

## ✅ CHECKLIST FINAL

- [ ] Instalar Vercel CLI
- [ ] Fazer login no Vercel
- [ ] Rodar `vercel --prod`
- [ ] Copiar URL gerada
- [ ] Atualizar backendUrl no HTML
- [ ] Git push
- [ ] Ativar GitHub Pages
- [ ] Testar em produção
- [ ] Validar dados reais carregando

---

## 🔗 RESULTADO FINAL

Você terá:
- **Backend:** `https://seu-projeto.vercel.app` (Vercel)
- **Frontend:** `https://engmarcelofifolato-ux.github.io/claude-plugins-official` (GitHub Pages)

**Ambos totalmente online e conectados!** 🌍

---

## 💡 Precisa de dados 100% reais?

Quando tiver chave BigDataCorp:

1. Vá em Vercel Dashboard
2. Settings → Environment Variables
3. Add: `BDC_API_KEY` = `sua_chave`
4. Redeploy

Pronto! Sistema terá 6.5M propriedades reais do INCRA! 🎉

---

**Bora!** Manda screenshot quando estiver online! 📸
