import * as React from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { useChatSlots } from '../../core/ChatSlotsContext';
import { useChatContext } from '../../core/ChatGlobalContext';
import MarkdownParagraphParser from './MessageMarkdownParagraphParser';
import { useSmoothManager } from './smooth/useSmoothManager';
import MarkdownComponentSmoother from './smooth/MarkdownComponentSmoother';
import { BoldComponent, EmComponent, ItalicComponent, LiComponent, StrongComponent } from './SimpleMarkdownComponents';
import MarkdownLazyComponentSmoother from './smooth/MarkdownLazyComponentSmoother';
import { SlotPropsType } from '../../core/SlotPropsType';
import { Message, Thread } from '../../../models';
import { ChatViewConstants } from '../../ChatViewConstants';
import clsx from 'clsx';

type Props = {
  text: string;
  inProgress: boolean;
};

const MessageMarkdown: React.FC<Props> = ({ text, inProgress: inProgressProp }) => {
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

  const getLazySmoothComponent = React.useCallback((componentKey: keyof SlotPropsType<Message, Thread>) => {
    return ({
      component: slots[componentKey],
      props: {
        ...slotProps.markdownTable,
        className: clsx(
          slotProps?.[componentKey]?.className,
          { [ChatViewConstants.TEXT_SMOOTH_CLASSNAME_PENDING]: inProgress }
        )
      },
    });
  }, [inProgress]);

  useSmoothManager(text, inProgress);

  return (
    <MarkdownToJsx
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
            /*table: {
              component: slots.markdownTable,
              props: slotProps.markdownTable,
            },*/
            table: getLazySmoothComponent('markdownTable'),
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
            h1: getLazySmoothComponent('markdownH1'),
            h2: getLazySmoothComponent('markdownH2'),
            h3: getLazySmoothComponent('markdownH3'),
            h4: getLazySmoothComponent('markdownH4'),
            h5: getLazySmoothComponent('markdownH5'),
            h6: getLazySmoothComponent('markdownH6'),
            img: getLazySmoothComponent('markdownImg'),
            pre: getLazySmoothComponent('markdownCodeWrapper'),
            code: getLazySmoothComponent('markdownCode'),
            hr: getLazySmoothComponent('markdownHr'),
            blockquote: getLazySmoothComponent('markdownBlockquote'),

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
    </MarkdownToJsx>
  );
}

export default MessageMarkdown;
