@echo off
chcp 65001 >nul
:: Cai dat va cau hinh Nginx lam reverse proxy (port 80 -> port app 3000)

cd /d "%~dp0"
set NGINX_VERSION=1.26.2
set NGINX_ZIP=nginx-%NGINX_VERSION%.zip
set NGINX_DIR=nginx-%NGINX_VERSION%

if exist %NGINX_DIR% (
    echo [!] Nginx da ton tai. Bo qua buoc tai ve...
    goto :config_nginx
)

echo Dang tai Nginx %NGINX_VERSION%...
powershell -Command "Invoke-WebRequest -Uri 'http://nginx.org/download/%NGINX_ZIP%' -OutFile '%NGINX_ZIP%'"

echo Dang giai nen...
powershell -Command "Expand-Archive -Path '%NGINX_ZIP%' -DestinationPath '.' -Force"
del %NGINX_ZIP%

:config_nginx
echo Dang copy file cau hinh nginx.conf...
copy /Y nginx_config\nginx.conf %NGINX_DIR%\conf\nginx.conf

echo [OK] Da cai dat Nginx. Dung start_nginx.bat / stop_nginx.bat de dieu khien.
