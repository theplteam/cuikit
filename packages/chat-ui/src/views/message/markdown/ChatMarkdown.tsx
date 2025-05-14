import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import MarkdownParagraphParser from './MarkdownParagraphParser';
import { useSmoothManager } from './smooth/useSmoothManager';
import MarkdownComponentSmoother from './smooth/MarkdownComponentSmoother';
import { BoldComponent, EmComponent, ItalicComponent, LiComponent, StrongComponent } from './SimpleMarkdownComponents';
import MarkdownLazyComponentSmoother from './smooth/MarkdownLazyComponentSmoother';
import { SlotPropsType } from '../../core/SlotPropsType';
import { Message, Thread } from '../../../models';

type Props = {
  text: string;
  inProgress: boolean;
};

const ChatMarkdown: React.FC<Props> = ({ text, inProgress: inProgressProp }) => {
  const { slots, slotProps } = useChatSlots();
  const { processAssistantText } = useChatContext();

  const [inProgress, setInProgress] = React.useState(false);

  if (processAssistantText) {
    text = processAssistantText(text);
  }

  React.useEffect(() => {
    if (!inProgress && inProgressProp) {
      setInProgress(true);
    }
  }, [inProgressProp]);

  const getHeaders = React.useCallback((header: keyof SlotPropsType<Message, Thread>) => {
    return ({
      component: MarkdownLazyComponentSmoother,
      props: {
        component: slots[header],
        componentProps: slotProps[header],
        inProgress,
      },
    });
  }, [])

  useSmoothManager(text, inProgress);

  return (
    <Markdown
      options={{
          forceBlock: true,
          forceWrapper: true,
          overrides: {
            a: {
              component: MarkdownLazyComponentSmoother,
              props: {
                component: slots.markdownA,
                componentProps: {
                  color: 'secondary',
                  underline: 'none',
                  ...slotProps.markdownA
                },
                inProgress,
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
              props: {
                ...slotProps.markdownTh,
                textComponent: slots.markdownTdText,
                textComponentProps: slotProps.markdownTdText
              },
            },
            td: {
              component: slots.markdownTd,
              props: {
                ...slotProps.markdownTd,
                textComponent: slots.markdownTdText,
                textComponentProps: slotProps.markdownTdText
              },
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
            li: {
              // Looks like this is also needed in slots
              component: MarkdownComponentSmoother,
              props: { inProgress, component: LiComponent },
            },
            b: {
              component: MarkdownLazyComponentSmoother,
              props: { inProgress, component: BoldComponent },
            },
            i: {
              component: MarkdownLazyComponentSmoother,
              props: { inProgress, component: ItalicComponent },
            },
            strong: {
              component: MarkdownLazyComponentSmoother,
              props: { inProgress, component: StrongComponent },
            },
            em: {
              component: MarkdownLazyComponentSmoother,
              props: { inProgress, component: EmComponent },
            },
            h1: getHeaders('markdownH1'),
            h2: getHeaders('markdownH2'),
            h3: getHeaders('markdownH3'),
            h4: getHeaders('markdownH4'),
            h5: getHeaders('markdownH5'),
            h6: getHeaders('markdownH6'),
            img: {
              component: slots.markdownImg,
              props: slotProps.markdownImg,
            },
            pre: {
              component: slots.markdownCodeWrapper,
              props: slotProps.markdownCodeWrapper,
            },
            code: {
              component: slots.markdownCode,
              props: slotProps.markdownCode,
            },
            hr: {
              component: slots.markdownHr,
              props: slotProps.markdownHr,
            },
            blockquote: {
              component: slots.markdownBlockquote,
              props: slotProps.markdownBlockquote,
            },
            p: {
              component: MarkdownParagraphParser,
              props: {
                pSlot: slots.markdownP,
                pSlotProps: slotProps.markdownP,
                inProgress: inProgress
              }
            },
            span: {
              component: MarkdownParagraphParser,
              props: {
                pSlot: slots.markdownP,
                pSlotProps: slotProps.markdownP,
                inProgress: inProgress
              }
            },
          },
        }}
    >
      {text}
    </Markdown>
  );
}

export default ChatMarkdown;
