import { M3SysMotion } from './utils/materialDesign/motion';
import { M3SysPalette } from './utils/materialDesign/palette';
import { M3SysShapeCorner } from './utils/materialDesign/shape';
import { elevation } from './utils/materialDesign/elevation';
import { MaterialThemeType } from './utils/materialDesign/materialTheme';
import Chat from './views/Chat';
import { ChatDialogue } from './models/ChatDialogue'
import { ChatMessage } from './models/ChatMessage'
import { ChatModel } from './models/ChatModel'
import { ChatDialogueTypeEnum, DialogueData, DChatDialogue } from './models/DialogueData'

type CustomTheme = {
  m3: {
    sys: {
      motion: M3SysMotion,
      palette: M3SysPalette,
      shape: {
        corner: M3SysShapeCorner,
      },
    };
    elevation: Record<keyof typeof elevation, string>;
    materialTheme: MaterialThemeType,
  },
  searchContainer: {
    maxWidth: number,
  },
  calendar: {
    leftBlockZIndex: number,
  },
};

interface AdditionalTheme extends CustomTheme {
  appDrawer: {
    width: number;
  };
  middleBlock: {
    width: number;
  };
  appBar: {
    height: number;
    fullHeight: number;
    mobileToolsHeight: number;
  };
  textColor: string;
  news: {
    tagsTitleWidth: number;
  };
  rightBlock: {
    minWidth: number;
    maxWidth: number;
    backgroundColor: string;
  };
}

declare module '@mui/material/styles' {
  interface Theme extends AdditionalTheme {}
  interface DeprecatedThemeOptions extends AdditionalTheme {}
  interface BreakpointOverrides {
    lst: true;
  }
}

export {
  Chat, ChatDialogue, ChatMessage, ChatModel,
  ChatDialogueTypeEnum, DialogueData, type DChatDialogue
};
