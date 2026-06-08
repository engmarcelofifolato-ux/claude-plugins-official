# 🚀 Guia de Testes em Produção - GeoRadar Agro

**Data:** Junho 3, 2026  
**Status:** Deploy em progresso no Railway  
**URL de Produção:** https://claude-plugins-official-production.up.railway.app

---

## 📋 Sistema Implementado

### ✅ Backend com Scheduler Automático
- **Banco de Dados:** SQLite com persistência
- **Agendamento:** Node-schedule (a cada 6 horas)
- **Execução:** Automática ao iniciar + periódica
- **Acumulação:** 105 → 10K+ leads progressivamente

### ✅ Endpoints Disponíveis
1. `/api/leads/:estado` - Buscar leads por estado
2. `/api/leads/search` - Busca avançada
3. `/api/credito/:estado` - Taxas de crédito
4. `/api/stats` - Estatísticas do banco
5. `/health` - Status do servidor

---

## 🧪 Testes de Produção

### Teste 1: Health Check
```bash
curl https://claude-plugins-official-production.up.railway.app/health | jq .

# Resposta esperada:
{
  "status": "ok",
  "database": "connected",
  "uptime": XX.XX
}
```

### Teste 2: Buscar Leads (São Paulo)
```bash
curl "https://claude-plugins-official-production.up.railway.app/api/leads/SP" | jq '.{total, retornados, storage}'

# Resposta esperada:
{
  "total": 105+,
  "retornados": 50,
  "storage": "XXX leads armazenados"
}
```

### Teste 3: Buscar por Módulo
```bash
curl "https://claude-plugins-official-production.up.railway.app/api/leads/SP?modulo=Empresas" | jq '.total'

# Resposta esperada:
25+
```

### Teste 4: Estatísticas
```bash
curl "https://claude-plugins-official-production.up.railway.app/api/stats" | jq '.porModulo'

# Resposta esperada:
[
  { "modulo": "Empresas", "total": 25+ },
  { "modulo": "Fundiário", "total": 25+ },
  { "modulo": "Ambiental", "total": 15+ },
  ...
]
```

### Teste 5: Busca Avançada
```bash
curl "https://claude-plugins-official-production.up.railway.app/api/leads/search?estado=SP&modulo=Fundiario&limit=10" | jq '.total'
```

---

## 🔄 Testar Scheduler Automático

### Verificar Logs de Acumulação
1. Acessar Railway Dashboard
2. Ir para: Deployments → Logs
3. Procurar por: "🔄 INICIANDO ACUMULAÇÃO"

### Indicadores de Funcionamento

✅ **Primeira inicialização:**
```
✅ Banco de dados pronto
📅 Scheduler ativado
⚡ Executando acumulação inicial...
```

✅ **A cada 6 horas:**
```
⏰ Trigger do scheduler: Acumulação automática
📍 SP: +375 leads
📍 MG: +375 leads
...
✅ ACUMULAÇÃO CONCLUÍDA em 12.34s
```

---

## 📊 Monitorar Progresso

### 1. Via Endpoint de Stats (Melhor Opção)
```bash
# Executar a cada hora
watch -n 3600 'curl -s https://...up.railway.app/api/stats | jq .'
```

### 2. Via Dashboard Railway
1. Vá para: https://railway.app
2. Projeto: desirable-courage
3. Serviço: claude-plugins-official
4. Aba: Logs
5. Procurar por: "ESTATÍSTICAS ATUALIZADAS"

### 3. Registrar Manualmente
```bash
# Arquivo tracking.log
echo "$(date '+%Y-%m-%d %H:%M:%S') - $(curl -s https://.../api/stats | jq '.totalLeads')" >> tracking.log
```

---

## 🎯 Expectativas por Período

### Dia 1
```
✅ Scheduler funcionando
✅ 105+ leads armazenados
✅ Todos os 5 módulos com dados
✅ Primeira acumulação executada
```

### Dia 2-3
```
Total esperado: 500-800 leads
Distribuição: ~100-160 por módulo
Fonte: Acumulações automáticas do scheduler
```

