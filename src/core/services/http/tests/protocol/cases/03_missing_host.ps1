$address = "127.0.0.1"
$port = 7890

# 1. Open a raw TCP connection
$client = New-Object System.Net.Sockets.TcpClient($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)

# 2. Define the exact raw string (using `r`n for CRLF)
# Note: There is NO Host header here, which violates HTTP/1.1
$request = "GET / HTTP/1.1`r`n" +
           "User-Agent: curl`r`n" +
           "`r`n"

# 3. Send the data
$writer.Write($request)
$writer.Flush()

# 4. (Optional) Read the server's response before the connection closes
$reader = New-Object System.IO.StreamReader($stream)
$response = $reader.ReadToEnd()
$response

# 5. Clean up
$client.Close()