# 快速入门

## 什么是 Open API

青龙面板的 Open API 是一组面向第三方集成的 REST 接口，基础路径为 `/open/*`。与面板内部使用的 `/api/*` 接口共享同一套路由，但鉴权方式不同：

- **Open API**：使用应用 `client_id` / `client_secret` 换取 Bearer Token，按 scope 控制权限
- **面板 API**：使用用户登录后的 JWT Token，拥有完整管理权限

本客户端仅覆盖 **Open API**（`/open/*`），不包含 `/open/apps*` 等需要面板 JWT 的应用管理接口。

## 准备工作

### 1. 创建应用

在青龙面板中：**系统设置 → 应用设置 → 添加应用**

记录生成的：
- `client_id`（12 位随机字符串）
- `client_secret`（24 位随机字符串）

### 2. 配置权限（Scope）

创建应用时勾选所需权限，调用接口时路径第一段必须与 scope 匹配：

| Scope | 路径前缀 | 说明 |
|-------|---------|------|
| `envs` | `/open/envs` | 环境变量 |
| `crons` | `/open/crons` | 定时任务 |
| `subscriptions` | `/open/subscriptions` | 订阅管理 |
| `configs` | `/open/configs` | 配置文件 |
| `scripts` | `/open/scripts` | 脚本管理 |
| `logs` | `/open/logs` | 日志管理 |
| `dependencies` | `/open/dependencies` | 依赖管理 |
| `system` | `/open/system` | 系统设置 |

若应用未授权对应 scope，请求将返回 `401`。

### 3. 确认面板地址

默认端口 `5700`，完整地址示例：

```
http://localhost:5700
http://192.168.1.100:5700
```

若配置了 `QlBaseUrl`（如 `/ql`），需包含前缀：

```
http://localhost:5700/ql
```

## 安装

```bash
pnpm add qinglong-client
# 或
npm install qinglong-client
```

要求 **Node.js >= 18**（使用原生 `fetch`）。

## 创建客户端

```typescript
import { QinglongClient } from 'qinglong-client';

const client = new QinglongClient({
  baseUrl: 'http://localhost:5700',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});
```

### 配置项

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `baseUrl` | `string` | 是 | 面板地址，支持 `QlBaseUrl` 前缀 |
| `clientId` | `string` | 是 | 应用 Client ID |
| `clientSecret` | `string` | 是 | 应用 Client Secret |
| `fetch` | `typeof fetch` | 否 | 自定义 fetch，可用于代理或测试 |
| `tokenRefreshBuffer` | `number` | 否 | Token 过期前刷新缓冲（秒），默认 300 |

## 认证机制

客户端自动处理 Token 生命周期，无需手动管理：

1. 首次请求时调用 `GET /open/auth/token?client_id=...&client_secret=...`
2. 缓存返回的 Bearer Token（默认有效期 30 天）
3. 在过期前 5 分钟（可配置）自动刷新
4. 后续请求自动携带 `Authorization: Bearer <token>`

Token 响应结构：

```typescript
interface AuthToken {
  token: string;
  token_type: 'Bearer';
  expiration: number; // Unix 秒级时间戳
}
```

## 基础用法

### 环境变量

```typescript
// 列表
const envs = await client.envs.list({ searchValue: 'JD' });

// 创建（批量）
await client.envs.create([
  { name: 'JD_COOKIE', value: 'xxx', remarks: '京东 Cookie' },
]);

// 更新
await client.envs.update({
  id: 1,
  name: 'JD_COOKIE',
  value: 'new_value',
});

// 删除
await client.envs.delete([1, 2, 3]);
```

### 定时任务

```typescript
// 创建
const cron = await client.crons.create({
  name: '每日签到',
  command: 'task sign.js',
  schedule: '0 8 * * *',
});

// 运行
await client.crons.run([cron.id!]);

// 查询日志
const log = await client.crons.getLog(cron.id!);
```

### 系统通知

```typescript
await client.system.notify({
  title: '任务完成',
  content: '签到脚本执行成功',
});
```

### 系统信息（无需鉴权）

```typescript
const info = await client.system.info();
console.log(info.version, info.branch);
```

## 响应与错误

所有接口返回统一格式 `{ code, data, message }`。客户端在 `code !== 200` 时抛出 `QinglongApiError`：

```typescript
import { QinglongApiError } from 'qinglong-client';

try {
  await client.envs.create([{ name: '123INVALID', value: 'x' }]);
} catch (e) {
  if (e instanceof QinglongApiError) {
    console.error('错误码:', e.code);
    console.error('消息:', e.message);
    console.error('校验详情:', e.errors);
  }
}
```

常见错误码：

| code | 含义 |
|------|------|
| `200` | 成功 |
| `400` | 参数错误（Joi 校验失败） |
| `401` | 未授权（Token 无效、过期或 scope 不匹配） |
| `403` | 无权限（文件路径等） |

## 特殊接口

### Multipart 上传

```typescript
import { readFileSync } from 'fs';

// 上传环境变量 JSON
const file = new Blob([readFileSync('envs.json')]);
await client.envs.upload(file);

// 导入数据备份
await client.system.importData(file);
```

### 二进制下载

```typescript
const blob = await client.scripts.download({
  filename: 'sign.js',
  path: 'repo',
});

// 保存到本地（Node.js）
import { writeFileSync } from 'fs';
writeFileSync('sign.js', Buffer.from(await blob.arrayBuffer()));
```

### 流式文本

以下接口返回完整文本（客户端自动收集流式响应）：

```typescript
const output = await client.system.commandRun({ command: 'node sign.js' });
const sysLog = await client.system.getLog({ startTime: '2024-01-01' });
```

## 与青龙版本同步

`package.json` 中的 `qinglongVersion` 字段标明本客户端对应的青龙版本。青龙 API 变更时需同步更新客户端类型与接口。

当前对应版本：**2.20.2**
