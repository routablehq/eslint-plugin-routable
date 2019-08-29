# Enforce newlines before exports (exports-newlines)

In our JavaScript files, we requires 2 newlines between import statements and other code.

To balance this out, we'd also like to enforce 2 newlines before export declarations.

## Rule Details

Enforces a number of newlines (1+) between export declarations and the code preceding it.

Examples of **incorrect** code for this rule:

```js
const x = () => true;
export { x };
```
```js
const x = () => true;
export default x;
```
```js
const x = () => true;
export default () => false;
```

Examples of **correct** code for this rule:

With `count` set to 1-

```js
const x = () => true;

export default x;
```
```js
const x = () => true;

export { x };
export default () => false;
```

With `count` set to 2-

```js
const x = () => true;


export { x };
```

### Options

`count` - Number of newlines between code and any exports.

Example config:

```json
{
  "routable/exports-newlines": ["error", { "count": 2 }]
}
```

## When Not To Use It

To enforce newlines anywhere except for immediately before an export declaration.
