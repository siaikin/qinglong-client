import { QinglongClient, QinglongApiError } from 'qinglong-client';
import { isDevProxyEnabled, resolveEffectiveBaseUrl } from './storage';
import type { ClientConnectionConfig, ClientTestCase, ExecuteResult } from './types';

function isIllegalFetchInvocation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.message.toLowerCase().includes('illegal invocation');
}

function isCorsOrNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    error.name === 'TypeError' &&
    (msg.includes('failed to fetch') ||
      msg.includes('fetch failed') ||
      msg.includes('networkerror') ||
      msg.includes('network request failed'))
  );
}

function formatResult(result: unknown): ExecuteResult {
  if (result instanceof Blob) {
    const downloadUrl = URL.createObjectURL(result);
    return {
      ok: true,
      type: 'blob',
      size: result.size,
      mimeType: result.type || 'application/octet-stream',
      downloadUrl,
    };
  }

  if (typeof result === 'string') {
    return { ok: true, type: 'text', content: result };
  }

  if (result === undefined || result === null) {
    return { ok: true, type: 'void', content: '(无返回值)' };
  }

  return {
    ok: true,
    type: 'json',
    content: JSON.stringify(result, null, 2),
  };
}

export async function executeClientTest(
  config: ClientConnectionConfig,
  testCase: ClientTestCase,
  argsJson: string,
  file?: File | null,
): Promise<ExecuteResult> {
  if (!config.baseUrl.trim()) {
    return {
      ok: false,
      type: 'error',
      message: '请填写面板地址 baseUrl',
    };
  }

  if (testCase.scope && (!config.clientId.trim() || !config.clientSecret.trim())) {
    return {
      ok: false,
      type: 'error',
      message: '该接口需要 clientId 和 clientSecret',
    };
  }

  let args: unknown[];
  try {
    const parsed = JSON.parse(argsJson);
    if (!Array.isArray(parsed)) {
      return {
        ok: false,
        type: 'parse',
        message: '参数必须是 JSON 数组格式，例如 [] 或 [1] 或 [{"key":"value"}]',
      };
    }
    args = parsed;
  } catch (error) {
    return {
      ok: false,
      type: 'parse',
      message: '参数 JSON 解析失败',
      details: error instanceof Error ? error.message : String(error),
    };
  }

  if (testCase.kind === 'file') {
    if (!file) {
      return {
        ok: false,
        type: 'error',
        message: '请选择要上传的文件',
      };
    }
    args = [file];
  }

  try {
    const client = new QinglongClient({
      baseUrl: resolveEffectiveBaseUrl(config),
      clientId: config.clientId.trim(),
      clientSecret: config.clientSecret.trim(),
      // Browsers require fetch to be called with window as receiver.
      fetch: (input, init) => globalThis.fetch(input, init),
    });

    const api = client[testCase.module] as unknown as Record<
      string,
      (...a: unknown[]) => Promise<unknown>
    >;
    const fn = api[testCase.method];
    if (typeof fn !== 'function') {
      return {
        ok: false,
        type: 'error',
        message: `方法不存在: client.${testCase.module}.${testCase.method}`,
      };
    }

    const result = await fn.call(api, ...args);
    return formatResult(result);
  } catch (error) {
    if (isIllegalFetchInvocation(error)) {
      return {
        ok: false,
        type: 'error',
        message: "Failed to execute 'fetch' on 'Window': Illegal invocation",
        details:
          '浏览器中 fetch 必须以正确方式调用。请重新构建 qinglong-client（pnpm build）并重启文档站。',
      };
    }

    if (isCorsOrNetworkError(error)) {
      return {
        ok: false,
        type: 'cors',
        message: isDevProxyEnabled()
          ? '网络请求失败'
          : '网络请求失败，可能是 CORS 跨域限制',
        details: isDevProxyEnabled()
          ? '开发环境下请求经 /qinglong-proxy 转发。请确认面板已启动、baseUrl 填写正确（含 /ql 前缀），并检查终端是否有代理错误。'
          : '文档站与青龙面板不同源时，浏览器会阻止跨域请求。请确认面板地址正确、面板已启动，且面板允许跨域访问；或尝试同机同域部署。',
      };
    }

    if (error instanceof QinglongApiError) {
      const details = error.errors?.length
        ? JSON.stringify(error.errors, null, 2)
        : undefined;
      return {
        ok: false,
        type: 'error',
        message: `[${error.code}] ${error.message}`,
        details,
      };
    }

    return {
      ok: false,
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
