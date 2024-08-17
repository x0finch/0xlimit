const PREFIX = "0xlimit";

const STORAGE_KEYS = {
  FEE_AMOUNT: "feeAmount",
  TRANSACTION_DEADLINE: "transactionDeadline",
  TOKEN_INFO_LIST: "tokenInfoList",
  TOKEN_INFO_LIST_LAST_MODIFIED: "tokenInfoListLastModified",
};

export type StorageID = keyof typeof STORAGE_KEYS;

export const getStorageKey = (id: StorageID) => `${PREFIX}.${STORAGE_KEYS[id]}`;
