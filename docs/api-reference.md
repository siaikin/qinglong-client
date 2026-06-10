# API 参考

所有方法均在 `QinglongClient` 实例上通过子模块调用。路径均相对于 `/open`。

---

## client.envs

需要 scope：`envs`

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `list(query?)` | GET | `/envs` | 获取环境变量列表 |
| `getById(id)` | GET | `/envs/:id` | 按 ID 获取 |
| `create(items)` | POST | `/envs` | 批量创建 |
| `update(body)` | PUT | `/envs` | 更新单个 |
| `delete(ids)` | DELETE | `/envs` | 批量删除，body 为 ID 数组 |
| `move(id, body)` | PUT | `/envs/:id/move` | 移动位置 |
| `disable(ids)` | PUT | `/envs/disable` | 批量禁用 |
| `enable(ids)` | PUT | `/envs/enable` | 批量启用 |
| `updateNames(body)` | PUT | `/envs/name` | 批量重命名 |
| `pin(ids)` | PUT | `/envs/pin` | 置顶 |
| `unpin(ids)` | PUT | `/envs/unpin` | 取消置顶 |
| `addLabels(body)` | POST | `/envs/labels` | 添加标签 |
| `removeLabels(body)` | DELETE | `/envs/labels` | 移除标签 |
| `upload(file)` | POST | `/envs/upload` | 上传 JSON 文件（multipart，字段 `env`） |

```typescript
// 创建示例
await client.envs.create([
  { name: 'MY_VAR', value: 'hello', remarks: '备注', labels: ['tag1'] },
]);
```

---

## client.crons

需要 scope：`crons`

### 定时任务

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `list(query?)` | GET | `/crons` | 获取任务列表 |
| `detail(query)` | GET | `/crons/detail` | 按条件查询单个 |
| `getById(id)` | GET | `/crons/:id` | 按 ID 获取 |
| `create(body)` | POST | `/crons` | 创建任务 |
| `update(body)` | PUT | `/crons` | 更新任务 |
| `delete(ids)` | DELETE | `/crons` | 批量删除 |
| `run(ids)` | PUT | `/crons/run` | 运行任务 |
| `stop(ids)` | PUT | `/crons/stop` | 停止任务 |
| `disable(ids)` | PUT | `/crons/disable` | 禁用 |
| `enable(ids)` | PUT | `/crons/enable` | 启用 |
| `pin(ids)` | PUT | `/crons/pin` | 置顶 |
| `unpin(ids)` | PUT | `/crons/unpin` | 取消置顶 |
| `updateStatus(body)` | PUT | `/crons/status` | 更新运行状态 |
| `addLabels(body)` | POST | `/crons/labels` | 添加标签 |
| `removeLabels(body)` | DELETE | `/crons/labels` | 移除标签 |
| `import()` | GET | `/crons/import` | 从 crontab 文件导入 |
| `getLog(id)` | GET | `/crons/:id/log` | 获取当前日志 |
| `getLogs(id)` | GET | `/crons/:id/logs` | 获取日志文件列表 |
| `getInstances(id)` | GET | `/crons/:id/instances` | 获取运行实例 |
| `stopInstance(cronId, instanceId)` | POST | `/crons/:id/instances/:instanceId/stop` | 停止实例 |

```typescript
// 创建示例
await client.crons.create({
  name: '测试任务',
  command: 'node test.js',
  schedule: '0 0 * * *',       // 标准 cron，或 @once / @boot
  labels: ['daily'],
  sub_id: null,
  allow_multiple_instances: 0,
});
```

### 视图

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `listViews()` | GET | `/crons/views` | 视图列表 |
| `createView(body)` | POST | `/crons/views` | 创建视图 |
| `updateView(body)` | PUT | `/crons/views` | 更新视图 |
| `deleteViews(ids)` | DELETE | `/crons/views` | 删除视图 |
| `moveView(body)` | PUT | `/crons/views/move` | 移动视图 |
| `disableViews(ids)` | PUT | `/crons/views/disable` | 禁用视图 |
| `enableViews(ids)` | PUT | `/crons/views/enable` | 启用视图 |

---

## client.subscriptions

需要 scope：`subscriptions`

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `list(query?)` | GET | `/subscriptions` | 订阅列表 |
| `getById(id)` | GET | `/subscriptions/:id` | 按 ID 获取 |
| `create(body)` | POST | `/subscriptions` | 创建订阅 |
| `update(body)` | PUT | `/subscriptions` | 更新订阅 |
| `delete(ids, query?)` | DELETE | `/subscriptions` | 删除，`query.force` 强制删除 |
| `run(ids)` | PUT | `/subscriptions/run` | 运行 |
| `stop(ids)` | PUT | `/subscriptions/stop` | 停止 |
| `disable(ids)` | PUT | `/subscriptions/disable` | 禁用 |
| `enable(ids)` | PUT | `/subscriptions/enable` | 启用 |
| `updateStatus(body)` | PUT | `/subscriptions/status` | 更新状态 |
| `getLog(id)` | GET | `/subscriptions/:id/log` | 当前日志 |
| `getLogs(id)` | GET | `/subscriptions/:id/logs` | 日志文件列表 |

```typescript
await client.subscriptions.create({
  type: 'public-repo',
  url: 'https://github.com/user/repo.git',
  alias: 'my-repo',
  schedule_type: 'crontab',
  schedule: '0 0 * * *',
});
```

