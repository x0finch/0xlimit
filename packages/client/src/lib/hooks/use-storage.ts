import useLocalStorage from "use-local-storage";
import { getStorageKey, StorageID } from "../constants/storage";
import { useMemo } from "react";

type Options<T> = Parameters<typeof useLocalStorage<T>>[2];
type Setter<T> = ReturnType<typeof useLocalStorage<T>>[1];

export const useStorage = <T>(
  id: StorageID | `${StorageID}.${string}`,
  defaultValue: T,
  options?: Options<T>
): [T, Setter<T>] => {
  const storageKey = useMemo(() => {
    let storageKey: string;

    const indexOfDot = id.indexOf(".");
    if (indexOfDot === -1) {
      storageKey = getStorageKey(id as StorageID);
    } else {
      storageKey = getStorageKey(id.slice(0, indexOfDot) as StorageID);
      storageKey = `${storageKey}.${id.slice(indexOfDot + 1)}`;
    }

    storageKey ??= "";
    return storageKey;
  }, [id]);

  return useLocalStorage(storageKey, defaultValue, options);
};
