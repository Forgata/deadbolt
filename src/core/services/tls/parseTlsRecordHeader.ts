import { MAX_TLS_RECORD_LENGTH, TLS_RECORD_HEADER_SIZE } from "./constants.js";
import type { TlsRecordParseResult } from "./types/index.js";

export function parseTlsRecordHeader(buffer: Buffer): TlsRecordParseResult {
  // the 5 byte constraint
  if (buffer.length < TLS_RECORD_HEADER_SIZE) {
    return {
      status: "INCOMPLETE",
      neededBytes: TLS_RECORD_HEADER_SIZE - buffer.length,
    };
  }
  // reading fields
  const contentType = buffer.readUint8(0);
  const versionMajor = buffer.readUint8(1);
  const versionMinor = buffer.readUint8(2);
  const recordLength = buffer.readUint16BE(3);

  // contentType validation
  if (contentType !== 0x16) {
    return {
      status: "INVALID",
      reason: `Invalid TLS ContentType: 0x${contentType.toString(16)}`,
    };
  }
  // TLS record validation
  const validVersion =
    versionMajor === 0x03 &&
    (versionMinor === 0x01 || versionMinor === 0x02 || versionMinor === 0x03);

  if (!validVersion)
    return {
      status: "INVALID",
      reason: `Invalid TLS Version: ${versionMajor}.${versionMinor}`,
    };

  //   record length validation
  if (recordLength <= 0 || recordLength > MAX_TLS_RECORD_LENGTH) {
    return {
      status: "INVALID",
      reason: `Invalid TLS Record Length: ${recordLength}`,
    };
  }

  const totalLength = TLS_RECORD_HEADER_SIZE + recordLength;

  //   checking completeness
  if (buffer.length < totalLength)
    return {
      status: "INCOMPLETE",
      neededBytes: totalLength - buffer.length,
    };

  // returning valid TLS record
  return {
    status: "COMPLETE",
    contentType,
    versionMajor,
    versionMinor,
    recordLength,
    recordEndOffset: totalLength,
  };
}
