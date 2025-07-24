import * as React from 'react';
import { ApiRefType, PrivateApiRefType } from './useApiRef';

export class ApiManager {
  constructor(
    public apiRef: React.RefObject<PrivateApiRefType>,
    public userApiRef: React.RefObject<ApiRefType> | undefined,
  ) { }

  setMethod = <K extends keyof ApiRefType>(name: K, method: ApiRefType[K]) => {
    const apiRef = this.apiRef;
    if (apiRef.current) {
      // TODO: #ANY
      (apiRef.current[name] as any) = method;
    }

    if (this.userApiRef?.current) {
      this.userApiRef.current[name] = method;
    }
  }

  setPrivateMethod = <K extends keyof PrivateApiRefType>(name: K, method: PrivateApiRefType[K]) => {
    const apiRef = this.apiRef;
    if (apiRef.current) {
      apiRef.current[name] = method;
    }
  }

  setMethods = (methods: Partial<ApiRefType>) => {
    for (const key in methods) {
      const method = methods[key as keyof ApiRefType];
      if (method) {
        this.setMethod(key as keyof ApiRefType, method);
      }
    }
  }
}

export const useApiManager = (
  apiRef: React.RefObject<PrivateApiRefType>,
  userApiRef: React.RefObject<ApiRefType> | undefined,
) => {
  return React.useMemo(() => new ApiManager(apiRef, userApiRef), [apiRef, userApiRef]);
}
