export enum ProxyState {
  UNKNOWN = "UNKNOWN",
  NO_PROXY = "NO_PROXY",
  ORIGINAL_PRESENT = "ORIGINAL_PRESENT",
  DEADBOLT_ACTIVE = "DEADBOLT_ACTIVE",
  DEADLOCKED = "DEADLOCKED",
}

export interface ProxyConfig {
  enabled: boolean;
  server: string | null;
  override: string | null;
}
