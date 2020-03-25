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
      description: 'enforce a number of newlines before export declarations',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'whitespace',
    messages: {
      expectedNewlineCount: 'Expected {{count}} empty {{lineOrLines}} before a {{exportType}} export declaration',
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
    // Constants
    //----------------------------------------------------------------------

    const HandledNodeType = {
      ExportDefaultDeclaration: 'ExportDefaultDeclaration',
      ExportNamedDeclaration: 'ExportNamedDeclaration',
      ExportAllDeclaration: 'ExportAllDeclaration',
    };

    const checkNodeTypes = Object.values(HandledNodeType);

    const ExportTypeDisplay = {
      [HandledNodeType.ExportDefaultDeclaration]: 'default',
      [HandledNodeType.ExportNamedDeclaration]: 'named',
      [HandledNodeType.ExportAllDeclaration]: '*',
    };

    const options = context.options[0] || { count: 1 };
    const EXPECTED_LINE_DIFFERENCE = options.count + 1;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Gets the numeric difference of lines between two nodes.
     * @param {ASTNode} node - First ASTNode
     * @param {ASTNode} nextNode - Other ASTNode
     * @return {number}
     */
    function getLineDifference(node, nextNode) {
      return nextNode.loc.start.line - node.loc.end.line;
    }

    /**
     * Returns whether a node is a decorated class.
     * @param {ASTNode} node - ASTNode
     * @return {Boolean}
     */
    function isClassWithDecorator(node) {
      return Boolean(node && node.type === 'ClassDeclaration' && node.decorators && node.decorators.length);
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    /**
     * Checks that a number of empty lines, equal to the value given for count (default 1),
     * exist before exports.
     * @param {ASTNode} node - ASTNode for the line before export
     * @param {ASTNode} nextNode - ASTNode for the export line
     */
    function checkForNewLine(node, nextNode) {
      if (isClassWithDecorator(nextNode)) {
        nextNode = nextNode.decorators[0];
      }

      const lineDifference = getLineDifference(node, nextNode);

      const countIsLow = lineDifference < EXPECTED_LINE_DIFFERENCE;

      if (countIsLow) {
        let column = node.loc.start.column;

        if (node.loc.start.line !== node.loc.end.line) {
          column = 0;
        }

        context.report({
          loc: {
            line: node.loc.end.line,
            column,
          },
          messageId: 'expectedNewlineCount',
          data: {
            count: options.count,
            exportType: nextNode && ExportTypeDisplay[nextNode.type],
            lineOrLines: options.count > 1 ? 'lines' : 'line',
          },
          fix: fixer => fixer.insertTextAfter(
            node,
            '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference)
          ),
        });
      }
    }

    /**
     * Given an export declaration node, checks whether the previous node
     * was also an export declaration. If not, ensures [options.count=1]
     * empty lines are between the last and the current nodes).
     * @param {ASTNode} node - Current ASTNode
     */
    function handleNode(node) {
      const { parent } = node;
      const nodePosition = parent.body.indexOf(node);

      if (nodePosition > 0) {
        const prevNode = parent.body[nodePosition - 1];

        // ensure line was preceded by something other than an exports line
        if (prevNode && !checkNodeTypes.includes(prevNode.type)) {
          checkForNewLine(prevNode, node);
        }
      }
    }

    return checkNodeTypes.reduce((obj, type) => ({
      ...obj,
      [type]: handleNode,
    }), {});
  },
};
