import * as React from 'react';
import SpanSmoothAnimation from './SpanSmoothAnimation';

const stringToSmoothComponent = (childString: string) => {
  return childString.split(' ').map((v, i) => !v
    // if `v` is empty, it means we removed a space and it needs to be restored
    ? ` `
    : (
      <SpanSmoothAnimation key={`${v}-${i}-span`}>
        {`${v} `}
      </SpanSmoothAnimation>
  ));
}

const forEachChildren = (children: React.ReactNode[]) => {
  const resultValue: React.ReactNode[] = [];

  children.forEach((childValue) => {
    if (typeof childValue === 'string') {
      resultValue.push(...stringToSmoothComponent(childValue));
    } else if (Array.isArray(childValue)) {
      resultValue.push(...forEachChildren(childValue));
    } else {
      resultValue.push(childValue);
    }
  });

  return resultValue;
}

export const useChildrenSmootherParser = () => {
  return React.useCallback((children: React.ReactNode) => {
    const childrenArray: React.ReactNode[] = [];

    if (typeof children === 'string') {
      childrenArray.push(children);
    } else if (Array.isArray(children)) {
      childrenArray.push(...forEachChildren(children));

    }

    return childrenArray;
  }, []);
}
