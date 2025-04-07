import { MessageModel } from '../../MessageModel';
import { prepareStreamString } from './prepareStreamString';

type ChatGptResponseType = {
  choices: Array<{
    delta: {
      content?: string | null;
    };
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;
  }>;
};

// TODO: #ANY
export const chatGptStreamParser = <T extends ChatGptResponseType>(value: string, assistant: MessageModel<any>) => {
  const clearedValue = prepareStreamString(value);
  try {
    const obj = JSON.parse(clearedValue) as T;
    assistant.text += obj.choices[0].delta.content ?? '';

    return obj;
  } catch (e) {
    console.error(e);
  }

  return undefined;
}
