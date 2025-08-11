import * as React from 'react';
import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';
import { useElementRef } from '../hooks/useElementRef';
import { useTablet } from '../../ui/Responsive';
import useEnterPress, { handleIgnoreEnterPress } from '../hooks/useEnterPress';
import SimpleScrollbar, { simpleBarClasses } from '../../ui/SimpleScrollbar';
import { useLocalizationContext } from '../core/LocalizationContext';
import TextFieldExpandButton from './TextFieldExpandButton';
import { motion } from '../../utils/materialDesign/motion';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useChatContext } from '../../views/core/ChatGlobalContext';

type Props = {
  text: string;
  setText: (value: string) => void;
  onSendMessage: () => void;
  handleFileUpload: (fileList: FileList | null) => void,
  disabled?: boolean;
  isTyping?: boolean;
};

const InputBaseStyled = styled(InputBase)(({ theme }) => ({
  height: '100%',
  [`&.${inputBaseClasses.root}`]: {
    padding: theme.spacing(0, 4, 0, 1.5),
    height: '100%',
  },
}))

const ChatTextField: React.FC<Props> = ({ text, setText, onSendMessage, handleFileUpload, disabled, isTyping }) => {
  const inputRef = useElementRef<HTMLInputElement>();
  const [height, setHeight] = React.useState(0);
  const [expand, setExpand] = React.useState(false);
  const locale = useLocalizationContext();
  const { enableFileAttachments } = useChatContext();

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

  const showExpandButton = expand || height > 75;

  const toggleExpand = () => {
    setExpand(!expand);
    inputRef.current?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    // Bug in Mozilla, only one file can be pasted: https://bugzilla.mozilla.org/show_bug.cgi?id=864052
    if (event.clipboardData.files.length && enableFileAttachments) {
      event.preventDefault();
      handleFileUpload(event.clipboardData.files);
    }
  };

  return (
    <Box
      width="100%"
      height="100%"
      sx={{
        [`& .${simpleBarClasses.content}`]: {
          height: '100%',
        },
        [`& .${simpleBarClasses.contentWrapper}`]: {
          height: expand ? '100% !important' : 'auto',
        },
      }}
    >
      <TextFieldExpandButton
        show={showExpandButton}
        expand={expand}
        onClick={toggleExpand}
      />
      <SimpleScrollbar
        style={{
          transition: `min-height ${motion.duration.medium1} ease, max-height ${motion.duration.medium1} ease`,
          maxHeight: expand ? '80vh' : 160,
          minHeight: expand ? '80vh' : 0,
          width: '100%',
          marginTop: 8,
        }}
      >
        <InputBaseStyled
          fullWidth
          multiline
          placeholder={locale.textFieldPlaceholder}
          value={text}
          inputRef={inputRef}
          sx={{
            [`&& .${inputBaseClasses.input}`]: {
              alignSelf: 'flex-start',
            },
          }}
          disabled={disabled}
          onPaste={handlePaste}
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
    </Box>
  );
};

export default ChatTextField;
