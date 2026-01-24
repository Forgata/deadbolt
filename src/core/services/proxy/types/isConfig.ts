import type { ProxyConfig } from "./proxyState.js";

function isProxyConfig(obj: any): obj is ProxyConfig {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.enabled === "boolean" &&
    (typeof obj.server === "string" || obj.server === null) &&
    (typeof obj.override === "string" || obj.override === null)
  );
}

export default isProxyConfig;
