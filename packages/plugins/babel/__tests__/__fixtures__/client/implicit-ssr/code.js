import { lazyForPaint } from 'react-loosely-lazy';

const ImplicitSsr = lazyForPaint(() => import('react'));
