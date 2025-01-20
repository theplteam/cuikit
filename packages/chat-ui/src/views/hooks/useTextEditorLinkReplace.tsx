export const useTextEditorLinkReplace = (
  textFirst: string,
  ruleFn: (href: string | undefined, id: string | undefined, title: string
) => string) => {

  let text = textFirst;
  const linkRE = new RegExp(/\[([^\[\]]+)\]/, 'gm');
  const allLink = text.match(linkRE);

  if (allLink) {
    allLink.forEach((link) => {
      const linkArr = link.split('|');
      // TODO: тупой фикс ссылок, падало на тексте в [текст]
      if (linkArr.length === 1) return;
      const string = linkArr[0].slice(1);
      const href = linkArr[1].slice(0, -1).trim();
      if (!string || !href) return;
      const isId = new RegExp(/^[0-9]+$/).test(href);
      if (isId) {
        text = text.replace(link, ruleFn(undefined, href, string));
      } else {
        let foundLink = new RegExp(/(\|)(\S+)([^\n]+)/).exec(link);
        if (!foundLink) return;
        if (foundLink[2] === '<a') foundLink = new RegExp(/(<a href=")(.*)(?=">)/).exec(link);
        if (!foundLink) return;
        text = text.replace(link, ruleFn(foundLink[2], undefined, string));
      }
    });
  }

  return text;
}
