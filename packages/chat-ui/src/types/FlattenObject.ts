type CapitalizeFirstLetter<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : T;

type ApplyPrefix<Key extends string, Prefix extends string> = Prefix extends ''
  ? Key
  : `${Prefix}${CapitalizeFirstLetter<Key>}`;

export type FlattenObject<T extends Record<string, unknown>, Prefix extends string = '', Key = keyof T> =
  Key extends string
    ? T[Key] extends Record<string, unknown>
      ? FlattenObject<T[Key], ApplyPrefix<Key, Prefix>>
      : { [P in ApplyPrefix<Key, Prefix>]: T[Key] }
    : never

export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends
    (k: infer I) => void ? I : never;
