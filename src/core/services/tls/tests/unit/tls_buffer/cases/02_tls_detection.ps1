# 02_tls_detection.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 02: TLS detection (single write)"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()

# Minimal TLS record header + small fake payload:
# 0x16 = Handshake, 0x03 0x03 = TLS 1.2, length = 0x0020 (32)
$bytes = [byte[]](0x16,0x03,0x03,0x00,0x20) + (0..31 | ForEach-Object { 0xAA })
$stream.Write($bytes, 0, $bytes.Length)
$stream.Flush()

Start-Sleep -Seconds 1
$client.Close()
Write-Host "Sent TLS-like record (single write)"
