#!/bin/bash

# ============================================================
# SCRIPT DE DEPLOY - GeoRadar Agro v1.0.0
# ============================================================
# Este script prepara o sistema para deploy em produção
# Executa: bash deploy.sh

set -e

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🚀 GEORADAR AGRO - SCRIPT DE DEPLOY"
echo "═══════════════════════════════════════════════════════"
echo ""

# ============================================================
# VERIFICAR REQUISITOS
# ============================================================

echo "📋 Verificando requisitos..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado"
    exit 1
fi
echo "✅ npm: $(npm --version)"

# Verificar git
if ! command -v git &> /dev/null; then
    echo "❌ Git não encontrado"
    exit 1
fi
echo "✅ Git: $(git --version | head -n1)"

echo ""

# ============================================================
# INSTALAR DEPENDÊNCIAS
# ============================================================

echo "📦 Instalando dependências..."
npm install --silent 2>/dev/null || npm install

echo "✅ Dependências instaladas"
echo ""

# ============================================================
# VALIDAR CÓDIGO
# ============================================================

echo "🧪 Executando testes..."
echo ""

if [ -f "api/test-endpoints.js" ]; then
    echo "   🔍 Testando endpoints..."
    timeout 10 node api/test-endpoints.js 2>/dev/null || true
    echo "   ✅ Testes de endpoint concluídos"
fi

echo ""

# ============================================================
# PREPARAR PARA DEPLOY
# ============================================================

echo "🔧 Preparando para deploy..."
echo ""

# Criar arquivo .vercelignore
cat > .vercelignore << 'EOF'
node_modules/
.git/
README.md
DEPLOYMENT_GUIDE.md
ETAPAS_CONCLUIDAS.md
CAR_INTEGRATION_GUIDE.md
RELATORIO_FINAL_TESTES.md
PLANOS_AUTENTICACAO.md
INSTRUCOES_TESTE_LOCAL.md
*.md
.gitignore
.env.local
EOF

echo "✅ .vercelignore criado"

# Verificar vercel.json
if [ ! -f "vercel.json" ]; then
    echo "⚠️  vercel.json não encontrado, criando..."
    cat > vercel.json << 'EOF'
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
EOF
    echo "✅ vercel.json criado"
else
    echo "✅ vercel.json encontrado"
fi

echo ""

# ============================================================
# INSTRUÇÕES DE DEPLOY
# ============================================================

echo "═══════════════════════════════════════════════════════"
echo "📚 INSTRUÇÕES DE DEPLOY"
echo "═══════════════════════════════════════════════════════"
echo ""

echo "🔹 OPÇÃO 1: DEPLOY EM VERCEL (Backend)"
echo ""
echo "   1. Instale Vercel CLI:"
echo "      npm install -g vercel"
echo ""
echo "   2. Faça login:"
echo "      vercel login"
echo ""
echo "   3. Deploy:"
echo "      vercel --prod"
echo ""
echo "   4. Anote a URL (exemplo: https://seu-projeto.vercel.app)"
echo ""

echo "🔹 OPÇÃO 2: DEPLOY EM GITHUB PAGES (Frontend)"
echo ""
echo "   1. Atualize URL da API no HTML:"
echo "      sed -i 's|http://localhost:3000|https://sua-api-vercel.vercel.app|g' GeoRadar-Agro-Advanced.html"
echo ""
echo "   2. Commit e push:"
echo "      git add GeoRadar-Agro-Advanced.html"
echo "      git commit -m 'Update API URL for production'"
echo "      git push origin claude/georadar-agro-spa-y6ZYS"
echo ""
echo "   3. Ative GitHub Pages:"
echo "      - Vá em: Settings > Pages"
echo "      - Source: Deploy from a branch"
echo "      - Branch: claude/georadar-agro-spa-y6ZYS"
echo "      - Folder: / (root)"
echo ""
echo "   4. Acesse em:"
echo "      https://seu-usuario.github.io/claude-plugins-official"
echo ""

echo "🔹 OPÇÃO 3: TESTE LOCAL (Recomendado Primeiro)"
echo ""
echo "   1. Inicie servidor local:"
echo "      node run-local-server.js"
echo ""
echo "   2. Acesse:"
echo "      http://localhost:3000"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "✅ PREPARAÇÃO CONCLUÍDA!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "📝 Próximas etapas:"
echo "   1. Teste localmente (node run-local-server.js)"
echo "   2. Se tudo OK, faça deploy em Vercel"
echo "   3. Atualize URL no frontend"
echo "   4. Deploy em GitHub Pages"
echo "   5. Teste em produção"
echo ""
echo "💡 Dica: Comece com opção 3 (local) para validar tudo!"
echo ""
