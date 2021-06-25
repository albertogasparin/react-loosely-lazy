/**
 * @jest-environment node
 */

import Parcel from '@parcel/core';
import { NodeFS } from '@parcel/fs';

import childProcess from 'child_process';
import { join, relative } from 'path';
import { promisify } from 'util';

const execFile = promisify(childProcess.execFile);

describe('reporter', () => {
  describe('when used with the transformer', () => {
    const rootPath = join(__dirname, '..', '..', '..', '..');

    beforeAll(async () => {
      // We need to build this package and the transformer so that it can be run by parcel
      await execFile(
        join(rootPath, 'scripts', 'build.mjs'),
        [
          '@react-loosely-lazy/manifest',
          '@react-loosely-lazy/parcel-transformer',
          '@react-loosely-lazy/parcel-reporter-manifest',
        ],
        {
          cwd: rootPath,
        }
      );
    }, 25000);

    type TestParcelPluginOptions = {
      appName: string;
      fileName: string;
      publicPath: string;
    };

    const testParcelPlugin = async ({
      appName,
      fileName,
      publicPath,
    }: TestParcelPluginOptions) => {
      const projectRoot = join(__dirname, 'apps', appName);
      const inputFS = new NodeFS();

      const run = async () => {
        const parcel = new Parcel({
          defaultConfig: join(projectRoot, '.parcelrc'),
          entries: [join(projectRoot, 'src', 'index.html')],
          inputFS,
          shouldDisableCache: true,
        });

        return parcel.run();
      };

      await run();

      const integrationAppPath = './packages/testing/integration-app';
      const projectRootPath = `./${relative(rootPath, projectRoot)}`;

      const manifest = await inputFS.readFile(
        join(projectRoot, 'dist', 'cjs', fileName),
        'utf-8'
      );

      expect(JSON.parse(manifest)).toEqual({
        publicPath,
        assets: {
          [`${integrationAppPath}/src/ui/concatenated-module/index.tsx`]: [
            expect.stringMatching(/concatenated-module.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/external-assets/index.tsx`]: [
            expect.stringMatching(/external-assets.\w+.js/),
            expect.stringMatching(/external-assets.\w+.css/),
          ],
          [`${integrationAppPath}/src/ui/lazy-after-paint.tsx`]: [
            expect.stringMatching(/lazy-after-paint.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/lazy-for-paint.tsx`]: [
            expect.stringMatching(/lazy-for-paint.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/lazy.tsx`]: [
            expect.stringMatching(/lazy.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/multiple-usages.tsx`]: [
            expect.stringMatching(/multiple-usages.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/named-lazy-for-paint.tsx`]: [
            expect.stringMatching(/named-lazy-for-paint.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/nested-lazy/index.tsx`]: [
            expect.stringMatching(/nested-lazy.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/nested-lazy/main.tsx`]: [
            expect.stringMatching(/main.\w+.js/),
          ],
          [`${integrationAppPath}/src/ui/typed-lazy-for-paint.tsx`]: [
            expect.stringMatching(/typed-lazy-for-paint.\w+.js/),
          ],
          [`${projectRootPath}/lib/custom-alias.tsx`]: [
            expect.stringMatching(/custom-alias.\w+.js/),
          ],
        },
      });
    };

    describe('creates the manifest', () => {
      it('using the default options', async () => {
        await testParcelPlugin({
          appName: 'default',
          fileName: 'rll-manifest.json',
          publicPath: './',
        });
      });

      it('using the customised options', async () => {
        await testParcelPlugin({
          appName: 'custom',
          fileName: 'custom-manifest.json',
          publicPath: './',
        });
      });
    });
  });
});
