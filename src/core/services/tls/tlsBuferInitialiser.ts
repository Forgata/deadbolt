import type { TlsBufferState } from "./types/index.js";

export function initTlsBufferState(): TlsBufferState {
  return {
    buffer: Buffer.alloc(0),
    expectedLength: null,
  };
}
