import { IdType } from "../types";

export type FileAttachedParams = {
  id: IdType;
  file: File;
  params: {
    setProgress: (n: number) => void;
    onFinish: () => void;
  },
}
