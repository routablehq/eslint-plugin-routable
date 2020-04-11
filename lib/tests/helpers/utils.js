import path from 'path';
import eslintPkg from 'eslint/package.json';
/* eslint-disable import/no-extraneous-dependencies */
import semver from 'semver';
import 'babel-eslint'; // warms up the module cache. this import takes a while (>500ms)
/* eslint-enable import/no-extraneous-dependencies */

export const testFilePath = (relativePath) => (
  path.join(process.cwd(), './tests/files', relativePath)
);

export const FILENAME = testFilePath('foo.js');

export const test = (t) => ({
  filename: FILENAME,
  ...t,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ...t.parserOptions,
  },
});

export const testVersion = (specifier, t) => (
  semver.satisfies(eslintPkg.version, specifier) && test(t())
);

export const testContext = (settings) => ({
  getFilename() { return FILENAME; },
  settings: settings || {},
});

export const getFilename = (file) => (
  path.join(__dirname, '..', 'files', file || 'foo.js')
);
