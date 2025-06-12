import * as React from 'react';

export const LiComponent: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>> = (props) => <li {...props} />
export const BoldComponent: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>> = (props) => <b {...props} />
export const StrongComponent: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>> = (props) => <strong {...props} />
export const ItalicComponent: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>> = (props) => <i {...props} />
export const AccentComponent: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLLIElement>>> = (props) => <em {...props} />
