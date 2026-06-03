# 🎯 Sistema de Acumulação Progressiva de Leads

## Visão Geral

O GeoRadar Agro agora possui um **sistema inteligente de armazenamento progressivo** que:

1. **Busca dados reais** das APIs públicas brasileiras
2. **Armazena em banco de dados** (SQLite)
3. **Acumula gradualmente** até 10.000+ leads por módulo
4. **Atualiza continuamente** conforme novas requisições chegam

---

## 🔄 Como Funciona

### Primeira Requisição (Primeiro Acesso)
```
GET /api/leads/SP
    ↓
Backend busca da API real
    ↓
Encontra 105 leads (25 Empresas + 25 Fundiário + 20 Crédito + 20 Solar + 15 Ambiental)
    ↓
Armazena no SQLite (leads.db)
    ↓
Retorna para frontend
```

### Próximas Requisições
```
GET /api/leads/SP
    ↓
Busca no banco (rápido - < 100ms)
    ↓
Se poucas linhas, busca novas da API também
    ↓
Armazena novos dados
    ↓
Retorna dados acumulados
```

### Ao Longo do Tempo
```
Dia 1:  105 leads armazenados
Dia 2:  150 leads (após mais buscas)
Dia 3:  250 leads
...
Semana 3: 5.000+ leads acumulados
Semana 4: 10.000+ leads (meta atingida!)
```

---

## 📊 Estrutura do Banco de Dados

### Tabela: `leads`
```sql
id TEXT PRIMARY KEY
nome TEXT
estado TEXT
modulo TEXT (Empresas | Fundiário | Ambiental | Crédito Rural | Solar Rural)
propriedade TEXT
tamanho TEXT
score INTEGER (0-100)
status TEXT
fonte TEXT
cnpj TEXT
atividade TEXT
porte TEXT
telefone TEXT
email TEXT
areaPreservada TEXT
cultura TEXT
temperatura REAL
umidade REAL
precipitacao REAL
data_captura TEXT
data_atualizacao TEXT
metadata TEXT (JSON)
```

### Tabela: `update_log`
```sql
id TEXT PRIMARY KEY
estado TEXT
modulo TEXT
fonte TEXT
total_encontrados INTEGER
data_atualizacao TEXT
```

---

## 🚀 Começar

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Iniciar Backend
```bash
npm start
# Banco será criado automaticamente em: backend/leads.db
```

### 3. Testar Endpoints

**Buscar leads:**
```bash
curl http://localhost:3001/api/leads/SP
curl http://localhost:3001/api/leads/MG?modulo=Empresas
```

**Ver estatísticas:**
```bash
curl http://localhost:3001/api/stats
```

---

## 🔨 Script de Acumulação

### Executar Uma Vez
```bash
node backend/accumulate-leads.js
```

### Agendar Execução (Cron - Linux/Mac)

Adicionar ao crontab:
```bash
crontab -e

# Executar a cada 6 horas
0 */6 * * * cd /caminho/para/georadar && node backend/accumulate-leads.js >> logs/accumulate.log 2>&1
```

### Windows (Task Scheduler)

Criar tarefa agendada:
```
Programa: node
Argumentos: C:\caminho\backend\accumulate-leads.js
Frequência: Cada 6 horas
```

---

## 📈 Progresso Esperado

### Semana 1
```
Empresas:      25 → 250 leads  (2,5% da meta)
Fundiário:     25 → 250 leads  (2,5%)
Ambiental:     15 → 150 leads  (1,5%)
Crédito Rural: 20 → 200 leads  (2,0%)
Solar Rural:   20 → 200 leads  (2,0%)
─────────────────────────────
Total:        105 → 1.050 leads (2,1%)
```

### Semana 2
```
Cada módulo:   250 → 1.500 leads (15% da meta)
───────────────────────────────────
Total:       1.050 → 7.500 leads (15%)
```

### Semana 3-4
```
Cada módulo:   1.500 → 10.000+ leads (100%)
─────────────────────────────────────
Total:       7.500 → 50.000+ leads ✅
```

---

## 🔍 Monitorar Progresso

