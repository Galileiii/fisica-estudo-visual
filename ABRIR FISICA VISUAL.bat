@echo off
title Fisica Visual
cd /d "%~dp0"

if not exist "node_modules" (
  echo.
  echo Primeira vez: instalando o necessario. Isso leva alguns segundos...
  echo.
  call npm install
)

echo.
echo Abrindo o Fisica Visual no navegador...
echo Deixe esta janela preta aberta enquanto estiver estudando.
echo Para fechar o app, feche esta janela.
echo.

call npm run dev
pause
