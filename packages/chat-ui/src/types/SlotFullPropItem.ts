export type SlotFullPropItem<Name extends string, Props> = Partial<
  Record<Name, React.JSXElementConstructor<Props>> & Record<`${Name}Props`, Props>
>;
