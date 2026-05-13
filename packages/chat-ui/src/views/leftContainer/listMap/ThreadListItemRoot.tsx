import * as React from 'react';
import {IdType} from "../../../types";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  threadId: IdType;
};

const ThreadListItemRoot: React.FC<Props> = ({ threadId, ...props }) => (
  <div {...props} />
);

export default ThreadListItemRoot;
