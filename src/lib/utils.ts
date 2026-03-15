export const cartesianProduct = <T extends any[][]>(
  arrays: [...T],
): Array<{ [K in keyof T]: T[K][number] }> =>
  arrays.reduce(
    (partialProduct, nextArray) =>
      partialProduct.flatMap((items) => nextArray.map((nextItem) => [items, nextItem].flat())),
    [[]],
  )
