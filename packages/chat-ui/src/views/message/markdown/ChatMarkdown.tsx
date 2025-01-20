import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import Link from '@mui/material/Link';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import ChatMessageTable from './ChatMessageTable';
import { ChatMessageUl, ChatMessageOl } from './ChatMessageUl';
import ChatMessageTableCell from './ChatMessageTableCell';
import ChatMessageImage from './ChatMessageImage';
import { useProcessAssistantText } from '../../hooks/useProcessAssistantText';
import { TypographyKeys } from '../../../utils/materialDesign/materialTheme';
import { MdText, MdTextUi } from '../../../ui/TextUi';

type Props = {
  text: string;
};

const typographyGap: Partial<Record<TypographyKeys, number>> = {
  'headline.small': 30,
  'title.large': 28,
  'title.medium': 26,
};

const ChatMarkdown: React.FC<Props> = ({ text }) => {

  text = useProcessAssistantText(text);

  const getHeader = (m3typography: TypographyKeys) => ({
    component: MdTextUi,
    props: {
      m3typography,
      style: {
        marginTop: `${(typographyGap[m3typography] ?? 16) - 16}px`,
      },
    },
  } as const);

  return (
    <Markdown
      options={{
        overrides: {
          a: {
            component: Link,
            props: {
              color: 'secondary',
              underline: 'none',
            },
          },
          table: ChatMessageTable,
          thead: TableHead,
          tbody: TableBody,
          th: ChatMessageTableCell,
          td: ChatMessageTableCell,
          tr: TableRow,
          span: {
            component: MdText,
            props: {
              m3typography: 'body.mediumArticle'
            },
          },
          ul: ChatMessageUl,
          ol: ChatMessageOl,
          h1: getHeader('headline.small'),
          h2: getHeader('title.large'),
          h3: getHeader('title.medium'),
          h4: getHeader('title.small'),
          h5: getHeader('body.large'),
          h6: getHeader('body.medium'),
          img: ChatMessageImage,
          // TODO: картинки оборачивается в тег <p>, это не баг и фиксить не будут
          //  @see https://github.com/quantizor/markdown-to-jsx/issues/209#issuecomment-417712075
          p: (props: React.JSX.IntrinsicElements['p']) => {
            return React.Children.toArray(props.children).some(child => typeof child === "string") ? (
              <MdText m3typography={'body.mediumArticle'} {...props} />
            ) : (
              <React.Fragment key={props.key} children={props.children} />
            )
          },
        },
      }}
    >
      {text}
    </Markdown>
  );
}

export default ChatMarkdown;
