# 05_http_chunked_request.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 05: HTTP request in two chunks (ensure not TLS)"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream, [System.Text.Encoding]::ASCII)
$writer.NewLine = "`r`n"

# Send request line first
$writer.Write("GET / HTTP/1.1`r`n")
$writer.Flush()
Start-Sleep -Milliseconds 200

# Send headers and termination
$writer.Write("Host: example.com`r`nConnection: close`r`n`r`n")
$writer.Flush()

Start-Sleep -Milliseconds 500
$client.Close()
Write-Host "Sent HTTP in two chunks"
