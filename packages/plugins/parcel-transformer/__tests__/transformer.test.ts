/**
 * @jest-environment node
 */

import Parcel from '@parcel/core';

import childProcess from 'child_process';
import { join } from 'path';
import { promisify } from 'util';

const execFile = promisify(childProcess.execFile);

describe('transformer', () => {
  beforeAll(async () => {
    const rootPath = join(__dirname, '..', '..', '..', '..');

    // We need to build this package so that it can be run by parcel
    await execFile(
      join(rootPath, 'scripts', 'build.mjs'),
      ['@react-loosely-lazy/parcel-transformer'],
      {
        cwd: rootPath,
      }
    );
  });

  it('stores asset module information in meta', async () => {
    const run = async () => {
      const projectRoot = join(__dirname, 'app');

      const parcel = new Parcel({
        defaultConfig: join(projectRoot, '.parcelrc'),
        entries: [join(projectRoot, 'src', 'index.html')],
        shouldDisableCache: true,
      });

      return parcel.run();
    };

    const buildSuccessEvent = await run();
    const assets = Array.from(buildSuccessEvent.changedAssets.values()).filter(
      asset => asset.meta.rllDependencies
    );

    const dependencies = assets.map(asset =>
      Array.from((asset.meta.rllDependencies as Set<string>).values()).sort(
        (a, b) => a.localeCompare(b)
      )
    );

    expect(dependencies).toEqual([
      [
        './ui/concatenated-module',
        './ui/external-assets',
        './ui/lazy',
        './ui/lazy-after-paint',
        './ui/lazy-for-paint',
        './ui/multiple-usages',
        './ui/named-lazy-for-paint',
        './ui/nested-lazy',
        './ui/typed-lazy-for-paint',
        'custom-alias',
      ],
      ['./main'],
    ]);
  });
});
