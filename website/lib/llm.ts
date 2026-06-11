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

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

export function getMarkdownUrl(page: (typeof source)['$inferPage']) {
  return `${basePath}/llm/${pageSlugToLlmParam(page.slugs)}/`;
}

export function getGitHubUrl(page: (typeof source)['$inferPage']) {
  if (page.path.startsWith('reference/')) {
    return 'https://github.com/siaikin/qinglong-client/tree/main/src';
  }
  return `https://github.com/siaikin/qinglong-client/blob/main/website/content/docs/${page.path}`;
}
