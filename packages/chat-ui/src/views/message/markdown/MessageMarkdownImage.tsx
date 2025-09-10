import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { chatClassNames } from '../../core/chatClassNames';

type Props = React.JSX.IntrinsicElements['img'] & {
  rootClassName?: string;
};

const BoxStyled = styled(Box)(({ theme }) => ({
  marginTop: 8,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  '& a': {
    width: 'inherit',
  },
  '& img': {
    maxHeight: 'min(500px, 80dvh)',
    objectFit: 'contain',
    objectPosition: 'center',
    width: 'inherit',
    [theme.breakpoints.down('md')]: {
      maxHeight: 'min(350px, 60dvh)',
    }
  },
}));

const MessageMarkdownImage: React.FC<Props> = ({ rootClassName, ...props }) => {
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
    <BoxStyled
      className={rootClassName}
    >
      <a
        href={props.src}
        data-pswp-width={size.width}
        data-pswp-height={size.height}
        target="_blank"
        className={chatClassNames.markdownImage}
        style={{
          lineHeight: 0,
          display: 'block',
        }} rel="noreferrer"
      >
        <img {...props} />
      </a>
    </BoxStyled>
  );
}

export default MessageMarkdownImage;
