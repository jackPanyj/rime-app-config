export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ConfigResponse {
  base: Record<string, unknown>;
  custom: Record<string, unknown>;
  customPatch: Record<string, unknown>;
}

export interface HealthResponse {
  platform: string;
  configDir: string;
  configDirExists: boolean;
  installation?: {
    distributionName: string;
    distributionVersion: string;
    rimeVersion: string;
    installTime: string;
  };
}

export interface SchemaListResponse {
  schemas: SchemaMetadata[];
}

export interface SchemaMetadata {
  schemaId: string;
  name: string;
  version: string;
  author: string[];
  description: string;
  switches: { name: string; states?: string[]; reset?: number }[];
  hasFuzzyPinyin: boolean;
}

export interface DeployResponse {
  success: boolean;
  message: string;
}
