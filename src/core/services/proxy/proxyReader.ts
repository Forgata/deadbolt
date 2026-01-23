import { exec } from "node:child_process";
import type { ProxyConfig } from "./proxyState.js";

const REG_PATH =
  "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

function queryRegistry(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`reg query "${REG_PATH}"`, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

function parseRegistryOutput(output: string): ProxyConfig {
  let enabled = false;
  let server: string | null = null;
  let override: string | null = null;

  const lines = output.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("ProxyEnable")) {
      const parts = trimmed.split(/\s+/);
      enabled = parts[parts.length - 1] === "0x1";
    }

    if (trimmed.startsWith("ProxyServer")) {
      const parts = trimmed.split(/\s+/);
      server = parts.slice(2).join(" ") || null;
    }

    if (trimmed.startsWith("ProxyOverride")) {
      const parts = trimmed.split(/\s+/);
      override = parts.slice(2).join(" ") || null;
    }
  }

  return { enabled, server, override };
}

export async function readSystemProxy(): Promise<ProxyConfig> {
  const output = await queryRegistry();
  return parseRegistryOutput(output);
}
