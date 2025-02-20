import * as React from 'react';
import { MessageStreamingParams } from '../../models';
import { ForceStream } from '../../models/stream/ForceStream';
import { generateRandomLoremIpsum } from '../../utils/stringUtils/generateLoremIpsum';
import { NOOP } from '../../utils/NOOP';

export const useAssistantAnswerMock = (mockOptions?: Partial<{ delayTimeout: number }>) => {

  const onUserMessageSent = React.useCallback(async (params: MessageStreamingParams) => {
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

  return { onUserMessageSent, handleStopMessageStreaming: NOOP };
}
