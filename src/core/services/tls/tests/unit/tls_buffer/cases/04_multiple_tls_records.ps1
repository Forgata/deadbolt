# 04_multiple_tls_records.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 04: Multiple TLS records back-to-back"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()

# Build two small TLS records
$rec1 = [byte[]](0x16,0x03,0x03,0x00,0x05) + (0..4 | ForEach-Object { 0x11 })
$rec2 = [byte[]](0x16,0x03,0x03,0x00,0x06) + (0..5 | ForEach-Object { 0x22 })

$stream.Write($rec1, 0, $rec1.Length)
$stream.Write($rec2, 0, $rec2.Length)
$stream.Flush()

Start-Sleep -Seconds 1
$client.Close()
Write-Host "Sent two TLS records consecutively"
