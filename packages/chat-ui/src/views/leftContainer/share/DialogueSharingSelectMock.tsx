import * as React from 'react';
import { Dialogue } from '../../../models/dialogue/Dialogue';

type Props = {
  dialogue: Dialogue;
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
