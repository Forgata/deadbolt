export type ConnectionProtocol = "HTTP" | "TLS" | "UNKNOWN";
export interface TlsInspectionContext {
  protocol: "TLS";
  sniHost: string | null;
}

export interface TlsBufferState {
  buffer: Buffer;
  expectedLength: number | null;
}

// tls record parse results
export type TlsRecordParseResult =
  | {
      status: "INCOMPLETE";
      neededBytes: number;
    }
  | {
      status: "INVALID";
      reason: string;
    }
  | {
      status: "COMPLETE";
      contentType: number;
      versionMajor: number;
      versionMinor: number;
      recordLength: number;
      recordEndOffset: number;
    };
