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
        [string] $Command,
        [hashtable] $EnvVars = @{}
    )

    $shell = Get-ShellPath
    $envSetup = ''
    foreach ($key in $EnvVars.Keys) {
        $envSetup += "`$env:$key = $(Quote-PS $EnvVars[$key]); "
    }
    $windowCommand = "`$Host.UI.RawUI.WindowTitle = $(Quote-PS $Title); Set-Location -LiteralPath $(Quote-PS $WorkDir); $envSetup$Command"
    Start-Process -FilePath $shell -ArgumentList @('-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $windowCommand)
}

function Read-DotEnvValue {
    param([string] $Path, [string] $Key)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    foreach ($line in Get-Content -LiteralPath $Path) {
        if ($line -match "^\s*$([regex]::Escape($Key))\s*=\s*(.*)$") {
            $val = $matches[1].Trim()
            # Strip surrounding quotes if present
            if ($val.Length -ge 2 -and (($val[0] -eq '"' -and $val[-1] -eq '"') -or ($val[0] -eq "'" -and $val[-1] -eq "'"))) {
                $val = $val.Substring(1, $val.Length - 2)
            }
            return $val
        }
    }
    return $null
}

foreach ($file in @((Join-Path $Backend '.env'), (Join-Path $Frontend '.env'))) {
    if (-not (Test-Path -LiteralPath $file)) {
        Write-Warning "Missing $file. Run scripts/setup-all.ps1 first."
    }
}

$aiPython = Get-VenvPython

# Share the AI engine key from backend/.env so backend and AI service authenticate against the same secret.
$aiEnv = @{}
$aiKey = Read-DotEnvValue -Path (Join-Path $Backend '.env') -Key 'AI_ENGINE_KEY'
if ([string]::IsNullOrWhiteSpace($aiKey)) {
    Write-Warning 'AI_ENGINE_KEY not set in backend/.env. The AI service will refuse to start. Generate a random value, e.g. "php -r `"echo bin2hex(random_bytes(32));`"" and set it in backend/.env.'
} else {
    $aiEnv['AI_ENGINE_KEY'] = $aiKey
}

Start-DevWindow 'SmartJob Backend' $Backend 'php artisan serve --host=127.0.0.1 --port=8000'
Start-DevWindow 'SmartJob Queue' $Backend 'php artisan queue:listen --queue=cv-parsing,default --tries=1'
Start-DevWindow 'SmartJob AI' $Ai "& $(Quote-PS $aiPython) -m uvicorn main:app --host 127.0.0.1 --port 8001" $aiEnv
Start-DevWindow 'SmartJob Frontend' $Frontend 'npm run dev'

Write-Host 'Started project windows.' -ForegroundColor Green
Write-Host 'Frontend: http://127.0.0.1:5173'
Write-Host 'Backend:  http://127.0.0.1:8000'
Write-Host 'AI:       http://127.0.0.1:8001/health'
