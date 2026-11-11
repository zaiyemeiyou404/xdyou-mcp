export type SideEffectClass = "read" | "write" | "network" | "external_mutation";

export interface PluginCapability {
  id: string;
  description: string;
  sideEffect: SideEffectClass;
  requiresApproval: boolean;
  timeoutMs: number;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}

export interface PluginManifest {
  pluginId: string;
  name: string;
  version: string;
  description: string;
  capabilities: PluginCapability[];
}

export interface PluginCallRequest {
  pluginId: string;
  capability: string;
  input: unknown;
  signal?: AbortSignal;
}

export interface PluginCallResult {
  ok: boolean;
  output: unknown | null;
  error: string | null;
  durationMs: number;
}

export interface PluginAdapter {
  manifest: PluginManifest;
  execute(request: PluginCallRequest): Promise<PluginCallResult>;
}

export interface ToolExecutionContext {
  signal?: AbortSignal;
}
