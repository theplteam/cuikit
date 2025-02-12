import * as React from 'react';
import { MessageStreamingParams } from '../../models';
import { ForceStream } from '../../models/stream/ForceStream';
import { generateRandomLoremIpsum } from '../../utils/stringUtils/generateLoremIpsum';

export const useAssistantAnswerMock = () => {
  return React.useCallback((params: MessageStreamingParams) => {
    const text = generateRandomLoremIpsum("medium");
    const forceStream = new ForceStream(text, undefined, params.pushChunk);
    forceStream.start();
    forceStream.promise?.then(() => {
      params.setText(text);
      params.onFinish();
    });
  }, []);
}
