@echo off
chcp 65001 >nul
:: Tao database "ongtrum" tren PostgreSQL local (bo qua neu da co)

cd /d "%~dp0"
if not defined DB_NAME set DB_NAME=ongtrum
if not defined DB_USER set DB_USER=postgres
if not defined DB_PASSWORD (
    if exist db_password.generated.txt (
        set /p DB_PASSWORD=<db_password.generated.txt
    )
)

set "PATH=%PATH%;C:\Program Files\PostgreSQL\16\bin"
set PGPASSWORD=%DB_PASSWORD%

for /f "delims=" %%i in ('psql -U %DB_USER% -h localhost -tAc "SELECT 1 FROM pg_database WHERE datname='%DB_NAME%'" 2^>nul') do set DB_EXISTS=%%i

if "%DB_EXISTS%"=="1" (
    echo [!] Database "%DB_NAME%" da ton tai. Bo qua.
) else (
    echo Dang tao database "%DB_NAME%"...
    psql -U %DB_USER% -h localhost -c "CREATE DATABASE %DB_NAME%;"
    echo [OK] Da tao database "%DB_NAME%".
)

set PGPASSWORD=
