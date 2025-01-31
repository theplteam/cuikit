export abstract class StreamSmootherAbstract {
  abstract readonly pushPartFn: (part: string) => void;

  abstract faster?: () => void;

  abstract onComplete: (callback: undefined | (() => void)) => void;
}
