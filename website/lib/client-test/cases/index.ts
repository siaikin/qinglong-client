import type { ClientModule, ClientTestCase } from '../types';
import { configsCases } from './configs';
import { cronsCases } from './crons';
import { dependenciesCases } from './dependencies';
import { envsCases } from './envs';
import { logsCases } from './logs';
import { scriptsCases } from './scripts';
import { subscriptionsCases } from './subscriptions';
import { systemCases } from './system';

export const ALL_CASES: ClientTestCase[] = [
  ...envsCases,
  ...cronsCases,
  ...subscriptionsCases,
  ...configsCases,
  ...scriptsCases,
  ...logsCases,
  ...dependenciesCases,
  ...systemCases,
];

export const MODULE_LABELS: Record<ClientModule, string> = {
  envs: 'client.envs',
  crons: 'client.crons',
  subscriptions: 'client.subscriptions',
  configs: 'client.configs',
  scripts: 'client.scripts',
  logs: 'client.logs',
  dependencies: 'client.dependencies',
  system: 'client.system',
};

export const MODULES: ClientModule[] = [
  'envs',
  'crons',
  'subscriptions',
  'configs',
  'scripts',
  'logs',
  'dependencies',
  'system',
];

export function getCasesByModule(module: ClientModule): ClientTestCase[] {
  return ALL_CASES.filter((c) => c.module === module);
}

export function getCaseKey(testCase: ClientTestCase): string {
  return `${testCase.module}.${testCase.method}`;
}
