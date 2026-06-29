import { markdownPathToSlugs, pageSlugToLlmParam } from '@/lib/llm';
import { NextRequest, NextResponse } from 'next/server';

const PROXY_PREFIX = '/qinglong-proxy';
const PROXY_TARGET_COOKIE = 'ql-proxy-target';
const DEFAULT_PROXY_TARGET = 'http://localhost:5700';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
]);

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

function getProxyTarget(request: NextRequest): string {
  const fromCookie = request.cookies.get(PROXY_TARGET_COOKIE)?.value;
  if (fromCookie) return decodeURIComponent(fromCookie);
  return process.env.QINGLONG_PROXY_TARGET ?? DEFAULT_PROXY_TARGET;
}

function buildProxyTargetUrl(
  targetBase: string,
  pathname: string,
  search: string,
): string {
  const suffix = pathname.slice(PROXY_PREFIX.length) || '/';
  return `${normalizeBaseUrl(targetBase)}${suffix}${search}`;
}

function forwardRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

function forwardResponseHeaders(response: Response): Headers {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });
  return headers;
}

async function proxyQinglongRequest(request: NextRequest): Promise<NextResponse> {
  const targetBase = getProxyTarget(request);
  const targetUrl = buildProxyTargetUrl(
    targetBase,
    request.nextUrl.pathname,
    request.nextUrl.search,
  );

  const method = request.method;
  const hasBody = method !== 'GET' && method !== 'HEAD';

  console.log(
    `[qinglong-proxy] ${method} ${targetUrl}`,
    `(from ${request.nextUrl.pathname}${request.nextUrl.search}, targetBase=${targetBase})`,
  );

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers: forwardRequestHeaders(request),
      body: hasBody ? await request.arrayBuffer() : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { code: 502, message: `代理转发失败: ${message}` },
      { status: 502 },
    );
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: forwardResponseHeaders(upstream),
  });
}

// Dev-only: map /docs/.../*.md to flat /llm/{slug} (production uses post-build .md files).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(PROXY_PREFIX)) {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.next();
    }
    return proxyQinglongRequest(request);
  }

  const match = pathname.match(/^\/docs\/(.+)\.md$/);
  if (!match) return NextResponse.next();

  const slugs = markdownPathToSlugs(match[1].split('/'));
  const flat = pageSlugToLlmParam(slugs);
  return NextResponse.rewrite(new URL(`/llm/${flat}`, request.url));
}

export const config = {
  matcher: ['/docs/:path*.md', '/qinglong-proxy/:path*'],
};
