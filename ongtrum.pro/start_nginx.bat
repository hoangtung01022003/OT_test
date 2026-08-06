@echo off
chcp 65001 >nul
cd /d "%~dp0"
set NGINX_VERSION=1.26.2
set NGINX_DIR=nginx-%NGINX_VERSION%

echo Dang khoi dong Nginx...
cd %NGINX_DIR%
start nginx.exe
cd ..
echo Nginx dang chay. Da co the truy cap qua cong 80.
