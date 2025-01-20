import * as React from 'react';
import Box from '@mui/material/Box';

type Props = React.PropsWithChildren<{}>;

const Root: React.FC<Props> = ({ children }) => {
  return (
    <Box
      id={"chatRoot"}
      width={'100dvw'}
      height={'100dvh'}
      position={'relative'}
      display={'flex'}
      justifyContent={'center'}
    >
      {children}
    </Box>
  );
}

export default Root;
