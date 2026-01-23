import net from "node:net";
import crypto from "node:crypto";

const SOCKET_TIMEOUT_MS = 5000;
const MAX_PREVIEW_BYTES = 1024;

export function handleConnection(socket: net.Socket) {
  const connectionId = crypto.randomUUID();
  console.log(
    `[${connectionId}] Connection opened from ${socket.remoteAddress}:${socket.remotePort}`,
  );

  socket.setTimeout(SOCKET_TIMEOUT_MS);

  socket.on("data", (chunk: Buffer) => {
    const preview = chunk.subarray(0, MAX_PREVIEW_BYTES);
    console.log(`[${connectionId}] Received ${chunk.length}`);
    console.log(`[${connectionId}] Preview  \n${preview.toString("utf8")}`);
    socket.end();
  });

  //   on timeot
  socket.on("timeout", () => {
    console.warn(`[${connectionId}] socket timed out`);
    socket.destroy();
  });

  //   on error
  socket.on("error", (error) => {
    console.error(`[${connectionId}] socket error`, error);
    socket.destroy();
  });

  socket.on("close", () => {
    console.log(`[${connectionId}] Connection closed`);
  });
}
