import { startTcpServer } from "./core/services/tcp/tcpServer.js";
import { determineProxyState } from "./core/services/proxy/proxyController.js";
import { readProxyConfig } from "./core/services/proxy/proxyReader.js";
import { ensureBackup } from "./core/services/proxy/proxyBackup.js";
import { handleConnection } from "./core/services/tcp/connectionHandler.js";
import { restoreProxyFromBackup } from "./core/services/proxy/restoreBackup.js";
import { setDeadboltProxy } from "./core/services/proxy/setDeadboltProxy.js";

const HOST = "127.0.0.1";
const PORT = 7890;
const DEADBOLT_SAFE = 1;

async function main() {
  const config = await readProxyConfig();
  const state = determineProxyState(config, HOST, PORT, false);

  try {
    // backup before anything
    await ensureBackup(state, config);

    // start tcp server
    await startTcpServer(handleConnection, PORT, HOST);

    // system proxy mutation if not safe mode (testing)
    if (!DEADBOLT_SAFE) {
      await setDeadboltProxy(HOST, PORT);
      console.log("[DEADBOLT] Proxy safely bound to listener");
    } else {
      console.warn("[DEADBOLT] SAFE MODE — proxy mutation skipped");
    }
  } catch (error) {
    console.error("[DEADBOLT] Startup error", error);
    await restoreProxyFromBackup();
    process.exit(1);
  }

  process.on("SIGINT", async () => await restoreProxyFromBackup());
  process.on("SIGTERM", async () => await restoreProxyFromBackup());
  process.on("exit", async () => await restoreProxyFromBackup());
}

main().catch((error) => console.error(error));
