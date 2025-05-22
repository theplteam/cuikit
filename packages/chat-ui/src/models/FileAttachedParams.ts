import { IdType } from "../types";

export type FileAttachedParams = {
  id: IdType;
  file: File;
  actions: {
    setProgress: (n: number) => void;
    onFinish: () => void;
  },
}
