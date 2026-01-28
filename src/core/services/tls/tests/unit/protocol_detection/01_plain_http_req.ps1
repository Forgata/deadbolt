$client = New-Object System.Net.Sockets.TcpClient("127.0.0.1", 7890)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)

$writer.Write("GET / HTTP/1.1`r`nHost: example.com`r`n`r`n")
$writer.Flush()

Start-Sleep 2
$client.Close()
