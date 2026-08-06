@echo off
cd /d "%~dp0"
set "PATH=%PATH%;C:\Program Files\nodejs"
node server.js
pause
