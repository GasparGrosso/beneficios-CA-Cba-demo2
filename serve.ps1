# serve.ps1 — Levanta el prototipo en un servidor estático local.
# Necesario para que localStorage se comparta entre las páginas (mismo origen).
# Uso:  click derecho > "Ejecutar con PowerShell"   ó   powershell -File serve.ps1
param([int]$Port = 5500)

Set-Location -Path $PSScriptRoot
$url = "http://localhost:$Port/"

function Start-WithPython {
  $py = (Get-Command python -ErrorAction SilentlyContinue)
  if (-not $py) { $py = (Get-Command py -ErrorAction SilentlyContinue) }
  if ($py) {
    Write-Host "Servidor en $url  (Ctrl+C para detener)" -ForegroundColor Green
    Start-Process $url
    & $py.Source -m http.server $Port
    return $true
  }
  return $false
}

function Start-WithNpx {
  $npx = (Get-Command npx -ErrorAction SilentlyContinue)
  if ($npx) {
    Write-Host "Servidor en $url  (Ctrl+C para detener)" -ForegroundColor Green
    Start-Process $url
    & $npx.Source --yes serve -l $Port .
    return $true
  }
  return $false
}

if (Start-WithPython) { return }
if (Start-WithNpx)    { return }

Write-Host "No se encontró Python ni Node (npx)." -ForegroundColor Yellow
Write-Host "Instalá alguno, o abrí index.html directamente (con la limitación de que"
Write-Host "localStorage podría no compartirse entre páginas en file://)." -ForegroundColor Yellow
