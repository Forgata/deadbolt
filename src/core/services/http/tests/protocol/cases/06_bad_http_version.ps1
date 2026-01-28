$address = "127.0.0.1"
$port = 7890

# 1. Open the connection
$client = New-Object System.Net.Sockets.TcpClient($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)

# 2. Define the request with an unsupported version (HTTP/2.0)
# Note: True HTTP/2 uses a binary framing layer, so sending it 
# as a plain text string like this is a definitive protocol error.
$request = "GET / HTTP/2.0`r`n" +
           "Host: example.com`r`n" +
           "`r`n"

# 3. Send and Flush
$writer.Write($request)
$writer.Flush()

# 4. Read response & Close
$reader = New-Object System.IO.StreamReader($stream)
$reader.ReadToEnd()
$client.Close()