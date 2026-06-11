import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'out');
const llmDir = path.join(outDir, 'llm');

function llmParamToSlugs(param) {
  if (param === 'index') return [];
  return param.split('--');
}

function slugsToMdRelative(slugs) {
  if (slugs.length === 0) return 'docs/index.md';

  const parts = [...slugs];
  parts[parts.length - 1] += '.md';
  return `docs/${parts.join('/')}`;
}

for (const name of readdirSync(llmDir)) {
  const src = path.join(llmDir, name);
  if (!statSync(src).isFile()) continue;

  const dest = path.join(outDir, slugsToMdRelative(llmParamToSlugs(name)));
  mkdirSync(path.dirname(dest), { recursive: true });
  writeFileSync(dest, readFileSync(src));
}
