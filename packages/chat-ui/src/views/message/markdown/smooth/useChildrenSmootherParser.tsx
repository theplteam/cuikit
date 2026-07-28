import * as React from 'react';
import SpanSmoothAnimation from './SpanSmoothAnimation';

// A single mutable counter is threaded through the whole parse of one paragraph so
// every generated span gets a globally-unique key. A per-string-segment index (the
// previous approach) collides whenever the same word lands at the same local index in
// two sibling text fragments, and React then reuses an already-animated node — so the
// new word never fades in.
type Counter = { i: number };

const stringToSmoothComponent = (childString: string, counter: Counter) => {
  return childString.split(' ').map((v) => !v
    // if `v` is empty, it means we removed a space and it needs to be restored
    ? ` `
    : (
      <SpanSmoothAnimation key={`smooth-${counter.i++}`}>
        {`${v} `}
      </SpanSmoothAnimation>
  ));
}

const forEachChildren = (children: React.ReactNode[], counter: Counter) => {
  const resultValue: React.ReactNode[] = [];

  children.forEach((childValue) => {
    if (typeof childValue === 'string') {
      resultValue.push(...stringToSmoothComponent(childValue, counter));
    } else if (Array.isArray(childValue)) {
      resultValue.push(...forEachChildren(childValue, counter));
    } else {
      resultValue.push(childValue);
    }
  });

  return resultValue;
}

export const useChildrenSmootherParser = () => {
  return React.useCallback((children: React.ReactNode) => {
    const childrenArray: React.ReactNode[] = [];
    const counter: Counter = { i: 0 };

    if (typeof children === 'string') {
      // A lone string child is pushed as-is (never wrapped in a pending span), so text that
      // renders without going through the smoother — e.g. reasoning paragraphs, whose
      // `inProgress` latches on while their stream has already ended — can never get stuck
      // at opacity 0.
      childrenArray.push(children);
    } else if (Array.isArray(children)) {
      childrenArray.push(...forEachChildren(children, counter));
    }

    return childrenArray;
  }, []);
}
