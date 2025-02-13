import * as React from 'react';
import { ObservableReactValue } from '../../utils/observers/ObservableReactValue';
import { useObserverValue } from './useObserverValue';

class SnackbarModel {
  readonly open = new ObservableReactValue(false);

  title = '';

  show = (title: string) => {
    this.title = title;
    this.open.value = true;
  }

  close = () => {
    this.open.value = false;
  }
}

const snackbarModel = new SnackbarModel();

export const useSnackbar = () => {
  return React.useMemo(() => snackbarModel as Readonly<SnackbarModel>, []);
}

export const useSnackbarState = () => {
  return useObserverValue(snackbarModel.open) ?? false;
}
