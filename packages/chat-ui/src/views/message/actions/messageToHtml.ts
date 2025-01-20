import { renderToStaticMarkup } from 'react-dom/server';
import { compiler } from 'markdown-to-jsx';

export const messageToHtml = (text: string) => {
  return renderToStaticMarkup(compiler(text));
}
