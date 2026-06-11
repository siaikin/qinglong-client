import { markdownPathToSlugs, pageSlugToLlmParam } from '@/lib/llm';
import { NextRequest, NextResponse } from 'next/server';

// Dev-only: map /docs/.../*.md to flat /llm/{slug} (production uses post-build .md files).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/docs\/(.+)\.md$/);
  if (!match) return NextResponse.next();

  const slugs = markdownPathToSlugs(match[1].split('/'));
  const flat = pageSlugToLlmParam(slugs);
  return NextResponse.rewrite(new URL(`/llm/${flat}`, request.url));
}

export const config = {
  matcher: '/docs/:path*.md',
};
