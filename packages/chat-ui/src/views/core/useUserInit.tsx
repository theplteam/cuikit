import * as React from 'react';
import { ChatApp, UserIdType } from '../../models/ChatApp';

/**
 * @deprecated
 */
export const useUserInit = (userId: UserIdType) => {
  React.useEffect(() => {
    ChatApp.userId = userId;
  }, [userId]);
}
