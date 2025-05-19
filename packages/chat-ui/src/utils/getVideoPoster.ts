const getVideoPoster = async (url: string) => {
  const video = document.createElement('video');
  video.src = url;
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  await new Promise((resolve) => {
    video.onloadedmetadata = () => {
      video.currentTime = 0.1;
    };
    video.onseeked = resolve;
  });
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

export default getVideoPoster;
