# 03_fragmented_tls_small_chunks.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 03: Fragmented TLS (small chunks)"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()

# Create a TLS-like record: header says payload=60 bytes
$header = [byte[]](0x16,0x03,0x03,0x00,0x3C)  # 0x3C = 60
$payload = (0..59 | ForEach-Object { [byte] (0x55) })
$full = $header + $payload

# Send in tiny fragments
$offset = 0
while ($offset -lt $full.Length) {
    $len = [Math]::Min(7, $full.Length - $offset)
    $chunk = $full[$offset..($offset + $len - 1)]
    $stream.Write($chunk, 0, $chunk.Length)
    $stream.Flush()
    Start-Sleep -Milliseconds 60
    $offset += $len
}

Start-Sleep -Seconds 1
$client.Close()
Write-Host "Sent fragmented TLS record"
