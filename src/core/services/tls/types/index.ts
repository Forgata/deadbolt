export type ConnectionProtocol = "HTTP" | "TLS" | "UNKNOWN";
export interface TlsInspectionContext {
  protocol: "TLS";
  sniHost: string | null;
}
