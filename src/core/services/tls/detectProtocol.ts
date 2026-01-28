import type { ConnectionProtocol } from "./types/index.js";

export function detectProtocol(buffer: Buffer): ConnectionProtocol {
  if (buffer.length === 0) return "UNKNOWN";
  const firstByte = buffer[0];
  if (firstByte === 0x16) return "TLS";
  if (
    firstByte === 0x47 ||
    firstByte === 0x50 ||
    firstByte === 0x43 ||
    firstByte === 0x48
  ) {
    return "HTTP";
  }
  return "UNKNOWN";
}
