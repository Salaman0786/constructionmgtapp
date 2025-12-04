let runtimeConfig: any;

export async function initConfig() {
  runtimeConfig = await (await fetch("/config.json")).json();
}

export function getApiBaseUrl() {
  return runtimeConfig.apiBaseUrl;
}
