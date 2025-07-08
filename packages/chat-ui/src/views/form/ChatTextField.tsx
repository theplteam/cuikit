import * as React from 'react';
import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';
import { useElementRef } from '../hooks/useElementRef';
import { useTablet } from '../../ui/Responsive';
import useEnterPress, { handleIgnoreEnterPress } from '../hooks/useEnterPress';
import SimpleScrollbar from '../../ui/SimpleScrollbar';
import { useLocalizationContext } from '../core/LocalizationContext';
import TextFieldExpandButton from './TextFieldExpandButton';

type Props = {
  text: string;
  setText: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
  isTyping?: boolean;
};

const ChatTextField: React.FC<Props> = ({ text, setText, onSendMessage, disabled, isTyping }) => {
  const inputRef = useElementRef<HTMLInputElement>();
  const [height, setHeight] = React.useState(0);
  const [expand, setExpand] = React.useState(false);
  const locale = useLocalizationContext();

  const isTablet = useTablet();
  const onEnterPress = useEnterPress(onSendMessage);

  let inputProps: InputBaseProps = {};
  if (!isTablet) {
    inputProps = {
      autoFocus: true,
      tabIndex: -1
    };
  }

  React.useEffect(() => {
    setHeight(parseInt(inputRef.current?.style.height ?? '0'));
  });

  React.useEffect(() => {
    if (isTyping) setExpand(false);
  }, [isTyping]);

  const showExpandButton = height > 75;

  const handleExpand = () => {
    setExpand(!expand);
    inputRef.current?.focus();
  };

  return (
    <>
      <TextFieldExpandButton
        show={showExpandButton}
        expand={expand}
        onClick={handleExpand}
      />
      <SimpleScrollbar
        style={{
          height: expand ? '80vh' : undefined,
          maxHeight: expand ? '80vh' : 160,
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <InputBase
          fullWidth
          multiline
          placeholder={locale.textFieldPlaceholder}
          value={text}
          inputRef={inputRef}
          sx={{
            flex: 1,
            padding: (theme) => theme.spacing(1, 0),
            [`&& .${inputBaseClasses.input}`]: {
              minHeight: expand ? '78vh' : 'auto',
            },
          }}
          disabled={disabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setText(event.target.value);
          }}
          onKeyDown={!isTablet ? handleIgnoreEnterPress : undefined}
          onKeyUp={isTablet
            ? undefined
            : onEnterPress}
          {...inputProps}
        />
      </SimpleScrollbar>
    </>
  );
};

export default ChatTextField;
