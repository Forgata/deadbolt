$client = New-Object System.Net.Sockets.TcpClient("127.0.0.1", 7890)
$stream = $client.GetStream()

$bytes = [byte[]](0x99,0x88,0x77,0x66)
$stream.Write($bytes, 0, $bytes.Length)
$stream.Flush()

Start-Sleep 2
$client.Close()
