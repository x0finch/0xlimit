const PREFIX = "0xlimit";

const STORAGE_KEYS = {
  FEE_AMOUNT: "feeAmount",
  TRANSACTION_DEADLINE: "transactionDeadline",
  TOKEN_LIST: "tokenList",
  TOKEN_LIST_LAST_MODIFIED: "tokenListLastModified",
};

export type StorageID = keyof typeof STORAGE_KEYS;

export const getStorageKey = (id: StorageID) => `${PREFIX}.${STORAGE_KEYS[id]}`;
