'use strict';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'SCSS imports should be last',
    },
    schema: [], // This rule has no options
  },
  create: context => {
    const sourceCode = context.getSourceCode();
    const imports = sourceCode.ast.body.filter(n => n.type === 'ImportDeclaration');

    let lastFileProcessed = undefined;
    return {
      ImportDeclaration: () => {
        // Each file needs to be processed only once
        if (lastFileProcessed !== context.getPhysicalFilename()) {
          lastFileProcessed = context.getPhysicalFilename();
          const isScss = node => /.scss$/.test(node.source.value);

          let count = 0;
          let lastOnesFound = false;
          const array = imports
            .slice()
            .reverse()
            .filter((item) => {
              if (lastOnesFound) {
                return true;
              }
              if (isScss(item)) {
                count++;
              } else {
                lastOnesFound = true;
                return true;
              }
              return false;
            })
            .reverse()

          const nodes = array.filter((item, i) => {
            return isScss(item);
          });

          nodes.forEach((node) => {
            context.report({
              message: `SCSS import must be last: ${node.source.value}`,
              node,
              fix: fixer => {
                const firstExport = sourceCode.ast.body.find((n) => ['ExportNamedDeclaration', 'ExportAllDeclaration'].includes(n.type));
                const lastImport = imports[imports.length - 1];
                if (firstExport && lastImport.range[0] > firstExport.range[1]) {
                  return;
                }

                const sourceCodeAsText = sourceCode.getText();
                const mapNodesToString = (items, scssImportsAtBottom) => items.map((item, i) => {
                  if ((items.length - scssImportsAtBottom) === i) {
                    return `\n${sourceCodeAsText.substring(...item.range)}`
                  }
                  return sourceCodeAsText.substring(...item.range);
                });

                const rest = imports.filter((item) => item.source.value !== node.source.value)
                const allImports = mapNodesToString([...rest, node], count + 1).join('\n');
                return fixer.replaceTextRange(
                  [imports[0].range[0], imports[imports.length - 1].range[1]],
                  allImports
                );
              },
            });
          });
        }
      },
    };
  },
};
