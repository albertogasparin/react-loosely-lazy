const MODULE_SPECIFIER = 'react-loosely-lazy';

const libraryImportSpecifiersRe = new RegExp(
  `^import[\\s\r\n]+(?:\\w+[\\s\r\n]*,?[\\s\r\n]*)?(?:{(?<specifiers>[^}]*)})[\\s\r\n]+from[\\s\r\n]*(?:"${MODULE_SPECIFIER}"|'${MODULE_SPECIFIER}')`,
  'gm'
);

const dynamicImportSingleQuotesSpecifierRe =
  /import[\s\r\n]*\((?:[^']*'(?<specifier>[^']+)')[^)]*\)/;
const dynamicImportDoubleQuotesSpecifierRe =
  /import[\s\r\n]*\((?:[^"]*"(?<specifier>[^"]+)")[^)]*\)/;

// https://stackoverflow.com/a/15123777
const commentRe = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;

export const getLibraryImportSpecifiers = (code: string) => {
  const libraryImportSpecifiers = new Set<string>();

  // Naively check if the module specifier is referenced at all in the file before proceeding
  if (
    !code.includes(`'${MODULE_SPECIFIER}'`) &&
    !code.includes(`"${MODULE_SPECIFIER}"`)
  ) {
    return libraryImportSpecifiers;
  }

  // This only handles a basic syntax to balance speed vs correctness:
  // import { x } from 'react-loosely-lazy';
  // import { x as y } from 'react-loosely-lazy';
  const importSpecifiers = code.matchAll(libraryImportSpecifiersRe);
  for (const importSpecifier of importSpecifiers) {
    if (importSpecifier.groups?.specifiers) {
      const specifiers = importSpecifier.groups.specifiers.split(',');

      for (const specifier of specifiers) {
        if (specifier.trim() === '') {
          // Skip a specifier that occurs from the last trailing ,
          continue;
        }

        const specifierWithImported = specifier
          .split(' as ')
          .map(s => s.trim());
        const local =
          specifierWithImported[specifierWithImported.length === 1 ? 0 : 1];

        libraryImportSpecifiers.add(local);
      }
    }
  }

  return libraryImportSpecifiers;
};

export const findUsages = (code: string, importSpecifiers: Set<string>) => {
  const usages: string[] = [];
  for (const importSpecifier of importSpecifiers) {
    // This is going to assume you call the library, with an optional generic type parameter, and no whitespace...
    const usageStartRe = new RegExp(`${importSpecifier}(?:<.+>)?\\(`);

    let usageIndex = 0;
    let usageStart;
    while ((usageStart = code.substr(usageIndex).match(usageStartRe))) {
      let usage = usageStart[0];
      usageIndex = code.indexOf(usage, usageIndex);
      const parenthesis = ['('];
      for (
        let i = usageIndex + usageStart[0].length;
        parenthesis.length ? i < code.length : false;
        i++
      ) {
        if (code[i] === '(') {
          parenthesis.push('(');
        } else if (code[i] === ')') {
          parenthesis.pop();
        }

        usage += code[i];
      }

      usages.push(usage);
      usageIndex = usageIndex + usage.length;
    }
  }

  return usages;
};

export const findDependencies = (usages: string[]) => {
  const dependencies = new Set<string>();
  for (const usage of usages) {
    // Strip comments, then find the first import
    const usageWithoutComments = usage.replace(commentRe, '');
    const dependency =
      usageWithoutComments.match(dynamicImportSingleQuotesSpecifierRe)?.groups
        ?.specifier ||
      usageWithoutComments.match(dynamicImportDoubleQuotesSpecifierRe)?.groups
        ?.specifier;

    if (dependency) {
      dependencies.add(dependency);
    }
  }

  return dependencies;
};
