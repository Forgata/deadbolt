$address = "127.0.0.1"
$port = 7890

# 1. Open the connection
$client = New-Object System.Net.Sockets.TcpClient($address, $port)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)

# 2. Define the request with a Null Byte ([char]0)
# This mimics the \0 in your printf command
$nullChar = [char]0
$request = "GET / HTTP/1.1`r`n" +
           "Host: example.com`r`n" +
           "X-Test: bad" + $nullChar + "value`r`n" +
           "`r`n"

# 3. Send and Flush
$writer.Write($request)
$writer.Flush()

# 4. Read response & Close
$reader = New-Object System.IO.StreamReader($stream)
$reader.ReadToEnd()
$client.Close()