@echo off
chcp 65001 >nul
:: Chay file nay TREN VPS moi lan muon cap nhat code moi tu GitHub
echo ===================================================
echo   TIEN TRINH CAP NHAT CODE ONGTRUM.PRO TREN VPS
echo ===================================================

cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Git\cmd"

echo.
echo [1/4] Dang tai code moi nhat tu GitHub...
cd ..
git pull origin main
cd ongtrum.pro

echo.
echo [2/4] Dang kiem tra va cai dat thu vien moi (neu co)...
call npm install

echo.
echo [3/4] Dang tat ung dung cu...
taskkill /F /IM node.exe /T >nul 2>&1

echo.
echo [4/4] Dang khoi dong lai ung dung...
call wscript.exe run_hidden.vbs

echo.
echo ===================================================
echo   HOAN TAT! UNG DUNG DA DUOC CAP NHAT VA DANG CHAY.
echo ===================================================
pause
