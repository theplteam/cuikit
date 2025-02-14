import * as React from 'react';
import SimpleBar, { Props as SimpleBarProps } from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { styled } from '@mui/material/styles';

type Props = React.PropsWithChildren<{
  style?: React.CSSProperties;
  maxContent?: boolean;
}> & Omit<SimpleBarProps, 'style'>;

type SimpleBarClassesType = Readonly<{
  contentWrapper: string;
  track: string;
  hover: string;
  scrollbarVisibleBefore: string;
}>;

export const simpleBarClasses: SimpleBarClassesType = {
  contentWrapper: 'simplebar-content-wrapper',
  track: 'simplebar-track',
  hover: 'simplebar-hover',
  scrollbarVisibleBefore: 'simplebar-visible:before',
};

const SimpleBarStyled = styled(SimpleBar, {
  shouldForwardProp: (propName) => propName !== 'maxContent'
})<{ maxContent?: boolean }>(({ maxContent }) => ({
  [`& .${simpleBarClasses.contentWrapper}`]: {
    minWidth: maxContent ? 'max-content' : undefined,
  },

  [`& .${simpleBarClasses.track}`]: {
    [`& .${simpleBarClasses.scrollbarVisibleBefore}`]: {
      opacity: 0.25,
      transition: 'opacity 0.3s'
    },
    [`&.${simpleBarClasses.hover}`]: {
      [`& .${simpleBarClasses.scrollbarVisibleBefore}`]: {
        opacity: 0.5,
      },
    },
  },
}));

const SimpleScrollbar: React.FC<Props> = ({ style, children, maxContent }) => {
  return (
    <SimpleBarStyled
      style={style}
      forceVisible
      autoHide={false}
      maxContent={maxContent}
    >
      {children}
    </SimpleBarStyled>
  );
}

export default SimpleScrollbar;
