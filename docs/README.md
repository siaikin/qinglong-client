# 文档

qinglong-client 完整文档。

## 目录

### 指南文档

| 文档 | 说明 |
|------|------|
| [快速入门](./getting-started.md) | 安装、认证、配置、基础用法 |
| [API 参考](./api-reference.md) | 8 个模块全部方法（105+ 端点） |
| [类型参考](./types.md) | TypeScript 类型与枚举说明 |
| [常见问题](./faq.md) | 认证、配置、批量操作、版本同步 |

### TypeDoc API 文档

使用 [TypeDoc](https://typedoc.org/) 从源码 JSDoc 自动生成交互式 HTML 文档：

```bash
pnpm docs        # 输出到 ../api-docs/
pnpm docs:watch  # 开发时监听变更
```

生成后打开 `api-docs/index.html`，可搜索类名、方法名、类型，查看完整签名与中文注释。

## 架构概览

```
QinglongClient
├── envs           → /open/envs          (scope: envs)
├── crons          → /open/crons         (scope: crons)
├── subscriptions  → /open/subscriptions (scope: subscriptions)
├── configs        → /open/configs       (scope: configs)
├── scripts        → /open/scripts       (scope: scripts)
├── logs           → /open/logs          (scope: logs)
├── dependencies   → /open/dependencies  (scope: dependencies)
└── system         → /open/system        (scope: system)
```

认证流程：

```
client_id + client_secret
        ↓
GET /open/auth/token
        ↓
Bearer Token（自动缓存，过期前刷新）
        ↓
Authorization: Bearer <token>
        ↓
GET/POST/PUT/DELETE /open/{scope}/...
```

## 相关链接

- [青龙面板](https://github.com/whyour/qinglong)
- [青龙官方 API 文档](https://qinglong.online/api/)
- [内置 API（QLAPI/gRPC）](https://qinglong.online/guide/user-guide/built-in-api)
