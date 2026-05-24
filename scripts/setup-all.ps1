[CmdletBinding()]
param(
    [switch] $SkipInstall,
    [switch] $SkipDatabase
)

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$Backend = Join-Path $Root 'backend'
$Frontend = Join-Path $Root 'frontend'
$Ai = Join-Path $Root 'Ai'

function Write-Section {
    param([string] $Message)
    Write-Host "`n== $Message ==" -ForegroundColor Cyan
}

function Test-Command {
    param([string] $Name)
    return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
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

function Invoke-Composer {
    param([string[]] $ComposerArgs)

    $composerPhar = Join-Path $Backend 'composer.phar'
    if (Test-Command 'composer') {
        Invoke-Native 'composer' $ComposerArgs
        return
    }

    if (Test-Path -LiteralPath $composerPhar) {
        Invoke-Native 'php' (@($composerPhar) + $ComposerArgs)
        return
    }

    throw 'Composer was not found. Install Composer or keep backend/composer.phar available.'
}

function Ensure-EnvFile {
    param([string] $Directory)

    $envFile = Join-Path $Directory '.env'
    $exampleFile = Join-Path $Directory '.env.example'

    if (Test-Path -LiteralPath $envFile) {
        Write-Host "Exists: $envFile"
        return
    }

    if (-not (Test-Path -LiteralPath $exampleFile)) {
        throw "Missing example env file: $exampleFile"
    }

    Copy-Item -LiteralPath $exampleFile -Destination $envFile
    Write-Host "Created: $envFile"
}

function Ensure-DotEnvValue {
    param(
        [string] $Path,
        [string] $Key,
        [scriptblock] $ValueFactory
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Missing env file: $Path"
    }

    $content = Get-Content -LiteralPath $Path -Raw
    if ($content -match "(?m)^$([regex]::Escape($Key))=(.+)$" -and -not [string]::IsNullOrWhiteSpace($matches[1])) {
        Write-Host "$Key already exists."
        return
    }

    $value = & $ValueFactory
    if ($content -match "(?m)^$([regex]::Escape($Key))=.*$") {
        $content = $content -replace "(?m)^$([regex]::Escape($Key))=.*$", "$Key=$value"
    } else {
        $content = $content.TrimEnd() + "`r`n$Key=$value`r`n"
    }

    Set-Content -LiteralPath $Path -Value $content -NoNewline
    Write-Host "Generated: $Key"
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

    return $null
}

Write-Section 'Checking required commands'
foreach ($command in @('php', 'npm', 'python')) {
    if (-not (Test-Command $command)) {
        throw "Required command not found: $command"
    }
    Write-Host "Found: $command"
}

Write-Section 'Creating local env files'
Ensure-EnvFile $Backend
Ensure-EnvFile $Frontend

Ensure-DotEnvValue (Join-Path $Backend '.env') 'AI_ENGINE_KEY' {
    -join ((1..64) | ForEach-Object { '{0:x}' -f (Get-Random -Minimum 0 -Maximum 16) })
}

if (-not $SkipInstall) {
    Write-Section 'Installing backend dependencies'
    Invoke-InDirectory $Backend {
        Invoke-Composer @('install')
    }

    Write-Section 'Installing frontend dependencies'
    Invoke-InDirectory $Frontend {
        Invoke-Native 'npm' @('install')
    }

    Write-Section 'Preparing AI virtual environment'
    Invoke-InDirectory $Ai {
        if (-not (Test-Path -LiteralPath '.venv')) {
            Invoke-Native 'python' @('-m', 'venv', '.venv')
        } else {
            Write-Host 'Exists: Ai/.venv'
        }

        $venvPython = Get-VenvPython
        if (-not $venvPython) {
            throw 'Could not find the virtual environment Python executable.'
        }

        Invoke-Native $venvPython @('-m', 'pip', 'install', '--upgrade', 'pip')
        Invoke-Native $venvPython @('-m', 'pip', 'install', '-r', 'requirements.txt')
    }
} else {
    Write-Host 'Skipped dependency installation.'
}

Write-Section 'Preparing Laravel app key and storage link'
Invoke-InDirectory $Backend {
    $envContent = Get-Content -LiteralPath '.env' -Raw
    if ($envContent -notmatch '(?m)^APP_KEY=base64:') {
        Invoke-Native 'php' @('artisan', 'key:generate')
    } else {
        Write-Host 'APP_KEY already exists.'
    }

    if (-not (Test-Path -LiteralPath (Join-Path 'public' 'storage'))) {
        Invoke-Native 'php' @('artisan', 'storage:link')
    } else {
        Write-Host 'Storage link already exists.'
    }

    foreach ($clearCommand in @('config:clear', 'route:clear', 'view:clear')) {
        Invoke-Native 'php' @('artisan', $clearCommand)
    }
}

if (-not $SkipDatabase) {
    Write-Section 'Running database migrations and seeders'
    try {
        Invoke-InDirectory $Backend {
            Invoke-Native 'php' @('artisan', 'migrate', '--seed')
        }
    } catch {
        Write-Warning 'Database setup failed. Start MySQL in XAMPP, create database smart_job, then run scripts/db-migrate-seed.ps1.'
        Write-Warning $_.Exception.Message
    }
} else {
    Write-Host 'Skipped database migration and seeding.'
}

Write-Section 'Setup finished'
Write-Host 'Run scripts/start-all.ps1 to start the project.'
