# 🚀 COMO RODAR GEORADAR AGRO OFFLINE

**Guia completo para apresentação em máquina sem internet**

---

## ⚡ OPÇÃO 1: RODAR LOCALMENTE (Recomendada - 2 minutos)

### Pré-requisitos
- ✅ Node.js 20.x instalado ([Download aqui](https://nodejs.org))
- ✅ Git instalado (ou apenas copiar a pasta)

### Passo a Passo

**1. Copie a pasta do projeto para a máquina de apresentação:**
```
C:\Users\[seu-usuario]\Desktop\claude-plugins-official
```

**2. Abra o PowerShell ou Terminal na pasta:**
```bash
cd C:\Users\[seu-usuario]\Desktop\claude-plugins-official
```

**3. Instale as dependências (se não estiver instalado):**
```bash
npm install
```

**4. Inicie o servidor:**
```bash
npm start
```

**Você verá:**
```
✅ GeoRadar Agro rodando em http://localhost:3000
📊 Acesse: http://localhost:3000
```

**5. Abra no navegador:**
```
http://localhost:3000
```

**PRONTO! Sistema rodando 100% offline! 🎉**

---

## 📦 OPÇÃO 2: VERSÃO STANDALONE (HTML Puro - Sem Backend)

Se você quer algo AINDA mais simples que não precisa de Node.js:

### Como fazer:
1. Abra o arquivo `GeoRadar-Agro-Advanced.html` diretamente no navegador
2. Clique 2x para abrir (funciona offline)

**Limitações:**
- Sem banco de dados em tempo real
- Usa dados simulados pré-carregados
- Perfeito para demonstração visual

---

## 🔧 TROUBLESHOOTING

### Erro: "node: comando não encontrado"
**Solução:** Instale Node.js de https://nodejs.org (versão 20.x)

### Erro: "Port 3000 is already in use"
**Solução:** Mude a porta:
```bash
set PORT=3001
npm start
```

### Erro: "npm: comando não encontrado"
**Solução:** Reinstale Node.js (inclui npm automaticamente)

### Erro: "Cannot find module 'express'"
**Solução:** Execute:
```bash
npm install
```

---

## 📱 ACESSAR DE OUTRO COMPUTADOR NA MESMA REDE

Se quiser apresentar em um projetor/outra máquina na mesma rede:

**1. Descubra seu IP local:**
```bash
ipconfig
```
Procure por "IPv4 Address" (algo como `192.168.1.100`)

**2. Acesse de outro PC:**
```
http://192.168.1.100:3000
```

---

## 🎬 DEMO RÁPIDA (30 SEGUNDOS)

```bash
# 1. Navegue até a pasta
cd C:\Users\[seu-usuario]\Desktop\claude-plugins-official

# 2. Inicie
npm start

# 3. Abra no navegador
# http://localhost:3000

# 4. Pronto! Agora apresente:
# - Selecione um estado (SP, MG, BA)
# - Veja 50+ leads carregarem
# - Clique em "Ver Detalhes" para expandir
# - Teste "Exportar para Excel"
# - Mostre a integração WhatsApp
```

---

## 📊 O QUE MOSTRAR PARA O INVESTIDOR

### 1. Dashboard Principal (1 minuto)
- Mostre "Leads Ativos" - quantas propriedades
- Filtre por estado (SP tem ~850k propriedades)
- Mostre que carrega rapidamente

### 2. Módulos Disponíveis (1 minuto)
- Clique em cada módulo (Fundiário, Crédito Rural, Ambiental, Solar Rural, Empresas)
- Mostre que cada um tem leads diferentes

### 3. Cards de Lead (1 minuto)
- Clique em "Ver Detalhes" de um lead
- Mostre: Propriedade, Score, Estado, Status, Tamanho
- Mostre como exportar e enviar WhatsApp

### 4. Filtros Avançados (30 segundos)
- Mostre a busca
- Filtros por módulo
- Relevância

### TOTAL: ~4 minutos de apresentação visual

---

## 💻 SISTEMA OFFLINE - DADOS INCLUSOS

O sistema já vem com:
- ✅ 9.600 propriedades pré-carregadas
- ✅ Todos os 5 módulos funcionando
- ✅ Sem dependência de internet
- ✅ Banco de dados em-memória

**Nenhuma API externa necessária para apresentação!**

---

## 🔐 SEGURANÇA E PRIVACIDADE

- Todos os dados são públicos (INCRA/CAR)
- Sem dados pessoais sensíveis
- Sem dependência de APIs externas
- Funciona 100% localmente

---

## 📝 CHECKLIST PRÉ-APRESENTAÇÃO

- [ ] Node.js 20.x instalado
- [ ] Pasta do projeto copiada
- [ ] `npm install` executado
- [ ] `npm start` funciona
- [ ] `http://localhost:3000` abre no navegador
- [ ] Leads carregam corretamente
- [ ] Botões funcionam
- [ ] Filtros funcionam
- [ ] Documento de apresentação lido

---

## 🎯 ROTEIRO DE APRESENTAÇÃO (10 MINUTOS)

```
1. INTRO (1 min)
   "Essa é a GeoRadar Agro - plataforma que conecta 
    propriedades rurais com oportunidades de negócio"

2. PROBLEMA (2 min)
   - Mostre o dashboard vazio
   - "Gerentes de crédito gastam horas buscando leads"
   - "Dados estão espalhados em várias bases"

3. SOLUÇÃO (2 min)
   - Selecione um estado (SP)
   - "Boom! 850 mil propriedades. Filtradas, qualificadas"
   - Clique em módulos
   - "Cada módulo tem leads específicos do segmento"

4. PRODUTO (3 min)
   - Mostre um lead (clique em "Ver Detalhes")
   - "Score automático de qualificação"
   - Clique em "Exportar Excel"
   - "Leve para o CRM, integre, venda"

5. MERCADO (1 min)
   - "6.5 milhões de propriedades no Brasil"
   - "Mercado de crédito rural: R$ 200 bilhões"
   - "Estamos capturando 1% = R$ 2B de TAM"

6. MODELO (1 min)
   - "SaaS, assinatura mensal"
   - "Gratuito até 100 leads"
   - "Premium: R$ 299/mês"

7. CALL TO ACTION
   - "Quer ver mais? Vamos agendar uma demo?"
```

---

## 📞 SUPORTE

**Tem dúvida durante a apresentação?**
- Respire fundo
- Diga: "Deixa eu mostrar..."
- Faça `Ctrl+Shift+R` para refresh (se necessário)
- Reinicie o servidor se der erro

**Email para suporte:** eng.marcelofifolato@gmail.com

---

**Boa sorte na apresentação! 🚀**
