import net from "node:net";
import { handleConnection } from "./connectionHandler.js";

const HOST = "127.0.0.1";
const PORT = 7890;

export function startTcpServer(
  handleConnection: (socket: net.Socket) => void,
  PORT: number,
  HOST: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = net.createServer((socket) => {
      handleConnection(socket);
    });
    server.once("error", (error) => {
      console.error("[TCP SERVER ERROR]", error);
      reject(error);
    });

    //   listening
    server.listen(PORT, HOST, () => {
      console.log(`[Deadbolt] TCP Listener running on ${HOST}:${PORT}`);
      resolve();
    });
  });
}
