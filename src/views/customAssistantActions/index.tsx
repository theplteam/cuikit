import * as React from 'react';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BlindIcon from '@mui/icons-material/Blind';
import IconButton from '@mui/material/IconButton';

const toConstructor = (element: React.ReactElement) => {
  return () => element;
};

export const useCustomAssistantActions = () => {
  return React.useMemo(() => [
    toConstructor(
      <IconButton
        key="AcUnitIcon"
        onClick={() => console.log('click AcUnitIcon')}
      >
        <AcUnitIcon />
      </IconButton>
    ),
    toConstructor(
      <IconButton
        key="BlindIcon"
        onClick={() => console.log('click BlindIcon')}
      >
        <BlindIcon />
      </IconButton>
    ),
  ], []);
}
