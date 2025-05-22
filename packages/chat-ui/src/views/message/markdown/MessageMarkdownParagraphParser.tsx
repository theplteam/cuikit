import * as React from 'react';
import { TypographyProps } from '@mui/material/Typography';
import MarkdownTexts from './MessageMarkdownTexts';

type Props = {
  pSlot: React.JSXElementConstructor<TypographyProps>;
  pSlotProps: TypographyProps;
  inProgress: boolean;
} & React.JSX.IntrinsicElements['p'];

const MessageMarkdownParagraphParser: React.FC<Props> = ({ pSlot, pSlotProps, children, inProgress: inProgress, ...props }) => {
  return React.Children.toArray(children).some(child => typeof child === "string" && child !== "\n") ? (
    <MarkdownTexts
      inProgress={inProgress}
      component={pSlot}
      componentProps={{
        ...pSlotProps,
        ...props as TypographyProps
      }}
    >
      {children}
    </MarkdownTexts>

    // TODO: Images are wrapped in a <p> tag. This is not a bug and will not be fixed.
    //  @see https://github.com/quantizor/markdown-to-jsx/issues/209#issuecomment-417712075
  ) : (
    <React.Fragment key={props.key}>
      {children}
    </React.Fragment>
  )
}

export default React.memo(MessageMarkdownParagraphParser);
