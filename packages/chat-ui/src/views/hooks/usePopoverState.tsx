import * as React from 'react';

type Config = {
  hideByAnchorElement: boolean;
};

export const usePopoverState = (config?: Partial<Config>) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClose = () => {
    if (config?.hideByAnchorElement) {
      setAnchorEl(null);
    }
    setOpen(false);
  };

  return {
    open,
    handleClick,
    handleClose,
    anchorEl,
  };
}
