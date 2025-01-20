import { useTextEditorLinkReplace } from './useTextEditorLinkReplace';

// TODO: PL
export const normalizeLink = (link: string) => {
  const isNormal = new RegExp(/(http|www)/).test(link);
  return isNormal ? link : `http://${link}`;
};

export const useProcessAssistantText = (text: string) => {
  text = useTextEditorLinkReplace(
    text,
    (href, id, title) => {
      const link = id
        ? `/#news/view/${id}`
        : href
          ? normalizeLink(href)
          : '/';

      return `[${title}](${link})`;
    },
  );

  text = text.replace(/\(.+?\/?news\/view\/(\d+)\)/, '(/#news/view/$1)');
  text = text.replace(/\(.+?\/?view\/(\d+)\)/, '(/#news/view/$1)');

  return text;
}
