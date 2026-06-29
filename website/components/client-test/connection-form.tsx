'use client';

import { useCallback, useState } from 'react';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { executeClientTest } from '@/lib/client-test/execute';
import type { ExecuteResult } from '@/lib/client-test/types';
import { ResultDisplay } from './result-display';
import { useConnectionConfig } from './use-connection-config';

const INPUT =
  'border-fd-border bg-fd-background w-full rounded-lg border px-3 py-2 text-sm';

const INFO_CASE = {
  module: 'system' as const,
  method: 'info',
  http: 'GET',
  path: '/system',
  description: '获取系统信息（无需鉴权）',
  argsJson: '[]',
};

export function ClientConnectionForm() {
  const { mounted, config, updateConfig } = useConnectionConfig();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ExecuteResult | null>(null);

  const handleTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await executeClientTest(config, INFO_CASE, '[]');
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  }, [config]);

  if (!mounted) {
    return (
      <p className="text-fd-muted-foreground not-prose text-sm">加载表单…</p>
    );
  }

  return (
    <div className="not-prose space-y-4">
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm">面板地址 baseUrl</label>
          <input
            className={INPUT}
            value={config.baseUrl}
            placeholder="http://localhost:5700"
            onChange={(e) => updateConfig({ baseUrl: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">clientId</label>
          <input
            className={INPUT}
            value={config.clientId}
            placeholder="应用 Client ID"
            onChange={(e) => updateConfig({ clientId: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">clientSecret</label>
          <input
            className={INPUT}
            type="password"
            value={config.clientSecret}
            placeholder="应用 Client Secret"
            onChange={(e) => updateConfig({ clientSecret: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className={`${buttonVariants({ color: 'primary' })} px-4 py-2`}
          disabled={testing || !config.baseUrl.trim()}
          onClick={handleTest}
        >
          {testing ? '测试中…' : '测试连接 (system.info)'}
        </button>
        {testResult?.ok ? (
          <span className="text-sm text-green-600 dark:text-green-400">
            连接成功
          </span>
        ) : testResult && !testResult.ok ? (
          <span className="text-sm text-red-600 dark:text-red-400">
            连接失败
          </span>
        ) : null}
      </div>

      {testResult ? <ResultDisplay result={testResult} /> : null}
    </div>
  );
}
