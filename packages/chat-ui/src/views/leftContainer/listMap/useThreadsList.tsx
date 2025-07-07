import * as React from 'react';
import { ThreadModel } from '../../../models';
import { Threads } from '../../../models/Threads';
import { useObserverValue } from '../../hooks/useObserverValue';
import { arrayPluck } from '../../../utils/arrayUtils/arrayPluck';
import { useHistoryContext } from '../../core/history/HistoryContext';

export const useThreadsList = (threads: ThreadModel[], model?: Threads<any, any>) => {
  const { locale } = useHistoryContext();

  const list = useObserverValue(model?.listGroups.groupValues) ?? {};

  React.useEffect(() => {
    model?.listGroups.audit(locale, threads);

  }, [locale, model, arrayPluck(threads, 'id').join(',')]);

  return React.useMemo(() => Object.values(list).sort((a, b) => b.data.timestamp - a.data.timestamp), [list]);
}
