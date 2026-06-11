# 🚀 Instruções para Testar GeoRadar Agro Localmente

**Versão:** 1.0.0  
**Data:** 11 de Junho de 2026  
**Status:** Pronto para Testes

---

## ⚡ Quick Start (2 minutos)

### 1. Iniciar o Servidor

```bash
# Navegar para a pasta do projeto
cd /home/user/claude-plugins-official

# Iniciar o servidor local
node run-local-server.js
```

**Resultado esperado:**
```
═══════════════════════════════════════════════════════
🚀 GEORADAR AGRO - SERVIDOR LOCAL
═══════════════════════════════════════════════════════

✅ Servidor rodando em: http://localhost:3000
✅ Dashboard: http://localhost:3000/dashboard
✅ API Base: http://localhost:3000/api

📱 Frontend: http://localhost:3000
🗄️ Banco de Dados: 9.600 leads
🔌 APIs: 4 integradas
🗺️ CAR: Matching funcional

⚠️ Pressione Ctrl+C para parar o servidor
```

### 2. Acessar a Aplicação

Abra o navegador e acesse:
```
http://localhost:3000
```

### 3. Testar as Funcionalidades

Veja seção **Guia de Testes** abaixo.

---

## 📊 Dashboard

Acesse o dashboard para monitoramento:
```
http://localhost:3000/dashboard
```

Mostra:
- ✅ Status do servidor
- ✅ Uptime
- ✅ Requisições processadas
- ✅ Links rápidos para APIs
- ✅ Documentação

---

## 🧪 Guia de Testes

### Teste 1: Carregamento Inicial

1. Acesse: `http://localhost:3000`
2. Aguarde carregar
3. Verifique se dados aparecem na tela

**Esperado:**
- ✅ Página carrega em <2 segundos
- ✅ Estados aparecem em lista
- ✅ Sem erros no console

### Teste 2: Seleção de Estado

1. Clique em um estado (ex: São Paulo)
2. Observe os leads carregando

**Esperado:**
- ✅ 100 leads carregam
- ✅ Dados aparecem em cards
- ✅ Score visível
- ✅ Localização exibida

### Teste 3: Filtro por Módulo

1. Selecione um estado
2. Clique no dropdown de módulo
3. Escolha um módulo (ex: Fundiário)

**Esperado:**
- ✅ Leads filtrados
- ✅ Apenas módulo selecionado
- ✅ Contagem atualizada

### Teste 4: Busca Avançada

1. Use os filtros:
   - Estado: SP
   - Módulo: Crédito Rural
   - CAR Atualizado: SIM
   - RL OK: SIM

**Esperado:**
- ✅ Filtros funcionam
- ✅ Resultados precisos
- ✅ Performance <100ms

### Teste 5: Detalhe de Propriedade

1. Clique em um lead
2. Modal abre com detalhes

**Esperado:**
- ✅ Modal exibe informações:
  - Nome da propriedade
  - Proprietário
  - Email
  - CAR number
  - Área e RL
  - Coordenadas
  - Possíveis serviços
  - Créditos disponíveis

### Teste 6: Exportação CSV

1. Carregue alguns leads
2. Clique em "Exportar CSV"
3. Arquivo baixa

**Esperado:**
- ✅ Arquivo com nome: `leads-SP.csv`
- ✅ Contém colunas:
  - ID, Nome, Proprietário, Email, Municipio, Estado, CAR, Area, RL, Score

### Teste 7: WhatsApp

1. Clique em um lead
2. Clique no botão WhatsApp
3. Abre conversa

**Esperado:**
- ✅ Link WhatsApp funciona
- ✅ Mensagem pré-preenchida
- ✅ Número: +55 16 99378-4631

### Teste 8: Infinite Scroll

1. Carregue leads de um estado
2. Scrolle até o final da página
3. Mais leads carregam

**Esperado:**
- ✅ Próxima página carrega
- ✅ Sem saltos ou delays
- ✅ Performance mantida

### Teste 9: CAR Enrichment

