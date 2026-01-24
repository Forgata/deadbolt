import path from "node:path";
import os from "node:os";
import { promises as fs } from "node:fs";
import { ProxyState, type ProxyConfig } from "./types/proxyState.js";

const BACKUP_DIR = path.join(os.homedir(), "AppData", "Roaming", "Deadbolt");
const BACKUP_FILE = path.join(BACKUP_DIR, "proxy.backup.json");

export async function ensureBackup(state: ProxyState, config: ProxyConfig) {
  try {
    await fs.access(BACKUP_DIR);
    return "BACKUP_EXISTS";
  } catch {}
  if (state === ProxyState.DEADLOCKED) return "SKIPPED_DEADLOCKED";
  await fs.mkdir(BACKUP_DIR, { recursive: true });

  await fs.writeFile(BACKUP_FILE, JSON.stringify(config, null, 2), {
    encoding: "utf-8",
  });
  return "BACKED_UP";
}
