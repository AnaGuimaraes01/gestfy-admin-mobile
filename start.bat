@echo off
REM Script de inicialização para Windows - Gestfy Admin Mobile

echo.
echo ===============================================================
echo   GESTFY ADMIN MOBILE - Inicializacao Rapida (Windows)
echo ===============================================================
echo.

REM Verificar se Node.js está instalado
echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo Erro: Node.js nao encontrado. Instale em: https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo   OK Node.js %NODE_VERSION%

REM Verificar se npm está instalado
echo Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo Erro: npm nao encontrado
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo   OK npm %NPM_VERSION%

REM Instalar dependências se não existir node_modules
if not exist "node_modules" (
    echo.
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo Erro ao instalar dependencias
        pause
        exit /b 1
    )
    echo OK Dependencias instaladas
)

echo.
echo ===============================================================
echo   Tudo pronto! Iniciando aplicativo...
echo ===============================================================
echo.
echo INSTRUCOES:
echo   1. Escanear o QR code com Expo Go
echo   2. Android: Use o app Expo Go
echo   3. iOS: Use a camera e abre Expo Go automaticamente
echo   4. Web: Pressione 'w'
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

REM Iniciar Expo
call npx expo start

pause
