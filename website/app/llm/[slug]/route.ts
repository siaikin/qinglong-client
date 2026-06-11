import { getLLMText } from '@/lib/llm';
import { pageSlugToLlmParam, llmParamToPageSlug } from '@/lib/llm';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;
export const dynamic = 'force-static';

export async function GET(
  _req: Request,
  { params }: RouteContext<'/llm/[slug]'>,
) {
  const { slug: slugParam } = await params;
  const page = source.getPage(llmParamToPageSlug(slugParam));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: pageSlugToLlmParam(page.slugs),
  }));
}
