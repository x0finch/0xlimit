import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { useMemo } from "react";

export const useSearch = <T extends object>(
  input: string,
  items: T[],
  options: IFuseOptions<T>
): FuseResult<T>[] => {
  const fuse = useMemo(() => new Fuse(items, options), [items]);
  return useMemo(() => fuse.search(input), [fuse, input]);
};
