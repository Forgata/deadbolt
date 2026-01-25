import net from "node:net";
import crypto from "node:crypto";
import { createConnectionContext } from "./connectionContext.js";

const SOCKET_TIMEOUT_MS = 5000;
const MAX_PREVIEW_BYTES = 1024;

export function handleConnection(socket: net.Socket) {
  const ctx = createConnectionContext();
  console.log(
    `[${ctx.id}] Connection opened from ${socket.remoteAddress}:${socket.remotePort}`,
  );

  socket.setTimeout(SOCKET_TIMEOUT_MS);

  socket.on("data", (chunk: Buffer) => {
    ctx.bytesReceived += chunk.length;
    ctx.buffer = Buffer.concat([ctx.buffer, chunk]);
    const preview = chunk.subarray(0, MAX_PREVIEW_BYTES);
    console.log(`[${ctx.id}] Received ${chunk.length}`);
    console.log(`[${ctx.id}] Preview  \n${preview.toString("utf8")}`);
    socket.end();
  });

  //   on timeot
  socket.on("timeout", () => {
    console.warn(`[${ctx.id}] socket timed out`);
    socket.destroy();
  });

  //   on error
  socket.on("error", (error) => {
    console.error(`[${ctx.id}] socket error`, error);
    socket.destroy();
  });

  socket.on("close", () => {
    console.log(`[${ctx.id}] Connection closed`);
  });
}
