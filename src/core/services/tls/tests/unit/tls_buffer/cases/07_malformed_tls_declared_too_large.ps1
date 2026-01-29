# 07_malformed_tls_declared_too_large.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 07: Malformed TLS - declared length too large"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()

# TLS header with huge declared length 0xFF 0xFF (65535)
$bytes = [byte[]](0x16,0x03,0x03,0xFF,0xFF)
$stream.Write($bytes, 0, $bytes.Length)
$stream.Flush()

Start-Sleep -Seconds 1
$client.Close()
Write-Host "Sent TLS header with oversized declared length"
