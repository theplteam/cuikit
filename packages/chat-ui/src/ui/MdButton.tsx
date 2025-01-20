import * as React from 'react';
import Button, { buttonClasses, type ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import hexToRgba from 'hex-to-rgba';
import { LangReplaceType } from '../utils/lng';
import { translateStringNode } from './TextUi';
import MdCircularProgress from './MdCircularProgress';

export type MdButtonProps = {
  replace?: LangReplaceType;
  noWrap?: boolean;
  loading?: boolean;
} & Omit<ButtonProps, 'className' | 'classes' | 'disableElevation'>;

const ButtonStyled = styled(Button)(({ theme }) => ({
  height: 40,
  padding: 0,
  color: theme.m3.sys.palette.onSurfaceVariant,
  gap: 8,
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: 500,
  letterSpacing: 0.1,
  borderRadius: 20,
  '&.MuiButton-outlined': {
    border: `1px solid ${theme.m3.sys.palette.outlineVariant}`,
    ':hover': {
      border: `1px solid ${theme.m3.sys.palette.outline}`,
    },
  },
  '&.MuiButton-outlinedPrimary, &.Playliner-MuiButton-textPrimary': {
    color: theme.m3.sys.palette.primary,
  },
  '& .MuiButton-endIcon, .MuiButton-startIcon': {
    margin: 0,
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
    fontSize: 18,
  },
  '&.MuiButton-contained': {
    backgroundColor: theme.m3.sys.palette.secondaryContainer,
    color: theme.m3.sys.palette.onSecondaryContainer,
    ':hover': {
      backgroundColor: theme.m3.sys.palette.secondaryFixedDim,
    },
    [`&.${buttonClasses.disabled}`]: {
      backgroundColor: hexToRgba(theme.m3.sys.palette.onSurface, 0.12),
      color: hexToRgba(theme.m3.sys.palette.onSurface, 0.38),
    }
  },
  '&.MuiButton-textSecondary': {
    color: theme.m3.sys.palette.secondary,
  },
  '&.MuiButton-containedSecondary': {
    backgroundColor: theme.m3.sys.palette.secondary,
    color: theme.m3.sys.palette.onSecondary,
    ':hover': {
      backgroundColor: theme.m3.sys.palette.onSecondaryContainer,
    },
  },
}));

const MdButton: React.FC<MdButtonProps> = ({ children, replace, onClick: onClickProp, loading, disabled, noWrap, ...props }) => {
  let padding = props.variant === 'text' ? { left: 12, right: 12 } : { left: 16, right: 16 };
  const additionalPadding = props.variant === 'text' ? 4 : 8;

  if (!!props.startIcon && !props.endIcon) {
    padding.right += additionalPadding;
  }

  if (!props.startIcon && !!props.endIcon) {
    padding.left += additionalPadding;
  }

  let onClick: ButtonProps['onClick'];
  if (onClickProp) {
    onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(e);
    };
  }

  return (
    <ButtonStyled
      {...props}
      disableElevation
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        paddingLeft: padding.left,
        paddingRight: padding.right,
        whiteSpace: noWrap ? 'nowrap' : undefined,
      }}
      classes={{
        textPrimary: props.color === 'primary' ? 'Playliner-MuiButton-textPrimary' : undefined,
      }}
    >
      {loading
        ? <MdCircularProgress size={24} />
        : translateStringNode(children, replace)}
    </ButtonStyled>
  );
};

export default MdButton;
