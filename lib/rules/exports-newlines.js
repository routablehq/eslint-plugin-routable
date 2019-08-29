/**
 * @fileoverview Enforce newlines before exports
 * @author Emily Kolar
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforce newlines before exports',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
    messages: {
      expected: 'Expected newlines before exports',
    },
    schema: [{
      'type': 'object',
      'properties': {
        'count': {
          'type': 'integer',
          'minimum': 1,
        },
      },
      'additionalProperties': false,
    }],
    type: 'layout',
  },
  create: function(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getLineDifference(node, nextNode) {
      return nextNode.loc.start.line - node.loc.end.line;
    }

    function isClassWithDecorator(node) {
      return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length;
    }

    //----------------------------------------------------------------------
  // Public
  //----------------------------------------------------------------------

    function checkForNewLine(node, nextNode, type) {
      if (isClassWithDecorator(nextNode)) {
        nextNode = nextNode.decorators[0];
      }

      const options = context.options[0] || { count: 1 };
      const lineDifference = getLineDifference(node, nextNode);
      const EXPECTED_LINE_DIFFERENCE = options.count + 1;

      if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
        let column = node.loc.start.column;

        if (node.loc.start.line !== node.loc.end.line) {
          column = 0;
        }

        context.report({
          loc: {
            line: node.loc.end.line,
            column,
          },
          message: `Expected ${options.count} empty line${options.count > 1 ? 's' : ''} \
before export declaration not preceded by another export declaration.`,
          fix: fixer => fixer.insertTextAfter(
            node,
            '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference)
          ),
        });
      }
    }

    function handleNode(node) {
      const { parent } = node;
      const nodePosition = parent.body.indexOf(node);
      if (nodePosition > 0) {
        const prevNode = parent.body[nodePosition - 1];

        if (
          prevNode
          && prevNode.type !== 'ExportDefaultDeclaration'
          && prevNode.type !== 'ExportNamedDeclaration'
          && prevNode.type !== 'ExportAllDeclaration'
        ) {
          checkForNewLine(prevNode, node, 'export');
        }
      }
    }

    return {
      ExportDefaultDeclaration: handleNode,
      ExportNamedDeclaration: handleNode,
      ExportAllDeclaration: handleNode,
    };
  },
};
