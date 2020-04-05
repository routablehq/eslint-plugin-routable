/**
 * @fileoverview Enforce directory path rules.
 * @author Emily Kolar
 */

import minimatch from 'minimatch';

import importType from '../helpers/importType';

const defaultGroups = ['builtin', 'external', 'parent', 'sibling', 'index'];
const defaultPathGroups = [{
  pattern: './components',
  group: 'sibling',
  position: 'after',
}, {
  pattern: './**/*.css',
  group: 'index',
  position: 'after',
}];


// REPORTING AND FIXING

function makeLinebreakAfterReport(context, imported) {
  imported.forEach((importedItem) => {
    if (importedItem.linebreakAfter) {
      if (importedItem.nextNode) {
        const nodeLine = importedItem.node.loc.end.line;
        const nextNodeLine = importedItem.nextNode.loc.start.line;

        if (nextNodeLine - nodeLine <= 1) {
          context.report({
            loc: {
              line: nodeLine,
              column: 0,
            },
            message: `Missing new line after import of ${importedItem.name}`,
          });
        }
      }
    }
  });
}

function makeCssImportsLastReport(context, importedItem, name) {
  const nodeLine = importedItem.loc.end.line;

  context.report({
    loc: {
      line: nodeLine,
      column: 0,
    },
    message: `CSS import ${name} should follow all other imports`,
  });
}

function mutateRanksToAlphabetize(imported) {
  const groupedByRanks = imported.reduce((acc, importedItem) => {
    if (!Array.isArray(acc[importedItem.rank])) {
      acc[importedItem.rank] = [];
    }
    acc[importedItem.rank].push(importedItem.name);
    return acc;
  }, {});

  const groupRanks = Object.keys(groupedByRanks);

  // assign globally unique rank to each import
  let newRank = 0;

  const alphabetizedRanks = groupRanks.sort().reduce((acc, groupRank) => {
    const importNames = groupedByRanks[groupRank];
    const lastIndex = importNames.length - 1;

    let newlineAfter = false;

    importNames.forEach((importedItemName, idx) => {
      if (idx < lastIndex) {
        const nextImportName = importNames[idx + 1];
        // covers ../, ./, and resolver aliases like -/ or @/
        const relativeOrAliasRegex = /^\W+\//g;

        if (relativeOrAliasRegex.test(importedItemName)) {
          const parts = importedItemName.split('/');
          const pathStart = [parts[0], parts[1]].join('/');

          if (nextImportName.indexOf(pathStart) !== 0) {
            newlineAfter = true;
          }
        }
      } else {
        // last import in any group always gets a newline after
        newlineAfter = true;
      }

      acc[importedItemName] = {
        rank: parseInt(groupRank, 10) + newRank,
        linebreakAfter: newlineAfter,
      };

      newRank += 1;
    });
    return acc;
  }, {});

  // mutate the original group-rank with alphabetized-rank
  imported.forEach((importedItem) => {
    importedItem.rank = alphabetizedRanks[importedItem.name].rank;
    importedItem.linebreakAfter = alphabetizedRanks[importedItem.name].linebreakAfter;
  });
}

// DETECTING

function computePathRank(ranks, pathGroups, path, maxPosition) {
  for (let i = 0, l = pathGroups.length; i < l; i += 1) {
    const {
      pattern, patternOptions, group, position = 1,
    } = pathGroups[i];
    if (minimatch(path, pattern, patternOptions || { nocomment: true })) {
      return ranks[group] + (position / maxPosition);
    }
  }
  return undefined;
}

function computeRank(context, ranks, name, type, excludedImportTypes) {
  const impType = importType(name, context);
  let rank;
  if (!excludedImportTypes.has(impType)) {
    rank = computePathRank(ranks.groups, ranks.pathGroups, name, ranks.maxPosition);
  }
  if (!rank) {
    rank = ranks.groups[impType];
  }
  if (type !== 'import') {
    rank += 100;
  }

  return rank;
}

function registerNode(context, node, name, type, ranks, imported, excludedImportTypes, nextNode) {
  const rank = computeRank(context, ranks, name, type, excludedImportTypes);
  if (rank !== -1) {
    imported.push({
      name,
      nextNode,
      node,
      rank,
    });
  }
}

