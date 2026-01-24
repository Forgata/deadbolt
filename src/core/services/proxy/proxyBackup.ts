import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { ProxyState, type ProxyConfig } from "./types/proxyState.js";

const BACKUP_DIR = path.join(os.homedir(), "AppData", "Roaming", "Deadbolt");
const BACKUP_FILE = path.join(BACKUP_DIR, "proxy.backup.json");

export function ensureBackup(state: ProxyState, config: ProxyConfig) {
  if (fs.existsSync(BACKUP_FILE)) return "BACKUP_EXISTS";
  if (state === ProxyState.DEADLOCKED) return "SKIPPED_DEADLOCKED";
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  fs.writeFileSync(BACKUP_FILE, JSON.stringify(config, null, 2), {
    encoding: "utf-8",
  });
  return "BACKED_UP";
}
