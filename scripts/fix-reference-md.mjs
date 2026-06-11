import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'website/content/docs/reference');

fixMarkdownFiles(outDir);

function fixMarkdownFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      fixMarkdownFiles(fullPath);
      continue;
    }
    if (!entry.endsWith('.md')) continue;

    let content = readFileSync(fullPath, 'utf8');
    content = fixInternalLinks(content);
    content = ensureTitleFrontmatter(content, fullPath);
    writeFileSync(fullPath, content);
  }
}

function fixInternalLinks(content) {
  return content.replace(
    /\]\(([^)]+\/)?([^/)#]+\.md)(#[^)]+)?\)/g,
    (_m, dirPart = '', filePart, hash = '') => {
      const slug = filePart.replace(/\.md$/, '');
      return `](${dirPart}${slug}${hash})`;
    },
  );
}

function ensureTitleFrontmatter(content, filePath) {
  const normalized = content.replace(/\r\n/g, '\n');
  const frontmatterMatch = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;

  const yaml = frontmatterMatch[1];
  if (/^title:/m.test(yaml)) return content;

  const headingMatch = normalized.match(/^---\n[\s\S]*?\n---\n\n# (.+?)(?:\n|$)/);
  let title = headingMatch?.[1]?.trim();

  if (title) {
    const kindMatch = title.match(
      /^(?:Class|Interface|Type Alias|Enumeration|Function|Variable|Namespace): (.+)$/,
    );
    if (kindMatch) title = kindMatch[1];
  } else {
    title = path.basename(filePath, '.md');
  }

  const updated = normalized.replace(
    /^---\n([\s\S]*?)\n---/,
    `---\n$1\ntitle: ${JSON.stringify(title)}\n---`,
  );

  return content.includes('\r\n') ? updated.replace(/\n/g, '\r\n') : updated;
}
