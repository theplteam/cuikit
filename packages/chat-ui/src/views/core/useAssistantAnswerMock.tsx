import * as React from 'react';
import { MessageSentParams } from '../../models';
import { generateRandomLoremIpsum, LoremIpsumSize } from '../../utils/stringUtils/generateLoremIpsum';

let stop = false;

export const useAssistantAnswerMock = (mockOptions?: Partial<{ delayTimeout: number, loremIpsumSize: LoremIpsumSize }>) => {

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    if (mockOptions?.delayTimeout) {
      await new Promise(resolve => setTimeout(resolve, mockOptions.delayTimeout));
    }

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }

    params.onFinish();
  }, []);

  const streamGenerator = React.useCallback(async function* (
    text?: string,
    params?: Partial<{ delay: number, chunkSize: number, loremIpsumSize?: LoremIpsumSize }>
  ) {
    stop = false;
    if (!text) {
      text = generateRandomLoremIpsum(params?.loremIpsumSize ?? mockOptions?.loremIpsumSize ?? "medium");
    }

    const delay = params?.delay ?? 150;
    const chunkSize = params?.chunkSize ?? 15;
    let index = 0;
    while (index < text.length && !stop) {
      const chunk = text.slice(index, index + chunkSize);

      await new Promise(resolve => setTimeout(resolve, delay));
      yield chunk;
      index += chunkSize;
    }
  }, []);

  const handleStopMessageStreaming = React.useCallback(() => {
    stop = true;
  }, []);

  return { onUserMessageSent, handleStopMessageStreaming, streamGenerator };
}
