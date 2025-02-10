import { ponyfillGlobal } from '@mui/utils';

class ChatLicenseInfo {
  static getLicenseKey(): string | undefined {
    return ponyfillGlobal.__CHAT_UI_LICENSE_INFO__?.key;
  }

  static setLicenseKey(key: string) {
    ponyfillGlobal.__CHAT_UI_LICENSE_INFO__ = { key };
  }
}

export default ChatLicenseInfo;
