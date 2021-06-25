import type { Asset, BundleGraph, PackagedBundle } from '@parcel/plugin';
import type { Manifest } from '@react-loosely-lazy/manifest';
import { relative } from 'path';

const getAssetId = (basePath: string, assetPath: string) => {
  let assetId = relative(basePath, assetPath);

  if (assetId.charAt(0) !== '.') {
    assetId = `./${assetId}`;
  }

  return assetId;
};

export type BuildManifestsOptions = {
  bundleGraph: BundleGraph<PackagedBundle>;
  options: {
    assetBasePath: string;
  };
};

export const buildManifests = ({
  bundleGraph,
  options: { assetBasePath },
}: BuildManifestsOptions): Map<string, Manifest> => {
  const manifestsByTarget = new Map<string, Manifest>();
  const visitedAssetsByTarget = new Map<string, WeakSet<Asset>>();

  for (const bundle of bundleGraph.getBundles()) {
    const { distDir } = bundle.target;
    if (!manifestsByTarget.has(distDir)) {
      manifestsByTarget.set(distDir, {
        publicPath: bundle.target.publicUrl,
        assets: {},
      });
    }

    if (!visitedAssetsByTarget.has(distDir)) {
      visitedAssetsByTarget.set(distDir, new WeakSet<Asset>());
    }

    const manifest = manifestsByTarget.get(distDir)!;
    const visitedAssets = visitedAssetsByTarget.get(distDir)!;

    bundle.traverseAssets((asset, _, actions) => {
      if (visitedAssets.has(asset)) {
        actions.skipChildren();

        return;
      }

      const dependencies = asset.getDependencies();

      for (const rllDependency of asset.meta.rllDependencies ?? []) {
        const dependency = dependencies.find(
          ({ isAsync, moduleSpecifier }) =>
            moduleSpecifier === rllDependency && isAsync
        );

        if (!dependency) {
          continue;
        }

        const maybeBundleGroup = bundleGraph.resolveAsyncDependency(
          dependency,
          bundle
        );

        if (maybeBundleGroup?.type !== 'bundle_group') {
          continue;
        }

        const mainEntry = bundleGraph
          .getReferencedBundle(dependency, bundle)
          ?.getMainEntry();

        if (!mainEntry) {
          continue;
        }

        const assetId = getAssetId(assetBasePath, mainEntry.filePath);
        const referencedBundles = bundleGraph.getBundlesInBundleGroup(
          maybeBundleGroup.value
        );

        for (const referencedBundle of referencedBundles) {
          const assetDependency = relative(
            referencedBundle.target.distDir,
            referencedBundle.filePath
          );

          if (!manifest.assets[assetId]) {
            manifest.assets[assetId] = [];
          }

          manifest.assets[assetId].push(assetDependency);
        }
      }

      visitedAssets.add(asset);
    });
  }

  return manifestsByTarget;
};
