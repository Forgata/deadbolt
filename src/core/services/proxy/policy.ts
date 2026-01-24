// import { ProxyState, type ProxyConfig } from "./proxyState.js";

// enum PolicyVerdict {
//   OK = "OK",
//   REPAIR_PROXY = "REPAIR_PROXY",
//   RESTART_LISTENER = "RESTART_LISTENER",
//   FULL_LOCKDOWN = "FULL_LOCKDOWN",
// }

// export function evaluateProxyPolicy(state: ProxyState, config: ProxyConfig) {
//     if (!config.enabled) {
//         if (state === 'DEADBOLT_ACTIVE') return PolicyVerdict.FULL_LOCKDOWN;
//         return PolicyVerdict.OK
//     }

//     // if deadbolt is enabled
//     if (state === 'NO_PROXY') return PolicyVerdict.REPAIR_PROXY;
//     if (state === 'ORIGINAL_PROXY') return PolicyVerdict.FULL_LOCKDOWN;
//     if (!listennerRunning) return PolicyVerdict.REPAIR_PROXY;

// }
