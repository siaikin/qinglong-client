import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

const dir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.join(dir, '..');
const basePath =
  process.env.NODE_ENV === 'production' ? '/qinglong-client' : '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Static export only for production build; dev needs proxy/middleware without export constraint.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  trailingSlash: false,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  transpilePackages: ['qinglong-client'],
  turbopack: {
    // website/ uses file:.. for qinglong-client; expand root so Turbopack can resolve it.
    root: packageRoot,
  },
};

export default withMDX(config);
