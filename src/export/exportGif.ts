import gifshot from "gifshot";

export const exportGif = (
  chunks: any[],
  startTime: number,
  stopTime: number,
  screenWidth: number,
  screenHeight: number,
  onImageComplete: any,
  onImageProgress: any,
  gifWidth: number
) => {
  const scaleFactor = gifWidth / screenWidth;
  const gifHeight = scaleFactor * screenHeight;
  const durationMillis = 1.0 * (stopTime - startTime);
  const framesPerSecond = 5;
  const frameDuration = 10.0 / framesPerSecond;
  const numFrames = Math.trunc((framesPerSecond * durationMillis) / 1000.0);
  const interval = 1.0 / framesPerSecond;

  onImageProgress(0);
  gifshot.createGIF(
    {
      video: chunks,
      gifWidth,
      gifHeight,
      numFrames,
      interval,
      frameDuration,
      progressCallback: onImageProgress,
    },
    function (obj: any) {
      if (!obj.error) {
        var image = obj.image;
        onImageComplete(image);
      }
    }
  );
};