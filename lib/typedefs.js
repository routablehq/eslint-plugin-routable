/**
 * @typedef {*} BuiltInType
 */

/**
 * @typedef {Object.<string,*>} ASTNode
 * @property {string} body
 * @property {*[]} decorators
 * @property {Object} loc
 * @property {ASTNode} parent
 * @property {string} type
 * @property {ASTNode|BuiltInType} value
 */

/**
 * @typedef {Object} Prop
 * @property {?ASTNode} node
 */

/**
 * @typedef {{ [string]: Prop }} PropTypes
 */

/**
 * @typedef {'unresolved'|{ [string]: Prop }} DefaultProps
 */
