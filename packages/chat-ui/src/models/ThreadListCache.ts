import moment from 'moment/moment';
import { langReplace } from '../locale/langReplace';
import { capitalizeFirstLetter } from '../utils/stringUtils/capitalizeFirstLetter';
import { Localization } from '../locale/Localization';
import { ListGroupType } from '../views/leftContainer/useThreadsGroupedList';
import { ThreadModel } from './ThreadModel';
import { ObservableReactValue } from '../utils/observers';
import { ThreadListGroupItem } from './ThreadListGroupItem';

export class ThreadListCache {
  groupValues = new ObservableReactValue<Record<string, ThreadListGroupItem>>({});

  readonly menuConfig = new ObservableReactValue<{
    anchorEl: null | HTMLElement;
    thread: ThreadModel;
  } | undefined>(undefined);

  audit = (locale: Localization, threads: ThreadModel[]) => {
    const currentMap = this.groupValues.value;

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
    const threadsAffiliation: Record<string, ThreadModel[]> = {};

    threads.forEach((item) => {
      const timestamp = item.timestamp.value;
      let groupKey = 'other';
      if (timestamp) {
        const basicGroupKey = basicKeys.find(v => timestamp >= basicGroups[v].timestamp);
        if (basicGroupKey) {
          results[basicGroupKey] = { ...basicGroups[basicGroupKey] };
          groupKey = basicGroupKey;
        } else if (timestamp >= startOfYear) {
          const month = moment.unix(timestamp).startOf('month');

          const monthEn = capitalizeFirstLetter(month.locale('en').format('MMMM'));
          results[monthEn] = {
            label: locale[`history${monthEn}` as keyof Localization] as string,
            timestamp: month.unix(),
            id: monthEn,
          };
          groupKey = monthEn;
        } else {
          const year = moment.unix(timestamp).startOf('year');
          const yearLang = year.format('YYYY');
          const yearKey = `year${yearLang}`;

          results[yearKey] = {
            label: yearLang,
            timestamp: year.unix(),
            id: yearKey,
          };
          groupKey = yearKey;
        }
      } else {
        results['other'] = {
          label: 'Other',
          timestamp: 0,
          id: 'Other',
        };
      }

      if (!threadsAffiliation[groupKey]) {
        threadsAffiliation[groupKey] = [];
      }

      threadsAffiliation[groupKey].push(item);
    });

    let changed = false;
    for (const key in results) {
      let groupModel = currentMap[key];
      if (!groupModel) {
        changed = true;
        groupModel = new ThreadListGroupItem(results[key]);
        currentMap[key] = groupModel;
      }

      groupModel.checkList(threadsAffiliation[key]);
    }

    if (changed) {
      this.groupValues.value = { ...currentMap };
    }
  }
}
