import { IdType } from "../types";

export type FileAttachedParams = {
  id: IdType;
  file: File;
  actions: {
    setError: (e: string) => void;
    setProgress: (n: number) => void;
    onFinish: () => void;
  },
}
