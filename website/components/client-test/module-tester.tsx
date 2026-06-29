'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Callout } from 'fumadocs-ui/components/callout';
import { Accordions } from 'fumadocs-ui/components/accordion';
import { getCaseKey, getCasesByModule } from '@/lib/client-test/cases';
import type { ClientModule } from '@/lib/client-test/types';
import { MethodPanel } from './method-panel';
import { useConnectionConfig } from './use-connection-config';

export function ClientModuleTester({ module }: { module: ClientModule }) {
  const { mounted, config } = useConnectionConfig();
  const cases = useMemo(() => getCasesByModule(module), [module]);

  if (!mounted) {
    return (
      <p className="text-fd-muted-foreground not-prose text-sm">加载测试器…</p>
    );
  }

  const hasBaseUrl = config.baseUrl.trim().length > 0;

  return (
    <div className="not-prose space-y-4">
      {!hasBaseUrl ? (
        <Callout type="warn">
          请先填写面板地址。前往{' '}
          <Link href="/docs/client-test" className="underline">
            连接配置
          </Link>{' '}
          页面设置 baseUrl 与应用凭证。
        </Callout>
      ) : (
        <Callout type="info">
          当前面板：<code>{config.baseUrl}</code>
          {' · '}
          <Link href="/docs/client-test" className="underline">
            修改连接
          </Link>
        </Callout>
      )}

      <Accordions type="multiple">
        {cases.map((testCase) => (
          <MethodPanel
            key={getCaseKey(testCase)}
            testCase={testCase}
            config={config}
          />
        ))}
      </Accordions>
    </div>
  );
}
