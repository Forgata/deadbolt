import { MAX_TLS_RECORD_SIZE, TLS_HEADER_SIZE } from "./constants.js";
import type { TlsBufferState } from "./types/index.js";

export class TlsParseError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "HttpParseError";
  }
}

export function bufferFirstTlsRecord(
  state: TlsBufferState,
  chunk: Buffer,
): Buffer | null {
  state.buffer = Buffer.concat([state.buffer, chunk]);

  if (state.buffer.length > MAX_TLS_RECORD_SIZE)
    throw new TlsParseError(
      "MAX_TLS_RECORD_SIZE",
      "TLS record exceeded max limit",
    );
  if (state.buffer.length < TLS_HEADER_SIZE) return null;
  if (state.expectedLength === null) {
    const payloadLength = state.buffer.readUInt16BE(3);
    state.expectedLength = TLS_HEADER_SIZE + payloadLength;

    if (state.expectedLength > MAX_TLS_RECORD_SIZE)
      throw new TlsParseError(
        "MAX_TLS_RECORD_SIZE",
        "Declared TLS record length exceeded max limit",
      );
  }

  if (state.buffer.length >= state.expectedLength) {
    const record = state.buffer.subarray(0, state.expectedLength);
    state.buffer = state.buffer.subarray(state.expectedLength);
    return record;
  }

  return null;
}
