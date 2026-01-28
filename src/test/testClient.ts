import net from "node:net";

export function testParser(data: string) {
  const client = new net.Socket();

  client.connect(7890, "127.0.0.1", () => {
    console.log("Connected, sending data...");
    client.write(data);
  });

  client.on("data", (chunk) => {
    console.log("Received:", chunk.toString());
    client.destroy();
  });

  client.on("close", () => {
    console.log("Connection closed");
  });

  client.on("error", (err) => {
    console.error("Client error:", err);
  });
}
