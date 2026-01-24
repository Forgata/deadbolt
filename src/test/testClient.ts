import net from "node:net";

const client = net.createConnection({ host: "127.0.0.1", port: 7890 }, () => {
  client.write("GET / HTTP/1.1\r\nHost: example.com\r\n\r\n");
});

client.on("end", () => {
  console.log("Disconnected");
});
