import { type DialogueAbstract } from '../../models';
import * as React from 'react';
import type { LinkProps } from '@mui/material/Link';
import type { TableProps } from '@mui/material/Table';
import type { TableHeadProps } from '@mui/material/TableHead';
import type { TableBodyProps } from '@mui/material/TableBody';
import type { TableCellProps } from '@mui/material/TableCell';
import type { TableRowProps } from '@mui/material/TableRow';
import type { TypographyProps } from '@mui/material/Typography';
import type { MessagePaginationProps } from '../message/actions/MessagePagination';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { StackProps } from '@mui/material/Stack';
import type { BoxProps } from '@mui/material/Box';

type ChildrenProps = React.PropsWithChildren<{}>;

export type SlotPropsType<D extends DialogueAbstract> = {
  dialogue: ChildrenProps;
  list: ChildrenProps;
  listSubtitle: TypographyProps;
  listTimeText: TypographyProps;
  listDriver: ChildrenProps;
  listDriverTitle: TypographyProps;
  firstMessage: { dialogue: D };

  // POPUPS
  popupsSharingContent: { dialogue: D; tariffsRef: React.RefObject<{ tariffs: number[] }> };
  popupsInfoContent: { dialogue: D; };

  // MESSAGE
  messagePagination: MessagePaginationProps;
  messagePaginationRoot: StackProps;
  messagePaginationText: TypographyProps;
  messagePaginationButton: IconButtonProps;
  messageAssistantFooter: { message: any };
  messageAssistantProgress: BoxProps & { dialogue: DialogueAbstract };
  messageAssistantProgressText: TypographyProps;

  // MARKDOWN
  markdown: { text: string };
  markdownA: LinkProps;
  markdownTable: TableProps;
  markdownThead: TableHeadProps;
  markdownTbody: TableBodyProps;
  markdownTh: TableCellProps;
  markdownTd: TableCellProps;
  markdownTdText: TypographyProps;
  markdownTr: TableRowProps;
  markdownSpan: TypographyProps;
  markdownUl: React.OlHTMLAttributes<HTMLOListElement>;
  markdownOl: React.HTMLAttributes<HTMLUListElement>;
  markdownH1: TypographyProps;
  markdownH2: TypographyProps;
  markdownH3: TypographyProps;
  markdownH4: TypographyProps;
  markdownH5: TypographyProps;
  markdownH6: TypographyProps;
  markdownImg: React.JSX.IntrinsicElements['img'];
  markdownP: TypographyProps;
};
