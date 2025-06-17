export class ForceStream {

  constructor(private model: { text: string }) {}

  start = (text: string) => {
    const split = text.split(' ');
    let key = 0;
    const timeout = setInterval(() => {
      this.model.text += split[key] + ' ';

      if (key === split.length - 1) {
        clearInterval(timeout);
        return;
      }
      key++;
    }, 20);
  }
}
