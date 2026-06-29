'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Callout } from 'fumadocs-ui/components/callout';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import {
  getCaseKey,
  getCasesByModule,
  MODULE_LABELS,
  MODULES,
} from '@/lib/client-test/cases';
import { executeClientTest } from '@/lib/client-test/execute';
import {
  isDevProxyEnabled,
  loadConnectionConfig,
  saveConnectionConfig,
  syncProxyTargetCookie,
} from '@/lib/client-test/storage';
import type {
  ClientConnectionConfig,
  ClientTestCase,
  ExecuteResult,
} from '@/lib/client-test/types';

const inputClassName =
  'border-fd-border bg-fd-background w-full rounded-lg border px-3 py-2 text-sm';
const textareaClassName =
  'border-fd-border bg-fd-secondary w-full rounded-lg border px-3 py-2 font-mono text-sm';
const buttonClassName =
  'bg-fd-primary text-fd-primary-foreground rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50';

function ResultDisplay({ result }: { result: ExecuteResult }) {
  if (!result.ok) {
    return (
      <div className="mt-3 space-y-2">
        <p className="text-sm font-medium">{result.message}</p>
        {result.details ? (
          <pre className="bg-fd-secondary overflow-x-auto rounded-lg p-4 text-sm">
            {result.details}
          </pre>
        ) : null}
      </div>
    );
  }

  if (result.type === 'blob') {
    return (
      <div className="mt-3 space-y-2">
        <p className="text-fd-muted-foreground text-sm">
          Blob ({result.mimeType}, {result.size} bytes)
        </p>
        <a
          href={result.downloadUrl}
          download="download"
          className="text-fd-primary text-sm underline"
        >
          下载文件
        </a>
      </div>
    );
  }

  return (
    <pre className="bg-fd-secondary mt-3 max-h-96 overflow-auto rounded-lg p-4 text-sm">
      {result.content}
    </pre>
  );
}

function MethodPanel({
  testCase,
  config,
}: {
  testCase: ClientTestCase;
  config: ClientConnectionConfig;
}) {
  const caseKey = getCaseKey(testCase);
  const [argsJson, setArgsJson] = useState(testCase.argsJson);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExecuteResult | null>(null);

  const handleRun = useCallback(async () => {
    setLoading(true);
    setResult(null);
    try {
      const execResult = await executeClientTest(
        config,
        testCase,
        argsJson,
        file,
      );
      setResult(execResult);
    } finally {
      setLoading(false);
    }
  }, [argsJson, config, file, testCase]);

  const title = `${testCase.http} ${testCase.method}()${testCase.destructive ? ' [副作用]' : ''}`;

  return (
    <Accordion title={title} id={caseKey}>
      <p className="text-fd-muted-foreground mb-3 text-sm">
        {testCase.description}
        {testCase.scope ? (
          <>
            {' '}
            · scope: <code>{testCase.scope}</code>
          </>
        ) : (
          <> · 无需鉴权</>
        )}
        {' '}
        · <code>{testCase.path}</code>
      </p>

      {testCase.kind === 'file' ? (
        <div className="mb-3">
          <label className="mb-1 block text-sm">上传文件</label>
          <input
            type="file"
            className={inputClassName}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      ) : (
        <div className="mb-3">
          <label className="mb-1 block text-sm">
            参数（JSON 数组，对应 fn(...args)）
          </label>
          <textarea
            className={textareaClassName}
            rows={4}
            value={argsJson}
            onChange={(e) => setArgsJson(e.target.value)}
          />
        </div>
      )}

      <button
        type="button"
        className={buttonClassName}
        disabled={loading}
        onClick={handleRun}
      >
        {loading ? '执行中…' : '执行'}
      </button>

      {result ? <ResultDisplay result={result} /> : null}
    </Accordion>
  );
}

function ModulePanel({
  module,
  config,
}: {
  module: (typeof MODULES)[number];
  config: ClientConnectionConfig;
}) {
  const cases = useMemo(() => getCasesByModule(module), [module]);

  return (
    <Accordions type="multiple">
      {cases.map((testCase) => (
        <MethodPanel
          key={getCaseKey(testCase)}
          testCase={testCase}
          config={config}
        />
      ))}
    </Accordions>
  );
}

export default function ClientTester() {
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<ClientConnectionConfig>({
    baseUrl: 'http://localhost:5700',
    clientId: '',
    clientSecret: '',
  });

  useEffect(() => {
    const loaded = loadConnectionConfig();
    setConfig(loaded);
    if (isDevProxyEnabled()) {
      syncProxyTargetCookie(loaded.baseUrl);
    }
    setMounted(true);
  }, []);

  const updateConfig = useCallback(
    (patch: Partial<ClientConnectionConfig>) => {
      setConfig((prev) => {
        const next = { ...prev, ...patch };
        saveConnectionConfig(next);
        return next;
      });
    },
    [],
  );

  if (!mounted) {
    return (
      <p className="text-fd-muted-foreground not-prose text-sm">加载测试器…</p>
    );
  }

  return (
    <div className="not-prose space-y-6">
      <Callout type="warn">
        {isDevProxyEnabled() ? (
          <>
            开发环境下，API 请求经本站 <code>/qinglong-proxy</code>{' '}
            转发至下方填写的真实面板地址（含 <code>/ql</code>{' '}
            前缀时照常填写），可绕过浏览器 CORS。请确保应用已授权对应
            scope；部分接口（删除、更新、重置认证等）会产生副作用。
          </>
        ) : (
          <>
            此页面会直连你的青龙面板执行真实 API 调用。请确保应用已授权对应
            scope；部分接口（删除、更新、重置认证等）会产生副作用。浏览器跨域限制可能导致请求失败，请确认面板地址正确且允许跨域访问，或通过反向代理同域部署。
          </>
        )}
      </Callout>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">连接配置</h3>
        <div className="grid gap-3 sm:grid-cols-1">
          <div>
            <label className="mb-1 block text-sm">面板地址 baseUrl</label>
            <input
              className={inputClassName}
              value={config.baseUrl}
              placeholder="http://localhost:5700"
              onChange={(e) => updateConfig({ baseUrl: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">clientId</label>
            <input
              className={inputClassName}
              value={config.clientId}
              placeholder="应用 Client ID"
              onChange={(e) => updateConfig({ clientId: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">clientSecret</label>
            <input
              className={inputClassName}
              type="password"
              value={config.clientSecret}
              placeholder="应用 Client Secret"
              onChange={(e) => updateConfig({ clientSecret: e.target.value })}
            />
          </div>
        </div>
        <p className="text-fd-muted-foreground text-sm">
          配置保存在浏览器 localStorage，不会上传到服务器。
          {isDevProxyEnabled() ? (
            <>
              {' '}
              开发代理目标同步至 cookie，供 middleware 转发使用。可先测试{' '}
              <code>system.info()</code>（无需 scope）验证连通性。
            </>
          ) : (
            <>
              {' '}
              可先测试 <code>system.info()</code>（无需 scope）验证连通性。
            </>
          )}
        </p>
      </section>

      <section>
        <h3 className="mb-3 text-lg font-semibold">API 测试</h3>
        <Tabs
          groupId="client-test-module"
          persist
          items={MODULES.map((module) => MODULE_LABELS[module])}
        >
          {MODULES.map((module) => (
            <Tab key={module} value={MODULE_LABELS[module]}>
              <ModulePanel module={module} config={config} />
            </Tab>
          ))}
        </Tabs>
      </section>
    </div>
  );
}
