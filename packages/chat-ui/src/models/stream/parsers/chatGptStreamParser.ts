import { Message } from '../../Message';
import { prepareStreamString } from './prepareStreamString';

type ChatGptResponseType = {
  choices: Array<{
    delta: {
      content?: string | null;
    };
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;
  }>;
};

export const chatGptStreamParser = <T extends ChatGptResponseType>(value: string, assistant: Message) => {
  const clearedValue = prepareStreamString(value);
  try {
    const obj = JSON.parse(clearedValue) as T;
    assistant.text += obj.choices[0].delta.content ?? '';

    return obj;
  } catch (e) {}

  return undefined;
}
