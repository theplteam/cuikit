import * as React from 'react';
import { ApiRefType, PrivateApiRefType } from './useApiRef';

export class ApiManager {
  constructor(
    public apiRef: React.RefObject<PrivateApiRefType>,
    public userApiRef: React.MutableRefObject<ApiRefType> | undefined,
  ) {}

  setMethod = <K extends keyof ApiRefType>(name: K, method: ApiRefType[K]) => {
    const apiRef = this.apiRef;
    if (apiRef.current) {
      // TODO: #ANY
      (apiRef.current[name] as any) = method;
    }

    if (this.userApiRef) {
      this.userApiRef.current[name] = method;
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
  userApiRef: React.MutableRefObject<ApiRefType> | undefined,
) => {
  return React.useMemo(() => new ApiManager(apiRef, userApiRef), [apiRef, userApiRef]);
}
