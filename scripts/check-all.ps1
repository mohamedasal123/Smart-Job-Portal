[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$Backend = Join-Path $Root 'backend'
$Frontend = Join-Path $Root 'frontend'
$Ai = Join-Path $Root 'Ai'

function Write-Section {
    param([string] $Message)
    Write-Host "`n== $Message ==" -ForegroundColor Cyan
}

function Invoke-Native {
    param(
        [Parameter(Mandatory = $true)] [string] $File,
        [string[]] $Arguments = @()
    )

    & $File @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed with exit code ${LASTEXITCODE}: $File $($Arguments -join ' ')"
    }
}

function Invoke-InDirectory {
    param(
        [Parameter(Mandatory = $true)] [string] $Path,
        [Parameter(Mandatory = $true)] [scriptblock] $ScriptBlock
    )

    Push-Location -LiteralPath $Path
    try {
        & $ScriptBlock
    } finally {
        Pop-Location
    }
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

function Read-DotEnvValue {
    param([string] $Path, [string] $Key)
    if (-not (Test-Path -LiteralPath $Path)) { return $null }
    foreach ($line in Get-Content -LiteralPath $Path) {
        if ($line -match "^\s*$([regex]::Escape($Key))\s*=\s*(.*)$") {
            $val = $matches[1].Trim()
            if ($val.Length -ge 2 -and (($val[0] -eq '"' -and $val[-1] -eq '"') -or ($val[0] -eq "'" -and $val[-1] -eq "'"))) {
                $val = $val.Substring(1, $val.Length - 2)
            }
            return $val
        }
    }
    return $null
}

function Set-AiCheckEnvironment {
    $backendEnv = Join-Path $Backend '.env'
    $aiEngineKey = Read-DotEnvValue -Path $backendEnv -Key 'AI_ENGINE_KEY'
    if (-not [string]::IsNullOrWhiteSpace($aiEngineKey)) {
        $env:AI_ENGINE_KEY = $aiEngineKey
        return
    }

    $legacyAiKey = Read-DotEnvValue -Path $backendEnv -Key 'AI_API_KEY'
    if (-not [string]::IsNullOrWhiteSpace($legacyAiKey)) {
        $env:AI_API_KEY = $legacyAiKey
        return
    }

    throw 'AI_ENGINE_KEY is not set in backend/.env, so AI import checks cannot run.'
}

Write-Section 'Checking backend platform requirements'
Invoke-InDirectory $Backend {
    if (Get-Command 'composer' -ErrorAction SilentlyContinue) {
        Invoke-Native 'composer' @('check-platform-reqs')
    } elseif (Test-Path -LiteralPath 'composer.phar') {
        Invoke-Native 'php' @('composer.phar', 'check-platform-reqs')
    } else {
        throw 'Composer was not found.'
    }

    Invoke-Native 'php' @('artisan', 'route:list', '--path=api')
}

Write-Section 'Checking frontend'
Invoke-InDirectory $Frontend {
    Invoke-Native 'npm' @('run', 'lint')
    Invoke-Native 'npm' @('run', 'build')
}

Write-Section 'Checking AI service imports'
$aiPython = Get-VenvPython
Set-AiCheckEnvironment
Invoke-InDirectory $Ai {
    Invoke-Native $aiPython @('-c', "import main; import spacy; spacy.load('en_core_web_sm'); print('AI ok')")
}

Write-Section 'All checks passed'
