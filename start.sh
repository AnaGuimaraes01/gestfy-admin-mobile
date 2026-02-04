#!/bin/bash
# Script de inicialização rápida - Gestfy Admin Mobile

echo "═══════════════════════════════════════════════════════════"
echo "  🚀 GESTFY ADMIN MOBILE - Inicialização Rápida"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Verificar se Node.js está instalado
echo "✓ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js não encontrado. Instale em: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  ✓ Node.js $NODE_VERSION"

# Verificar se npm está instalado
echo "✓ Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm não encontrado"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo "  ✓ npm $NPM_VERSION"

# Instalar dependências se não existir node_modules
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "✗ Erro ao instalar dependências"
        exit 1
    fi
    echo "✓ Dependências instaladas"
fi

# Verificar se Expo CLI está instalado
echo ""
echo "✓ Verificando Expo CLI..."
if ! command -v expo &> /dev/null; then
    echo "  ⚠️  Expo CLI não encontrado. Instalando globalmente..."
    npm install -g expo-cli
fi
EXPO_VERSION=$(expo --version 2>/dev/null || echo "instalado")
echo "  ✓ Expo CLI $EXPO_VERSION"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✓ Tudo pronto! Iniciando aplicativo..."
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "💡 INSTRUÇÕES:"
echo "  1. Escanear o QR code com Expo Go"
echo "  2. Android: Use Expo Go app"
echo "  3. iOS: Use câmera (abre Expo Go automaticamente)"
echo "  4. Web: Pressione 'w'"
echo ""
echo "🔌 Pressione Ctrl+C para parar o servidor"
echo ""

# Iniciar Expo
npx expo start
