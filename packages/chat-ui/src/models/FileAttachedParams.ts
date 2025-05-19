export type FileAttachedParams = {
  file: File;
  params: {
    setProgress: (n: number) => void;
    onFinish: () => void;
  },
}
