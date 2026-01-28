export interface ConnectionContext {
  id: string;
  buffer: Buffer;
  bytesReceived: number;
  headersComplete: boolean;
  headerEndIndex: number | null;
  host: string | null;
  createdAt: Date;
  protocol?: "TLS" | "HTTP" | "UNKNOWN";
}
