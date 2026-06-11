import { source } from '@/lib/source';

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
  const base = page.url.split('/docs')[0];
  return `${base}/llm/${pageSlugToLlmParam(page.slugs)}/`;
}

export function getGitHubUrl(page: (typeof source)['$inferPage']) {
  return `https://github.com/siaikin/qinglong-client/blob/main/website/content/docs/${page.path}`;
}
