@echo off
chcp 65001 >nul
cd /d "%~dp0"
set NGINX_VERSION=1.26.2
set NGINX_DIR=nginx-%NGINX_VERSION%

echo Dang tat Nginx...
cd %NGINX_DIR%
nginx.exe -s quit
cd ..
echo Nginx da duoc tat.
