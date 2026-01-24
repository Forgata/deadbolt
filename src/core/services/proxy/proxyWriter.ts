import { execSync } from "node:child_process";
import type { ProxyConfig } from "./types/proxyState.js";

export function writeProxyConfig(config: ProxyConfig) {
  const baseKey =
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";
  // enable / disable
  execSync(
    `reg add "${baseKey}" /v ProxyEnable /t REG_DWORD /d ${config.enabled ? "1" : "0"} /f`,
  );

  if (config.server) {
    execSync(
      `reg add "${baseKey}" /v ProxyServer /t REG_SZ /d "${config.server}" /f`,
    );
  } else {
    execSync(`reg delete "${baseKey}" /v ProxyServer /f`, { stdio: "ignore" });
  }
}
