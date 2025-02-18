import * as React from 'react';
import { ApiRefUserType } from '../core/useInitializeApiRef';
import { DDialogue, DMessage } from '../../models';

export const useChatApiRef = <DM extends DMessage = any, DD extends DDialogue<DM> = any>() =>
  React.useRef<ApiRefUserType<DM, DD> | null>(null);
