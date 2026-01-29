# 06_garbage_unknown.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 06: Garbage / Unknown protocol"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()

$bytes = [byte[]](0x99,0x88,0x77,0x66,0x55)
$stream.Write($bytes, 0, $bytes.Length)
$stream.Flush()

Start-Sleep -Seconds 1
$client.Close()
Write-Host "Sent garbage bytes"
