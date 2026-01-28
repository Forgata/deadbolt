$address = "127.0.0.1"
$port = 7890

# 1. Open the connection
$client = New-Object System.Net.Sockets.TcpClient($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)

# 2. Define the incomplete request
# Note: We only send ONE `r`n after the Host header.
# A valid request requires TWO `r`n sequences to terminate the headers.
$request = "GET / HTTP/1.1`r`n" +
           "Host: example.com`r`n"

# 3. Send and Flush
$writer.Write($request)
$writer.Flush()

# 4. Wait briefly so the server can process the partial data 
# before we force the connection closed.
Start-Sleep -Milliseconds 500

# 5. Close the connection. This "hangs" the server and triggers the error.
$client.Close()