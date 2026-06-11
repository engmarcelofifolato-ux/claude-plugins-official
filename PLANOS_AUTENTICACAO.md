# 💳 Planos de Pagamento e Autenticação - GeoRadar Agro

**Data:** 11 de Junho de 2026  
**Status:** 🚀 Pronto para Implementação  
**Versão:** 1.0.0

---

## 📋 Visão Geral

Sistema de autenticação de usuários com 3 planos de assinatura:
- ✅ Gratuito (100 leads/mês)
- ✅ Profissional (5.000 leads/mês)
- ✅ Enterprise (50.000 leads/mês)

---

## 💰 Planos Disponíveis

### 1️⃣ Plano Gratuito

```
Preço: R$ 0,00/mês
Leads por mês: 100
```

**Funcionalidades:**
- ✅ Busca básica
- ✅ Filtro por estado
- ✅ Visualizar detalhes
- ✅ Exportar CSV (10 leads/mês)
- ✅ WhatsApp (10 contatos/mês)

**Limites:**
- Requisições API: 100/hora
- Sem suporte
- Dashboard básico

**Ideal para:** Explorar a plataforma

---

### 2️⃣ Plano Profissional

```
Preço: R$ 99,90/mês
Leads por mês: 5.000
```

**Funcionalidades:**
- ✅ Busca avançada
- ✅ Todos os filtros
- ✅ CAR enrichment
- ✅ Exportar CSV (sem limite)
- ✅ WhatsApp (sem limite)
- ✅ API access
- ✅ Relatórios básicos
- ✅ Suporte por email

**Limites:**
- Requisições API: 1.000/hora
- Dashboard completo
- Histórico de 90 dias

**Ideal para:** Profissionais e pequenas empresas

---

### 3️⃣ Plano Enterprise

```
Preço: R$ 499,90/mês
Leads por mês: 50.000
```

**Funcionalidades:**
- ✅ Tudo do plano Profissional
- ✅ Acesso completo a APIs
- ✅ Dados reais do CAR
- ✅ Geolocalização avançada
- ✅ Análises detalhadas
- ✅ Dashboard personalizado
- ✅ Relatórios automáticos
- ✅ Suporte prioritário 24/7
- ✅ SLA garantido
- ✅ Integração customizada

**Limites:**
- Requisições API: 10.000/hora
- Dashboard avançado
- Histórico ilimitado
- APIs customizadas

**Ideal para:** Grandes empresas e instituições

---

## 🔐 Sistema de Autenticação

### Tecnologias

**Atualmente (v1.0.0):**
- Tokens simples em cache (NodeCache)
- Sessões de 7 dias
- Sem criptografia de senha (simples)

**Futuro (v1.1.0):**
- JWT (JSON Web Tokens) com RS256
- Bcrypt para senhas
- OAuth2 (Google, Microsoft)
- 2FA (Two-Factor Authentication)

---

## 📊 Fluxo de Autenticação

```
1. Usuário acessa http://localhost:3000
                    ↓
2. Clica em "Cadastro" ou "Login"
                    ↓
3. Preenche formulário
                    ↓
4. Backend valida dados
                    ↓
5. Se novo: Cria usuário (plano gratuito)
   Se existente: Gera token
                    ↓
6. Token armazenado no localStorage
                    ↓
7. Token enviado em todas requisições
                    ↓
8. API valida token e plano
                    ↓
9. Retorna dados com limites de plano
```

---

## 🛠️ Implementação Técnica

### Arquivo: `api/auth-gateway.js`

```javascript
// Funções disponíveis:

cadastrarUsuario(email, senha, nome, plano)
  // Retorna: sucesso + dados do usuário

login(email, senha)
  // Retorna: token + informações do usuário

validarToken(token)
  // Retorna: valido + dados do usuário

obterUsuario(email)
  // Retorna: informações completas do usuário

verificarLimiteRequisicoes(email)
  // Retorna: permitido + uso atual

verificarLimiteLead(email)
  // Retorna: permitido + uso atual

registrarExportacaoCSV(email)
  // Registra uso de exportação

registrarWhatsApp(email)
  // Registra envio WhatsApp

obterPlano(plano_id)
  // Retorna: informações do plano

listarPlanos()
  // Retorna: lista de todos os planos
```

