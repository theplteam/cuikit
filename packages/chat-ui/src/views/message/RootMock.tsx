import * as React from 'react';
import Stack from '@mui/material/Stack';

type Props = React.PropsWithChildren;

const RootMock: React.FC<Props> = ({ children }) => {
  return (
    <Stack height="100%" flex={1}>
      {children}
    </Stack>
  );
}

export default RootMock;
