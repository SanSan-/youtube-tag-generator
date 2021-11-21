export const fact = (n: number): number => {
  switch (n) {
    case 1: return 1;
    case 2: return 2;
    case 3: return 6;
    case 4: return 24;
    case 5: return 120;
    case 6: return 720;
    case 7: return 5040;
    default: return 0;
  }
};

export const cNk = (n: number, k: number): number => (fact(n) / fact(n - k));

export const sumNk = (n: number): number => {
  let sum = 0;
  for (let i = 1; i < n; i++) {
    sum += cNk(n, i);
  }
  return sum + fact(n);
};
