export type ClientModule =
  | 'envs'
  | 'crons'
  | 'subscriptions'
  | 'configs'
  | 'scripts'
  | 'logs'
  | 'dependencies'
  | 'system';

export type ClientTestCase = {
  module: ClientModule;
  method: string;
  http: string;
  path: string;
  scope?: string;
  description: string;
  argsJson: string;
  kind?: 'file';
  destructive?: boolean;
};

export type ClientConnectionConfig = {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
};

export type ExecuteSuccess =
  | { ok: true; type: 'json'; content: string }
  | { ok: true; type: 'text'; content: string }
  | { ok: true; type: 'blob'; size: number; mimeType: string; downloadUrl: string }
  | { ok: true; type: 'void'; content: string };

export type ExecuteFailure = {
  ok: false;
  type: 'error' | 'cors' | 'parse';
  message: string;
  details?: string;
};

export type ExecuteResult = ExecuteSuccess | ExecuteFailure;
