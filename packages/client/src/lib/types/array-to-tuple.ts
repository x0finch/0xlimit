type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type UnionToTuple<U> = UnionToIntersection<
  U extends any ? (k: U) => void : never
> extends (k: infer I) => void
  ? [...UnionToTuple<Exclude<U, I>>, I]
  : [];

export type ArrayToTuple<T extends any[]> = T extends (infer U)[]
  ? UnionToTuple<U>
  : never;
