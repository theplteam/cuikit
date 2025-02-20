import * as React from 'react';
import { Dialogues } from '../../models/stream/Dialogues';
import { IdType } from '../../types';
import { DDialogue, Dialogue } from '../../models';
import { ChatPropsTypes } from './useChatProps';
import { ApiManager } from './useApiManager';

export const useApiRefInitialization = (
  apiManager: ApiManager,
  model: Dialogues<any, any>,
  props: ChatPropsTypes<any, any>,
) => {
  React.useEffect(() => {
    const getAllDialogues = () => model.list.value.map(v => v.data.data);

    const onChangeDialogue = (dialogueId: IdType) => {
      model.currentDialogue.value = model.get(dialogueId);
    };

    const openNewDialogue = (dialogue?: DDialogue) => {
      const dialogueInstance = model.fromData(dialogue ?? Dialogue.createEmptyData(), props.onUserMessageSent);
      model.currentDialogue.value = dialogueInstance;
    };

    apiManager.setMethod('onChangeDialogue', onChangeDialogue);
    apiManager.setMethod('getAllDialogues', getAllDialogues);
    apiManager.setMethod('openNewDialogue', openNewDialogue);
    apiManager.setMethod('deleteDialogue', model.delete);
    apiManager.setMethod('getCurrentDialogue', () => model.currentDialogue.value?.data);
    // apiManager.setMethod('sendUserMessage', model.currentDialogue.)

  }, [props, model]);
}
