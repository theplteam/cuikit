import * as React from 'react';
import useLicenseVerifier, { LICENSE_STATUS } from './hooks/useLicenseVerifier';
import Box from '@mui/material/Box';

const Watermark: React.FC = () => {
  const { licenseStatus, licenseError } = useLicenseVerifier();

  if (licenseStatus === LICENSE_STATUS.valid) return null;
  return (
    <Box
      position="absolute"
      zIndex={100000}
      width={'100%'}
      right={0}
      bottom={'50%'}
      textAlign={'center'}
      fontSize={24}
      letterSpacing={4}
      fontWeight={700}
      sx={{
        pointerEvents: 'none',
      }}
    >
      {licenseError}
    </Box>
  );
}

export default Watermark;