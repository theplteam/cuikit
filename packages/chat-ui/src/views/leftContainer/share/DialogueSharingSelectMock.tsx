import * as React from 'react';
import { DialogueLight } from '../../../models/Dialogue';

type Props = {
  dialogue: DialogueLight;
  tariffsRef: React.RefObject<{ tariffs: number[] }>;
};

const DialogueSharingSelectMock: React.FC<Props> = () => {
  return (
    <>
      Use slots.popups.sharing.content
    </>
  );
}

export default DialogueSharingSelectMock;
