import * as React from 'react';
import { useObserverValue } from '../../hooks/useObserverValue';
import { MessageModel } from '../../../models';
import { useLocalizationContext } from '../../core/LocalizationContext';
import { langReplace } from '../../../locale/langReplace';

export const useReasoningTimeText = (message: MessageModel) => {
  const reasoningTime = useObserverValue(message.reasoningManager.timeSec) ?? 0;
  const locale = useLocalizationContext();

  React.useEffect(() => {
    if (!reasoningTime) return;

    let str = '';
    if (reasoningTime < 60) {
      str = reasoningTime + " seconds";
    } else {
      // Вычисляем количество минут и оставшиеся секунды
      const minutes = Math.floor(reasoningTime / 60);
      const remainingSeconds = reasoningTime % 60;
      str = minutes + " minutes " + remainingSeconds + " seconds";
    }

    message.reasoningManager.title.value = langReplace(locale.reasonedFor, { time: str });
  }, [reasoningTime]);
}
