import * as React from 'react';
import { sortByDesc } from '../../utils/arrayUtils/arraySort';
import { ArrayType } from '../../models/types';
import moment from 'moment';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { ThreadModel } from '../../models/ThreadModel';
import { useLocalizationContext } from '../core/LocalizationContext';
import { langReplace } from '../../locale/langReplace';
import { capitalizeFirstLetter } from '../../utils/stringUtils/capitalizeFirstLetter';
import { Localization } from '../../locale/Localization';

export type ThreadGroupType = {
  groupKey: string;
  thread: ThreadModel;
  time: number;
};

export type ListGroupType = {
  label: string;
  timestamp: number;
  id: string;
};

export const useThreadsGroupedList = (threads: ArrayType<ThreadModel>) => {
  const [threadGroups, setThreadGroups] = React.useState<Record<string, ListGroupType>>({});
  const locale = useLocalizationContext();

  React.useEffect(() => {
    const basicGroups = {
      today: {
        id: 'today',
        timestamp: moment().startOf('day').unix(),
        label: locale.historyToday,
      },
      yesterday: {
        id: 'yesterday',
        timestamp: moment().subtract(1, 'days').startOf('day').unix(),
        label: locale.historyYesterday,
      },
      last7Days: {
        id: 'last7Days',
        timestamp: moment().subtract(7, 'days').startOf('day').unix(),
        label: langReplace(locale.historyPreviousNDays, { days: 7 }),
      },
      last30Days: {
        id: 'last30Days',
        timestamp: moment().subtract(30, 'days').startOf('day').unix(),
        label: langReplace(locale.historyPreviousNDays, { days: 30 }),
      },
    } as Record<string, ListGroupType>;

    const basicKeys = Object.keys(basicGroups) as (keyof typeof basicGroups)[];

    const startOfYear = moment().startOf('year').unix();

    const results: Record<string, ListGroupType> = {};

    threads.forEach((item) => {
      const timestamp = item.timestamp.value;
      if (timestamp) {
        const basicGroupKey = basicKeys.find(v => timestamp >= basicGroups[v].timestamp);
        if (basicGroupKey) {
          results[basicGroupKey] = { ...basicGroups[basicGroupKey] };
        } else if (timestamp >= startOfYear) {
          const month = moment.unix(timestamp);

          const monthEn = capitalizeFirstLetter(month.locale('en').format('MMMM'));
          results[monthEn] = {
            label: locale[`history${monthEn}` as keyof Localization] as string,
            timestamp: month.unix(),
            id: monthEn,
          };
        } else {
          const year = moment.unix(timestamp).startOf('year');
          const yearLang = year.format('YYYY');
          const yearKey = `year${yearLang}`;

          results[yearKey] = {
            label: yearLang,
            timestamp: year.unix(),
            id: yearKey,
          };
        }
      } else {
        results['other'] = {
          label: 'Other',
          timestamp: 0,
          id: 'Other',
        };
      }

    });

    if (JSON.stringify(results) !== JSON.stringify(threadGroups)) {
      setThreadGroups({ ...results });
    }
  }, [arrayPluck(threads, 'id').join(',')]);

  return React.useMemo(() => {
    const groupsValues = sortByDesc(Object.values(threadGroups), 'timestamp');

    const threadsInGroup: ThreadGroupType[] = [];
    threads.forEach((thread) => {
      threadsInGroup.push({
        groupKey: groupsValues.find(v => v.timestamp <= thread.time)?.id ?? '',
        thread,
        time: thread.time,
      });
    });

    sortByDesc(threadsInGroup, 'time');

    return { groupsValues, threadsInGroup };
  }, [threadGroups, threads]);
}