---

## 📱 Interface (Será Implementada)

### Página de Login

```html
Tela:
  [Logo GeoRadar Agro]
  
  Email:
  [_________________________]
  
  Senha:
  [_________________________]
  
  [Login]  [Cadastro Novo]
  
  Mensagem: "Primeiro acesso? Cadastre-se gratuitamente"
```

### Página de Cadastro

```html
Tela:
  [Logo GeoRadar Agro]
  
  Nome:
  [_________________________]
  
  Email:
  [_________________________]
  
  Senha:
  [_________________________]
  
  Confirmar Senha:
  [_________________________]
  
  Plano:
  [Gratuito ▼]  (Profissional | Enterprise)
  
  [ ] Li e concordo com os Termos de Serviço
  
  [Cadastrar]  [Voltar]
```

### Dashboard de Usuário

```html
Bem-vindo, João!

Plano: Profissional (R$ 99,90/mês)

Uso do Mês:
  Leads consultados: 1.250 / 5.000 (25%)
  Exportações CSV: Ilimitado
  WhatsApp: Ilimitado
  Requisições API: 450 / 1.000/hora

[Upgrade Plano]  [Configurações]  [Logout]
```

---

## 🔌 Endpoints de Autenticação (v1.1.0)

```
POST /auth/cadastro
  Body: { email, senha, nome, plano }
  Response: { sucesso, usuario, token }

POST /auth/login
  Body: { email, senha }
  Response: { sucesso, token, usuario, plano_info }

GET /auth/usuario
  Headers: { Authorization: "Bearer TOKEN" }
  Response: { usuario, plano_info, uso_mes, limites }

POST /auth/logout
  Headers: { Authorization: "Bearer TOKEN" }
  Response: { sucesso }

GET /auth/planos
  Response: { planos: [...] }

GET /auth/plano/:id
  Response: { plano_info }
```

---

## 💼 Sistema de Limites

### Por Plano

| Limite | Gratuito | Profissional | Enterprise |
|--------|----------|--------------|-----------|
| Leads/mês | 100 | 5.000 | 50.000 |
| CSV exports | 10 | Ilimitado | Ilimitado |
| WhatsApp | 10 | Ilimitado | Ilimitado |
| API req/hora | 100 | 1.000 | 10.000 |

### Comportamento ao Atingir Limite

```
Gratuito (100 leads/mês):
  → Ao atingir 100, bloqueia acesso
  → Mostra "Upgrade para continuar"

Profissional (5.000 leads/mês):
  → Ao atingir 5.000, bloqueia acesso
  → Mostra "Próximo ciclo: [data]"

Enterprise (50.000 leads/mês):
  → Customizável por contrato
  → Sem bloqueio automático
```

---

## 🔄 Reset de Uso

```javascript
// Reset automático mensal (dia 1º de cada mês)
// Script executado via cron job

resetarUsoMensal(usuario_id) {
  usuario.uso_mes = {
    leads_consultados: 0,
    exportacoes_csv: 0,
    mensagens_whatsapp: 0,
    requisicoes_api: 0
  }
}
```

---

## 📊 Dashboard de Administrador (Futuro)

```
Visão Geral:
  Total de usuários: 1.250
  Receita mensal: R$ 15.890,00
  Taxa de conversão: 12.5%

Usuários por Plano:
  Gratuito: 1.050 (84%)
  Profissional: 180 (14%)
  Enterprise: 20 (2%)

Gráfico de Crescimento:
  [Gráfico mostrando crescimento]

Usuários Recentes:
  Email | Plano | Data Cadastro
  user@email.com | Gratuito | 2026-06-11
```

