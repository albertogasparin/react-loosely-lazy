import { join } from 'path';
import { promises } from 'fs';
import { fileURLToPath, URL } from 'url';

const { readFile } = promises;

export const getPackages = async () => {
  const rootPath = fileURLToPath(new URL('..', import.meta.url));
  const paths = [
    'packages/core/manifest',
    'packages/core/react-loosely-lazy',
    'packages/plugins/babel',
    'packages/plugins/parcel-reporter-manifest',
    'packages/plugins/parcel-transformer',
    'packages/plugins/webpack',
    'packages/testing/integration-app',
  ].map(path => join(rootPath, path));

  const packages = await Promise.all(
    paths.map(path =>
      readFile(join(path, 'package.json'), 'utf-8').then(str => {
        const packageJson = JSON.parse(str);

        return [path, packageJson];
      })
    )
  );

  return new Map(packages);
};

export const getPublicPackages = async () => {
  const packages = await getPackages();

  return new Map(
    Array.from(packages.entries()).filter(
      ([, packageJson]) => !packageJson.private
    )
  );
};

export const toPackageNamesMap = packages => {
  return new Map(
    Array.from(packages.entries(), ([path, packageJson]) => [
      packageJson.name,
      [path, packageJson],
    ])
  );
};
