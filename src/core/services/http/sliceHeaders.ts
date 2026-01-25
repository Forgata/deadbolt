import type { ConnectionContext } from "../tcp/types/index.js";

export function sliceHeaders(ctx: ConnectionContext): Buffer {
  if (!ctx.headersComplete || ctx.headerEndIndex === null)
    throw new Error(
      "[DEADBOLT] ERROR: Attempted to slice headers before completion",
    );
  return ctx.buffer.subarray(0, ctx.headerEndIndex);
}
