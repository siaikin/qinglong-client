# [2.0.0](https://github.com/siaikin/qinglong-client/compare/v1.3.0...v2.0.0) (2026-06-26)


### ⚠ BREAKING CHANGES

* **`crons.list()`** 返回类型由 `Crontab[]` 改为 `{ data: Crontab[]; total: number }`，与青龙源码 `crontabs()` 一致
* **`ListCronsQuery`** 移除无效字段（ids/labels/sub_id/status 等），改为 searchValue、page、size、sorter、filters、queryString
* **`CronDetailQuery`** 仅保留 `log_path`；按名称搜索请用 `list({ searchValue })`

### Features

* add `system.updateLanguage()` for `PUT /system/config/lang`

### Bug Fixes

* align crons/subscriptions/system Open API types with Qinglong 2.20.2 source

# [1.3.0](https://github.com/siaikin/qinglong-client/compare/v1.2.0...v1.3.0) (2026-06-11)


### Features

* enhance AI documentation and update llms integration ([7f63092](https://github.com/siaikin/qinglong-client/commit/7f630924bd512e022cd59a2d7c4c1008f52ec332))

# [1.2.0](https://github.com/siaikin/qinglong-client/compare/v1.1.1...v1.2.0) (2026-06-11)


### Features

* implement middleware for markdown path handling and enhance build process ([2d40eef](https://github.com/siaikin/qinglong-client/commit/2d40eefe428fd4dbd4b6409433f54fd03b4f70c6))

## [1.1.1](https://github.com/siaikin/qinglong-client/compare/v1.1.0...v1.1.1) (2026-06-11)


### Bug Fixes

* update base path handling in LLM functions and adjust type imports ([4df782a](https://github.com/siaikin/qinglong-client/commit/4df782a017ac907f19108659c9ae5c8b6ef631de))

# [1.1.0](https://github.com/siaikin/qinglong-client/compare/v1.0.0...v1.1.0) (2026-06-10)


### Features

* format readme ([a2a662a](https://github.com/siaikin/qinglong-client/commit/a2a662ab29e21064c6096391601d48e2e44022d8))

# 1.0.0 (2026-06-10)


### Features

* initial repository ([59cc1f6](https://github.com/siaikin/qinglong-client/commit/59cc1f669add6137b859207cdf56b8b18de9698a))

# Changelog

All notable changes to this project will be documented in this file by [semantic-release](https://semantic-release.org/).
