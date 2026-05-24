[CmdletBinding()]
param(
    [string] $DumpPath,
    [string] $Database = 'smart_job',
    [string] $Username = 'root',
    [string] $Password = '',
    [string] $HostName = '127.0.0.1',
    [int] $Port = 3306
)

$ErrorActionPreference = 'Stop'

$Root = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$Backend = Join-Path $Root 'backend'

if ([string]::IsNullOrWhiteSpace($DumpPath)) {
    $candidate = Join-Path $Root 'smart_job.sql'
    if (Test-Path -LiteralPath $candidate) {
        $DumpPath = $candidate
    } else {
        throw 'SQL dump not found. Put smart_job.sql in the project root or pass -DumpPath C:\path\dump.sql.'
    }
}

$DumpPath = (Resolve-Path -LiteralPath $DumpPath).Path

function Get-MysqlExe {
    $mysql = Get-Command 'mysql' -ErrorAction SilentlyContinue
    if ($mysql) { return $mysql.Source }

    $xamppMysql = 'C:\xampp\mysql\bin\mysql.exe'
    if (Test-Path -LiteralPath $xamppMysql) { return $xamppMysql }

    throw 'mysql command not found. Start XAMPP and make sure C:\xampp\mysql\bin\mysql.exe exists, or add mysql to PATH.'
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

$mysqlExe = Get-MysqlExe
$baseArgs = @('-h', $HostName, '-P', [string] $Port, '-u', $Username)
if (-not [string]::IsNullOrEmpty($Password)) {
    $baseArgs += "-p$Password"
}

Write-Host "Creating database if missing: $Database" -ForegroundColor Cyan
Invoke-Native $mysqlExe ($baseArgs + @('-e', "CREATE DATABASE IF NOT EXISTS ``$Database`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"))

Write-Host "Importing dump: $DumpPath" -ForegroundColor Cyan
$importArgs = $baseArgs + @($Database)
$process = Start-Process -FilePath $mysqlExe -ArgumentList $importArgs -RedirectStandardInput $DumpPath -NoNewWindow -Wait -PassThru
if ($process.ExitCode -ne 0) {
    throw "Database import failed with exit code $($process.ExitCode)."
}

Push-Location -LiteralPath $Backend
try {
    if (Test-Path -LiteralPath '.env') {
        Invoke-Native 'php' @('artisan', 'config:clear')
    }
} finally {
    Pop-Location
}

Write-Host 'Database imported successfully.' -ForegroundColor Green
