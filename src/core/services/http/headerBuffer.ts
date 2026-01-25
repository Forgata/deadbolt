import { HEADER_TERMINATOR, MAX_HEADER_BYTES } from "../tcp/constants.js";
import type { ConnectionContext } from "../tcp/types/index.js";
import type { HeaderBufferResult } from "./types/index.js";

export function bufferHttpHeaders(
  ctx: ConnectionContext,
  chunk: Buffer,
): HeaderBufferResult {
  if (ctx.headersComplete)
    return { headersComplete: true, shouldTerminate: true };

  // appending incoming bytes
  ctx.buffer = Buffer.concat([ctx.buffer, chunk]);
  ctx.bytesReceived += chunk.length;

  // enforcing header size limit
  if (ctx.buffer.length > MAX_HEADER_BYTES)
    return {
      headersComplete: false,
      shouldTerminate: true,
      reason: "HTTP headers exceeded max limit",
    };

  const headerEndIndex = ctx.buffer.indexOf(HEADER_TERMINATOR);
  if (headerEndIndex === -1) {
    ctx.headersComplete = true;
    ctx.headerEndIndex = headerEndIndex + HEADER_TERMINATOR.length;
    return { headersComplete: true, shouldTerminate: false };
  }

  return { headersComplete: false, shouldTerminate: false };
}
