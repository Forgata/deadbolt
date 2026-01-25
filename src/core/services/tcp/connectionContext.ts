import { randomUUID } from "node:crypto";
import type { ConnectionContext } from "./types/index.js";

export function createConnectionContext(): ConnectionContext {
  return {
    id: randomUUID(),
    buffer: Buffer.alloc(0),
    bytesReceived: 0,
    headersComplete: false,
    headerEndIndex: null,
    host: null,
    createdAt: new Date(),
  };
}
