import { source } from '@/lib/source';
import { basePath } from '@/lib/base-path';

/** Flat slug for static export (avoids nested path collisions). */
export function pageSlugToLlmParam(slugs: string[]) {
  return slugs.length === 0 ? 'index' : slugs.join('--');
}

export function llmParamToPageSlug(param: string) {
  if (param === 'index') return [];
  return param.split('--');
}

/** `/docs/api/envs.md` → `['api', 'envs']`; `/docs/index.md` → `[]` */
export function markdownPathToSlugs(segments: string[]): string[] {
  if (segments.length === 0) return [];

  const out = [...segments];
  out[out.length - 1] = out[out.length - 1].replace(/\.md$/, '');
  if (out.length === 1 && out[0] === 'index') return [];
  return out;
}

/** `['api', 'envs']` → `/docs/api/envs.md`; `[]` → `/docs/index.md` */
export function slugsToMarkdownPath(slugs: string[]): string {
  if (slugs.length === 0) return '/docs/index.md';

  const parts = [...slugs];
  parts[parts.length - 1] += '.md';
  return `/docs/${parts.join('/')}`;
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

export function getMarkdownUrl(page: (typeof source)['$inferPage']) {
  return `${basePath}${slugsToMarkdownPath(page.slugs)}`;
}

export function getGitHubUrl(page: (typeof source)['$inferPage']) {
  if (page.path.startsWith('reference/')) {
    return 'https://github.com/siaikin/qinglong-client/tree/main/src';
  }
  return `https://github.com/siaikin/qinglong-client/blob/main/website/content/docs/${page.path}`;
}
