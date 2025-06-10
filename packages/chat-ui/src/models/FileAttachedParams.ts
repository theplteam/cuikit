import { IdType } from "../types";

export type FileAttachedParams = {
  id: IdType;
  file: File;
  actions: {
    setError: (e: string) => void;
    setProgress: (n: number) => void;
    setId: (newId: IdType) => void;
    onFinish: () => void;
  },
}
