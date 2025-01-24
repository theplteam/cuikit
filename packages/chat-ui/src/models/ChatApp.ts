export enum LangKeys {
  EN = 'en', RU = 'ru',
}

export type UserIdType = string | number | undefined;

export class ChatApp {
  static lang: LangKeys = LangKeys.EN;

  static userId: UserIdType;

  static setLang = (lang: LangKeys) => {
    ChatApp.lang = lang;
  }
}
