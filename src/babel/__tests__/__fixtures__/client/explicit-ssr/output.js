import { lazyForPaint } from 'react-loosely-lazy';
const ExplicitSSR = lazyForPaint(() => import('react'), {
  ssr: true,
  getCacheId: function () {
    if (require && require.resolveWeak) {
      return require.resolveWeak('react');
    }

    return 'react';
  },
  moduleId: './node_modules/react/index.js',
});
