import { exec } from "node:child_process";

export async function setDeadboltProxy(
  host: string,
  port: number,
): Promise<void> {
  const server = `${host}:${port}`;
  const REG_PATH =
    "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings";

  // enabling proxy
  await new Promise<void>((resolve, reject) => {
    exec(`reg add "${REG_PATH}" /v ProxyEnable /t REG_DWORD /d 1 /f`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  // setting proxy server
  await new Promise<void>((resolve, reject) => {
    exec(
      `reg add "${REG_PATH}" /v ProxyServer /t REG_SZ /d "${server}" /f`,
      (err) => {
        if (err) return reject(err);
        resolve();
      },
    );
  });

  console.log(`[DEADBOLT] System Proxy set to ${server}`);
}
