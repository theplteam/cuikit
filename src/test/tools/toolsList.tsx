import { ToolType } from "@plteam/chat-ui";
import { BulbIcon, EditSparkleIcon, ImageCollectionIcon, InternetIcon, AnalysesIcon } from "./icons";

export const toolsList: ToolType[] = [
  {
    type: 'image',
    icon: ImageCollectionIcon,
    label: 'Create an image',
    chipLabel: "Image",
  },
  {
    type: 'search',
    icon: InternetIcon,
    label: 'Search the web',
    chipLabel: "Search",
  },
  {
    type: 'canvas',
    icon: EditSparkleIcon,
    label: 'Write text or code',
    chipLabel: "Canvas",
  },
  {
    type: 'research',
    icon: AnalysesIcon,
    label: 'Run deep research',
    chipLabel: "Research"
  },
  {
    type: 'justify',
    icon: BulbIcon,
    label: 'Think more',
    chipLabel: "Justify",
  },
];
