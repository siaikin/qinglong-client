import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = path.join(root, 'site');
const pagesBasePath = '/qinglong-client';

rmSync(siteDir, { recursive: true, force: true });
mkdirSync(siteDir, { recursive: true });

cpSync(path.join(root, 'docs-site'), siteDir, { recursive: true });
cpSync(path.join(root, 'docs'), path.join(siteDir, 'guide'), { recursive: true });

execSync(
  [
    'pnpm exec typedoc',
    `--out ${path.join(siteDir, 'api')}`,
    `--basePath ${pagesBasePath}/api/`,
    `--hostedBaseUrl https://siaikin.github.io${pagesBasePath}/api/`,
  ].join(' '),
  { cwd: root, stdio: 'inherit' },
);

console.log(`Docs site built at ${siteDir}`);
