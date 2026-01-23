import net from "node:net";
import { handleConnection } from "./connectionHandler.js";

const HOST = "127.0.0.1";
const PORT = 8080;

export function startTcpServer() {
  const server = net.createServer((socket) => {
    handleConnection(socket);
  });
  server.on("error", (error) => {
    console.error("[TCP SERVER ERROR]", error);
  });

  //   listening
  server.listen(PORT, HOST, () => {
    console.log(`[Deadbolt] TCP Listener running on ${HOST}:${PORT}`);
  });
}