---

## client.configs

需要 scope：`configs`

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `listSamples()` | GET | `/configs/samples` | 示例配置列表 |
| `listFiles()` | GET | `/configs/files` | 配置文件列表 |
| `getDetail(query)` | GET | `/configs/detail` | 读取配置（query.path） |
| `getFile(file)` | GET | `/configs/:file` | 按文件名读取 |
| `save(body)` | POST | `/configs/save` | 保存配置文件 |

```typescript
const files = await client.configs.listFiles();
const content = await client.configs.getFile('config.sh');
await client.configs.save({ name: 'config.sh', content: '# ...' });
```

---

## client.scripts

需要 scope：`scripts`

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `list(query?)` | GET | `/scripts` | 脚本目录树 |
| `getDetail(query)` | GET | `/scripts/detail` | 读取脚本内容 |
| `getFile(file, query?)` | GET | `/scripts/:file` | 按文件名读取 |
| `create(body)` | POST | `/scripts` | 创建脚本/目录 |
| `update(body)` | PUT | `/scripts` | 更新脚本内容 |
| `delete(body)` | DELETE | `/scripts` | 删除脚本/目录 |
| `run(body)` | PUT | `/scripts/run` | 运行脚本 |
| `stop(body)` | PUT | `/scripts/stop` | 停止脚本 |
| `rename(body)` | PUT | `/scripts/rename` | 重命名 |
| `download(body)` | POST | `/scripts/download` | 下载（返回 Blob） |

```typescript
const tree = await client.scripts.list({ path: 'repo' });
const code = await client.scripts.getDetail({ path: 'repo', file: 'sign.js' });
await client.scripts.update({
  filename: 'sign.js',
  path: 'repo',
  content: 'console.log("hello")',
});
```

---

## client.logs

需要 scope：`logs`

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `list()` | GET | `/logs` | 日志目录树 |
| `getDetail(query)` | GET | `/logs/detail` | 读取日志（ANSI 已剥离） |
| `getFile(file, query?)` | GET | `/logs/:file` | 按文件名读取 |
| `delete(body)` | DELETE | `/logs` | 删除日志文件 |
| `download(body)` | POST | `/logs/download` | 下载（返回 Blob） |

---

## client.dependencies

需要 scope：`dependencies`

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `list(query?)` | GET | `/dependencies` | 依赖列表 |
| `getById(id)` | GET | `/dependencies/:id` | 按 ID 获取 |
| `create(items)` | POST | `/dependencies` | 批量创建 |
| `update(body)` | PUT | `/dependencies` | 更新 |
| `delete(ids)` | DELETE | `/dependencies` | 删除 |
| `forceDelete(ids)` | DELETE | `/dependencies/force` | 强制删除 |
| `reinstall(ids)` | PUT | `/dependencies/reinstall` | 重新安装 |
| `cancel(ids)` | PUT | `/dependencies/cancel` | 取消安装 |

```typescript
// type: 0=nodejs, 1=python3, 2=linux
await client.dependencies.create([
  { name: 'axios', type: 0, remark: 'HTTP 库' },
]);
```

---

## client.system

需要 scope：`system`（`info()` 除外，无需鉴权）

### 信息与通知

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `info()` | GET | `/system` | 系统信息（**无需鉴权**） |
| `getConfig()` | GET | `/system/config` | 系统配置 |
| `notify(body)` | PUT | `/system/notify` | 发送通知 |
| `commandRun(body)` | PUT | `/system/command-run` | 运行命令（流式文本） |
| `commandStop(body)` | PUT | `/system/command-stop` | 停止命令 |

### 更新与数据

| 方法 | HTTP | 路径 | 说明 |
|------|------|------|------|
| `checkUpdate()` | PUT | `/system/update-check` | 检查更新 |
| `update()` | PUT | `/system/update` | 更新青龙 |
| `reload(body?)` | PUT | `/system/reload` | 重载系统 |
| `exportData(body?)` | PUT | `/system/data/export` | 导出数据（Blob） |
| `importData(file)` | PUT | `/system/data/import` | 导入数据（multipart） |
| `getLog(query?)` | GET | `/system/log` | 系统日志（流式文本） |
| `deleteLog()` | DELETE | `/system/log` | 删除系统日志 |
| `resetAuth(body)` | PUT | `/system/auth/reset` | 重置管理员认证 |

### 配置项

| 方法 | HTTP | 路径 |
|------|------|------|
| `updateLogRemoveFrequency(body)` | PUT | `/system/config/log-remove-frequency` |
| `updateCronConcurrency(body)` | PUT | `/system/config/cron-concurrency` |
| `updateDependenceProxy(body)` | PUT | `/system/config/dependence-proxy` |
| `updateNodeMirror(body)` | PUT | `/system/config/node-mirror` |
| `updatePythonMirror(body)` | PUT | `/system/config/python-mirror` |
| `updateLinuxMirror(body)` | PUT | `/system/config/linux-mirror` |
| `updateTimezone(body)` | PUT | `/system/config/timezone` |
| `updateGlobalSshKey(body)` | PUT | `/system/config/global-ssh-key` |
| `cleanDependence(body)` | PUT | `/system/config/dependence-clean` |

```typescript
const info = await client.system.info();
// { isInitialized, version, publishTime, branch, changeLog, changeLogLink }

await client.system.notify({ title: '告警', content: '磁盘空间不足' });
```
