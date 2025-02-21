import { DDialogue, type Dialogue, DMessage } from '../../models';
import * as React from 'react';
import type { LinkProps } from '@mui/material/Link';
import type { TableProps } from '@mui/material/Table';
import type { TableHeadProps } from '@mui/material/TableHead';
import type { TableBodyProps } from '@mui/material/TableBody';
import type { TableCellProps } from '@mui/material/TableCell';
import type { TableRowProps } from '@mui/material/TableRow';
import type { TypographyProps } from '@mui/material/Typography';
import type { MessagePaginationProps } from '../message/MessagePagination';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { StackProps } from '@mui/material/Stack';
import type { BoxProps } from '@mui/material/Box';

type ChildrenProps = React.PropsWithChildren<{}>;

export type SlotPropsType<DM extends DMessage, DD extends DDialogue<DM>> = {
  /**
   * Override the full dialogue component
   */
  dialogue: ChildrenProps;
  /**
   * Parent for the dialogues list
   * Will ignored if dialoguesList slot provided
   */
  listContainer: any;
  /**
   * List of dialogues
   */
  dialoguesList: any;
  /**
   * Subtitle component for the list container
   */
  listSubtitle: TypographyProps;
  /**
   * Typography component for rendering time text in the dialogues list (today, last week, last 30 days, etc.)
   */
  listTimeText: TypographyProps;
  /**
   * Driver component for the dialogues list (mobile version)
   * Will ignored if dialoguesList slot provided
   */
  listDrawer: ChildrenProps;
  /**
   * Title for the mobile dialogues list (same as listSubtitle)
   */
  listDrawerTitle: TypographyProps;
  /**
   * Welcome message from the assistant for a new dialogue or the initial message from the assistant in an existing dialogue.
   */
  firstMessage: { dialogue: Dialogue<DM, DD>, text?: string };

  sendMessageButton: IconButtonProps;

  // MESSAGE
  /**
   * Render the pagination block for message branches
   */
  messagePagination: MessagePaginationProps;
  /**
   * Root container for message pagination (branches)
   */
  messagePaginationRoot: StackProps;
  /**
   * Typography component for message pagination (branches)
   */
  messagePaginationText: TypographyProps;
  /**
   * IconButton for arrows
   */
  messagePaginationButton: IconButtonProps;
  /**
   * Render some information under the assistant's message.
   */
  messageAssistantFooter: { message: any };
  /**
   * Render the component while sending a request to the chat or while "thinking."
   */
  messageAssistantProgress: BoxProps & { dialogue: Dialogue<DM, DD> };
  /**
   * Typography for the component displayed while sending a request to the chat or while "thinking."
   */
  messageAssistantProgressText: TypographyProps;

  // MARKDOWN
  /**
   * Custom markdown renderer
   */
  markdown: { text: string };
  /**
   * Render links
   */
  markdownA: LinkProps;
  /**
   * Render tables (<table>)
   */
  markdownTable: TableProps;
  /**
   * Render table head (<thead>)
   */
  markdownThead: TableHeadProps;
  /**
   * Render table body (<tbody>)
   */
  markdownTbody: TableBodyProps;
  /**
   * Render table row (<tr>)
   */
  markdownTr: TableRowProps;
  /**
   * Render table head cell (<th>)
   */
  markdownTh: TableCellProps;
  /**
   * Render table cell (<td>)
   */
  markdownTd: TableCellProps;
  /**
   * Custom typography for table cells
   */
  markdownTdText: TypographyProps;
  /**
   * Render spans (<span>)
   */
  markdownSpan: TypographyProps;
  /**
   * Render lists (<ul>)
   */
  markdownUl: React.OlHTMLAttributes<HTMLOListElement>;
  /**
   * Render numeric lists (<ol>)
   */
  markdownOl: React.HTMLAttributes<HTMLUListElement>;
  /**
   * Render headers (<h1>)
   */
  markdownH1: TypographyProps;
  /**
   * Render headers (<h2>)
   */
  markdownH2: TypographyProps;
  /**
   * Render headers (<h3>)
   */
  markdownH3: TypographyProps;
  /**
   * Render headers (<h4>)
   */
  markdownH4: TypographyProps;
  /**
   * Render headers (<h5>)
   */
  markdownH5: TypographyProps;
  /**
   * Render headers (<h6>)
   */
  markdownH6: TypographyProps;
  /**
   * Render images (<img>)
   */
  markdownImg: React.JSX.IntrinsicElements['img'];
  /**
   * Render pre (<pre>)
   */
  markdownCodeWrapper: React.JSX.IntrinsicElements['pre'];
  /**
   * Render code (<code>)
   */
  markdownCode: React.JSX.IntrinsicElements['code'];
  /**
   * Render blockquote (<blockquote>)
   */
  markdownBlockquote: React.JSX.IntrinsicElements['blockquote'];
  /**
   * Render paragraphs (<p>)
   */
  markdownP: TypographyProps;
};
