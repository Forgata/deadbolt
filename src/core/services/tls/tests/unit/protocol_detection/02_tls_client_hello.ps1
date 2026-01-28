$client = New-Object System.Net.Sockets.TcpClient("127.0.0.1", 7890)
$stream = $client.GetStream()

# TLS record header:
# 0x16 = Handshake
# 0x03 0x01 = TLS 1.0+
# 0x00 0x2e = length
$bytes = [byte[]](0x16,0x03,0x01,0x00,0x2e)

$stream.Write($bytes, 0, $bytes.Length)
$stream.Flush()

Start-Sleep 2
$client.Close()
