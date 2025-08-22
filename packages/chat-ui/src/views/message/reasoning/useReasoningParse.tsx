import * as React from 'react';
import throttle from 'lodash.throttle';
import { MessageModel } from '../../../models';
import { useLocalizationContext } from '../../core/LocalizationContext';
import { useObserverValue } from '../../hooks/useObserverValue';
import { ReasoningViewType } from '../../../models/MessageReasoningModel';

export const parseReasoningText = (text: string) => {
  const matches = text.split("\n\n").reverse();
  if (matches.length < 1) return undefined;

  let titleIndex = -1;
  let textIndex = -1;
  for (let i = 1; i < matches.length; i++) {

    const titleMatches = Array.from(matches[i].matchAll(/\*\*(.*?)\*\*/g));
    if (titleMatches.length) {
      titleIndex = i;
      break;
    } else {
      textIndex = i;
    }
  }

  let newTitle = '';
  if (matches[titleIndex]) {
    newTitle = matches[titleIndex]
      .replaceAll('*', '')
      .replaceAll('#', '')
  }

  return { newTitle, newText: matches[textIndex] }
}

export const useReasoningParse = (text: string, message: MessageModel, inProgress: boolean) => {
  const [description, setDescription] = React.useState('');
  const locale = useLocalizationContext();

  const reasoningType = useObserverValue(message.reasoningManager.viewType) ?? ReasoningViewType.HEADERS_STREAM;

  const parserFn = React.useCallback(throttle((newText: string) => {
    return parseReasoningText(newText);
  }, 300, { leading: false, trailing: true }), []);

  React.useEffect(() => {
    const reasoningManager = message.reasoningManager;
    if (reasoningType === ReasoningViewType.STREAM) return;

    const result = parserFn(text);

    if (!result?.newTitle && text.length > 150) {
      if (reasoningManager.lockedOptions.includes('viewType')) {
        reasoningManager.viewType.value = ReasoningViewType.STREAM
      }
      if (inProgress) {
        reasoningManager.setHeader(locale.thinking)
      }
    } else {
      if (result) {
        const { newText, newTitle } = result;

        if (!!newText && description !== newText) {
          if (reasoningType === ReasoningViewType.SHORT_BLOCKS) {
            setDescription(newText);
          }
          if (inProgress) {
            reasoningManager.setHeader(newTitle);
          }
        } else if (!!newTitle && (!description && !reasoningManager.title.value) && inProgress) {
          reasoningManager.setHeader(newTitle);
        }
      }
    }

  }, [text, inProgress]);

  return { description, reasoningType };
}
