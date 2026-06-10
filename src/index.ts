/**
 * qinglong-client
 *
 * 青龙面板 Open API（/open/*）TypeScript 客户端。
 *
 * @example
 * ```typescript
 * import { QinglongClient } from 'qinglong-client';
 *
 * const client = new QinglongClient({
 *   baseUrl: 'http://localhost:5700',
 *   clientId: 'xxx',
 *   clientSecret: 'yyy',
 * });
 *
 * const envs = await client.envs.list();
 * ```
 *
 * @packageDocumentation
 */

export { QinglongClient } from './client';
export * from './types';
