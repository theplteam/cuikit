import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import { useSafeChatContext } from "../../../views/core/ChatGlobalContext";

const MessageMarkdownWrapper: React.FC<BoxProps> = (p) => {
  const { disableRtl } = useSafeChatContext();

  return <Box {...p} dir={disableRtl ? 'ltr' : 'auto'} />
}

export default MessageMarkdownWrapper;