---

## 🔒 Segurança

### Melhorias Necessárias

1. **Senhas:**
   - [ ] Usar bcrypt para hash
   - [ ] Validação de força
   - [ ] Recovery por email

2. **Tokens:**
   - [ ] Implementar JWT
   - [ ] Expiração automática
   - [ ] Refresh tokens

3. **API:**
   - [ ] Rate limiting por IP
   - [ ] HTTPS obrigatório
   - [ ] CORS restritivo

4. **Dados:**
   - [ ] Criptografia de senhas
   - [ ] Auditoria de acessos
   - [ ] Backup automático

---

## 💳 Pagamento (Integração Futura)

### Plataformas Suportadas

- **Stripe:** Para cartões e pagamentos internacionais
- **MercadoPago:** Para Brasil (PIX, boleto, cartão)
- **PayPal:** Como alternativa global

### Fluxo de Pagamento

```
1. Usuário seleciona plano pago
           ↓
2. Clica em "Assinar Agora"
           ↓
3. Redireciona para gateway de pagamento
           ↓
4. Completa pagamento
           ↓
5. Webhook atualiza status
           ↓
6. Acesso liberado ao plano
```

---

## 📝 Roadmap de Implementação

### Fase 1: MVP (Atual - 1 semana)
- [x] Estrutura de autenticação
- [x] 3 planos definidos
- [x] API de limites
- [ ] Interface de login
- [ ] Interface de cadastro
- [ ] Dashboard de usuário

### Fase 2: Refinamento (2-3 semanas)
- [ ] Testes de autenticação
- [ ] Testes de limites
- [ ] Interface melhorada
- [ ] Reset mensal automático
- [ ] Suporte a 2FA

### Fase 3: Pagamento (3-4 semanas)
- [ ] Integração Stripe/MercadoPago
- [ ] Faturas automáticas
- [ ] Cancelamento de plano
- [ ] Relatório de pagamentos

### Fase 4: Admin (4-5 semanas)
- [ ] Dashboard de admin
- [ ] Gestão de usuários
- [ ] Relatórios detalhados
- [ ] Controle de planos

---

## 📞 Testes de Autenticação

### Teste 1: Cadastro

```bash
# Usuário de teste (já existe)
Email: teste@georadar.com
Senha: senha123
Plano: Gratuito
```

### Teste 2: Login

```javascript
// Simular login
const resultado = login('teste@georadar.com', 'senha123');
// Response:
// {
//   sucesso: true,
//   token: "token_1_...",
//   usuario: { id, email, nome, plano },
//   plano_info: { ... }
// }
```

### Teste 3: Validar Limites

```javascript
// Verificar limite de leads
verificarLimiteLead('teste@georadar.com');
// Response:
// {
//   permitido: true,
//   uso_atual: 46,
//   limite: 100
// }
```

---

## 🎯 Próximos Passos

1. **Testar sistema localmente** ← Você está aqui
2. **Implementar interface de login/cadastro**
3. **Integrar autenticação no frontend**
4. **Testes automatizados de auth**
5. **Deploy em produção**
6. **Integração de pagamento**

---

## 📚 Documentação Adicional

- `api/auth-gateway.js` - Código da autenticação
- `INSTRUCOES_TESTE_LOCAL.md` - Como testar localmente
- `DEPLOYMENT_GUIDE.md` - Deploy em produção

---

## 💡 Notas

- Atualmente usa cache em memória (NodeCache)
- Em produção, usar banco de dados real
- Senhas não estão criptografadas (melhorar com bcrypt)
- Tokens simples (usar JWT no futuro)

---

## 📞 Suporte

Para implementar autenticação:
- Email: eng.marcelofifolato@gmail.com
- WhatsApp: +55 16 99378-4631

---

**Pronto para implementar autenticação? Chame quando quiser começar! 🚀**
