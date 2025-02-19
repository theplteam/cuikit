import * as React from 'react';
import { ApiRefType } from '../core/useApiRef';
import { DDialogue, DMessage } from '../../models';

export const useChatApiRef = <DM extends DMessage = any, DD extends DDialogue<DM> = any>() =>
  React.useRef<ApiRefType<DM, DD> | null>(null);
