import * as React from 'react';
import { styled } from '@mui/material/styles';
import SimpleBar from 'simplebar-react';
import { simpleBarClasses } from './SimpleScrollbar';

type Props = React.PropsWithChildren<{
  style?: React.CSSProperties;
}>;

const SimpleBarStyled = styled(SimpleBar)(({ theme }) => ({
  [`& .${simpleBarClasses.track}`]: {
    width: 12,
    borderLeft: '1px solid #dedede',
    background: '#f9f9f9',
    [`& .${simpleBarClasses.scrollbarVisibleBefore}`]: {
      width: 6,
      opacity: 0.25,
      transition: 'opacity 0.3s',
      left: 2,

    },
    [`&.${simpleBarClasses.hover}`]: {
      [`& .${simpleBarClasses.scrollbarVisibleBefore}`]: {
        opacity: 0.5,
      },
    },
  },
}));

const Scrollbar: React.FC<Props> = ({ children, style }) => {
  return (
    <SimpleBarStyled
      autoHide={false}
      style={{ maxHeight: 'inherit', minHeight: '100%', ...style }}
    >
      {children}
    </SimpleBarStyled>
  );
}

export default Scrollbar;
