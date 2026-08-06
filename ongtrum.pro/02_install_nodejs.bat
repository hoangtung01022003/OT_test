@echo off
chcp 65001 >nul
:: Cai dat Node.js LTS (bo qua neu da co)

where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [!] Node.js da duoc cai dat. Bo qua.
    node -v
    goto :eof
)

set NODE_VERSION=22.11.0
set NODE_MSI=node-v%NODE_VERSION%-x64.msi
set NODE_URL=https://nodejs.org/dist/v%NODE_VERSION%/%NODE_MSI%

echo Dang tai Node.js v%NODE_VERSION%...
powershell -Command "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%TEMP%\%NODE_MSI%'"

echo Dang cai dat Node.js (im lang)...
msiexec /i "%TEMP%\%NODE_MSI%" /qn /norestart ADDLOCAL=ALL

del "%TEMP%\%NODE_MSI%" >nul 2>&1

:: Them Node vao PATH cho phien lam viec hien tai
set "PATH=%PATH%;C:\Program Files\nodejs"

echo [OK] Da cai dat Node.js.
