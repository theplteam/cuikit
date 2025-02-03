import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import { useProcessAssistantText } from '../../hooks/useProcessAssistantText';
import { MdText } from '../../../ui/TextUi';
import { useChatSlots } from '../../core/ChatSlotsContext';

type Props = {
  text: string;
};

const ChatMarkdown: React.FC<Props> = ({ text }) => {
  const { slots, slotProps } = useChatSlots();
  text = useProcessAssistantText(text);


  return (
    <Markdown
      options={{
        overrides: {
          a: {
            component: slots.markdownA,
            props: {
              color: 'secondary',
              underline: 'none',
            },
          },
          table: {
            component: slots.markdownTable,
            props: slotProps.markdownTable,
          },
          thead: {
            component: slots.markdownThead,
            props: slotProps.markdownThead,
          },
          tbody: {
            component: slots.markdownTbody,
            props: slotProps.markdownTbody,
          },
          th: {
            component: slots.markdownTh,
            props: slotProps.markdownTh,
          },
          td: {
            component: slots.markdownTd,
            props: slotProps.markdownTd,
          },
          tr: {
            component: slots.markdownTr,
            props: slotProps.markdownTr,
          },
          ul: {
            component: slots.markdownUl,
            props: slotProps.markdownUl,
          },
          ol: {
            component: slots.markdownOl,
            props: slotProps.markdownOl,
          },
          h1: {
            component: slots.markdownH1,
            props: slotProps.markdownH1,
          },
          h2: {
            component: slots.markdownH2,
            props: slotProps.markdownH2,
          },
          h3: {
            component: slots.markdownH3,
            props: slotProps.markdownH3,
          },
          h4: {
            component: slots.markdownH4,
            props: slotProps.markdownH4,
          },
          h5: {
            component: slots.markdownH5,
            props: slotProps.markdownH5,
          },
          h6: {
            component: slots.markdownH6,
            props: slotProps.markdownH6,
          },
          img: {
            component: slots.markdownImg,
            props: slotProps.markdownImg,
          },
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
