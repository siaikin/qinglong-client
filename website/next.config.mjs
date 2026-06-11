import { createMDX } from 'fumadocs-mdx/next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const withMDX = createMDX();

const dir = path.dirname(fileURLToPath(import.meta.url));
const basePath =
  process.env.NODE_ENV === 'production' ? '/qinglong-client' : '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : '',
  turbopack: {
    root: dir,
  },
};

export default withMDX(config);
