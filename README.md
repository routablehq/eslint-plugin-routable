# eslint-plugin-routable

Internal ESLint plugin for Routable

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i -D eslint
```

Next, install `eslint-plugin-routable`:

```
$ npm i -D eslint-plugin-routable
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-routable` globally.

## Usage

Add `routable` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "routable"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "routable/rule-name": 2
    }
}
```

## Supported Rules

`exports-newlines`

## Development

1. Clone the repo
2. Run `npm link` in the project repo
3. Navigate to the *other* project where you are using the plugin and run `npm link eslint-plugin-routable`
4. Update the eslint configuration to turn on the rule
5. Run eslint
