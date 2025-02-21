import * as React from 'react';
import { ApiRefType } from '../core/useApiRef';
import { Thread, DMessage } from '../../models';

export const useChatApiRef = <DM extends DMessage = any, DD extends Thread<DM> = any>() =>
  React.useRef<ApiRefType<DM, DD> | null>(null);
