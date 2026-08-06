@echo off
chcp 65001 >nul
:: Cai dat Git for Windows (bo qua neu da co)

where git >nul 2>&1
if %errorlevel% equ 0 (
    echo [!] Git da duoc cai dat. Bo qua.
    goto :eof
)

set GIT_VERSION=2.47.1
set GIT_INSTALLER=Git-%GIT_VERSION%-64-bit.exe
set GIT_URL=https://github.com/git-for-windows/git/releases/download/v%GIT_VERSION%.windows.1/%GIT_INSTALLER%

echo Dang tai Git %GIT_VERSION%...
powershell -Command "Invoke-WebRequest -Uri '%GIT_URL%' -OutFile '%TEMP%\%GIT_INSTALLER%'"

echo Dang cai dat Git (im lang)...
"%TEMP%\%GIT_INSTALLER%" /VERYSILENT /NORESTART /NOCANCEL /SP- /SUPPRESSMSGBOXES

del "%TEMP%\%GIT_INSTALLER%" >nul 2>&1

:: Them Git vao PATH cho phien lam viec hien tai
set "PATH=%PATH%;C:\Program Files\Git\cmd"

echo [OK] Da cai dat Git.
