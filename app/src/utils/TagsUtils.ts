import { isEmptyArray } from '~utils/CommonUtils';

export const getTagsCloudMap = (keywords: string[][], combNum: number): string[][] => {
  let temp = [] as string[][];
  let copyTimes = combNum;
  for (let i = 0; i < keywords.length; i++) {
    copyTimes /= keywords[i].length;
    const repeatTimes = combNum / (copyTimes * keywords[i].length);
    let tempString = [] as string[];
    for (let k = 0; k < repeatTimes; k++) {
      for (let j = 0; j < keywords[i].length; j++) {
        const fill = new Array(copyTimes).fill(keywords[i][j]) as string[];
        tempString = [...tempString, ...fill];
      }
    }
    temp = [...temp, tempString];
  }
  let result = [] as string[][];
  for (let i = 0; i < combNum; i++) {
    let tempString = [] as string[];
    for (let j = 0; j < temp.length; j++) {
      tempString = [...tempString, temp[j][i]];
    }
    result = [...result, tempString];
  }
  return result;
};

export const getTagsCloud = (cloudMap: string[][]): string[] => {
  const n = !isEmptyArray(cloudMap) ? cloudMap[0].length : 0;
  const idxs = Array.from(Array(n).keys());
  let prev = idxs.reduce((arr: number[][], idx: number) => ([...arr, [idx]]), [] as number[][]);
  let cloud = [...prev];
  for (let i = 1; i < n; i++) {
    let temp = [] as number[][];
    for (let j = 0; j < idxs.length; j++) {
      const current = idxs[j];
      const exclude = prev.filter((elem) => !elem.includes(current));
      temp = [...temp, ...exclude.reduce((arr: number[][], tail) => ([...arr, [current, ...tail]]), [])];
    }
    prev = temp;
    cloud = [...cloud, ...temp];
  }
  const result = new Set<string>();
  for (let i = 0; i < cloudMap.length; i++) {
    const curr = cloudMap[i];
    cloud.forEach((idxList) => {
      result.add(idxList.map((idx) => (curr[idx])).join(' '));
    });
  }
  return [...result];
};
