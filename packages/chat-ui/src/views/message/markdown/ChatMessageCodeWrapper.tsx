import * as React from 'react';
import { styled } from '@mui/material/styles';
import { materialDesignSysPalette } from './../../../utils/materialDesign/palette';
import Stack from '@mui/material/Stack';
import { useChatCoreSlots } from '../../../views/core/ChatSlotsContext';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useLocalizationContext } from '../../../views/core/LocalizationContext';
import { useSnackbar } from '../../../views/hooks/useSnackbar';
import { Prism } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = React.JSX.IntrinsicElements['pre'];

const PreStyled = styled('pre')(() => ({
  '&&& div:first-child': {
    flexDirection: 'row',
  }
}))

const PrismStyled = styled(Prism)(() => ({
  maxHeight: 300,
  marginTop: '0 !important',
  borderRadius: '0 0 4px 4px !important',
}))

const MenuBar = styled(Stack)(() => ({
  backgroundColor: materialDesignSysPalette.surfaceContainerLow,
  borderRadius: '4px 4px 0 0',
}))

const ChatMessageCodeWrapper: React.FC<Props> = ({ children, ...other }) => {
  const [codeText, setCodeText] = React.useState('');
  const coreSlots = useChatCoreSlots();
  const locale = useLocalizationContext();
  const snackbar = useSnackbar();

  const childrenProps = React.useMemo(() => React.Children.map(children, element => {
    if (!React.isValidElement(element)) return;
    return element.props
  }), [children]);

  React.useEffect(() => {
    setCodeText(childrenProps?.[0]?.children || '')
  }, [children]);

  const codeLang = childrenProps?.[0]?.className?.replace('lang-', '') || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText)
      .then(() => snackbar.show(locale.messageCopiedToClipboard));;
  }

  return (
    <>
      <PreStyled {...other}>
        <MenuBar flexDirection={'row'} padding={1} alignItems={'center'} justifyContent={'space-between'}>
          <Typography>
            {codeLang}
          </Typography>
          <Stack flexDirection={'row'} gap={1}>
            <coreSlots.button size='small' onClick={handleCopy} startIcon={<ContentCopyIcon />}>
              {locale.codeCopyButton}
            </coreSlots.button>
            {/* <coreSlots.button size='small' onClick={handleEdit} startIcon={<EditIcon />}>
              {locale.codeEditButton}
            </coreSlots.button> */}
          </Stack>
        </MenuBar>
        <PrismStyled showLineNumbers language={codeLang as string} style={dracula} PreTag={'div'}>
          {codeText}
        </PrismStyled>
      </PreStyled >
      {/* <Drawer
        open={isEditing}
        onClose={handleEdit}
        anchor={'right'}
      >
        <Stack width={'100%'} height={'100%'} alignItems={'flex-start'} sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
          <coreSlots.iconButton color='inherit' onClick={handleEdit}>
            <CloseIcon />
          </coreSlots.iconButton>
         !@monaco-editor/react!
          <Editor
            width={isMobile ? '100vw' : 600}
            height={'100%'}
            theme="vs-dark"
            value={codeText}
            onChange={(value) => setCodeText(value || '')}
            options={{
              lineNumbers: "on",
              language: codeLang,
              disableLayerHinting: true,
              minimap: { enabled: false }
            }}
          />
        </Stack>
      </Drawer> */}
    </>
  );
}

export default ChatMessageCodeWrapper;
