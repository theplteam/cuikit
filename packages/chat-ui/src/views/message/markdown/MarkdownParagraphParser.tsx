import * as React from 'react';
import { TypographyProps } from '@mui/material/Typography';
import MarkdownTexts from './MarkdownTexts';

type Props = {
  pSlot: React.JSXElementConstructor<TypographyProps>;
  pSlotProps: TypographyProps;
  inProgress: boolean;
} & React.JSX.IntrinsicElements['p'];

const MarkdownParagraphParser: React.FC<Props> = ({ pSlot, pSlotProps, children, inProgress: inProgress, ...props }) => {
  return React.Children.toArray(children).some(child => typeof child === "string") ? (
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

const childrenToString = (children: React.ReactNode) =>
  React.Children.toArray(children).filter(v => typeof v === "string").join('-');

export default React.memo(MarkdownParagraphParser, (prevProps, nextProps) => {
  return prevProps.inProgress === nextProps.inProgress && childrenToString(prevProps.children) === childrenToString(nextProps.children);
});
