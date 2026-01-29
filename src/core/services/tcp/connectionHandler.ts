import net from "node:net";
import { createConnectionContext } from "./connectionContext.js";
import { MAX_PREVIEW_BYTES, SOCKET_TIMEOUT_MS } from "./constants.js";
import { bufferHttpHeaders } from "../http/httpHeaderBuffer.js";
import { sliceHeaders } from "../http/sliceHeaders.js";
import { HttpParseError, parseHttpHeaders } from "../http/httpHeaderParser.js";
import { detectProtocol } from "../tls/detectProtocol.js";
import type { TlsBufferState } from "../tls/types/index.js";
import { initTlsBufferState } from "../tls/tlsBuferInitialiser.js";
import { bufferFirstTlsRecord, TlsParseError } from "../tls/tlsParser.js";

export function handleConnection(socket: net.Socket) {
  const ctx = createConnectionContext();
  console.log("NEW CONNECTION");
  console.log(
    `[${ctx.id}] Connection opened from ${socket.remoteAddress}:${socket.remotePort}`,
  );

  socket.setTimeout(SOCKET_TIMEOUT_MS);

  const tlsState: TlsBufferState = initTlsBufferState();

  socket.on("data", (chunk: Buffer) => {
    // protocol detection
    if (ctx.protocol === "UNKNOWN") {
      const detectedProtocol = detectProtocol(chunk);

      if (detectedProtocol === "UNKNOWN") {
        console.warn(`[${ctx.id}] Unknown protocol, closing...`);
        socket.destroy();
        return;
      }
      ctx.protocol = detectedProtocol;
      console.log(`[${ctx.id}] Detected protocol: ${ctx.protocol}`);
    }

    if (ctx.protocol === "TLS") {
      try {
        const record = bufferFirstTlsRecord(tlsState, chunk);
        if (!record) {
          console.log(
            `[${ctx.id}] waiting for more bytes... (${tlsState.buffer.length})`,
          );
          return;
        }
        console.log(`[${ctx.id}] Full TLS record recieved (${record.length})`);
        // todo parse client hello, extract sni
        socket.pause();
        return;
      } catch (error: unknown) {
        if (error instanceof TlsParseError) {
          console.error(`[${ctx.id}] TLS Parse Error: ${error.message}`);
          socket.destroy();
          return;
        }
      }
    }

    const result = bufferHttpHeaders(ctx, chunk);
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
      const headerBuffer = sliceHeaders(ctx);

      try {
        const parsed = parseHttpHeaders(headerBuffer);
        ctx.host = parsed.headers.get("host") || null;

        console.log(
          `[${ctx.id}] Parsed request: ${parsed.method} ${parsed.target} ${parsed.version}`,
        );
        console.log(`[${ctx.id}] Host: ${ctx.host}`);

        console.log(`[${ctx.id}] Header slice length: ${headerBuffer.length}`);
        console.log(`[${ctx.id}] Header lines:`);

        parsed.headers.forEach((value, key) => {
          console.log(`  [${key}] ${value}`);
        });

        socket.pause();
      } catch (error: unknown) {
        if (error instanceof HttpParseError) {
          console.warn(
            `[${ctx.id}] HTTP parse error: ${error.code} - ${error.message}`,
          );
        } else {
          console.error(`[${ctx.id}] Unexpected parse error`, error);
        }
        socket.destroy();
        return;
      }
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
