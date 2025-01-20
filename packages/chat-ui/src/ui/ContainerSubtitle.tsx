import * as React from 'react';
import { MdTextUi } from './TextUi';

type Props = React.PropsWithChildren;

const ContainerSubtitle: React.FC<Props> = ({ children }) => {
  return (
    <MdTextUi m3typography={'title.medium'} m3color={'onSurfaceVariant'}>
      {children}
    </MdTextUi>
  );
}

export default ContainerSubtitle;
