$Address = "127.0.0.1"
$Port = 7890
$CasesPath = Join-Path $PSScriptRoot "cases"

$TestFiles = Get-ChildItem -Path $CasesPath -Filter "*.txt" | Sort-Object Name

Write-Host "`n========================================" -ForegroundColor Gray
Write-Host "   HTTP PARSER PROTOCOL TEST SUITE" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Gray

$Passed = 0
$Failed = 0

foreach ($File in $TestFiles) {
    $TestName = $File.BaseName
    Write-Host "TEST: $($TestName.PadRight(25))" -NoNewline -ForegroundColor White
    
    try {
        $Client = New-Object System.Net.Sockets.TcpClient($Address, $Port)
        $Stream = $Client.GetStream()

        $Payload = [System.IO.File]::ReadAllBytes($File.FullName)

        $Stream.Write($Payload, 0, $Payload.Length)
        $Stream.Flush()
        
        Start-Sleep -Milliseconds 250
        
        $Client.Close()
        Write-Host "[ SENT ]" -ForegroundColor Green
        $Passed++
    }
    catch {
        Write-Host "[ FAIL ]" -ForegroundColor Red
        Write-Host "      Reason: $($_.Exception.Message)" -ForegroundColor DarkGray
        $Failed++
    }
}

Write-Host "`n========================================" -ForegroundColor Gray
Write-Host " RESULTS: $Passed Sent / $Failed Failed" -ForegroundColor Yellow
Write-Host "========================================`n" -ForegroundColor Gray