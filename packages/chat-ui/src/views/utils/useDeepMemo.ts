import React from "react";

const useDeepMemo = <T>(factory: () => T, deps: any[]): T => {
  const ref = React.useRef<T>();
  const prevDeps = React.useRef<any[]>([]);

  if (!ref.current || !isEqual(prevDeps.current, deps)) {
    ref.current = factory();
    prevDeps.current = deps;
  }

  return ref.current!;
};

const isEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => isEqual(a[key], b[key]));
};

export default useDeepMemo;
