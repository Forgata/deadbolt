# Get all .ps1 files in the cases directory
$testPath = Join-Path (Get-Location) "cases"
$testFiles = Get-ChildItem -Path $testPath -Filter "*.ps1" | Sort-Object Name

Write-Host "--- STARTING PROTOCOL TEST SUITE ---" -ForegroundColor Cyan
Write-Host "Found $($testFiles.Count) test cases.`n"

foreach ($file in $testFiles) {
    Write-Host "EXECUTING: $($file.Name)... " -NoNewline -ForegroundColor Yellow
    
    try {        
        & $file.FullName
        Write-Host "[ DONE ]" -ForegroundColor Green
    }
    catch {
        Write-Host "[ ERROR ]" -ForegroundColor Red
        Write-Host "$($_.Exception.Message)" -ForegroundColor Gray
    }

    # 5-second gap
    Write-Host "Cooldown: " -NoNewline -ForegroundColor DarkGray
    for ($i = 5; $i -gt 0; $i--) {
        Write-Host "$i " -NoNewline
        Start-Sleep -Seconds 1
    }
    Write-Host "`n"
}

Write-Host "--- ALL TESTS COMPLETED ---" -ForegroundColor Cyan