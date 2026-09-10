import * as React from 'react';
import { defaultRangeExtractor, Range, useVirtualizer } from '@tanstack/react-virtual';
import { ThreadListProjection } from '../../../models/ThreadListGroupItem';

export type VirtualRow = {
  index: number;
  key: string | number | bigint;
  start: number;
  size: number;
};

export type HistoryVirtualizer = {
  totalSize: number;
  rows: VirtualRow[];
  /** Index into `projection.items` of the header currently pinned to the top. */
  stickyIndex: number;
  /** Callback ref for the pinned header element, used to animate it smoothly. */
  stickyRef: (element: HTMLElement | null) => void;
};

type Options = {
  projection: ThreadListProjection;
  scrollElement: HTMLElement | null;
  sizerElement: HTMLElement | null;
  itemHeight: number;
  groupHeaderHeight: number;
  enabled: boolean;
};

/** Index of the last header at or before `index`. */
const headerAtOrBefore = (headerIndexes: number[], index: number) => {
  let low = 0;
  let high = headerIndexes.length - 1;
  let found = headerIndexes.length ? headerIndexes[0] : 0;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (headerIndexes[mid] <= index) {
      found = headerIndexes[mid];
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return found;
};

/** Count of headers strictly before `index`. */
const headersBefore = (headerIndexes: number[], index: number) => {
  let low = 0;
  let high = headerIndexes.length - 1;
  let count = 0;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (headerIndexes[mid] < index) {
      count = mid + 1;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return count;
};

/**
 * Wraps `@tanstack/react-virtual` so the list body never touches it directly.
 * Swapping the implementation stays a one-file change.
 */
export const useHistoryVirtualizer = ({
  projection,
  scrollElement,
  sizerElement,
  itemHeight,
  groupHeaderHeight,
  enabled,
}: Options): HistoryVirtualizer => {
  const { items, headerIndexes } = projection;

  const stickyIndexRef = React.useRef(0);
  const stickyElementRef = React.useRef<HTMLElement | null>(null);

  // The sizer sits below the scroll element (simplebar inserts its own content
  // wrapper, and the `threadsList` slot may add padding). Without this offset,
  // absolutely positioned rows and the sticky header — which is positioned
  // against the scrollport — drift apart by exactly that padding.
  const scrollMargin = sizerElement?.offsetTop ?? 0;

  // Must be memoized: virtual-core keys its measurement memo on `getItemKey`
  // identity, so an inline arrow rebuilds the whole measurements array on every
  // render, including scroll-driven ones.
  const getItemKey = React.useCallback(
    (index: number) => items[index]?.key ?? index,
    [items],
  );

  const estimateSize = React.useCallback(
    (index: number) => (items[index]?.kind === 'header' ? groupHeaderHeight : itemHeight),
    [items, groupHeaderHeight, itemHeight],
  );

  const rangeExtractor = React.useCallback((range: Range) => {
    stickyIndexRef.current = headerAtOrBefore(headerIndexes, range.startIndex);
    return Array.from(new Set([stickyIndexRef.current, ...defaultRangeExtractor(range)]))
      .sort((a, b) => a - b);
  }, [headerIndexes]);

  const virtualizer = useVirtualizer({
    count: enabled ? items.length : 0,
    getScrollElement: () => scrollElement,
    estimateSize,
    getItemKey,
    rangeExtractor,
    scrollMargin,
    overscan: 6,
  });

  // Heights are constant, so an item's offset is pure arithmetic. This avoids
  // `getMeasurements`, which is private in virtual-core and would not compile.
  const offsetOf = React.useCallback((index: number) => {
    const headers = headersBefore(headerIndexes, index);
    return scrollMargin + headers * groupHeaderHeight + (index - headers) * itemHeight;
  }, [headerIndexes, scrollMargin, groupHeaderHeight, itemHeight]);

  /**
   * Keeps the outgoing header sliding out as the next one arrives.
   *
   * This cannot be done through React: the virtualizer only notifies on
   * `startIndex`/`endIndex` changes, roughly once per row, so a re-render driven
   * approach would jump rather than slide. The listener writes the same value
   * React would compute, so the two never disagree.
   */
  const updateStickyOffset = React.useCallback(() => {
    const element = stickyElementRef.current;
    if (!element || !scrollElement) return;

    const nextHeader = headerIndexes.find(i => i > stickyIndexRef.current);
    if (nextHeader === undefined) {
      element.style.top = '0px';
      return;
    }

    const overlap = offsetOf(nextHeader) - scrollElement.scrollTop - groupHeaderHeight;
    element.style.top = `${overlap < 0 ? overlap : 0}px`;
  }, [scrollElement, headerIndexes, offsetOf, groupHeaderHeight]);

  React.useLayoutEffect(() => {
    if (!enabled || !scrollElement) return;

    updateStickyOffset();
    scrollElement.addEventListener('scroll', updateStickyOffset, { passive: true });
    return () => scrollElement.removeEventListener('scroll', updateStickyOffset);
  }, [enabled, scrollElement, updateStickyOffset]);

  const stickyRef = React.useCallback((element: HTMLElement | null) => {
    stickyElementRef.current = element;
    if (element) updateStickyOffset();
  }, [updateStickyOffset]);

  const virtualItems = virtualizer.getVirtualItems();

  const rows = React.useMemo(
    () => virtualItems.map(item => ({
      index: item.index,
      key: item.key,
      start: item.start,
      size: item.size,
    })),
    [virtualItems],
  );

  return {
    totalSize: virtualizer.getTotalSize(),
    rows,
    stickyIndex: stickyIndexRef.current,
    stickyRef,
  };
};

export default useHistoryVirtualizer;
