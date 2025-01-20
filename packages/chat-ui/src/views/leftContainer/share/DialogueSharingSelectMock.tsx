import * as React from 'react';
import { ChatDialogue } from '../../../models/ChatDialogue';

type Props = {
  dialogue: ChatDialogue;
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
