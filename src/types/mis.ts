export interface MISSettings {
  mis_provider: string | null;
  mis_config: Record<string, unknown> | null;
}

export interface TestConnectionResponse {
  connected: boolean;
  details: Record<string, unknown> | null;
}
