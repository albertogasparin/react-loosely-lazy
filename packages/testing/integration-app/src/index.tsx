import React, { lazy } from 'react';
import type { ComponentType } from 'react';
import {
  lazyForPaint,
  lazyAfterPaint as lazyAfterPaintAlias,
  lazy as lazyAlias,
} from 'react-loosely-lazy';
import { LazyProxy } from './ui/proxy/lazy';
import { Static } from './ui/static';
import type { TypedLazyForPaintProps } from './ui/typed-lazy-for-paint';
import './styles.css';

const LazyForPaint = lazyForPaint(
  () =>
    import(/* webpackChunkName: "async-lazy-for-paint" */ './ui/lazy-for-paint')
);

const NamedLazyForPaint = lazyForPaint(() =>
  import(
    /* webpackChunkName: "async-named-lazy-for-paint" */ './ui/named-lazy-for-paint'
  ).then(({ NamedLazyForPaint: Component }) => Component)
);

const TypedLazyForPaint = lazyForPaint<ComponentType<TypedLazyForPaintProps>>(
  () =>
    import(
      /* webpackChunkName: "async-typed-lazy-for-paint" */ './ui/typed-lazy-for-paint'
    )
);

const LazyAfterPaintAlias = lazyAfterPaintAlias(
  () =>
    import(
      /* webpackChunkName: "async-lazy-after-paint" */ './ui/lazy-after-paint'
    )
);

const LazyAlias = lazyAlias(
  () => import(/* webpackChunkName: "async-lazy" */ './ui/lazy')
);

const ReactLazy = lazy(
  () => import(/* webpackChunkName: "async-react-lazy" */ './ui/react-lazy')
);

const LazyConcatenatedModule = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "async-concatenated-module" */ './ui/concatenated-module'
    )
);

const LazyExternalAssets = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "async-external-assets" */ './ui/external-assets'
    )
);

const LazyMultipleUsagesOne = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "async-multiple-usages-one" */ './ui/multiple-usages'
    )
);

const LazyMultipleUsagesTwo = lazyForPaint(
  () =>
    import(
      /* webpackChunkName: "async-multiple-usages-two" */ './ui/multiple-usages'
    )
);

const LazyNested = lazyForPaint(
  () => import(/* webpackChunkName: "async-nested-lazy" */ './ui/nested-lazy')
);

const LazyCustomAlias = lazyForPaint(
  () =>
    // @ts-ignore This is a defined webpack alias
    // eslint-disable-next-line import/no-unresolved
    import(/* webpackChunkName: "async-custom-alias" */ 'custom-alias')
);

export const App = () => (
  <div>
    <LazyProxy />
    <Static />
    <LazyForPaint />
    <NamedLazyForPaint />
    <TypedLazyForPaint id="foo" />
    <LazyAfterPaintAlias />
    <LazyAlias />
    <ReactLazy />
    <LazyConcatenatedModule />
    <LazyExternalAssets />
    <LazyMultipleUsagesOne />
    <LazyMultipleUsagesTwo />
    <LazyNested />
    <LazyCustomAlias />
  </div>
);
