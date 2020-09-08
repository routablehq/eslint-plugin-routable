/* eslint-disable */
const coreModules = require('resolve/lib/core');

const resolve = require('eslint-module-utils/resolve').default;

function isAbsolute(name) {
  return name.indexOf('/') === 0;
}

module.exports.isAbsolute = isAbsolute;

function isSubpath(subpath, path) {
  const normPath = path.replace(/\\/g, '/');
  const normSubpath = subpath.replace(/\\/g, '/').replace(/\/$/, '');
  if (normSubpath.length === 0) {
    return false;
  }
  const left = normPath.indexOf(normSubpath);
  const right = left + normSubpath.length;
  return left !== -1
    && (left === 0 || normSubpath[0] !== '/' && normPath[left - 1] === '/')
    && (right >= normPath.length || normPath[right] === '/');
}

module.exports.isSubpath = isSubpath;

function isExternalPath(path, name, settings) {
  const folders = (settings && settings['import/external-module-folders']) || ['node_modules'];
  return !path || folders.some((folder) => isSubpath(folder, path));
}

module.exports.isExternalPath = isExternalPath;

const externalModuleRegExp = /^\w/;
function isExternalModule(name, settings, path) {
  return externalModuleRegExp.test(name) && isExternalPath(path, name, settings);
}

module.exports.isExternalModule = isExternalModule;

const externalModuleMainRegExp = /^[\w]((?!\/).)*$/;
function isExternalModuleMain(name, settings, path) {
  return externalModuleMainRegExp.test(name) && isExternalPath(path, name, settings);
}

module.exports.isExternalModuleMain = isExternalModuleMain;

const scopedRegExp = /^@[^/]*\/?[^/]+/;
function isScoped(name) {
  return name && scopedRegExp.test(name);
}

module.exports.isScoped = isScoped;

const scopedMainRegExp = /^@[^/]+\/?[^/]+$/;
function isScopedMain(name) {
  return name && scopedMainRegExp.test(name);
}

module.exports.isScopedMain = isScopedMain;

function isInternalModule(name, settings, path) {
  const internalScope = (settings && settings['import/internal-regex']);
  const matchesScopedOrExternalRegExp = scopedRegExp.test(name) || externalModuleRegExp.test(name);
  return (matchesScopedOrExternalRegExp && (internalScope && new RegExp(internalScope).test(name) || !isExternalPath(path, name, settings)));
}

module.exports.isInternalModule = isInternalModule;

function isRelativeToParent(name) {
  return /^\.\.$|^\.\.[\\/]/.test(name);
}

module.exports.isRelativeToParent = isRelativeToParent;

const indexFiles = ['.', './', './index', './index.js'];
function isIndex(name) {
  return indexFiles.indexOf(name) !== -1;
}

module.exports.isIndex = isIndex;

function isRelativeToSibling(name) {
  return /^\.[\\/]/.test(name);
}

module.exports.isRelativeToSibling = isRelativeToSibling;

function isScopedModule(name) {
  return name.indexOf('@') === 0;
}

module.exports.isScopedModule = isScopedModule;

function baseModule(name) {
  if (isScoped(name)) {
    const [scope, pkg] = name.split('/');
    return `${scope}/${pkg}`;
  }
  const [pkg] = name.split('/');
  return pkg;
}

module.exports.baseModule = baseModule;

// path is defined only when a resolver resolves to a non-standard path
function isBuiltIn(name, settings, path) {
  if (path || !name) return false;
  const base = baseModule(name);
  const extras = (settings && settings['import/core-modules']) || [];
  return coreModules[base] || extras.indexOf(base) > -1;
}

module.exports.isBuiltIn = isBuiltIn;

function typeTest(name, settings, path) {
  if (isAbsolute(name, settings, path)) { return 'absolute'; }
  if (isBuiltIn(name, settings, path)) { return 'builtin'; }
  if (isInternalModule(name, settings, path)) { return 'internal'; }
  if (isExternalModule(name, settings, path)) { return 'external'; }
  if (isScoped(name, settings, path)) { return 'external'; }
  if (isRelativeToParent(name, settings, path)) { return 'parent'; }
  if (isIndex(name, settings, path)) { return 'index'; }
  if (isRelativeToSibling(name, settings, path)) { return 'sibling'; }
  return 'unknown';
}

module.exports.typeTest = typeTest;

function resolveImportType(name, context) {
  return typeTest(name, context.settings, resolve(name, context));
}

module.exports.resolveImportType = resolveImportType;
