import React, { ComponentProps, ComponentType, useContext } from 'react';
import { LazySuspenseContext } from '../../suspense';
import { LoaderError } from '../errors/loader-error';
import { getExport } from '../../utils';
import { ServerLoader } from '../loader';

function load<C>(moduleId: string, loader: ServerLoader<C>) {
  try {
    return getExport(loader());
  } catch (err) {
    throw new LoaderError(moduleId, err);
  }
}

export function createComponentServer<C extends ComponentType<any>>({
  dataLazyId,
  loader,
  moduleId,
  ssr,
}: {
  dataLazyId: string;
  loader: ServerLoader<C>;
  moduleId: string;
  ssr: boolean;
}) {
  return (props: ComponentProps<C>) => {
    const Resolved = ssr ? load(moduleId, loader) : null;
    const { fallback } = useContext(LazySuspenseContext);

    return (
      <>
        <input type="hidden" data-lazy-begin={dataLazyId} />
        {Resolved ? <Resolved {...props} /> : fallback}
        <input type="hidden" data-lazy-end={dataLazyId} />
      </>
    );
  };
}
