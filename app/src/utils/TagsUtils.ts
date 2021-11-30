import { isEmptyArray } from '~utils/CommonUtils';

export const getTagsMap = (keywords: string[][], combCount: number): string[][] => {
  let temp = [] as string[][];
  let copyTimes = combCount;
  for (let i = 0; i < keywords.length; i++) {
    copyTimes /= keywords[i].length;
    const repeatTimes = combCount / (copyTimes * keywords[i].length);
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
  for (let i = 0; i < combCount; i++) {
    let tempString = [] as string[];
    for (let j = 0; j < temp.length; j++) {
      tempString = [...tempString, temp[j][i]];
    }
    result = [...result, tempString];
  }
  return result;
};

export const getTags = (tagsMap: string[][]): string[] => {
  const n = !isEmptyArray(tagsMap) ? tagsMap[0].length : 0;
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
  for (let i = 0; i < tagsMap.length; i++) {
    const curr = tagsMap[i];
    cloud.forEach((idxList) => {
      result.add(idxList.map((idx) => (curr[idx])).join(' '));
    });
  }
  return [...result];
};
