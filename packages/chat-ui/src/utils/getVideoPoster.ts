const getVideoPoster = async (url: string) => {
  const video = document.createElement('video');
  video.src = url;
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });
  await new Promise((resolve) => {
    video.onseeked = () => setTimeout(resolve, 10);
    video.currentTime = 2;
  });
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

export default getVideoPoster;
