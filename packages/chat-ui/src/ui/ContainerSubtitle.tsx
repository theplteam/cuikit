import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

type Props = TypographyProps;

const ContainerSubtitle: React.FC<Props> = ({ children }) => {
  return (
    <Typography variant="subtitle1">
      {children}
    </Typography>
  );
}

export default ContainerSubtitle;
