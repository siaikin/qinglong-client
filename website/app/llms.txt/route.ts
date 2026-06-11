import { getLlmsIndex } from '@/lib/llm';

export const revalidate = false;
export const dynamic = 'force-static';

export function GET() {
  return new Response(getLlmsIndex(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
