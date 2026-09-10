import moment from 'moment/moment';
import { langReplace } from '../locale/langReplace';
import { capitalizeFirstLetter } from '../utils/stringUtils/capitalizeFirstLetter';
import { Localization } from '../locale/Localization';
import { ThreadModel } from './ThreadModel';
import { ObservableReactValue } from '../utils/observers';
import {
  EMPTY_PROJECTION,
  headerKey,
  ListGroupType,
  rowKey,
  ThreadListFlatItem,
  ThreadListGroupItem,
  ThreadListProjection,
} from './ThreadListGroupItem';

export const PINNED_GROUP_KEY = '__pinned__';

export class ThreadListCache {
  groupValues = new ObservableReactValue<Record<string, ThreadListGroupItem>>({});

  /**
   * Flat render list derived from groupValues. This is the single source of
   * truth for the list body: it collapses the nested group structure into one
   * index space so the list can be windowed, and it is the only place the
   * isEmpty filter is applied.
   */
  readonly projection = new ObservableReactValue<ThreadListProjection>(EMPTY_PROJECTION);

  readonly menuConfig = new ObservableReactValue<{
    anchorEl: null | HTMLElement;
    thread: ThreadModel;
  } | undefined>(undefined);

  private lastLocale?: Localization;
  private lastThreads: ThreadModel[] = [];

  /**
   * Re-runs the last audit. Needed by call sites that change something the
   * audit reads without replacing Threads.list — notably clearing a thread's
   * isEmpty flag, which makes an already-listed thread become visible.
   */
  requestAudit = () => {
    if (this.lastLocale) {
      this.audit(this.lastLocale, this.lastThreads);
    }
  }

  audit = (locale: Localization, threads: ThreadModel[]) => {
    this.lastLocale = locale;
    this.lastThreads = threads;

    const currentMap = this.groupValues.value;

    // Empty (unsent) threads render to nothing, so they must never occupy a slot
    // in the index space the virtualizer builds on.
    const visibleThreads = threads.filter(t => !t.isEmpty.value);

    const pinnedThreads = visibleThreads.filter(t => t.pinnedAt.value != null);
    const unpinnedThreads = visibleThreads.filter(t => t.pinnedAt.value == null);

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

    if (pinnedThreads.length) {
      results[PINNED_GROUP_KEY] = {
        id: PINNED_GROUP_KEY,
        label: locale.historyPinned,
        timestamp: Number.MAX_SAFE_INTEGER,
      };
      threadsAffiliation[PINNED_GROUP_KEY] = pinnedThreads;
    }

    unpinnedThreads.forEach((item) => {
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
        results.other = {
          label: 'Other',
          timestamp: 0,
          id: 'other',
        };
      }

      if (!threadsAffiliation[groupKey]) {
        threadsAffiliation[groupKey] = [];
      }

      threadsAffiliation[groupKey].push(item);
    });

    // Build a fresh map rather than mutating the one the observable still holds:
    // an in-place write is invisible to subscribers (the observable compares by
    // identity) yet already visible to anyone reading the value.
    const nextMap: Record<string, ThreadListGroupItem> = {};

    for (const key in results) {
      const groupModel = currentMap[key] ?? new ThreadListGroupItem(results[key]);
      // Reused instances must take the freshly built data, otherwise the label
      // stays in the old language and the timestamp goes stale past midnight.
      groupModel.data = results[key];

      const comparator = key === PINNED_GROUP_KEY
        ? (a: ThreadModel, b: ThreadModel) => (b.pinnedAt.value ?? 0) - (a.pinnedAt.value ?? 0)
        : undefined;
      groupModel.checkList(threadsAffiliation[key] ?? [], comparator);

      nextMap[key] = groupModel;
    }

    this.groupValues.value = nextMap;

    const ordered = Object.values(nextMap).sort((a, b) => b.data.timestamp - a.data.timestamp);
    const nextProjection = ThreadListCache.buildProjection(ordered);

    if (!ThreadListCache.sameProjection(this.projection.value, nextProjection)) {
      this.projection.value = nextProjection;
    }
  }

  private static buildProjection = (groups: ThreadListGroupItem[]): ThreadListProjection => {
    const items: ThreadListFlatItem[] = [];
    const headerIndexes: number[] = [];

    for (const group of groups) {
      const threads = group.threads.value;
      if (!threads.length) continue;

      headerIndexes.push(items.length);
      items.push({
        kind: 'header',
        key: headerKey(group.data.id),
        groupId: group.data.id,
        group: group.data,
      });

      for (const thread of threads) {
        items.push({
          kind: 'row',
          key: rowKey(thread),
          groupId: group.data.id,
          thread,
        });
      }
    }

    return { items, headerIndexes };
  }

  /**
   * Compares keys in order and header labels. Keys alone are not enough: group
   * keys are locale-independent (today, January, year2024), so a language switch
   * would produce an identical key sequence and the relabelled projection would
   * be discarded.
   */
  private static sameProjection = (a: ThreadListProjection, b: ThreadListProjection) => {
    if (a.items.length !== b.items.length) return false;

    for (let i = 0; i < a.items.length; i++) {
      const left = a.items[i];
      const right = b.items[i];
      if (left.key !== right.key) return false;
      if (left.kind === 'header' && right.kind === 'header' && left.group.label !== right.group.label) {
        return false;
      }
    }

    return true;
  }
}
