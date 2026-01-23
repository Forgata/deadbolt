export const testCases = [
  {
    config: { enabled: false, server: "127.0.0.1:7890", override: null },
    listenerRunning: false,
  },
  {
    config: { enabled: true, server: "8.8.8.8:8080", override: null },
    listenerRunning: false,
  },
  {
    config: { enabled: true, server: "127.0.0.1:7890", override: null },
    listenerRunning: true,
  },
  {
    config: { enabled: true, server: "127.0.0.1:7890", override: null },
    listenerRunning: false,
  },
];
