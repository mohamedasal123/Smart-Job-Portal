[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$Backend = Join-Path $Root 'backend'

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

Push-Location -LiteralPath $Backend
try {
    if (-not (Test-Path -LiteralPath '.env')) {
        if (-not (Test-Path -LiteralPath '.env.example')) {
            throw 'Missing backend/.env and backend/.env.example.'
        }
        Copy-Item -LiteralPath '.env.example' -Destination '.env'
        Invoke-Native 'php' @('artisan', 'key:generate')
    }

    foreach ($clearCommand in @('config:clear', 'route:clear', 'view:clear')) {
        Invoke-Native 'php' @('artisan', $clearCommand)
    }
    Invoke-Native 'php' @('artisan', 'migrate', '--seed')
} finally {
    Pop-Location
}

Write-Host 'Database migrated and seeded.' -ForegroundColor Green
