# Enforce undefined for empty default prop values (default-props-prefer-undefined)

Some React components have props that are not required, and usually use empty-state values when setting their default props.

Instead of setting a default prop to `null` or `false` as a neutral empty state, we can redux complexity in code and snapshot test output (plus leverage slight performance benefits) by setting them to `undefined`.

In nearly all circumstances for us, this change does not alter the component's inner logic.

## Rule Details

Enforces `undefined` default prop values, over `null` or `false`.

Examples of **incorrect** code for this rule:

```js
const MyComponent = (props) => { /* ... */ };
MyComponent.propTypes = { stringValue: PropTypes.string };
MyComponent.defaultProps = {  stringValue: null };
```

```js
/* with ["error", { "forbidFalse": true }] */
const MyComponent = (props) => { /* ... */ };
MyComponent.propTypes = { boolValue: PropTypes.bool };
MyComponent.defaultProps = {  boolValue: false };
```

Examples of **correct** code for this rule:

```js
const MyComponent = (props) => { /* ... */ };
MyComponent.propTypes = { stringValue: PropTypes.string };
MyComponent.defaultProps = { stringValue: undefined };
```

```js
/* with ["error", { "forbidFalse": true }] */
const MyComponent = (props) => { /* ... */ };
MyComponent.propTypes = { boolValue: PropTypes.bool };
MyComponent.defaultProps = { boolValue: undefined };
```

However, `null` can be used if it is explicitly declared as a potential value using `PropTypes.oneOf()`.

This is a necessary escape hatch, as some enums or object types may contain null as a potential value.

```js
/* allowed because null is explicitly declared as a possible value */
const MyComponent = (props) => { /* ... */ };
MyComponent.propTypes = { stringValue: PropTypes.oneOf(['success', 'failure', null]) };
MyComponent.defaultProps = { stringValue: null };
```

### Options

`forbidFalse` - Whether setting a default prop to false should be banned in favor of setting it to `undefined` (identical in practice if you use `!propValue` syntax and not `propValue === false`).

Example config:

```json
{
  "routable/default-props-prefer-undefined": ["error", { "forbidFalse": true }]
}
```

## When Not To Use It

When you don't want to standardize the neutral values of default props.
