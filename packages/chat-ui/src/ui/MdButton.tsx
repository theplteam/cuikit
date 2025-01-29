import * as React from 'react';
import Button, { buttonClasses, type ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import hexToRgba from 'hex-to-rgba';
import { LangReplaceType } from '../utils/lng';
import { translateStringNode } from './TextUi';
import MdCircularProgress from './MdCircularProgress';
import { materialDesignSysPalette } from '../utils/materialDesign/palette';

export type MdButtonProps = {
  replace?: LangReplaceType;
  noWrap?: boolean;
  loading?: boolean;
} & Omit<ButtonProps, 'className' | 'classes' | 'disableElevation'>;

const customTextPrimaryClass = 'ChatUi-MuiButton-textPrimary';

const ButtonStyled = styled(Button)(() => ({
  height: 40,
  padding: 0,
  color: materialDesignSysPalette.onSurfaceVariant,
  gap: 8,
  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: 500,
  letterSpacing: 0.1,
  borderRadius: 20,
  '&.MuiButton-outlined': {
    border: `1px solid ${materialDesignSysPalette.outlineVariant}`,
    ':hover': {
      border: `1px solid ${materialDesignSysPalette.outline}`,
    },
  },
  [`&.MuiButton-outlinedPrimary, &.${customTextPrimaryClass}`]: {
    color: materialDesignSysPalette.primary,
  },
  '& .MuiButton-endIcon, .MuiButton-startIcon': {
    margin: 0,
  },
  '& .MuiSvgIcon-root': {
    color: 'inherit',
    fontSize: 18,
  },
  '&.MuiButton-contained': {
    backgroundColor: materialDesignSysPalette.secondaryContainer,
    color: materialDesignSysPalette.onSecondaryContainer,
    ':hover': {
      backgroundColor: materialDesignSysPalette.secondaryFixedDim,
    },
    [`&.${buttonClasses.disabled}`]: {
      backgroundColor: hexToRgba(materialDesignSysPalette.onSurface, 0.12),
      color: hexToRgba(materialDesignSysPalette.onSurface, 0.38),
    }
  },
  '&.MuiButton-textSecondary': {
    color: materialDesignSysPalette.secondary,
  },
  '&.MuiButton-containedSecondary': {
    backgroundColor: materialDesignSysPalette.secondary,
    color: materialDesignSysPalette.onSecondary,
    ':hover': {
      backgroundColor: materialDesignSysPalette.onSecondaryContainer,
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
        textPrimary: props.color === 'primary' ? customTextPrimaryClass : undefined,
      }}
    >
      {loading
        ? <MdCircularProgress size={24} />
        : translateStringNode(children, replace)}
    </ButtonStyled>
  );
};

export default MdButton;
