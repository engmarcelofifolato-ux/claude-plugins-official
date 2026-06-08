# 🚀 GeoRadar Agro - Backend API Gateway

Backend Node.js que integra com APIs públicas brasileiras para trazer **leads REAIS** de verdade.

## 📊 APIs Integradas

| API | Dados | Status | Free |
|-----|-------|--------|------|
| **SICAR** | CAR, propriedades, área | ✅ | ✅ |
| **Receita Federal** | CNPJ, empresas agrícolas | ✅ | ✅ |
| **Banco Central** | Taxas crédito rural, PRONAF | ✅ | ✅ |
| **INMET** | Dados climáticos, solar | ✅ | ✅ |
| **INCRA** | Propriedades rurais | ✅ | ✅ |

## 🛠️ Instalação

### Pré-requisitos
- Node.js 16+
- npm ou yarn

### Setup Local

```bash
# 1. Entrar no diretório
cd backend

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env
cp .env.example .env

# 4. Iniciar servidor
npm start

# Para desenvolvimento com auto-reload:
npm run dev
```

## 📡 Endpoints

### 1. GET `/api/leads/:estado`
Busca todos os leads de um estado específico

**Parâmetros:**
- `estado` (obrigatório): Sigla do estado (ex: SP, MG, BA)
- `modulo` (opcional): Filtrar por módulo (Fundiário, Crédito Rural, Solar Rural, Empresas, Ambiental)

**Exemplo:**
```bash
curl http://localhost:3001/api/leads/SP
curl http://localhost:3001/api/leads/MG?modulo=Solar%20Rural
```

**Resposta:**
```json
{
  "sucesso": true,
  "total": 45,
  "estado": "SP",
  "modulo": "Todos",
  "leads": [
    {
      "id": "CAR-SP-001",
      "nome": "João da Silva",
      "estado": "SP",
      "propriedade": "Ribeirão Preto",
      "tamanho": "500ha",
      "modulo": "Fundiário",
      "carStatus": "validado",
      "score": 85,
      "status": "Ativo",
      "fonte": "SICAR"
    },
    ...
  ],
  "timestamp": "2026-06-03T14:30:00Z"
}
```

### 2. GET `/api/leads/search`
Busca parametrizada com filtros

**Parâmetros:**
- `estado`: Sigla do estado
- `modulo`: Módulo específico
- `limit`: Número máximo de resultados (default: 50)

**Exemplo:**
```bash
curl "http://localhost:3001/api/leads/search?estado=SP&modulo=Crédito%20Rural&limit=100"
```

### 3. GET `/api/credito/:estado`
Informações de crédito rural por estado

**Exemplo:**
```bash
curl http://localhost:3001/api/credito/SP
```

**Resposta:**
```json
{
  "estado": "SP",
  "taxas": {
    "pronaf": 0.0481,
    "pronamp": 0.0688,
    "creditGreen": 0.0381,
    "dataAtualizacao": "2026-06-03T14:30:00Z"
  },
  "financiamentos": [
    {
      "nome": "PRONAF",
      "taxa": 0.0481,
      "limite": 150000,
      "prazo": 60
    },
    ...
  ]
}
```

### 4. GET `/health`
Status do servidor

```bash
curl http://localhost:3001/health
```

## 🔄 Fluxo de Dados

```
Frontend (GeoRadar-Agro-Advanced.html)
         ↓
    Backend API Gateway
         ↓
    ┌────┴────┬────────┬────────┬──────┐
    ↓         ↓        ↓        ↓      ↓
  SICAR   Receita  Central   INMET  INCRA
  (CAR)  Federal   Bank   (Solar) (Prop)
```

## 💾 Cache

Sistema de cache automático para evitar chamadas repetidas:

| Dados | TTL |
|-------|-----|
| SICAR/CAR | 24h |
| CNPJ | 24h |
| Taxas Banco Central | 7 dias |
| Dados Solares | 30 dias |

Cache é invalidado automaticamente após expiração.

## 🌍 Estados Suportados

```
AC, AL, AP, AM, BA, CE, DF, ES, GO, MA, MT, MS, MG, PA, PB, PR, PE, PI, RJ, RN, RS, RO, RR, SC, SP, SE, TO
```

## 📊 Estrutura do Lead

```javascript
{
  id: "CAR-SP-001",           // ID único da fonte
  nome: "João Silva",         // Nome proprietário
  estado: "SP",               // Sigla estado
  propriedade: "Município",   // Local/município
  tamanho: "500ha",          // Área em hectares
  modulo: "Fundiário",       // Módulo GeoRadar
  score: 85,                 // Score 0-100
  status: "Ativo",           // Status atual
  fonte: "SICAR",            // Fonte de dados
  
  // Dados específicos por módulo
  carStatus?: "validado",     // [Fundiário]
  cnpj?: "00.000.000/0000-00", // [Empresas]
  creditData?: {...},         // [Crédito Rural]
  solarPotencial?: {...}      // [Solar Rural]
}
```

## 🚀 Deploy

### Heroku
```bash
# 1. Criar app
heroku create georadar-agro-backend

# 2. Deploy
git push heroku main

# 3. Verificar
heroku logs --tail
```

### Vercel
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Usar API em produção
https://seu-projeto.vercel.app/api/leads/SP
```

### Railway.app (Recomendado)
```bash
# 1. Conectar repositório
# 2. Selecionar branch
# 3. Environment: Node.js
# 4. Deploy automático

# URL: https://seu-projeto-railway.railway.app
```

## 🔍 Troubleshooting

### "API indisponível"
- Verificar conexão internet
- Verificar se a API pública está funcionando
- Checar logs com `npm run dev`

### "CORS error"
- Backend está rodando em http://localhost:3001?
- Frontend está tentando chamar a URL correta?
- Verificar CORS settings em api-gateway.js

### Sem resultados
- Estado está digitado corretamente? (ex: SP, não sp)
- API pública pode estar sem dados para aquele estado
- Aumentar o `limit` para trazer mais leads

## 📈 Performance

- **Request timeout**: 10 segundos
- **Cache hit rate**: ~80% (após primeira chamada)
- **Response time**: <500ms (com cache)
- **Sem cache**: <5s (primeiro request)

## 🔐 Segurança

- Sem autenticação necessária (APIs públicas)
- CORS habilitado (apenas para GeoRadar)
- Rate limiting: Não implementado (adicionar conforme necessário)
- Dados sensíveis: Nenhum armazenado

## 📝 Logs

```bash
# Ver logs em tempo real
npm run dev

# Exemplo de log
🚀 GeoRadar Agro Backend
Servidor rodando em: http://localhost:3001
```

## 🤝 Contribuições

Para adicionar novas APIs:

1. Criar classe de API em `api-gateway.js`
2. Implementar método `searchByState(estado)`
3. Implementar método `toGeoRadarLead(data, estado)`
4. Adicionar endpoint em `/api/leads/:estado`

## 📞 Suporte

- Email: eng.marcelofifolato@gmail.com
- WhatsApp: +55 (16) 99378-4631

---

**Versão:** 1.0.0  
**Status:** 🟢 Produção  
**Última atualização:** Junho 2026
