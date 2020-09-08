/**
 * @fileOverview Checks that defaultProp values are set to undefined instead of null
 * in most scenarios. Optionally, checks that they are undefined instead of false.
 * @author Emily Kolar
 */

// eslint-plugin-react will deep-parse the syntax tree for any file in which a react
// component is found, and return data about the component and its props in a
// nicely formatted way, and handles various versions of both react and ECMA.
// given that we're already parsing react in this plugin, and thus require that
// functionality anyway, making eslint-plugin-react a peer (and dev) dependency
// seems reasonable.
/**
 * @type {{ detect: Function }}
 */
const Components = require('eslint-plugin-react/lib/util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce defaultProps are set to undefined',
      category: 'Variables',
      recommended: false,
    },
    messages: {
      nullExpectedUndefined: 'Expected default prop {{propName}} to be undefined but is null',
      falseExpectedUndefined: 'Expected default prop {{propName}} to be undefined but is false',
    },
    schema: [{
      type: 'object',
      properties: {
        forbidFalse: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    }],
    type: 'suggestion',
  },
  create: Components.detect((context, components) => {
    //----------------------------------------------------------------------
    // .eslintrc config options
    //----------------------------------------------------------------------

    const configuration = context.options[0] || {};
    const forbidFalse = configuration.forbidFalse || false;

    //----------------------------------------------------------------------
    // Values to check
    //----------------------------------------------------------------------

    const expectations = [
      {
        value: null,
        isOn: true, // always check null defaultProps
      },
      {
        value: false,
        isOn: forbidFalse,
      },
    ];

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    /**
     * Checks whether this propTypes checker is `oneOf()`, and
     * if so, if any of the arguments given to `oneOf()` are a specific value.
     * Usage: For example, if we define a propType as PropTypes.oneOf([1, null]),
     * then we should allow the defaultProp value to be null. This function
     * checks whether this is the case.
     * @param {Prop} prop - Prop type object
     * @param {BuiltInType} matchValue - Expectation match value
     * @return {boolean}
     */
    function doesOneOfPropTypeAllowValue(prop, matchValue) {
      // prop-types checker function name (bool, func, etc)
      const propNodeValue = prop.node.value;

      if (propNodeValue.type === 'CallExpression') {
        const { arguments: args, callee } = propNodeValue;

        if (callee) {
          const { name: checkerFnName } = callee.property;

          if (checkerFnName === 'oneOf') {
            const [allowedValues] = args;

            if (allowedValues && allowedValues.elements) {
              const { elements } = allowedValues;

              return !!elements.find((element) => (
                element.type === 'Literal' && element.value === matchValue
              ));
            }
          }
        }
      }

      return false;
    }

    /**
     * Gets a defaultProp's source-code value (e.g. true, 1, {}, etc).
     * @param {Prop} defaultProp - defaultProp object
     * @return {BuiltInType} Value of the defaultProp (in the source code)
     */
    function getDefaultPropValue(defaultProp) {
      if (defaultProp.node && defaultProp.node.value) {
        // Accesses the defaultProp node's value node, and returns its value property
        return defaultProp.node.value.value;
      }

      return undefined;
    }

    /**
     * Checks a defaultProp against a single expectation. i.e.--
     * Assert that its value does not equal the given matchValue, unless explicitly allowed
     * in propTypes declaration via PropTypes.oneOf([matchValue, ...]).
     * @param {string} propName - Name of the defaultProp
     * @param {Prop} prop - prop object
     * @param {Prop} defaultProp - defaultProp object
     * @param {BuiltInType} matchValue - Expectation value
     * @return {string|undefined} - Error message id to report, if expectation fails.
     */
    function checkExpectation(propName, prop, defaultProp, matchValue) {
      const defaultPropValue = getDefaultPropValue(defaultProp);

      if (defaultPropValue === matchValue) {
        if (!doesOneOfPropTypeAllowValue(prop, matchValue)) {
          return `${String(matchValue)}ExpectedUndefined`;
        }
      }

      return undefined;
    }

    /**
     * Checks the prop against each expectation in the list, where expectation.isOn
     * is true, and if an issue is found, returns the id of the error message to report.
     * @param {string} propName - Name of the current defaultProp
     * @param {Prop} prop - The prop object
     * @param {Prop} defaultProp - The defaultProp object
     * @return {string|undefined} - Error message id to report, if expectation fails.
     */
    function checkExpectationsForDefaultProp(propName, prop, defaultProp) {
      let errorMessageId;

      for (
        let i = 0, len = expectations.length;
        errorMessageId === undefined && i < len; // break the loop on first issue found
        i += 1
      ) {
        const { value, isOn } = expectations[i];

        if (isOn) {
          errorMessageId = checkExpectation(propName, prop, defaultProp, value);
        }
      }

      return errorMessageId;
    }

    /**
     * Tests that all defaultProps passed in meet a list of expectations.
     * A message is reported for each defaultProp that fails the tests.
     * @param  {PropTypes} propTypes - propTypes object to check. Keys are the props names, values are objects.
     * @param  {DefaultProps} defaultProps - defaultProps object to check. Keys are the props names, values are objects.
     * @return {void}
     */
    function reportInvalidDefaultProps(propTypes, defaultProps) {
      // If this defaultProps is "unresolved" or the propTypes is undefined, then we should ignore
      // this component and not report any errors for it (eslint-plugin-react should be used
      // to check that propTypes and defaultProps definitions are in place where they are needed)
      if (defaultProps === 'unresolved' || !propTypes || Object.keys(propTypes).length === 0) {
        return;
      }

      Object.keys(defaultProps).forEach((defaultPropName) => {
        const defaultProp = defaultProps[defaultPropName];
        const prop = propTypes[defaultPropName];

        const reportMessageId = checkExpectationsForDefaultProp(defaultPropName, prop, defaultProp);

        if (reportMessageId) {
          context.report({
            node: defaultProp.node,
            messageId: reportMessageId,
            data: { propName: defaultPropName },
          });
        }
      });
    }

    // --------------------------------------------------------------------------
    // Public API
    // --------------------------------------------------------------------------

    return {
      'Program:exit': function () {
        const list = components.list();

        // If no defaultProps could be found, we don't report anything.
        Object.keys(list).filter((component) => list[component].defaultProps).forEach((component) => {
          reportInvalidDefaultProps(
            list[component].declaredPropTypes,
            list[component].defaultProps || {},
          );
        });
      },
    };
  }),
};
