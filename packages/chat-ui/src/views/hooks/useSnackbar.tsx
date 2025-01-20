import * as React from 'react';
import { ObservableReactValue } from '../../models/observers/ObservableReactValue';
import { useObserverValue } from './useObserverValue';
import { lng } from '../../utils/lng';

class SnackbarModel {
  readonly open = new ObservableReactValue(false);

  title = '';

  show = (title: string | string[]) => {
    this.title = Array.isArray(title) ? lng(title) : title;
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
