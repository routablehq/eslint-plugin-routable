'use strict';

const meta = {
  docs: {
    description: 'enforce use of Routable helper functions',
    category: 'Routable',
    recommended: false,
  },
  fixable: 'code',
  schema: [],
  type: 'problem'
};

module.exports = {
  meta: meta,
  create: create,
};

function create(context) {
  return {
    'MemberExpression': function check(node) {
      if (node.property.name === 'values') {
        context.report({
          node: node,
          message: 'use "allValues(object)" instead of "object.values"',
          fix: function fix(fixer) {
            return fixer.replaceTextRange(
              [node.start, node.end + 2],
              ['allValues(', node.object.name, ')'].join('')
            );
          }
        });
      }
    }
  };
}