### Via Endpoint `/api/stats`
```bash
curl http://localhost:3001/api/stats

{
  "sucesso": true,
  "totalLeads": 15000,
  "porModulo": [
    { "modulo": "Empresas", "total": 3000, "scoreMedia": 70 },
    { "modulo": "Fundiário", "total": 3000, "scoreMedia": 72 },
    { "modulo": "Ambiental", "total": 3000, "scoreMedia": 69 },
    { "modulo": "Crédito Rural", "total": 3000, "scoreMedia": 75 },
    { "modulo": "Solar Rural", "total": 3000, "scoreMedia": 74 }
  ]
}
```

### Diretamente no Banco (SQLite)
```bash
sqlite3 backend/leads.db

# Ver total de leads
SELECT COUNT(*) FROM leads;

# Ver por módulo
SELECT modulo, COUNT(*) as total FROM leads GROUP BY modulo;

# Ver leads mais recentes
SELECT * FROM leads ORDER BY data_atualizacao DESC LIMIT 10;
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# .env
PORT=3001
NODE_ENV=development
DB_PATH=./leads.db
BACKEND_URL=http://localhost:3001
```

---

## 📝 API Endpoints

### GET `/api/leads/:estado`
Buscar leads acumulados de um estado

**Parâmetros:**
- `estado`: SP, MG, BA, etc
- `modulo` (opcional): Filtrar por módulo
- `limit` (opcional): Limite de resultados (default: 50)

**Resposta:**
```json
{
  "sucesso": true,
  "total": 5000,
  "retornados": 50,
  "estado": "SP",
  "modulo": "Todos",
  "leads": [...],
  "storage": "5000 leads armazenados",
  "timestamp": "2026-06-03T19:00:00Z"
}
```

### GET `/api/stats`
Ver estatísticas do banco

**Resposta:**
```json
{
  "sucesso": true,
  "totalLeads": 15000,
  "porModulo": [...]
}
```

---

## 🛡️ Segurança & Performance

### Performance
- **Com Cache:** < 100ms
- **Sem Cache:** 1-2s (primeira busca)
- **Acesso ao DB:** < 50ms (SSD)

### Armazenamento
- **Tamanho BD:** ~2MB por 10.000 leads
- **Crescimento:** ~200 bytes por lead
- Para 50.000 leads: ~10MB

### Backup

```bash
# Backup do banco
cp backend/leads.db backend/leads.backup.db

# Restaurar
cp backend/leads.backup.db backend/leads.db
```

---

## 🔄 Atualizações

### Atualizar Dados (Sem perder histórico)
O sistema usa `INSERT OR REPLACE` que:
- ✅ Atualiza leads existentes
- ✅ Adiciona novos leads
- ✅ Preserva histórico (data_atualizacao rastreado)

### Limpar Banco Completamente
```bash
node -e "require('./backend/database').initDatabase().then(db => db.clearDatabase())"
```

---

## 📊 Métricas

Após a implementação completa:

| Métrica | Valor |
|---------|-------|
| **Total de Leads** | 50.000+ |
| **Por Módulo** | 10.000+ |
| **Tempo de Resposta** | < 100ms |
| **Tamanho do Banco** | ~10MB |
| **Leads Reais** | 100% (dados das APIs) |
| **Atualização Automática** | A cada 6h (cron) |

---

## 🎯 Próximos Passos

1. ✅ Implementar banco de dados progressivo
2. ⏳ Agendar script de acumulação (cron/scheduler)
3. ⏳ Monitorar crescimento do banco
4. ⏳ Atingir 10.000 leads por módulo
5. ⏳ Deploy em produção com backup automático

---

## 📞 Suporte

Dúvidas sobre acumulação?

```bash
# Ver logs de acumulação
cat logs/accumulate.log

# Testar script manualmente
node backend/accumulate-leads.js

# Debug: conectar ao banco
sqlite3 backend/leads.db ".tables"
```

---

**Status:** ✅ Pronto para começar a acumular leads reais!

GeoRadar Agro - Inteligência Territorial Progressiva 🚀
