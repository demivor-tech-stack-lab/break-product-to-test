@echo off
rem Dong bo thu muc test len GitHub: chi commit + push khi co thay doi.
rem Chay tu dong moi toi (Task Scheduler "BreakProductToTest-DailySync") hoac double-click.
setlocal
cd /d "%~dp0"
echo ==== %date% %time% ==== >> sync.log
git pull --rebase --autostash -q >> sync.log 2>&1
git add -A >> sync.log 2>&1
git diff --cached --quiet
if %errorlevel%==0 (
  echo khong co thay doi >> sync.log
  exit /b 0
)
for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"') do set TODAY=%%i
git commit -q -m "Daily test update %TODAY%" >> sync.log 2>&1
git push -q origin main >> sync.log 2>&1
if errorlevel 1 (echo PUSH THAT BAI >> sync.log) else (echo da push >> sync.log)
endlocal
