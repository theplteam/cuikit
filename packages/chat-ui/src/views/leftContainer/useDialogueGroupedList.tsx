import * as React from 'react';
import { sortByDesc } from '../../utils/arrayUtils/arraySort';
import { ArrayType } from '../../models/types';
import moment from 'moment';
import { arrayPluck } from '../../utils/arrayUtils/arrayPluck';
import { DialogueLight } from '../../models/Dialogue';

export type DialogueGroupType = {
  groupKey: string;
  dialogue: DialogueLight;
};

export type ListGroupType = {
  label: [string, string] | readonly [string, string];
  timestamp: number;
  id: string;
};

export const useDialogueGroupedList = (dialogues: ArrayType<DialogueLight>) => {
  const [dialogueGroups, setDialogueGroups] = React.useState<Record<string, ListGroupType>>({});

  React.useEffect(() => {
    const basicGroups = {
      today: {
        id: 'today',
        timestamp: moment().startOf('day').unix(),
        label: ['Сегодня', 'Today'],
      },
      yesterday: {
        id: 'yesterday',
        timestamp: moment().subtract(1, 'days').startOf('day').unix(),
        label: ['Вчера', 'Yesterday'],
      },
      last7Days: {
        id: 'last7Days',
        timestamp: moment().subtract(7, 'days').startOf('day').unix(),
        label: ['Предыдущие 7 дней', 'Previous 7 Days'],
      },
      last30Days: {
        id: 'last30Days',
        timestamp: moment().subtract(30, 'days').startOf('day').unix(),
        label: ['Предыдущие 30 дней', 'Previous 30 Days'],
      },
    } as Record<string, ListGroupType>;

    const basicKeys = Object.keys(basicGroups) as (keyof typeof basicGroups)[];

    const startOfYear = moment().startOf('year').unix();

    const results: Record<string, ListGroupType> = {};

    dialogues.forEach((item) => {
      const timestamp = item.timestamp.value;
      const basicGroupKey = basicKeys.find(v => timestamp >= basicGroups[v].timestamp);
      if (basicGroupKey) {
        results[basicGroupKey] = { ...basicGroups[basicGroupKey] };
      } else if (timestamp >= startOfYear) {
        const month = moment.unix(timestamp);
        const monthEn = month.format('MMMM');
        const monthRu = month.locale('ru').format('MMMM');

        results[monthEn] = {
          label: [monthRu, monthEn],
          timestamp,
          id: monthEn,
        };
      } else {
        const year = moment.unix(timestamp).startOf('year');
        const yearLang = year.format('YYYY');
        const yearKey = `year${yearLang}`;

        results[yearKey] = {
          label: [yearLang, yearLang],
          timestamp: year.unix(),
          id: yearKey,
        };
      }
    });

    if (JSON.stringify(results) !== JSON.stringify(dialogueGroups)) {
      setDialogueGroups({ ...results });
    }
  }, [arrayPluck(dialogues, 'id').join(',')]);

  return React.useMemo(() => {
    const groupsValues = sortByDesc(Object.values(dialogueGroups), 'timestamp');

    const dialoguesInGroup: DialogueGroupType[] = [];
    dialogues.forEach((dialogue) => {
      dialoguesInGroup.push({
        groupKey: groupsValues.find(v => v.timestamp < dialogue.timestamp.value)?.id ?? '',
        dialogue,
      });
    });

    return { groupsValues, dialoguesInGroup };
  }, [dialogueGroups, dialogues]);
}
