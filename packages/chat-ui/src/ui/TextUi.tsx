import * as React from 'react';
import { LangReplaceType, lng } from '../utils/lng';

const isLangChildren = (children: React.ReactNode): children is string[] => {
  return Array.isArray(children) && typeof children[0] === 'string';
}

/** @deprecated */
export const translateStringNode = (node: React.ReactNode, replace?: LangReplaceType): string | React.ReactNode => {
  if (isLangChildren(node)) return lng(node, replace);
  if (node && Array.isArray(node)) {
    return node.map(child => translateStringNode(child, replace));
  }
  return node;
};


