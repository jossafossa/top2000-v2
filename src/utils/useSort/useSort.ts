export function useSort<T>(positions: T[], type: keyof T, direction: boolean) {
  if (type === "change") direction = !direction;

  return [...positions].sort((a, b) => {
    if (a[type] === undefined || b[type] === undefined) {
      return 0;
    }

    // @ts-expect-error -- We know that the type is a number
    if (a[type] > b[type]) {
      return direction ? 1 : -1;
    }
    // @ts-expect-error -- We know that the type is a number

    if (a[type] < b[type]) {
      return direction ? -1 : 1;
    }
    return 0;
  });
}
