import * as React from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { useChatSlots } from '../../core/ChatSlotsContext';
import MarkdownParagraphParser from './MessageMarkdownParagraphParser';
import { useSmoothManager } from './smooth/useSmoothManager';
import MarkdownComponentSmoother from './smooth/MarkdownComponentSmoother';
import { AccentComponent, BoldComponent, ItalicComponent, LiComponent, StrongComponent } from './SimpleMarkdownComponents';
import MarkdownLazyComponentSmoother from './smooth/MarkdownLazyComponentSmoother';
import { SlotPropsType } from '../../core/SlotPropsType';
import { Message, Thread } from '../../../models';
import clsx from 'clsx';
import { chatClassNames } from '../../core/chatClassNames';
import { useInProgressStateCache } from './useInProgressStateCache';
import Skeleton from '@mui/material/Skeleton';
import { ChatUsersProps } from '../../core/useChatProps';
import { maskIncompleteMarkdownTail } from '../../../utils/stringUtils/maskIncompleteMarkdownTail';
import { ResolvedSpeed } from '../../core/useResolvedSpeed';

type Props = {
  text: string;
  inProgress: boolean;
  processAssistantText?: (text: string) => string;
  customMarkdownComponents?: ChatUsersProps<any, any>['customMarkdownComponents'];
  speed?: ResolvedSpeed;
};

const MessageMarkdown: React.FC<Props> = ({ text, inProgress: inProgressProp, processAssistantText, customMarkdownComponents, speed }) => {
  const { slots, slotProps } = useChatSlots();
  const inProgress = useInProgressStateCache(inProgressProp);

  if (processAssistantText) {
    text = processAssistantText(text);
  }

  const getLazySmoothComponent = React.useCallback((componentKey: keyof SlotPropsType<Message, Thread>) => {
    return ({
      component: slots[componentKey],
      props: {
        ...slotProps[componentKey],

        className: clsx(
          slotProps?.[componentKey]?.className,
          { [chatClassNames.markdownSmoothedPending]: inProgress }
        )
      },
    });
  }, [inProgress]);

  const customOverrides = React.useMemo(() => {
    const obj = {};
    customMarkdownComponents?.forEach(({ name, component }) => {
      const data = {
        [name]: {
          component: component,
        }
      };
      Object.assign(obj, data);
    });

    return obj;
  }, [customMarkdownComponents]);

  const paragraphSettings = React.useMemo(() => ({
    component: MarkdownParagraphParser,
    props: {
      pSlot: slots.markdownP,
      pSlotProps: slotProps.markdownP,
      inProgress: inProgress,
    }
  }), [inProgress, slots, slotProps]);

  const spanSettings = React.useMemo(() => ({
    component: MarkdownParagraphParser,
    props: {
      pSlot: slots.markdownSpan,
      pSlotProps: slotProps.markdownSpan,
      inProgress: inProgress,
    }
  }), [inProgress, slots, slotProps]);

  const markdownText = React.useMemo(() => {
    // Only while chunks keep arriving: once the stream ends the text is final, and a
    // trailing `[` is something the author meant to write rather than a torn-off link.
    const streamedText = inProgressProp ? maskIncompleteMarkdownTail(text) : text;

    if (!customMarkdownComponents?.length) return streamedText;
    const replacedText = inProgressProp ? streamedText.replace(/<([A-Z][A-Za-z0-9]*)([^>]*)>?/g, (match) => {
      const isSelfClosing = match.trim().endsWith('/>');
      if (!isSelfClosing) {
        const userHeight = customMarkdownComponents.find(({ name }) => match.startsWith(`<${name} `))?.skeletonHeight;
        const height = `${userHeight || 60}px`;
        return `<Skeleton height={${height}} />`;
      }
      return match;
    }) : streamedText;
    return replacedText;
  }, [inProgressProp, customMarkdownComponents, text]);

  // Keyed on what is actually rendered, not on the raw `text`. When the stream ends, the mask
  // (and the custom-component skeletons) lift on a render where `text` has not changed, so the
  // revealed nodes mount with the pending class — and `inProgress` cannot wake the smoother
  // either, since `useInProgressStateCache` latches it true for good. Watching the rendered
  // string is the only signal that new elements just appeared.
  useSmoothManager(markdownText, inProgress, speed);

  return (
    <MarkdownToJsx
      options={{
        forceBlock: true,
        forceWrapper: true,
        wrapper: slots.markdownWrapper,
        overrides: {
          ...customOverrides,
          a: {
            component: slots.markdownA,
            props: {
              ...slotProps.markdownA,
              className: clsx(
                slotProps.markdownA?.className,
                { [chatClassNames.markdownSmoothedPending]: inProgress }
              )
            },
          },
          table: getLazySmoothComponent('markdownTable'),
          thead: {
            component: slots.markdownThead,
            props: {
              ...slotProps.markdownThead,
            },
          },
          tbody: {
            component: slots.markdownTbody,
            props: {
              ...slotProps.markdownTbody,
            },
          },
          th: {
            component: slots.markdownTh,
            props: {
              ...slotProps.markdownTh,
              textComponent: slots.markdownTdText,
              textComponentProps: slotProps.markdownTdText,
            },
          },
          td: {
            component: slots.markdownTd,
            props: {
              ...slotProps.markdownTd,
              textComponent: slots.markdownTdText,
              textComponentProps: slotProps.markdownTdText,
            },
          },
          tr: {
            component: slots.markdownTr,
            props: {
              ...slotProps.markdownTr,
            },
          },
          ul: {
            component: slots.markdownUl,
            props: {
              ...slotProps.markdownUl,
            },
          },
          ol: {
            component: slots.markdownOl,
            props: {
              ...slotProps.markdownOl,
            },
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
          h1: getLazySmoothComponent('markdownH1'),
          h2: getLazySmoothComponent('markdownH2'),
          h3: getLazySmoothComponent('markdownH3'),
          h4: getLazySmoothComponent('markdownH4'),
          h5: getLazySmoothComponent('markdownH5'),
          h6: getLazySmoothComponent('markdownH6'),
          pre: getLazySmoothComponent('markdownCodeWrapper'),
          code: getLazySmoothComponent('markdownCode'),
          hr: getLazySmoothComponent('markdownHr'),
          blockquote: getLazySmoothComponent('markdownBlockquote'),
          img: {
            component: slots.markdownImg,
            props: {
              ...slotProps.markdownImg,
              rootClassName: clsx(
                slotProps.markdownImg?.rootClassName,
                { [chatClassNames.markdownSmoothedPending]: inProgress }
              )
            },
          },
          em: {
            component: MarkdownLazyComponentSmoother,
            props: { inProgress, component: AccentComponent },
          },
          p: paragraphSettings,
          span: spanSettings,
          Skeleton: {
            component: Skeleton,
            props: { variant: "rectangular" },
          },
        },
      }}
    >
      {markdownText}
    </MarkdownToJsx>
  );
}

export default MessageMarkdown;
