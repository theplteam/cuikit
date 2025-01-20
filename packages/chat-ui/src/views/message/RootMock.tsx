import * as React from 'react';
import Stack from '@mui/material/Stack';

type Props = React.PropsWithChildren<{}>;

const RootMock: React.FC<Props> = ({ children }) => {
  return (
    <Stack height={'100%'}>
      {children}
    </Stack>
  );
}

export default RootMock;
