import * as React from 'react';
import { ApiRefType } from '../core/useApiRef';
import { Thread, Message } from '../../models';

export const useChatApiRef = <DM extends Message = any, DD extends Thread<DM> = any>() =>
  React.useRef<ApiRefType<DM, DD> | null>(null);