### Semana 1
```
Total esperado: 2.000-3.000 leads
Distribuição: ~400-600 por módulo (4-6% da meta)
Trend: Crescimento linear a cada 6 horas
```

### Semana 2
```
Total esperado: 7.500-10.000 leads
Distribuição: ~1.500-2.000 por módulo (15-20% da meta)
```

### Semana 4
```
Total esperado: 50.000+ leads
Distribuição: 10.000+ por módulo ✅ META ATINGIDA
```

---

## 🔍 Troubleshooting

### Problema: Health Check falha
**Causa:** Deploy ainda em andamento ou erro de iniciação  
**Solução:** Aguardar 2-3 minutos e tentar novamente

```bash
# Verificar status no Railway
curl -I https://claude-plugins-official-production.up.railway.app/health
```

### Problema: Leads não aumentam
**Causa:** Scheduler não está rodando  
**Solução:** Verificar logs no Railway

```bash
# Procurar por:
# - "Scheduler ativado"
# - "INICIANDO ACUMULAÇÃO"
# - "ACUMULAÇÃO CONCLUÍDA"
```

### Problema: Database locked
**Causa:** Múltiplas tentativas de escrita simultânea  
**Solução:** Aguardar ou reiniciar serviço

---

## 📱 Integração com Frontend

### URL de Produção do Backend
```javascript
// Atualizar em GeoRadar-Agro-Advanced.html
let backendUrl = 'https://claude-plugins-official-production.up.railway.app';
```

### Testar Integração
1. Abrir: https://seu-github.io/.../GeoRadar-Agro-Advanced.html
2. Devtools → Console
3. Procurar por erros de CORS
4. Verificar se leads carregam

---

## 🎊 Checklist de Validação

- [ ] Health endpoint responde com status "ok"
- [ ] Banco conectado (database: "connected")
- [ ] Primeiro conjunto de leads retornado (105+)
- [ ] Stats mostram 5 módulos com dados
- [ ] Logs mostram "Scheduler ativado"
- [ ] Acumulação executada (logs: "CONCLUÍDA em Xs")
- [ ] Leads aumentam a cada 6 horas
- [ ] Frontend carrega dados do backend
- [ ] Detalhes dos leads aparecem corretamente

---

## 🚀 Próximas Etapas

**Imediatamente após deploy:**
1. ✅ Testar health check
2. ✅ Verificar leads iniciais
3. ✅ Confirmar scheduler em logs
4. ✅ Atualizar frontend com URL de produção

**Após 24 horas:**
1. ✅ Verificar se leads aumentaram
2. ✅ Confirmar próxima acumulação (6h + 6h = 12h)
3. ✅ Validar estatísticas

**Após 1 semana:**
1. ✅ Analisar crescimento (deve ter 2-3K leads)
2. ✅ Verificar taxa de crescimento
3. ✅ Monitorar performance (tempo de resposta)

---

## 📞 Suporte Rápido

**Comando para testar tudo de uma vez:**
```bash
#!/bin/bash
BASE_URL="https://claude-plugins-official-production.up.railway.app"

echo "🔍 Testando Sistema GeoRadar em Produção"
echo "========================================"
echo ""
echo "1️⃣ Health Check:"
curl -s $BASE_URL/health | jq .

echo ""
echo "2️⃣ Contagem Total de Leads:"
curl -s $BASE_URL/api/stats | jq '.totalLeads'

echo ""
echo "3️⃣ Distribuição por Módulo:"
curl -s $BASE_URL/api/stats | jq '.porModulo[] | {modulo, total}'

echo ""
echo "4️⃣ Últimos Leads (SP):"
curl -s $BASE_URL/api/leads/SP | jq '.leads[0:3] | .[] | {nome, modulo, score}'

echo ""
echo "✅ Testes Concluídos"
```

---

**Status:** 🟡 Deploy em Progresso  
**Próxima Verificação:** Em 2-3 minutos

*Desenvolvido com ❤️ para GeoRadar Agro*