1. Abra detalhes de um lead
2. Procure por seção "CAR"
3. Veja dados enriquecidos

**Esperado:**
- ✅ Alguns leads têm dados CAR
- ✅ Status de validação visível
- ✅ Distância de matching exibida

### Teste 10: Performance

1. Abra o DevTools (F12)
2. Vá em "Network"
3. Teste requisições

**Esperado:**
- ✅ Requisições <100ms
- ✅ Payload <50KB
- ✅ Cache funcionando (2ª requisição mais rápida)

---

## 🔌 Testes via API (Terminal)

### Teste de Health Check

```bash
curl http://localhost:3000/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "database": "connected",
  "totalLeads": 9600
}
```

### Teste de Leads por Estado

```bash
curl http://localhost:3000/api/leads/SP?limit=5
```

### Teste de Estatísticas

```bash
curl http://localhost:3000/api/stats
```

### Teste de CAR Matching

```bash
curl "http://localhost:3000/api/car/matching?lat=-21.1753&lon=-47.8102&tolerancia=300"
```

### Teste de Busca Avançada

```bash
curl "http://localhost:3000/api/leads/search?estado=SP&modulo=Fundiário&limit=10"
```

---

## 🛠️ Troubleshooting

### Problema: "Port 3000 already in use"

**Solução:**
```bash
# Use uma porta diferente
PORT=3001 node run-local-server.js

# Ou mate o processo usando a porta
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>
```

### Problema: Dados não carregam

**Solução:**
1. Verifique se o servidor está rodando
2. Abra o DevTools (F12) > Console
3. Procure por erros
4. Verifique URL da API (deve ser `http://localhost:3000`)

### Problema: CSS não carrega corretamente

**Solução:**
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Recarregue a página (Ctrl+F5)
3. Tente outro navegador

### Problema: WhatsApp não abre

**Solução:**
1. Verifique o número de telefone
2. Tente abrir o link manualmente:
   ```
   https://wa.me/5516993784631?text=...
   ```

---

## 📋 Checklist de Testes

Use este checklist para validar o sistema:

```
FRONTEND:
  [ ] Página carrega corretamente
  [ ] Estados aparecem em lista
  [ ] Seleção de estado funciona
  [ ] Filtro por módulo funciona
  [ ] Busca avançada funciona
  [ ] Detalhes do lead funcionam
  [ ] Modal exibe informações
  [ ] CSV exporta corretamente
  [ ] WhatsApp abre
  [ ] Infinite scroll funciona

API:
  [ ] Health check responde
  [ ] Stats retorna dados
  [ ] Leads por estado funcionam
  [ ] Lead detalhe funciona
  [ ] Busca avançada funciona
  [ ] CAR matching funciona
  [ ] CAR stats funcionam
  [ ] Performance <100ms

PERFORMANCE:
  [ ] Requisições rápidas (<100ms)
  [ ] Sem erros de console
  [ ] Cache funcionando
  [ ] Memory usage normal
  [ ] CPU usage normal
```

---

## 🎯 Próximas Etapas

Após validar o sistema localmente:

### 1. Deploy em Produção
```bash
# Backend (Vercel)
vercel --prod

# Frontend (GitHub Pages)
git push origin claude/georadar-agro-spa-y6ZYS
```

### 2. Implementar Autenticação
- Cadastro de usuários
- Login/Logout
- Planos pagos
- Controle de acesso

### 3. Melhorias Futuras
- Banco de dados real
- Dados reais do CAR
- Analytics
- Mobile app

---

## 💡 Dicas

**Para melhor experience:**
1. Use Chrome ou Firefox (mais rápido)
2. Abra DevTools para monitorar requisições
3. Teste com diferentes estados
4. Teste em mobile (responsivo)
5. Compartilhe feedback

---

## 📞 Suporte

Algum problema?
- Email: eng.marcelofifolato@gmail.com
- WhatsApp: +55 16 99378-4631

---

**Divirta-se testando! 🚀**
