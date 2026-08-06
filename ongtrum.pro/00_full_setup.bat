@echo off
chcp 65001 >nul
:: ===================================================
::   CAI DAT TOAN BO ONGTRUM.PRO TREN VPS WINDOWS (CHAY 1 LAN DUY NHAT)
:: ===================================================
:: Chay file nay bang quyen Administrator, ngay trong thu muc app
:: (thu muc chua server.js, package.json).

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Ban phai chay file nay bang quyen Administrator!
    echo Chuot phai vao file -^> "Run as administrator"
    pause
    exit /b 1
)

cd /d "%~dp0"

:: ---- CAU HINH CHUNG (co the sua neu can) ----
set DB_NAME=ongtrum
set DB_USER=postgres
set APP_PORT=3000

:: Tao mat khau PostgreSQL ngau nhien neu chua co (luu lai o db_password.generated.txt)
if not exist db_password.generated.txt (
    powershell -NoProfile -Command "-join ((48..57)+(65..90)+(97..122)|Get-Random -Count 24|%%{[char]$_})" > db_password.generated.txt
)
set /p DB_PASSWORD=<db_password.generated.txt

echo.
echo ===================================================
echo   [1/8] Cai dat Git...
echo ===================================================
call 01_install_git.bat

echo.
echo ===================================================
echo   [2/8] Cai dat Node.js...
echo ===================================================
call 02_install_nodejs.bat

echo.
echo ===================================================
echo   [3/8] Cai dat PostgreSQL...
echo ===================================================
call 03_install_postgresql.bat

echo.
echo ===================================================
echo   [4/8] Tao database "%DB_NAME%"...
echo ===================================================
call 04_setup_database.bat

echo.
echo ===================================================
echo   [5/8] Tao file .env...
echo ===================================================
call 05_setup_env.bat

echo.
echo ===================================================
echo   [6/8] Cai dat thu vien npm...
echo ===================================================
call 06_install_dependencies.bat

echo.
echo ===================================================
echo   [7/8] Cai dat Nginx (reverse proxy port 80 -^> %APP_PORT%)...
echo ===================================================
call 07_install_nginx.bat

echo.
echo ===================================================
echo   [8/8] Mo firewall + dat tu khoi dong cung Windows...
echo ===================================================
call 08_open_firewall.bat
call 09_install_autostart.bat

echo.
echo ===================================================
echo   KHOI DONG UNG DUNG LAN DAU...
echo ===================================================
call start_nginx.bat
call wscript.exe run_hidden.vbs

echo.
echo ===================================================
echo   HOAN TAT CAI DAT!
echo   - Truy cap qua Nginx : http://%COMPUTERNAME%/  (hoac http://^<IP-VPS^>/)
echo   - Truy cap truc tiep : http://^<IP-VPS^>:%APP_PORT%/
echo   - Mat khau PostgreSQL (user postgres) da luu trong: db_password.generated.txt
echo   - NHO: mo file .env va kiem tra lai ADMIN_PASSWORD, SESSION_SECRET, thong tin ngan hang!
echo ===================================================
pause
