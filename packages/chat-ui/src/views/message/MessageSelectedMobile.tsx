import * as React from 'react';
import { MobileMessageActionsType } from './hooks/useMobileMessageActions';
import MessageMobileUserActions from './actions/mobile/MessageMobileUserActions';
import MessageMobileAssistantActions from './actions/mobile/MessageMobileAssistantActions';
import { MessagesModeType } from './hooks/useMessagesMode';
import { useDialogueContext } from '../dialogue/DialogueContext';
import MdMenu from '../../ui/menu/MdMenu';

type Props = {
  mobileMessageActions: Required<MobileMessageActionsType>;
  modeManager: MessagesModeType;
  open: boolean;
};

const MessageSelectedMobile = () => {
  const [selectedValue, setSelectedValue] = React.useState<MobileMessageActionsType['selectedValue'] | undefined>();
  const [open, setOpen] = React.useState<boolean>(false);

  const {
    mobileMessageActions,
    messageMode
  } = useDialogueContext();

  React.useEffect(() => {
    if (open && !mobileMessageActions.selectedValue) {
      setTimeout(() => {
        setSelectedValue(undefined);
      }, 400);
    } else {
      setSelectedValue(mobileMessageActions.selectedValue);
    }

    setOpen(!!mobileMessageActions.selectedValue);
  }, [mobileMessageActions]);

  if (!selectedValue) return null;

  return (
    <MessageSelectedMobileContent
      modeManager={messageMode}
      mobileMessageActions={{
        handleCloseSelection: mobileMessageActions.handleCloseSelection,
        handleSelectMessage: mobileMessageActions.handleSelectMessage,
        selectedValue,
      }}
      open={open}
    />
  );
}

const MessageSelectedMobileContent: React.FC<Props> = ({ mobileMessageActions, open, modeManager }) => {
  const { message, dialogue, ...position } = mobileMessageActions.selectedValue;

  return (
    <MdMenu
      open={open}
      anchorEl={() => ({
        getBoundingClientRect: position.getBoundingClientRect,
        nodeType: 1,
      })}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      onClose={mobileMessageActions.handleCloseSelection}
    >
      {message.isUser ? (
        <MessageMobileUserActions
          message={message}
          modeManager={modeManager}
          onClose={mobileMessageActions.handleCloseSelection}
        />
      ) : (
        <MessageMobileAssistantActions
          message={message}
          dialogue={dialogue}
          onClose={mobileMessageActions.handleCloseSelection}
        />
      )}
    </MdMenu>
  );
}

export default MessageSelectedMobile;
