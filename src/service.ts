import { startTcpServer } from "./core/services/tcp/tcpServer.js";
// startTcpServer();

import { determineProxyState } from "./core/services/proxy/proxyController.js";
import { readSystemProxy } from "./core/services/proxy/proxyReader.js";
import { testCases } from "./core/services/proxy/test/index.js";

async function main() {
  const proxy = await readSystemProxy();
  console.log("[Deadbolt][DEBUG] System Proxy State:", proxy);

  for (const t of testCases) {
    const state = determineProxyState(
      t.config,
      "127.0.0.1",
      7890,
      t.listenerRunning,
    );
    console.log(state);
  }
}

main().catch((error) => console.error(error));
