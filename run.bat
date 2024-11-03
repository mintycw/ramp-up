@echo off

echo "Starting both scripts..."

start cmd.exe @cmd /k "cd ./Client && npm i --force && npm run start"
start cmd.exe @cmd /k "cd ./Server && npm i --force && npm run dev"