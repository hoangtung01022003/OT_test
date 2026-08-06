@echo off
chcp 65001 >nul
:: Cai dat PostgreSQL (bo qua neu da co). Dat mat khau superuser "postgres" = %DB_PASSWORD%

if not defined DB_PASSWORD (
    echo [!] Chua co bien DB_PASSWORD, dang tao mat khau ngau nhien...
    cd /d "%~dp0"
    if not exist db_password.generated.txt (
        powershell -NoProfile -Command "-join ((48..57)+(65..90)+(97..122)|Get-Random -Count 24|%%{[char]$_})" > db_password.generated.txt
    )
    set /p DB_PASSWORD=<db_password.generated.txt
)

set PG_BIN=C:\Program Files\PostgreSQL\16\bin
if exist "%PG_BIN%\psql.exe" (
    echo [!] PostgreSQL da duoc cai dat. Bo qua buoc cai dat.
    set "PATH=%PATH%;%PG_BIN%"
    goto :eof
)

set PG_VERSION=16.4-1
set PG_INSTALLER=postgresql-%PG_VERSION%-windows-x64.exe
set PG_URL=https://get.enterprisedb.com/postgresql/%PG_INSTALLER%

echo Dang tai PostgreSQL %PG_VERSION%...
powershell -Command "Invoke-WebRequest -Uri '%PG_URL%' -OutFile '%TEMP%\%PG_INSTALLER%'"

echo Dang cai dat PostgreSQL (im lang, co the mat vai phut)...
"%TEMP%\%PG_INSTALLER%" --mode unattended --unattendedmodeui minimal ^
    --superpassword "%DB_PASSWORD%" ^
    --servicename postgresql ^
    --serverport 5432 ^
    --locale "English, United States"

del "%TEMP%\%PG_INSTALLER%" >nul 2>&1

set "PATH=%PATH%;%PG_BIN%"

echo [OK] Da cai dat PostgreSQL. Mat khau superuser "postgres" da luu trong db_password.generated.txt
