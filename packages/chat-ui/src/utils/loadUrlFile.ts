const loadUrlFile = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const name = url.split('/').pop() || 'file';
    return new File([blob], name, { type: blob.type });
  } catch (e) {
    console.error(e);
  }
  return undefined;
}

export default loadUrlFile;
