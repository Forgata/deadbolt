import net from "node:net";
import { createConnectionContext } from "./connectionContext.js";
import { MAX_PREVIEW_BYTES, SOCKET_TIMEOUT_MS } from "./constants.js";
import { bufferHttpHeaders } from "../http/headerBuffer.js";

export function handleConnection(socket: net.Socket) {
  const ctx = createConnectionContext();
  console.log(
    `[${ctx.id}] Connection opened from ${socket.remoteAddress}:${socket.remotePort}`,
  );

  socket.setTimeout(SOCKET_TIMEOUT_MS);

  socket.on("data", (chunk: Buffer) => {
    const result = bufferHttpHeaders(ctx, chunk);
    // ctx.bytesReceived += chunk.length;
    // ctx.buffer = Buffer.concat([ctx.buffer, chunk]);

    const preview = chunk.subarray(0, MAX_PREVIEW_BYTES);

    console.log(
      `[${ctx.id}] Received ${chunk.length} bytes (total: ${ctx.bytesReceived})`,
    );
    console.log(`[${ctx.id}] Preview  \n${preview.toString("utf8")}`);

    if (result.shouldTerminate) {
      console.warn(`[${ctx.id}] Terminating: ${result.reason}`);
      socket.destroy();
      return;
    }

    if (result.headersComplete) {
      console.log(
        `[${ctx.id}] HTTP Headers complete at byte ${ctx.headerEndIndex}`,
      );
      socket.pause();
    }
    // socket.end();
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
