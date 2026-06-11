import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'qinglong-client',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/siaikin/qinglong-client',
        external: true,
      },
      {
        text: 'npm',
        url: 'https://www.npmjs.com/package/qinglong-client',
        external: true,
      },
      {
        text: 'TypeDoc',
        url: '/docs/reference',
      },
    ],
  };
}
