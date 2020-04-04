import * as R from 'ramda';

// matches '../actions'
// ('|").+([A-Z]+|[a-z]+).+('|")

export const makeGetUpToAndFirstWord = (isCaseInsensitive) => R.groupBy((val) => {
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

export const groupByUpToAndFirstWord = (values, isCaseInsensitive) => {
  const groupBy = makeGetUpToAndFirstWord(isCaseInsensitive);
  return groupBy(values, isCaseInsensitive);
};

export const map = R.map;
export const forEachOf = R.forEachObjIndexed;
