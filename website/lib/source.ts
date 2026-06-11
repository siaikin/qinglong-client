import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  // Must not include Next.js basePath; Link/router add it automatically.
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
