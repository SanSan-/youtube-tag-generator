const isEmptyArray = (value) => !(value && value instanceof Array && value.length > 0);

const getTagsCloud = (cloudMap) => {
  const n = !isEmptyArray(cloudMap) ? cloudMap[0].length : 0;
  const idxs = Array.from(Array(n).keys());
  let prev = idxs.reduce((arr, idx) => ([...arr, [idx]]), []);
  let cloud = [...prev];
  for (let i = 1; i < n; i++) {
    let temp = [];
    for (let j = 0; j < idxs.length; j++) {
      const current = idxs[j];
      const exclude = prev.filter((elem) => !elem.includes(current));
      temp = [...temp, ...exclude.reduce((arr, tail) => ([...arr, [current, ...tail]]), [])];
    }
    prev = temp;
    cloud = [...cloud, ...temp];
  }
  const result = new Set();
  for (let i = 0; i < cloudMap.length; i++) {
    const curr = cloudMap[i];
    cloud.forEach((idxList) => {
      result.add(idxList.map((idx) => (curr[idx])).join(' '));
    });
  }
  return [...result];
};

module.exports = { getTagsCloud };
