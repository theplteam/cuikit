// A link label that is still being typed is only worth hiding while it is short enough to
// plausibly be a label. Prose carries unmatched brackets all the time — an interval `[0, 1)`,
// a citation `[Smith et al.`, `arr[i` — and with no bound the rest of the paragraph would stay
// hidden behind one of them until a `]` finally arrived.
const MAX_LABEL_LENGTH = 64;

// A fence sits on its own line, optionally inside a blockquote and indented by up to three
// spaces. Only a run of the SAME character, at least as long as the opening one, closes it —
// a `~~~` line inside a ``` block is content, not a terminator.
const FENCE_LINE = /^(?:\s*>)*[ ]{0,3}(`{3,}|~{3,})/;

// Four spaces or a tab start an indented code block, where raw markdown is the point.
const INDENTED_CODE_LINE = /^(?: {4}|\t)/;

const isInsideOpenFence = (lines: string[]) => {
  let open: { marker: string, length: number } | null = null;

  lines.forEach(line => {
    const match = FENCE_LINE.exec(line);

    if (!match) return;

    const marker = match[1][0];
    const { length } = match[1];

    if (!open) {
      open = { marker, length };

      return;
    }

    if (marker === open.marker && length >= open.length) open = null;
  });

  return open !== null;
};

/**
 * Index the unfinished link/image construct starts at, or -1 when the line ends on settled
 * text. Walks the line rather than matching a pattern, because the three states a streamed
 * link passes through — `[label`, `[label]`, `[label](url` — must all cut at the same place.
 * A regex that recognised only some of them would reveal the label and then hide it again,
 * which is a worse artefact than the raw URL this exists to suppress.
 */
const findIncompleteConstruct = (line: string): number => {
  const openLabels: number[] = [];
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    // An escaped bracket is literal text — notably `\[` opening LaTeX display math.
    if (char === '\\') {
      i += 2;
      continue;
    }

    if (char === '[') {
      // `![` opens an image, and the `!` has to go with it.
      openLabels.push(line[i - 1] === '!' ? i - 1 : i);
      i += 1;
      continue;
    }

    if (char !== ']' || openLabels.length === 0) {
      i += 1;
      continue;
    }

    const start = openLabels.pop() as number;
    const labelTooLong = i - start > MAX_LABEL_LENGTH;

    // `[label]` sitting at the very end: the `(` may still be on its way, so it counts as
    // unfinished. Anywhere else it is just a bracketed word.
    if (i === line.length - 1) return labelTooLong ? -1 : start;

    if (line[i + 1] !== '(') {
      i += 1;
      continue;
    }

    // Walk the destination counting parentheses, so a URL that contains its own — the
    // `Foo_(bar)` shape Wikipedia links use — is not mistaken for a finished one.
    let depth = 1;
    let j = i + 2;

    while (j < line.length && depth > 0) {
      if (line[j] === '\\') {
        j += 2;
        continue;
      }

      if (line[j] === '(') depth += 1;
      else if (line[j] === ')') depth -= 1;

      j += 1;
    }

    if (depth > 0) return labelTooLong ? -1 : start;

    i = j;
  }

  if (openLabels.length === 0) return -1;

  // The outermost bracket is the cut point, so a nested `[![alt](img.png)](https://ci` goes
  // as one piece instead of leaving the outer `[` behind.
  const start = openLabels[0];

  return line.length - start > MAX_LABEL_LENGTH ? -1 : start;
};

/**
 * Hides a markdown link or image that a chunk boundary caught half-written.
 *
 * While a message streams, a chunk can end in the middle of a link, leaving the text as
 * `... and [Temple Adventure](https://app`. markdown-to-jsx has no choice but to render
 * that as literal source, so the bare URL is on screen for a whole poll interval before it
 * is swapped for an `<a>`. The swap costs a second time over: the word spans are keyed by
 * position within the paragraph, and dropping the raw words shifts every key after them,
 * so React hands already-faded-in nodes to different text and it appears with no animation.
 *
 * Cutting the half-written construct off the tail avoids both — the link simply shows up
 * complete one chunk later, which is how the rest of the streamed text already behaves.
 *
 * Only the last line is a candidate: earlier lines are settled text that is not going to
 * change. Code, fenced or indented, is left exactly as written.
 */
export const maskIncompleteMarkdownTail = (text: string): string => {
  if (!text) return text;

  const lines = text.split('\n');
  const lastLine = lines[lines.length - 1];

  if (INDENTED_CODE_LINE.test(lastLine)) return text;
  if (isInsideOpenFence(lines)) return text;

  const cut = findIncompleteConstruct(lastLine);

  return cut === -1 ? text : text.slice(0, text.length - lastLine.length + cut);
};
