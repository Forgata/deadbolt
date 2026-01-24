import os from "node:os";
import fs from "node:fs";
import path from "path";
import { readProxyConfig } from "./proxyReader.js";
import { writeProxyConfig } from "./proxyWriter.js";
import type { ProxyConfig } from "./types/proxyState.js";

const BACKUP_FILE = path.join(
  os.homedir(),
  "AppData",
  "Roaming",
  "Deadbolt",
  "proxy.backup.json",
);

export async function restoreProxyFromBackup() {
  if (!fs.existsSync(BACKUP_FILE)) return "NO_BACKUP";

  let backup: ProxyConfig;
  try {
    backup = JSON.parse(fs.readFileSync(BACKUP_FILE, "utf-8"));
  } catch (err) {
    console.error("[FILE_READ_ERROR] ", err);
    return "BAACKUP_CORRUPT";
  }

  writeProxyConfig(backup);

  //   verifying if restored
  const current = await readProxyConfig();
  if (
    current.enabled !== backup.enabled ||
    current.server !== backup.server ||
    current.override !== backup.override
  ) {
    return "RESTORE_FAILED";
  }

  fs.unlinkSync(BACKUP_FILE);
  return "RESTORED_OK";
}
