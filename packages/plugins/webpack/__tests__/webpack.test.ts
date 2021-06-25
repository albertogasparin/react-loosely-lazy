/**
 * @jest-environment node
 */
import type { Manifest } from '@react-loosely-lazy/manifest';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { join, relative } from 'path';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import webpack, { Stats } from 'webpack';

import { ReactLooselyLazyPlugin } from '../src';

describe('ReactLooselyLazyPlugin', () => {
  type TestWebpackPluginOptions = {
    publicPath?: string;
  };

  const testWebpackPlugin = async ({
    publicPath,
  }: TestWebpackPluginOptions = {}) => {
    const rootPath = join(__dirname, '..', '..', '..', '..');
    const projectRoot = join(__dirname, 'app');
    const manifestFilename = 'manifest.json';

    const config = {
      devtool: 'source-map' as const,
      entry: {
        main: join(projectRoot, 'src', 'index.tsx'),
      },
      mode: 'production' as const,
      output: {
        path: join(projectRoot, 'dist'),
        filename: '[name].js',
        publicPath: '/dist/',
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [['@babel/preset-env', { modules: false }]],
              },
            },
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
        ],
      },
      plugins: [
        new ReactLooselyLazyPlugin({
          filename: manifestFilename,
          publicPath,
        }),
        // @ts-expected-error New types do not work with webpack 4
        new MiniCssExtractPlugin() as any,
      ],
      resolve: {
        alias: {
          'custom-alias': join(projectRoot, 'lib', 'custom-alias.tsx'),
        },
        extensions: ['.tsx', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
      },
    };

    type WebpackOutput = {
      manifest: Manifest;
      stats: Stats.ToJsonOutput;
    };

    const result = await new Promise<WebpackOutput>((resolve, reject) => {
      webpack(config, (err, stats) => {
        if (err) reject(err);

        const asset = stats.compilation.assets[manifestFilename];
        resolve({
          manifest: asset ? JSON.parse(asset.source()) : undefined,
          stats: stats.toJson(),
        });
      });
    });

    const { manifest, stats } = result;

    expect(stats).toMatchObject({
      errors: [],
      warnings: [],
    });

    const integrationAppPath = './packages/testing/integration-app';
    const projectRootPath = `./${relative(rootPath, projectRoot)}`;

    expect(manifest).toEqual({
      publicPath: publicPath ?? '/dist/',
      assets: {
        [`${integrationAppPath}/src/ui/concatenated-module/index.tsx`]: [
          'async-concatenated-module.js',
        ],
        [`${integrationAppPath}/src/ui/external-assets/index.tsx`]: [
          'async-external-assets.css',
          'async-external-assets.js',
        ],
        [`${integrationAppPath}/src/ui/lazy-after-paint.tsx`]: [
          'async-lazy-after-paint.js',
        ],
        [`${integrationAppPath}/src/ui/lazy-for-paint.tsx`]: [
          'async-lazy-for-paint.js',
        ],
        [`${integrationAppPath}/src/ui/lazy.tsx`]: ['async-lazy.js'],
        [`${integrationAppPath}/src/ui/multiple-usages.tsx`]: [
          'async-multiple-usages-one.js',
        ],
        [`${integrationAppPath}/src/ui/named-lazy-for-paint.tsx`]: [
          'async-named-lazy-for-paint.js',
        ],
        [`${integrationAppPath}/src/ui/nested-lazy/index.tsx`]: [
          'async-nested-lazy.js',
        ],
        [`${integrationAppPath}/src/ui/nested-lazy/main.tsx`]: [
          'async-inner-nested-lazy.js',
        ],
        [`${integrationAppPath}/src/ui/typed-lazy-for-paint.tsx`]: [
          'async-typed-lazy-for-paint.js',
        ],
        [`${projectRootPath}/lib/custom-alias.tsx`]: ['async-custom-alias.js'],
      },
    });
  };

  describe('creates the manifest', () => {
    it('using the default options', async () => {
      await testWebpackPlugin();
    });

    it('with an overridden publicPath when it is provided', async () => {
      await testWebpackPlugin({
        publicPath: 'https://cdn.example.com/',
      });
    });
  });
});
