# Configuration
$Address = "127.0.0.1"
$Port = 7890
$CasesPath = Join-Path $PSScriptRoot "cases"

# Get all .txt files and sort them numerically/alphabetically
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

        # Read the exact raw bytes from the file
        $Payload = [System.IO.File]::ReadAllBytes($File.FullName)

        # Send the payload
        $Stream.Write($Payload, 0, $Payload.Length)
        $Stream.Flush()

        # Small delay for the server to process and close
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