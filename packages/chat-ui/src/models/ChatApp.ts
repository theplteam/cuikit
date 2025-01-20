export enum LangKeys {
  EN = 'en', RU = 'ru',
}

export class ChatApp {
  static lang: LangKeys = LangKeys.EN;

  static setLang = (lang: LangKeys) => {
    ChatApp.lang = lang;
  }
}
