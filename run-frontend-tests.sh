#!/bin/bash

echo "🚀 Iniciando testes de frontend..."
echo ""

# Iniciar servidor em background
node api/server-local.js > /tmp/server.log 2>&1 &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 2

# Executar testes
node api/test-frontend-integration.js

# Parar servidor
kill $SERVER_PID 2>/dev/null || true

echo "✅ Testes concluídos"
