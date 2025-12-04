interface RuntimeConfig {
  apiBaseUrl: string;
}

export async function loadConfig(): Promise<RuntimeConfig> {
  const response = await fetch("/config.json");
  return response.json();
}
