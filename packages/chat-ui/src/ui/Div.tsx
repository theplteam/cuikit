import * as React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement>;

const Div: React.FC<Props> = (props) => <div {...props} />

export default Div;
