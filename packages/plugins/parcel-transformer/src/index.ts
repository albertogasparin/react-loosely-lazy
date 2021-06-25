import { Transformer } from '@parcel/plugin';
import {
  findDependencies,
  getLibraryImportSpecifiers,
  findUsages,
} from './utils';

export default new Transformer({
  async transform({ asset }) {
    const code = await asset.getCode();
    const libraryImportSpecifiers = getLibraryImportSpecifiers(code);
    if (libraryImportSpecifiers.size === 0) {
      return [asset];
    }

    const usages = findUsages(code, libraryImportSpecifiers);
    const dependencies = findDependencies(usages);

    asset.meta.rllDependencies = dependencies;

    return [asset];
  },
});
