import * as React from 'react';
import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useElementRef } from '../hooks/useElementRef';
import { useTablet } from '../../ui/Responsive';
import useEnterPress, { handleIgnoreEnterPress } from '../hooks/useEnterPress';
import SimpleScrollbar from '../../ui/SimpleScrollbar';
import { lng } from '../../utils/lng';

type Props = {
  text: string;
  setText: (value: string) => void;
  onSendMessage: () => void;
  disabled?: boolean;
  classes: {
    multiline: string;
  };
};

const inputClasses = {
  ...inputBaseClasses,
  fullHeight: 'PL-inputBase-fullHeight',
} as const;

const InputBaseStyled = styled(InputBase)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  // если включить, то будет анимация увеличения размера, но глючит перенос на новую строку:
  //  верхняя строчка в textarea добавляется моментально и вылезает за пределы textarea, а затем transition её догоняет
  /*[`&:not(.${inputClasses.fullHeight})`]: {
    [`& .${inputClasses.input}`]: {
      transition: theme.transitions.create('height', { duration: theme.m3.sys.motion.duration.medium1 }),
    },
  },*/
}));

const ChatTextField: React.FC<Props> = ({ text, setText, onSendMessage, disabled, classes }) => {
  const inputRef = useElementRef<HTMLInputElement>();
  const [height, setHeight] = React.useState(0);

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
  })

  const isMultiline = height > 25;
  const isFullHeight = height > 165;

  return (
    <SimpleScrollbar
      style={{
        maxHeight: 160,
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <InputBaseStyled
        fullWidth
        placeholder={lng(['Сообщение чату', 'Message chat'])}
        value={text}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setText(event.target.value);
        }}
        className={clsx(
          {
            [classes.multiline]: isMultiline,
            [inputClasses.fullHeight]: isFullHeight,
          }
        )}
        inputRef={inputRef}
        onKeyDown={!isTablet ? handleIgnoreEnterPress : undefined}
        onKeyUp={isTablet
          ? undefined
          : onEnterPress}
        size="small"
        multiline
        sx={{
          flex: 1,
          p: 1,
        }}
        disabled={disabled}
        {...inputProps}
      />
    </SimpleScrollbar>
  );
};

export default ChatTextField;