const types = ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index'];

// Creates an object with type-rank pairs.
// Example: { index: 0, sibling: 1, parent: 1, external: 1, builtin: 2, internal: 2 }
// Will throw an error if it contains a type that does not exist, or has a duplicate
function convertGroupsToRanks(groups) {
  const rankObject = groups.reduce((res, group, index) => {
    if (typeof group === 'string') {
      group = [group];
    }
    group.forEach((groupItem) => {
      if (types.indexOf(groupItem) === -1) {
        throw new Error(`Incorrect configuration of the rule: Unknown type \`${
          JSON.stringify(groupItem)}\``);
      }
      if (res[groupItem] !== undefined) {
        throw new Error(`Incorrect configuration of the rule: \`${groupItem}\` is duplicated`);
      }
      res[groupItem] = index;
    });
    return res;
  }, {});

  const omittedTypes = types.filter((type) => rankObject[type] === undefined);

  return omittedTypes.reduce((res, type) => {
    res[type] = groups.length;
    return res;
  }, rankObject);
}

function convertPathGroupsForRanks(pathGroups) {
  const after = {};
  const before = {};

  const transformed = pathGroups.map((pathGroup, index) => {
    const { group, position: positionString } = pathGroup;
    let position = 0;
    if (positionString === 'after') {
      if (!after[group]) {
        after[group] = 1;
      }
      // eslint-disable-next-line no-plusplus
      position = after[group]++;
    } else if (positionString === 'before') {
      if (!before[group]) {
        before[group] = [];
      }
      before[group].push(index);
    }

    return { ...pathGroup, position };
  });

  let maxPosition = 1;

  Object.keys(before).forEach((group) => {
    const groupLength = before[group].length;
    before[group].forEach((groupIndex, index) => {
      transformed[groupIndex].position = -1 * (groupLength - index);
    });
    maxPosition = Math.max(maxPosition, groupLength);
  });

  Object.keys(after).forEach((key) => {
    const groupNextPosition = after[key];
    maxPosition = Math.max(maxPosition, groupNextPosition - 1);
  });

  return {
    pathGroups: transformed,
    maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10,
  };
}

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          groups: {
            type: 'array',
          },
          pathGroupsExcludedImportTypes: {
            type: 'array',
          },
          pathGroups: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                pattern: {
                  type: 'string',
                },
                patternOptions: {
                  type: 'object',
                },
                group: {
                  type: 'string',
                  enum: types,
                },
                position: {
                  type: 'string',
                  enum: ['after', 'before'],
                },
              },
              required: ['pattern', 'group'],
            },
          },
          'newlines-between': {
            enum: [
              'ignore',
              'always',
            ],
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const pathGroupsExcludedImportTypes = new Set(['builtin', 'external']);

    let ranks;

    try {
      const { pathGroups, maxPosition } = convertPathGroupsForRanks(options.pathGroups || defaultPathGroups);
      ranks = {
        groups: convertGroupsToRanks(options.groups || defaultGroups),
        pathGroups,
        maxPosition,
      };
    } catch (error) {
      // malformed configuration
      return {
        Program(node) {
          context.report(node, error.message);
        },
      };
    }

    let imported = [];

    return {
      ImportDeclaration: function handleImports(node) {
        const { parent, source } = node;
        const nodePosition = parent.body.indexOf(node);
        const nextNode = parent.body[nodePosition + 1];
        const name = source.value;

        // ignoring unassigned imports
        if (node.specifiers.length) {
          registerNode(
            context,
            node,
            name,
            'import',
            ranks,
            imported,
            pathGroupsExcludedImportTypes,
            nextNode,
          );
        } else if (name.includes('.css') && nextNode) {
          // ...except not ignoring css
          makeCssImportsLastReport(context, node, name);
        }
      },
      'Program:exit': function reportAndReset() {
        mutateRanksToAlphabetize(imported);

        makeLinebreakAfterReport(context, imported);

        imported = [];
      },
    };
  },
};
