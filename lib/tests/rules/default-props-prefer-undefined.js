/**
 * @fileOverview Tests for default-props-prefer-undefined, which
 * checks that defaultProp values are set to undefined instead of null
 * (in most, but not all, scenarios). Optionally, it also checks that they
 * are undefined instead of false.
 * @author Emily Kolar
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const RuleTester = require('eslint').RuleTester;

const parsers = require('../helpers/parsers');
const rule = require('../../rules/default-props-prefer-undefined');

const ERR_MSG_EXPECTED_NOT_NULL = 'Expected default prop someProp to be undefined but is null';
const ERR_MSG_EXPECTED_NOT_FALSE = 'Expected default prop someProp to be undefined but is false';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const testerOptions = {
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  parser: parsers.BABEL_ESLINT,
};

const ruleTester = new RuleTester(testerOptions);

ruleTester.run('default-props-prefer-undefined', rule, {
  valid: [
    // ===================
    // class components
    // ===================
    // with undefined prop
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.string,
        };
        SomeComponent.defaultProps = {
          someProp: undefined,
        };
      `,
    },
    // with false prop, when forbidFalse is not turned on
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.bool,
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
    },
    // with null prop, when PropTypes.oneOf() explicitly allows null
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf([null, 'hello']),
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
    },
    // with false prop, when forbidFalse is turned on,
    // but when PropTypes.oneOf() explicitly allows false
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf([false, 'hello']),
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
    },
    // check everything ok with no defaultProps declared
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.string.isRequired,
        };
      `,
    },
    // check everything ok with no propTypes or defaultProps declared
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
      `,
    },
    // check the component is skipped if default props declared without any propTypes
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
    },
    // check the component is skipped if default props declared without any propTypes,
    // when a defaultProp is false and forbidFalse is turned on
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
    },
    // check the component is skipped if default props is an empty object
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.string.isRequired,
        };
        SomeComponent.defaultProps = {};
      `,
    },
    // check the component is skipped if prop types is an empty object
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {};
        SomeComponent.defaultProps = {
            someProp: null,
        };
      `,
    },
    // ===================
    // functional components
    // ===================
    // with undefined prop
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.string,
        };
        SomeComponent.defaultProps = {
          someProp: undefined,
        };
      `,
    },
    // with false prop, when forbidFalse is not turned on
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.bool,
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
    },
    // with null prop, when PropTypes.oneOf() explicitly allows null
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf([null, 'hello']),
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
    },
    // with false prop, when forbidFalse is turned on,
    // but when PropTypes.oneOf() explicitly allows false
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf([false, 'hello']),
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
    },
    // check everything ok with no defaultProps declared
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.string.isRequired,
        };
      `,
    },
    // check everything ok with no propTypes or defaultProps declared
    {
      code: `
        const SomeComponent = () => {
          return <div />;
        };
      `,
    },
    // check the component is skipped if default props declared without any propTypes
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
    },
    // check the component is skipped if default props declared without any propTypes,
    // when a defaultProp's value is false and forbidFalse is turned on
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
    },
    // check the component is skipped if default props is an empty object
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.string.isRequired,
        };
        SomeComponent.defaultProps = {};
      `,
    },
    // check the component is skipped if prop types is an empty object
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {};
        SomeComponent.defaultProps = {
            someProp: null,
        };
      `,
    },
  ],
  invalid: [
    // class components
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.string,
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
errors: [{
        line: 11,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_NULL,
      }],
    },
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.bool,
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
      errors: [{
        line: 11,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_FALSE,
      }],
    },
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf(['hi', 'bye']),
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
      errors: [{
        line: 11,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_NULL,
      }],
    },
    {
      code: `
        class SomeComponent extends React.Component {
          render() {
            return <div />;
          }
        }
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf(['hi', 'bye']),
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
      errors: [{
        line: 11,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_FALSE,
      }],
    },
    // functional components
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.string,
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
errors: [{
        line: 9,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_NULL,
      }],
    },
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.bool,
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
errors: [{
        line: 9,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_FALSE,
      }],
    },
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf(['hi', 'bye']),
        };
        SomeComponent.defaultProps = {
          someProp: null,
        };
      `,
      errors: [{
        line: 9,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_NULL,
      }],
    },
    {
      code: `
        const SomeComponent = (props) => {
          return <div />;
        };
        SomeComponent.propTypes = {
          someProp: PropTypes.oneOf(['hi', 'bye']),
        };
        SomeComponent.defaultProps = {
          someProp: false,
        };
      `,
      options: [{
        forbidFalse: true,
      }],
      errors: [{
        line: 9,
        column: 11,
        message: ERR_MSG_EXPECTED_NOT_FALSE,
      }],
    },
  ],
});
