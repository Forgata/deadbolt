// import { startTcpServer } from "./core/services/tcp/tcpServer.js";
// startTcpServer();

import { readSystemProxy } from "./core/services/proxy/proxyReader.js";

async function main() {
  const proxy = await readSystemProxy();
  console.log("[Deadbolt][DEBUG] System Proxy State:", proxy);
}
