const R = require('ramda');

const makeGetUpToAndFirstWord = (isCaseInsensitive) => R.groupBy((val) => {
  const parentPath = /^(\.{2}\/([A-Z]+|[a-z]+)\/?)/;
  const siblingPath = /^(\.{1}\/([A-Z]+|[a-z]+)\/?)/;

  const useVal = isCaseInsensitive ? val.toLowerCase() : val;

  if (parentPath.test(useVal)) {
    const parts = useVal.split('/');
    return useVal.substring(0, 3).concat(parts[1]);
  }

  if (siblingPath.test(useVal)) {
    const parts = useVal.split('/');
    return useVal.substring(0, 2).concat(parts[1]);
  }

  return useVal.split('/')[0];
});

module.exports.makeGetUpToAndFirstWord = makeGetUpToAndFirstWord;

const groupByUpToAndFirstWord = (values, isCaseInsensitive) => {
  const groupBy = makeGetUpToAndFirstWord(isCaseInsensitive);
  return groupBy(values, isCaseInsensitive);
};

module.exports.groupByUpToAndFirstWord = groupByUpToAndFirstWord;

module.exports.map = R.map;
module.exports.forEachOf = R.forEachObjIndexed;
