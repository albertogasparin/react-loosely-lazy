import type { ComponentType } from 'react';

import { PHASE } from '../constants';
import { hash, displayNameFromId, isNodeEnvironment } from '../utils';
import type { Asset, Manifest } from '../webpack';

import { createComponentClient } from './components/client';
import { createComponentServer } from './components/server';
import { createDeferred } from './deferred';
import { ClientLoader, Loader, ServerLoader } from './loader';

export type { Asset, Manifest };

export type Options = {
  // Should be rendered on SSR
  // if false renders fallback on SSR
  ssr?: boolean;

  defer?: number;

  moduleId?: string;
};

export type LazyComponent<P> = ComponentType<P> & {
  preload: () => void;
  getAssetUrls: (manifest: Manifest) => string[] | undefined;
};

function lazyProxy<P>(
  loader: Loader<P>,
  { defer = PHASE.PAINT, moduleId = '', ssr = true }: Options = {}
): LazyComponent<P> {
  const isServer = isNodeEnvironment();
  const dataLazyId = hash(moduleId);

  const LazyComponent: ComponentType<P> = isServer
    ? createComponentServer({
        dataLazyId,
        loader: loader as ServerLoader<P>,
        moduleId,
        ssr,
      })
    : createComponentClient({
        dataLazyId,
        defer,
        deferred: createDeferred(loader as ClientLoader<P>),
        moduleId,
        ssr,
      });

  LazyComponent.displayName = `Lazy(${displayNameFromId(moduleId)})`;

  const getAssetUrls = (manifest: Manifest) => {
    if (!manifest[moduleId]) {
      return;
    }

    return manifest[moduleId];
  };

  /**
   * This will eventually be used to render preload link tags on transition.
   * Currently not working as we need a way for the client to be able to know the manifest[moduleId].file
   * without having to load the manifest on the client as it could be huge.
   */
  const preload = () => {
    const head = document.querySelector('head');

    if (!head) {
      return;
    }

    const link = document.createElement('link');

    link.rel = 'preload';

    // TODO add href to link
    head.appendChild(link);
  };

  return Object.assign(LazyComponent, {
    getAssetUrls,
    preload,
  });
}

export const DEFAULT_OPTIONS: {
  [key: string]: { ssr: boolean; defer: number };
} = {
  lazyForPaint: { ssr: true, defer: PHASE.PAINT },
  lazyAfterPaint: { ssr: true, defer: PHASE.AFTER_PAINT },
  lazy: { ssr: false, defer: PHASE.LAZY },
};

export function lazyForPaint<P>(loader: Loader<P>, opts?: Options) {
  return lazyProxy<P>(loader, {
    ...DEFAULT_OPTIONS.lazyForPaint,
    ...(opts || {}),
  });
}

export function lazyAfterPaint<P>(loader: Loader<P>, opts?: Options) {
  return lazyProxy<P>(loader, {
    ...DEFAULT_OPTIONS.lazyAfterPaint,
    ...(opts || {}),
  });
}

export function lazy<P>(loader: Loader<P>, opts?: Options) {
  return lazyProxy<P>(loader, {
    ...DEFAULT_OPTIONS.lazy,
    ...(opts || {}),
  });
}

export type { ClientLoader, Loader, ServerLoader };
export { LoaderError, isLoaderError } from './errors/loader-error';
