export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): {
  [I in K]: T[I];
} => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => keys.includes(key as K))
  ) as {
    [I in K]: T[I];
  };
};

export const omit = <T extends object, K extends keyof T & string>(
  obj: T,
  ...keys: K[]
): {
  [I in Exclude<keyof T, K>]: T[I];
} => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as {
    [I in Exclude<keyof T, K>]: T[I];
  };
};

export const diff = <T extends Record<keyof any, unknown>>(
  curObj: T,
  newObj: T
) => {
  const differences = Object.entries(newObj).filter(
    ([key, value]) => curObj[key] !== value
  );

  return differences.length > 0
    ? (Object.fromEntries(differences) as Partial<T>)
    : null;
};
