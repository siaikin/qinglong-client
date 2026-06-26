# qinglong-client

青龙面板 Open API（`/open/*`）的 TypeScript 客户端。

- 类型从青龙源码推导，附带 JSDoc 中文注释
- 自动 Token 获取与刷新
- 零运行时依赖，支持 Node.js 18+ 和现代 bundler
- 对应青龙版本：**2.20.2**

## 安装


```bash
pnpm add qinglong-client
```

## 快速开始

```typescript
import { QinglongClient } from 'qinglong-client';

const client = new QinglongClient({
  baseUrl: 'http://localhost:5700',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});

// 环境变量
const envs = await client.envs.list({ searchValue: '' });

// 定时任务：按名称搜索
const { data: crons, total } = await client.crons.list({ searchValue: '签到' });

// 创建定时任务
const cron = await client.crons.create({
  name: '每日签到',
  command: 'node sign.js',
  schedule: '0 8 * * *',
});

// 系统通知
await client.system.notify({ title: '完成', content: '任务执行成功' });
```

使用前需在青龙面板 **系统设置 → 应用设置** 中创建应用并勾选对应 scope 权限。

## 文档

在线文档：**https://siaikin.github.io/qinglong-client/**

基于 [Fumadocs](https://www.fumadocs.dev/docs) 构建，包含手写 **API 参考**（按模块的 HTTP 方法表）与 **TypeDoc**（从 `src/` JSDoc 自动生成，站点顶部导航入口）。

本地命令：

```bash
pnpm docs:gen      # 生成 TypeDoc Markdown → website/content/docs/reference/
pnpm docs:dev      # 先生成 TypeDoc，再启动 Fumadocs 开发服务器
pnpm docs:build    # 生成 TypeDoc 并构建静态站点
pnpm docs:watch    # 监听源码变更自动重建 TypeDoc
```

AI 可读：详见文档站 [AI & LLMS](https://siaikin.github.io/qinglong-client/docs/ai-docs/)（[llms.txt](https://siaikin.github.io/qinglong-client/llms.txt)、[llms-full.txt](https://siaikin.github.io/qinglong-client/llms-full.txt)、单页 `*.md`）

## API 模块

| 模块 | Scope | 方法数 |
|------|-------|--------|
| `client.envs` | `envs` | 14 |
| `client.crons` | `crons` | 27 |
| `client.subscriptions` | `subscriptions` | 12 |
| `client.configs` | `configs` | 5 |
| `client.scripts` | `scripts` | 10 |
| `client.logs` | `logs` | 5 |
| `client.dependencies` | `dependencies` | 8 |
| `client.system` | `system` | 23 |

## 错误处理

```typescript
import { QinglongApiError } from 'qinglong-client';

try {
  await client.envs.create([{ name: 'INVALID', value: '1' }]);
} catch (e) {
  if (e instanceof QinglongApiError) {
    console.error(e.code, e.message);
  }
}
```

## 类型导出

```typescript
import type {
  Env,
  Crontab,
  Subscription,
  Dependence,
  SystemConfig,
  CreateEnvItem,
  CronMutationRequest,
  NotifyRequest,
} from 'qinglong-client';
```

## 开发

```bash
pnpm install
pnpm build      # 构建 ESM + CJS + .d.ts
pnpm typecheck  # 类型检查
pnpm docs:gen   # 生成 API Markdown（TypeDoc → reference/）
pnpm docs:dev   # 生成 API 文档并启动 Fumadocs
```

## 发布

本项目使用 [semantic-release](https://semantic-release.org/) 在 GitHub Actions 中自动发布到 npm 与 GitHub Releases。

向 `main` 分支推送符合 [Conventional Commits](https://www.conventionalcommits.org/) 的提交后，CI 会自动：

1. 运行类型检查与构建
2. 根据提交信息计算版本号（`feat:` → minor，`fix:` → patch，`BREAKING CHANGE` → major）
3. 更新 `CHANGELOG.md` 与 `package.json`
4. 发布到 [npm](https://www.npmjs.com/package/qinglong-client) 并创建 GitHub Release

### npm Trusted Publishing

npm 发布使用 [Trusted Publishing (OIDC)](https://docs.npmjs.com/trusted-publishers)，无需长期有效的 `NPM_TOKEN`。

> **注意**：OIDC 发布需要 npm 11.5+（Node 24 自带）。release job 使用 Node 24；CI job 仍用 Node 22 即可。

在 [npm 包设置](https://www.npmjs.com/package/qinglong-client) → **Trusted Publisher** 中配置 GitHub Actions：

| 字段 | 值 |
|------|-----|
| Organization or user | `siaikin` |
| Repository | `qinglong-client` |
| Workflow filename | `release.yml` |

GitHub 不允许手动创建以 `GITHUB_` 开头的 Secret（系统保留）。workflow 通过 `${{ github.token }}` 自动注入 `GITHUB_TOKEN` 环境变量，**无需**在仓库 Settings → Secrets 中添加任何 GitHub 相关 Secret。

配置完成后，可在 npm 包设置中将 **Publishing access** 设为 **Require two-factor authentication and disallow tokens**，进一步限制传统 token 发布。

### 提交规范示例

```text
feat: add subscription batch update
fix: handle 401 token refresh
docs: update getting started guide
chore: bump dev dependencies
```

当前仓库已有 `feat: initial repository` 提交，首次 release 将发布 **v1.0.0**（或按 analyzer 规则计算的版本）。

## License

Apache-2.0
