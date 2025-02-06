import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ChatViewConstants } from '../../ChatViewConstants';
import { materialDesignSysPalette } from '../../../utils/materialDesign/palette';

type Props = React.JSX.IntrinsicElements['img'];

const BoxStyled = styled(Box)(({ theme }) => ({
  marginTop: 8,
  width: '100%',
  backgroundColor: materialDesignSysPalette.surfaceBright,
  position: 'relative',
  '& a': {
    width: 'inherit',
  },
  '& img': {
    maxHeight: 'min(500px, 80dvh)',
    objectFit: 'contain',
    objectPosition: 'center',
    aspectRatio: 'auto',
    width: 'inherit',
  },
}));

const ChatMessageImage: React.FC<Props> = (props) => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const [rejected, setRejected] = React.useState(false);

  React.useEffect(() => {
    const image = new Image();
    image.src = props.src as string;
    image.onload = () => {
      setSize({ width: image.width, height: image.height });
    };

    image.onerror = () => {
      setRejected(true);
    }
    image.onabort = () => {
      setRejected(true);
    };

  }, [props.src]);

  if (rejected) return null;
  return (
    <BoxStyled>
      <a
        href={props.src}
        data-pswp-width={size.width}
        data-pswp-height={size.height}
        target="_blank"
        className={ChatViewConstants.MARKDOWN_IMAGE_CLASSNAME}
        style={{
          lineHeight: 0,
          display: 'block',
        }}
      >
        <img {...props} />
      </a>
    </BoxStyled>
  );
}

export default ChatMessageImage;
