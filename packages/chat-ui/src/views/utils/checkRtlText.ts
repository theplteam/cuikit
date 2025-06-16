export const checkRtlText = (text: string) => {
  const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  const isRtl = rtlChars.test(`${text}`);
  return isRtl;
};
