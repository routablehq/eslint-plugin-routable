/**
 * @fileoverview Internal ESLint plugin for Routable
 * @author Emily Kolar
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require('requireindex');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = requireIndex(`${__dirname}/rules`);

module.exports.configs = requireIndex(`${__dirname}/config`);
