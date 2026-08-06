@echo off
chcp 65001 >nul
:: Cai dat thu vien npm cho ung dung

cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs"

echo Dang chay npm install...
call npm install

echo [OK] Da cai dat xong thu vien.
