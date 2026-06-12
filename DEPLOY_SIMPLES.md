# 🚀 DEPLOY EM 3 PASSOS - GeoRadar Agro

## Bom dia! Vamos fazer o deploy agora!

---

## 📋 OPÇÃO RECOMENDADA: Testar Local DEPOIS Deploy Online

### **PASSO 1️⃣: TESTAR LOCALMENTE (5 minutos)**

Execute no terminal:
```bash
node run-local-server.js
```

Abra no navegador:
```
http://localhost:3000
```

**Valide:**
- ✅ Página carrega
- ✅ Botões funcionam
- ✅ Dados aparecem
- ✅ Filtros funcionam
- ✅ CSV exporta
- ✅ WhatsApp abre

Se tudo OK → continue para passo 2

---

### **PASSO 2️⃣: DEPLOY BACKEND EM VERCEL (10 minutos)**

```bash
# 1. Instalar Vercel CLI (se não tiver)
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

**Resultado:**
- Você receberá uma URL como: `https://seu-projeto-xxxxx.vercel.app`
- Anote essa URL! ⚠️

---

### **PASSO 3️⃣: DEPLOY FRONTEND EM GITHUB PAGES (5 minutos)**

```bash
# 1. Atualizar URL no HTML
# Edite o arquivo: GeoRadar-Agro-Advanced.html
# Procure por: const apiUrl = 'http://localhost:3000'
# Substitua por: const apiUrl = 'https://seu-projeto-xxxxx.vercel.app'

# Ou execute (Linux/Mac):
sed -i 's|http://localhost:3000|https://seu-projeto-xxxxx.vercel.app|g' GeoRadar-Agro-Advanced.html

# 2. Commit e push
git add GeoRadar-Agro-Advanced.html
git commit -m "Update API URL for production"
git push origin claude/georadar-agro-spa-y6ZYS

# 3. Ativar GitHub Pages
# Vá em: https://github.com/seu-usuario/claude-plugins-official
# Settings → Pages
# Source: Deploy from a branch
# Branch: claude/georadar-agro-spa-y6ZYS
# Folder: / (root)
# Save

# 4. Aguarde 1-2 minutos
```

**Seu link será:**
```
https://seu-usuario.github.io/claude-plugins-official
```

---

## ✅ PRONTO!

Agora você tem:
- 🔗 **Frontend:** https://seu-usuario.github.io/claude-plugins-official
- 🔗 **Backend:** https://seu-projeto-xxxxx.vercel.app

---

## 🎯 Próximos Passos

1. ✅ Testar no link online
2. ✅ Validar funcionalidades
3. ✅ Implementar autenticação
4. ✅ Integração de pagamento

---

## 📞 Precisa de ajuda?

- Email: eng.marcelofifolato@gmail.com
- WhatsApp: +55 16 99378-4631

---

**Bora começar? 🚀**
