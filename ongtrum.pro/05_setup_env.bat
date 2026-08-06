@echo off
chcp 65001 >nul
:: Tao file .env tu .env.example (neu chua co), tu dong dien DATABASE_URL + SESSION_SECRET

cd /d "%~dp0"
if not defined DB_NAME set DB_NAME=ongtrum
if not defined DB_USER set DB_USER=postgres
if not defined APP_PORT set APP_PORT=3000
if not defined DB_PASSWORD (
    if exist db_password.generated.txt (
        set /p DB_PASSWORD=<db_password.generated.txt
    )
)

if exist .env (
    echo [!] File .env da ton tai. Khong ghi de.
    goto :review
)

echo Dang tao .env tu .env.example...
copy /Y .env.example .env >nul

powershell -NoProfile -Command ^
    "$path = '.env';" ^
    "$secret = -join ((48..57)+(65..90)+(97..122)|Get-Random -Count 32|%%{[char]$_});" ^
    "$dbUrl = 'postgresql://%DB_USER%:%DB_PASSWORD%@localhost:5432/%DB_NAME%';" ^
    "(Get-Content $path) |" ^
    "  ForEach-Object { $_ -replace '^PORT=.*', ('PORT=' + '%APP_PORT%') } |" ^
    "  ForEach-Object { $_ -replace '^SESSION_SECRET=.*', ('SESSION_SECRET=' + $secret) } |" ^
    "  ForEach-Object { $_ -replace '^DATABASE_URL=.*', ('DATABASE_URL=' + $dbUrl) } |" ^
    "  Set-Content $path"

echo [OK] Da tao .env voi DATABASE_URL va SESSION_SECRET tu dong.

:review
echo.
echo ===================================================
echo   QUAN TRONG: kiem tra lai .env truoc khi chay app!
echo   - ADMIN_USERNAME / ADMIN_PASSWORD (dang mac dinh la yeu)
echo   - Thong tin ngan hang BANK_* (neu dung tinh nang donate)
echo   Notepad se mo ra, sua xong thi Luu (Ctrl+S) roi dong lai.
echo ===================================================
notepad .env
