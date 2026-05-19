[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$Backend = Join-Path $Root 'backend'
$Frontend = Join-Path $Root 'frontend'
$Ai = Join-Path $Root 'Ai'

function Quote-PS {
    param([string] $Value)
    return "'" + $Value.Replace("'", "''") + "'"
}

function Get-ShellPath {
    $pwsh = Get-Command 'pwsh' -ErrorAction SilentlyContinue
    if ($pwsh) {
        return $pwsh.Source
    }

    $powershell = Get-Command 'powershell' -ErrorAction SilentlyContinue
    if ($powershell) {
        return $powershell.Source
    }

    throw 'Could not find pwsh or powershell.'
}

function Get-VenvPython {
    $windowsPython = Join-Path $Ai '.venv\Scripts\python.exe'
    if (Test-Path -LiteralPath $windowsPython) {
        return $windowsPython
    }

    $unixPython = Join-Path $Ai '.venv/bin/python'
    if (Test-Path -LiteralPath $unixPython) {
        return $unixPython
    }

    return 'python'
}

function Start-DevWindow {
    param(
        [string] $Title,
        [string] $WorkDir,
        [string] $Command
    )

    $shell = Get-ShellPath
    $windowCommand = "`$Host.UI.RawUI.WindowTitle = $(Quote-PS $Title); Set-Location -LiteralPath $(Quote-PS $WorkDir); $Command"
    Start-Process -FilePath $shell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $windowCommand)
}

foreach ($file in @((Join-Path $Backend '.env'), (Join-Path $Frontend '.env'))) {
    if (-not (Test-Path -LiteralPath $file)) {
        Write-Warning "Missing $file. Run scripts/setup-all.ps1 first."
    }
}

$aiPython = Get-VenvPython

Start-DevWindow 'SmartJob Backend' $Backend 'php artisan serve --host=127.0.0.1 --port=8000'
Start-DevWindow 'SmartJob Queue' $Backend 'php artisan queue:listen --queue=cv-parsing,default --tries=1'
Start-DevWindow 'SmartJob AI' $Ai "& $(Quote-PS $aiPython) -m uvicorn main:app --host 127.0.0.1 --port 8001"
Start-DevWindow 'SmartJob Frontend' $Frontend 'npm run dev'

Write-Host 'Started project windows.' -ForegroundColor Green
Write-Host 'Frontend: http://127.0.0.1:5173'
Write-Host 'Backend:  http://127.0.0.1:8000'
Write-Host 'AI:       http://127.0.0.1:8001/health'
