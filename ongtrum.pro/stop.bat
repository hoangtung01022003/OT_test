@echo off
chcp 65001 >nul
echo Dang tim va tat tien trinh Node.js dang chay ngam...
taskkill /F /IM node.exe /T >nul 2>&1

echo [OK] Da tat. Cong da duoc giai phong.
pause
