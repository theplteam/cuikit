import * as React from 'react';
import MdIconButton from '../../packages/chat-ui/src/ui/MdIconButton.tsx';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BlindIcon from '@mui/icons-material/Blind';

const toConstructor = (element: React.ReactElement) => {
  return () => element;
};

export const useCustomAssistantActions = () => {
  return React.useMemo(() => [
    toConstructor(
      <MdIconButton
        onClick={() => console.log('click AcUnitIcon')}
        key={'AcUnitIcon'}
      >
        <AcUnitIcon />
      </MdIconButton>
    ),
    toConstructor(
      <MdIconButton
        onClick={() => console.log('click BlindIcon')}
        key={'BlindIcon'}
      >
        <BlindIcon />
      </MdIconButton>
    ),
  ], []);
}
