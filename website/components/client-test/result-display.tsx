import type { ExecuteResult } from '@/lib/client-test/types';

export function ResultDisplay({ result }: { result: ExecuteResult }) {
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
