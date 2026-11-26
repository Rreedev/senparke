# Siteyi derler ve GitHub Pages'e (gh-pages dalı) yayınlar.
# Kullanım: powershell -File scripts\deploy.ps1 "değişiklik notu"
param([string]$Message = "Site güncellemesi")
$ErrorActionPreference = 'Stop'
$env:Path = "C:\Program Files\Git\cmd;$env:Path"
Set-Location (Split-Path $PSScriptRoot -Parent)

node scripts/build-site.js
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -q -m $Message -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" }
git push -q origin main
$split = git subtree split --prefix public
git push -f -q origin "${split}:refs/heads/gh-pages"
Write-Host "Yayınlandı: https://$(Get-Content public\CNAME)"
