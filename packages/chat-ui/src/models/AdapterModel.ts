import { AdapterType } from '../views/adapter/AdapterType';

export class AdapterModel {
  static version = 0;

  private static _reverseMessageTransforming: AdapterType['reverseMessageTransforming'];
  private static _transformMessage: AdapterType['transformMessage'];
  private static _transformThread: AdapterType['transformThread'];

  public static get reverseMessageTransforming(): AdapterType['reverseMessageTransforming'] {
    return AdapterModel._reverseMessageTransforming;
  }

  public static set reverseMessageTransforming(value: AdapterType['reverseMessageTransforming']) {
    AdapterModel._reverseMessageTransforming = value;
    AdapterModel.version++;
  }

  public static get transformMessage(): AdapterType['transformMessage'] {
    return AdapterModel._transformMessage;
  }

  public static set transformMessage(value: AdapterType['transformMessage']) {
    AdapterModel._transformMessage = value;
    AdapterModel.version++;
  }

  public static get transformThread(): AdapterType['transformThread'] {
    return AdapterModel._transformThread;
  }

  public static set transformThread(value: AdapterType['transformThread']) {
    AdapterModel._transformThread = value;
    AdapterModel.version++;
  }

  public static baseThreadTransformer = (thread: any) => {
    if (!!AdapterModel.transformMessage && Array.isArray(thread.messages)) {
      return {
        ...thread,
        messages: thread.messages.map(AdapterModel.transformMessage)
      };
    }

    return thread;
  }
}
