import * as React from 'react';
import throttle from 'lodash.throttle';

export const useReasoningParse = (text: string) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const parserFn = React.useCallback(throttle((newText: string) => {
    const matches = newText.split("\n\n").reverse();
    if (matches.length < 1) return undefined;

    let titleIndex = -1;
    let textIndex = -1;
    for (let i = 1; i < matches.length; i++) {
      const titleMatches = matches[i].matchAll(/\*\*(.*?)\*\*/g).toArray();
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
  }, 300, { leading: false, trailing: true }), []);

  React.useEffect(() => {
    const result = parserFn(text);

    if (result) {
      const { newText, newTitle } = result;

      if (!!newText && description !== newText) {
        setDescription(newText);
        setTitle(newTitle);
      } else if (!!newTitle && (!description && !title)) {
        setTitle(newTitle);
      }
    }
  }, [text]);

  return { title, description };
}
