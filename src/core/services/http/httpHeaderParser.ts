import type { DecodedHeaders, ParsedHttpRequest } from "./types/index.js";

export class HttpParseError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "HttpParseError";
  }
}

// parsing and validating http headers from buffer

export function parseHttpHeaders(buffer: Buffer): ParsedHttpRequest {
  const raw = buffer.toString("utf-8");
  const headerEnd = raw.indexOf("\r\n\r\n");

  if (headerEnd === -1)
    throw new HttpParseError("INCOMPLETE_HEADERS", "Incomplete HTTP headers");

  const headerText = raw.slice(0, headerEnd);
  const lines = headerText.split("\r\n");

  if (lines.length === 0)
    throw new HttpParseError("EMPTY_HEADERS", "Empty HTTP request");

  //   request line
  const requestLine = lines.shift()!;
  const parts = requestLine.trim().split(/\s+/);

  if (parts.length !== 3) {
    throw new HttpParseError("BAD_REQUEST_LINE", "Malformed HTTP request line");
  }

  const [method, target, version] = parts;

  if (!method || !target || !version)
    throw new HttpParseError("BAD_REQUEST_LINE", "Malformed HTTP request line");

  if (!/^[A-Z]+$/.test(method))
    throw new HttpParseError("INVALID_METHOD", "Invalid HTTP method");

  if (version !== "HTTP/1.1" && version !== "HTTP/1.0")
    throw new HttpParseError("BAD_HTTP_VERSION", "Unsupported HTTP version");

  //   headers lines
  const headers = new Map<string, string>();

  for (const line of lines) {
    if (line === "") continue;
    const colonIndex = line.indexOf(":");
    if (colonIndex <= 0)
      throw new HttpParseError(
        `BAD_HEADER_LINE`,
        `Malformed HTTP header line: ${line}`,
      );

    const [rawName, ...rest] = line.split(":");

    if (!rawName)
      throw new HttpParseError(
        `BAD_HEADER_LINE`,
        `Malformed HTTP header line: ${line}`,
      );

    const name = rawName.trim();
    const value = rest.join(":").trim();

    if (!name || !/^[A-Za-z0-9-]+$/.test(name))
      throw new HttpParseError(
        `INVALID_HEADER_NAME`,
        `Invalid HTTP header name: ${name}`,
      );

    // control character detection
    if (/[\0\r\n]/.test(value))
      throw new HttpParseError(
        `INVALID_HEADER_VALUE`,
        `Control character in header: ${value}`,
      );
    const normalisedName = name.toLowerCase();

    if (normalisedName === "host" && headers.has("host"))
      throw new HttpParseError("DUPLICATE_HOST", "Duplicate Host Header");
    headers.set(normalisedName, value);
  }

  // header checks
  const isAbsoluteForm =
    target.startsWith("http://") || target.startsWith("https://");

  if (isAbsoluteForm) {
    try {
      new URL(target);
    } catch {
      throw new HttpParseError(
        "BAD_REQUEST_TARGET",
        "Invalid absolute-form request target",
      );
    }
  }

  if (version === "HTTP/1.1" && !isAbsoluteForm && !headers.has("host")) {
    throw new HttpParseError(
      "MISSING_HOST",
      "Missing Host header in HTTP/1.1 request",
    );
  }

  return {
    method,
    target,
    version,
    headers,
  };
}

// test 3 passed
// test 4 passed
// test 5 passed
// test 6 passed
// test 7 passed
// test 8 passed
// test 9 passed
// test 10 passed
// test 11 passed
// test 12 passed
