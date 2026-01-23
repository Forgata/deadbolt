import { ProxyState, type ProxyConfig } from "./proxyState.js";

function isDeadboltProxy(
  server: string | null,
  host: string,
  port: number,
): boolean {
  if (!server) return false;
  const deadboltAddress = `${host}:${port}`;
  return server.includes(deadboltAddress);
}

// determining proxy state
export function determineProxyState(
  config: ProxyConfig,
  deadboltHost: string,
  deadboltPort: number,
  listenerRunning: boolean,
): ProxyState {
  if (!config.enabled) return ProxyState.NO_PROXY;

  if (isDeadboltProxy(config.server, deadboltHost, deadboltPort))
    return ProxyState.ORIGINAL_PRESENT;

  if (listenerRunning) return ProxyState.DEADBOLT_ACTIVE;

  return ProxyState.DEADLOCKED;
}
