import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">qinglong-client</h1>
      <p className="text-fd-muted-foreground mb-8 max-w-2xl text-lg">
        青龙面板 Open API（/open/*）的 TypeScript 客户端。类型从青龙源码推导，附带 JSDoc
        中文注释，自动 Token 获取与刷新，零运行时依赖。
      </p>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/docs"
          className="bg-fd-primary text-fd-primary-foreground rounded-lg px-6 py-2.5 font-medium"
        >
          阅读文档
        </Link>
        <a
          href="https://www.npmjs.com/package/qinglong-client"
          className="border-fd-border rounded-lg border px-6 py-2.5 font-medium"
          target="_blank"
          rel="noreferrer"
        >
          npm 包
        </a>
      </div>
      <pre className="bg-fd-secondary text-left max-w-2xl overflow-x-auto rounded-lg p-4 text-sm">
        {`import { QinglongClient } from 'qinglong-client';

const client = new QinglongClient({
  baseUrl: 'http://localhost:5700',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});

const envs = await client.envs.list({ searchValue: '' });`}
      </pre>
      <p className="text-fd-muted-foreground mt-6 text-sm">
        对应青龙版本 <strong>2.20.2</strong>
      </p>
    </main>
  );
}
