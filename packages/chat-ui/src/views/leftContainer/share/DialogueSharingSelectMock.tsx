import * as React from 'react';
import { DialogueAbstract } from '../../../models/DialogueAbstract';

type Props = {
  dialogue: DialogueAbstract;
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
