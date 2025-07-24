import Emittery from 'emittery';
import { NOOP } from '../utils/NOOP';

type EventsType = {
  onFilesAttached: { ids: (string | number)[] };
};

export type EventsEmitterMethods = {
  on: EventsEmitter['on'];
  off: EventsEmitter['off'];
  when: EventsEmitter['when'];
}

type ListenerType<Name extends keyof EventsType, Return = void | Promise<void>> = (eventData: EventsType[Name]) => Return;

export class EventsEmitter {
  private instance = new Emittery<EventsType>();

  on = <Name extends keyof EventsType>(name: Name, listener: ListenerType<Name>) => {
    return this.instance.on(name, listener);
  }

  when = <Name extends keyof EventsType>(name: Name, predicate: ListenerType<Name, boolean>) => {
    return this.instance.once(name, predicate);
  }

  off = <Name extends keyof EventsType>(name: Name, listener: ListenerType<Name>) => {
    this.instance.off(name, listener);
  }

  emit = <Name extends keyof EventsType>(name: Name, data: EventsType[Name]) => {
    this.instance.emit(name, data);
  }

  getMethods = (): EventsEmitterMethods => {
    return {
      on: this.on,
      off: this.off,
      when: this.when,
    };
  }

  static getMockMethods = (): EventsEmitterMethods => {
    return {
      on: () => NOOP,
      off: NOOP,
      when: () => ({
        off: NOOP,
        // TODO: #ANY
      } as any),
    };
  }
}
