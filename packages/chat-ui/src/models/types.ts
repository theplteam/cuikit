export type FnType<ReturnValue = void> = () => ReturnValue;
export type MakeReadonlyValuesExcept<T, Keys extends keyof T> = Readonly<Omit<T, Keys>> & Pick<T, Keys>;
export type MakeReadonlyValues <T, Keys extends keyof T> = Readonly<Pick<T, Keys>> & Omit<T, Keys>;
export type ArrayType<T> = (readonly T[]) | T[];

export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> & Pick<T, K>;
