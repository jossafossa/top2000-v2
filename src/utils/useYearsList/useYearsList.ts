export const useYearsList = (
  start: number,
  end: number | undefined = undefined
) => {
  end = end || new Date().getFullYear();

  return Array.from({ length: end - start + 1 }, (_, index) =>
    String(start + index)
  ).reverse();
};
