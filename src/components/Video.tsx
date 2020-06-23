import React, { useEffect } from "react";
import { Frame } from "../state";

export const Video = ({
  frames,
  width,
  height,
  displayWidth,
  displayHeight
}: {
  frames: Frame[];
  width: number;
  height: number;
  displayWidth: number;
  displayHeight: number;
}) => {
  const canvasRef = React.useRef(null);

  const play = () => {
    let frameIndex = 0;
    let timeStarted = Date.now();
    const canvas = canvasRef.current;
    const ctx = (canvas! as HTMLCanvasElement).getContext("2d");

    const draw = () => {
      const timeElapsed = Date.now() - timeStarted;

      if (timeElapsed >= frames[frameIndex].timestamp) {
        ctx?.putImageData(frames[frameIndex].imageData, 0, 0);
        frameIndex += 1;

        if (frameIndex >= frames.length) {
          frameIndex = 0;
          timeStarted = Date.now();
        }
      }

      requestAnimationFrame(draw);
    };

    requestAnimationFrame(draw);
  };

  useEffect(() => {
    play();
  }, [canvasRef, frames]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        maxHeight: "100%",
        height: displayHeight,
        maxWidth: "100%",
        width: displayWidth,
        margin: "auto"
      }}
    />
  );
};
