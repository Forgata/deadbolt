export type ConnectionProtocol = "HTTP" | "TLS" | "UNKNOWN";
export interface TlsInspectionContext {
  protocol: "TLS";
  sniHost: string | null;
}

export interface TlsBufferState {
  buffer: Buffer;
  expectedLength: number | null;
}
