import type { ClientTestCase } from '../types';

export const configsCases: ClientTestCase[] = [
  {
    module: 'configs',
    method: 'listSamples',
    http: 'GET',
    path: '/configs/samples',
    scope: 'configs',
    description: '获取示例配置文件名列表',
    argsJson: '[]',
  },
  {
    module: 'configs',
    method: 'listFiles',
    http: 'GET',
    path: '/configs/files',
    scope: 'configs',
    description: '获取配置文件列表',
    argsJson: '[]',
  },
  {
    module: 'configs',
    method: 'getDetail',
    http: 'GET',
    path: '/configs/detail',
    scope: 'configs',
    description: '读取配置文件内容（通过 query path）',
    argsJson: '[{"path":"config.sh"}]',
  },
  {
    module: 'configs',
    method: 'getFile',
    http: 'GET',
    path: '/configs/:file',
    scope: 'configs',
    description: '读取配置文件内容（通过文件名）',
    argsJson: '["config.sh"]',
  },
  {
    module: 'configs',
    method: 'save',
    http: 'POST',
    path: '/configs/save',
    scope: 'configs',
    description: '保存配置文件',
    argsJson: '[{"name":"config.sh","content":"# config"}]',
  },
];
