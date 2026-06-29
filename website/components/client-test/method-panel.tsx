'use client';

import { useCallback, useState } from 'react';
import { Accordion } from 'fumadocs-ui/components/accordion';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { getCaseKey } from '@/lib/client-test/cases';
import { executeClientTest } from '@/lib/client-test/execute';
import type {
  ClientConnectionConfig,
  ClientTestCase,
  ExecuteResult,
} from '@/lib/client-test/types';
import { ArgsForm } from './args-form';
import { ResultDisplay } from './result-display';

const INPUT =
  'border-fd-border bg-fd-background w-full rounded-lg border px-3 py-2 text-sm';

export function MethodPanel({
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
        )}{' '}
        · <code>{testCase.path}</code>
      </p>

      {testCase.kind === 'file' ? (
        <div className="mb-3">
          <label className="mb-1 block text-sm">上传文件</label>
          <input
            type="file"
            className={INPUT}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      ) : (
        <div className="mb-3">
          <ArgsForm defaultArgsJson={testCase.argsJson} onChange={setArgsJson} />
        </div>
      )}

      <button
        type="button"
        className={`${buttonVariants({ color: 'primary' })} px-4 py-2`}
        disabled={loading}
        onClick={handleRun}
      >
        {loading ? '执行中…' : '执行'}
      </button>

      {result ? <ResultDisplay result={result} /> : null}
    </Accordion>
  );
}
