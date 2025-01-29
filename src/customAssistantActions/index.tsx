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
        onClick={() => console.log('click AcUnitIcon')}
        key={'AcUnitIcon'}
      >
        <AcUnitIcon />
      </IconButton>
    ),
    toConstructor(
      <IconButton
        onClick={() => console.log('click BlindIcon')}
        key={'BlindIcon'}
      >
        <BlindIcon />
      </IconButton>
    ),
  ], []);
}
