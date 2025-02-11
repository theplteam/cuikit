import * as React from 'react';
import useLicenseVerifier from './license/useLicenseVerifier';
import Box from '@mui/material/Box';
import LICENSE_STATUS from './license/ChatLicenseStatus';
import { Typography } from '@mui/material';

const Watermark: React.FC = () => {
  const { licenseStatus, licenseError } = useLicenseVerifier();

  if (licenseStatus === LICENSE_STATUS.Valid) return null;
  return (
    <Box
      width={'100%'}
      textAlign={'center'}
    >
      <Typography fontSize={24} sx={{ color: 'rgba(130, 130, 130, 0.62)' }} fontFamily='"Roboto", "Helvetica", "Arial", sans-serif' letterSpacing={5}>
        {`Chat UI ${licenseError}`}
      </Typography>
    </Box>
  );
}

export default Watermark;
