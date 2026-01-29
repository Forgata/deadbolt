# 01_simple_http.ps1
$address = "127.0.0.1"
$port = 7890
Write-Host "Test 01: HTTP simple GET"

$client = New-Object System.Net.Sockets.TcpClient
$client.Connect($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream, [System.Text.Encoding]::ASCII)
$writer.NewLine = "`r`n"
$writer.Write("GET / HTTP/1.1`r`nHost: example.com`r`nConnection: close`r`n`r`n")
$writer.Flush()

Start-Sleep -Milliseconds 500
if ($stream.DataAvailable) {
    $buf = New-Object byte[] 4096
    try { $count = $stream.Read($buf, 0, $buf.Length) } catch {}
}
$client.Close()
Write-Host "Sent HTTP GET and closed"
