import * as React from 'react';
import { MessageSentParams } from '../../models';
import { ForceStream } from '../../models/stream/ForceStream';
import { generateRandomLoremIpsum } from '../../utils/stringUtils/generateLoremIpsum';
import { NOOP } from '../../utils/NOOP';

export const useAssistantAnswerMock = (mockOptions?: Partial<{ delayTimeout: number }>) => {

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    if (mockOptions?.delayTimeout) {
      await new Promise(resolve => setTimeout(resolve, mockOptions.delayTimeout));
    }
    const text = generateRandomLoremIpsum("medium");
    const forceStream = new ForceStream(text, undefined, params.pushChunk);
    forceStream.start();
    forceStream.promise?.then(() => {
      params.setText(text);
      params.onFinish();
    });
  }, []);

  const streamGenerator = React.useCallback(async function* (
    text?: string,
    params?: Partial<{ delay: number, chunkSize: number, loremIpsumSize?: 'small' | 'medium' | 'large' }>
  ) {
    if (!text) {
      text = generateRandomLoremIpsum(params?.loremIpsumSize ?? "medium");
    }

    const delay = params?.delay ?? 500;
    const chunkSize = params?.chunkSize ?? 10;
    let index = 0;
    while (index < text.length) {
      const chunk = text.slice(index, index + chunkSize);

      await new Promise(resolve => setTimeout(resolve, delay));
      yield chunk;
      index += chunkSize;
    }
  }, []);

  return { onUserMessageSent, handleStopMessageStreaming: NOOP, streamGenerator };
}
