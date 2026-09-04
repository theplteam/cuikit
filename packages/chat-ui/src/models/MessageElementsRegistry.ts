import { IdType } from '../types';

export class MessageElementsRegistry {
  private map = new Map<IdType, HTMLElement>();

  register = (id: IdType, el: HTMLElement | null) => {
    if (el) {
      this.map.set(id, el);
    } else {
      this.map.delete(id);
    }
  };

  get = (id: IdType) => this.map.get(id);
}
