$address = "127.0.0.1"
$port = 7890

# 1. Open the connection
$client = New-Object System.Net.Sockets.TcpClient($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)

# 2. Define the request with two Host headers
# This is a direct violation of RFC 9112
$request = "GET / HTTP/1.1`r`n" +
           "Host: a.com`r`n" +
           "Host: b.com`r`n" +
           "`r`n"

# 3. Send and Flush
$writer.Write($request)
$writer.Flush()

# 4. Read response & Close
$reader = New-Object System.IO.StreamReader($stream)
$reader.ReadToEnd()
$client.Close()