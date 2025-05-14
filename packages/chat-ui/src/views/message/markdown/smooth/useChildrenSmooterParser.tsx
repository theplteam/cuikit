import * as React from 'react';
import SpanSmoothAnimation from './SpanSmoothAnimation';

const stringToSmoothComponent = (childString: string) => {
  return childString.split(' ').map((v, i) => (
    <SpanSmoothAnimation key={`${v}-${i}-span`}>
      {`${v} `}
    </SpanSmoothAnimation>
  ));
}

export const useChildrenSmooterParser = () => {
  return React.useCallback((children: React.ReactNode) => {
    const childrenArray: React.ReactNode[] = [];

    if (typeof children === 'string') {
      childrenArray.push(children);
    } else if (Array.isArray(children)) {
      children.forEach((childValue) => {
        if (typeof childValue === 'string') {
          childrenArray.push(...stringToSmoothComponent(childValue));
        } else {
          childrenArray.push(childValue);
        }
      });
    }

    return childrenArray;
  }, []);
}
