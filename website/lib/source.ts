import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

const basePath =
  process.env.NODE_ENV === 'production' ? '/qinglong-client' : '';

export const source = loader({
  baseUrl: `${basePath}/docs`,
  source: docs.toFumadocsSource(),
});
