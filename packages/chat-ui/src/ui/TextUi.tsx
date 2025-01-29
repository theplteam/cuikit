import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { extractTypographyText } from '../utils/materialDesign/TypographyUtils';
import { clsx } from 'clsx';
import { M3SysPaletteKeys, materialDesignSysPalette } from '../utils/materialDesign/palette';
import { TypographyKeys } from '../utils/materialDesign/materialTheme';
import { LangReplaceType, lng } from '../utils/lng';

type Props = Omit<UiTextProps, 'color' | 'variant'> & {
  color?: UiTextProps['m3color'];
  variant?: UiTextProps['m3typography'];
};

export type M3TypographyTypes = {
  m3color?: M3SysPaletteKeys;
  m3typography?: TypographyKeys;
};

export type UiTextProps = TypographyProps<React.ElementType, { component?: React.ElementType }> & {
  isDescription?: boolean,
  disableTranslation?: boolean,
  div?: boolean,
  replace?: LangReplaceType,
  ellipsis?: boolean;
  wrap?: boolean;
} & M3TypographyTypes;

const TypographyStyled = styled(Typography, {
  shouldForwardProp: propName => ['m3color', 'm3typography'].indexOf(propName as string) === -1
})<M3TypographyTypes>(({ theme, m3typography, m3color }) => ({
  ...(m3typography ? extractTypographyText(m3typography) : undefined),
  color: m3color ? materialDesignSysPalette[m3color] : undefined,
}));

const isLangChildren = (children: React.ReactNode): children is string[] => {
  return Array.isArray(children) && typeof children[0] === 'string';
}

const TextUi = (props: UiTextProps) => {
  const { isDescription, disableTranslation, div, replace, m3color, m3typography, ellipsis, wrap, ...newProps } = props;
  if (newProps.className) {
    newProps.className = clsx('Text', newProps.className);
  } else {
    newProps.className = 'Text';
  }
  if (isDescription) {
    newProps.className = clsx('description', newProps.className);
    if (newProps.variant === 'body1' || newProps.variant === undefined) {
      newProps.className = clsx('body1', newProps.className);
    }
  }

  if (ellipsis) {
    newProps.style = {
      ...newProps.style,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    };
  }

  if (wrap) {
    newProps.style = {
      ...newProps.style,
      textWrap: 'wrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    };
  }
  const children = !disableTranslation ? translateStringNode(newProps.children, replace) : newProps.children;

  let text: React.ReactElement;
  if (m3color || m3typography) {
    text = (
      <TypographyStyled {...newProps} m3typography={m3typography} m3color={m3color}>
        {children}
      </TypographyStyled>
    )
  } else {
    text = React.createElement(Typography, newProps, children);
  }

  return div ? <div>{text}</div> : text;
};

export const MdTextUi: React.FC<Props> = ({ m3color, m3typography, color, variant, ...props }) => {
  return (
    <TextUi
      m3typography={m3typography ?? variant ?? 'body.medium'}
      m3color={m3color ?? color ?? 'onBackground'}
      {...props}
    />
  );
}

export const MdText: React.FC<Omit<UiTextProps, 'disableTranslation'>> = (props) => {
  return (
    <MdTextUi {...props} disableTranslation />
  );
}

export const translateStringNode = (node: React.ReactNode, replace?: LangReplaceType): string | React.ReactNode => {
  if (isLangChildren(node)) return lng(node, replace);
  if (node && Array.isArray(node)) {
    return node.map(child => translateStringNode(child, replace));
  }
  return node;
};


