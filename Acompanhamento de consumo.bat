@echo off
echo Verificando e instalando dependencias...
IF NOT EXIST node_modules (
    npm install
)
echo Iniciando o servidor de desenvolvimento...
start http://localhost:5173
npm run dev
pause