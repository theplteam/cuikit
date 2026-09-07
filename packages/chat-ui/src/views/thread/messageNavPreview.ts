import { MessageModel } from '../../models/MessageModel';

const WHITESPACE = /\s+/g;

/**
 * Short single-line excerpt of a message, used as its label in the navigation rail and
 * in the mobile list. Markdown line breaks are collapsed so a multi-paragraph question
 * still reads as one sentence.
 */
export const getMessageNavPreview = (message: MessageModel | undefined, maxLength: number) => {
  const text = (message?.text ?? '').replace(WHITESPACE, ' ').trim();

  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
};
