import { MessageModel } from '../../models/MessageModel';

const WHITESPACE = /\s+/g;
const FIRST_VISIBLE = /\S/;

/**
 * How much raw text is normalised for a preview, as a multiple of the requested length.
 * Collapsing whitespace copies the string, so a pasted document must never be copied
 * whole just to show its first line — a few times the preview length is always enough
 * to fill it, and the rest is discarded anyway.
 */
const PREFIX_HEADROOM = 4;

/**
 * Short single-line excerpt of a message, used as its label in the navigation rail and
 * in the mobile list. Markdown line breaks are collapsed so a multi-paragraph question
 * still reads as one sentence.
 */
export const getMessageNavPreview = (message: MessageModel | undefined, maxLength: number) => {
  const raw = message?.text ?? '';
  const start = raw.search(FIRST_VISIBLE);

  if (start === -1) return '';

  const end = start + maxLength * PREFIX_HEADROOM;
  const text = raw.slice(start, end).replace(WHITESPACE, ' ').trimEnd();

  if (text.length > maxLength) return `${text.slice(0, maxLength).trimEnd()}…`;

  return raw.length > end ? `${text}…` : text;
};
