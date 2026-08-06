@echo off
chcp 65001 >nul
:: Dat ung dung + Nginx tu dong chay lai moi khi VPS khoi dong (Task Scheduler)

cd /d "%~dp0"
set NGINX_VERSION=1.26.2

echo Dang tao scheduled task "OngtrumApp"...
schtasks /create /tn "OngtrumApp" /tr "wscript.exe \"%~dp0run_hidden.vbs\"" /sc onstart /ru "SYSTEM" /rl HIGHEST /f >nul

echo Dang tao scheduled task "OngtrumNginx"...
schtasks /create /tn "OngtrumNginx" /tr "\"%~dp0nginx-%NGINX_VERSION%\nginx.exe\"" /sc onstart /ru "SYSTEM" /rl HIGHEST /f >nul

echo [OK] Da dat tu dong khoi chay ung dung + Nginx khi VPS restart.
echo      (Xem/xoa trong Task Scheduler: task "OngtrumApp" va "OngtrumNginx")
