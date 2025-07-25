export const useYearsList = (start: number) => {
  const today = new Date();

  const isAfterChristmas = today.getMonth() === 11 && today.getDate() >= 14;

  const offset = isAfterChristmas ? 0 : 1;

  return Array.from(
    { length: today.getFullYear() - offset - start + 1 },
    (_, index) => String(start + index)
  ).reverse();
};
