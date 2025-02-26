import * as React from 'react';
import useLicenseVerifier from './license/useLicenseVerifier';
import LICENSE_STATUS from './license/ChatLicenseStatus';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Watermark: React.FC = () => {
  const { licenseStatus, licenseError } = useLicenseVerifier();

  if (licenseStatus === LICENSE_STATUS.Valid) return null;
  return (
    <Stack
      position="sticky"
      bottom="50%"
      width="100%"
      textAlign="center"
      zIndex={99999}
      sx={{
        pointerEvents: 'none',
      }}
    >
      <Typography variant='h5' letterSpacing={5} sx={{ color: 'rgba(130, 130, 130, 0.62)' }}>
        {`Chat UI ${licenseError}`}
      </Typography>
    </Stack >
  );
}

export default Watermark;
