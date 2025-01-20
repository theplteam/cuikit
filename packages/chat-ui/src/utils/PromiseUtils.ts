export class PromiseUtils<TResult1 = void, TResult2 = never> {
  private readonly _promise: Promise<TResult1>;

  private _resolve!: (arg: TResult1) => void;

  private _reject!: (arg: TResult2) => void;

  constructor() {
    this._promise = new Promise<TResult1>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolveAfter = (ms: number) => {
    setTimeout(this._resolve, ms);
    return this._promise;
  };

  get promise() { return this._promise; }

  get resolve() { return this._resolve; }

  get reject() { return this._reject; }

  static timeoutMs = (ms: number) => (new PromiseUtils()).resolveAfter(ms);

  static timeoutSecond = (seconds: number) => PromiseUtils.timeoutMs(seconds * 1000);
}
