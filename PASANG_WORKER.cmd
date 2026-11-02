@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo  Pasang Worker AI NUTRIVA (sekali jalan)
echo ============================================
echo.
echo 1/5 Memasang dependensi proyek...
call npm ci --ignore-scripts
if errorlevel 1 goto gagal
echo.
echo 2/5 Masuk ke Cloudflare (peramban akan terbuka, setujui akses)...
call npx wrangler login
if errorlevel 1 goto gagal
echo.
echo 3/5 Mengunggah Worker...
call npx wrangler deploy
if errorlevel 1 goto gagal
echo.
echo 4/5 Pasang kunci OpenRouter BARU. Tempel saat diminta (tidak tampil di layar).
call npx wrangler secret put OPENROUTER_API_KEY
if errorlevel 1 goto gagal
echo.
set /p URLW=5/5 Tempel URL Worker dari langkah 3 (https://nutriva-ai....workers.dev): 
call npx tsx src/tools/cli-uji-worker.ts %URLW% http://localhost:5173
echo.
echo Selesai. Kirim hasil uji di atas ke Claude.
pause
exit /b 0
:gagal
echo.
echo Ada langkah yang gagal. Fotokan atau salin pesan di atas dan kirim ke Claude.
pause
exit /b 1
