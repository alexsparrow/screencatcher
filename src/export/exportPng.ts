import UPNG from "upng-js";

export const exportPng = (
  video: HTMLVideoElement,
  x: number,
  y: number,
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  callback: any
) => {
  const interval = 100;
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const context = canvas.getContext("2d");

  let startTime = Date.now();
  let lastTime = startTime;

  let frames: any[] = [];
  let dels: number[] = [];

  const capture = () => {
    const timeSinceLastFrame = Date.now() - lastTime;
    if (timeSinceLastFrame > interval) {
      context?.drawImage(video, x, y, width, height, 0, 0, targetWidth, targetHeight);
      const imageData = context?.getImageData(0, 0, targetWidth, targetHeight);
      lastTime = Date.now();

      frames.push(imageData?.data);
      dels.push(timeSinceLastFrame);
    }

    if (!video.paused && Date.now() - startTime < 30000) {
      requestAnimationFrame(capture);
    } else {
      callback(UPNG.encode(frames, targetWidth, targetHeight, 255, dels));
    }
  };

  video.play();
  video.onloadeddata = () => {
    startTime = Date.now();
    capture();
  };
};