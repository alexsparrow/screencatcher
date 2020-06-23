import { Frame } from "./state";

import Worker from "workerize-loader!./exportGifWorker"; // eslint-disable-line import/no-webpack-loader-syntax
import GifEncoder from "gif-encoder";
import UPNG from "upng-js";

interface Exporter {
  start(): void;
  addFrame(data: Uint8ClampedArray, delay: number): void;
  finish(): void;
}

export class GIFExporter implements Exporter {
  encoder: typeof GifEncoder;

  constructor(width: number, height: number) {
    this.encoder = new GifEncoder(width, height, {
      highWaterMark: 50000000,
    });
  }

  start(): void {
    this.encoder.writeHeader();
  }

  addFrame(data: Uint8ClampedArray, delay: number) {
    this.encoder.addFrame(data);
  }

  finish(): string {
    this.encoder.finish();

    return btoa(
      this.encoder
        .read()
        .reduce((data: any, byte: any) => data + String.fromCharCode(byte), "")
    );
  }
}

export class PNGExporter implements Exporter {
  width: number;
  height: number;
  frames: Uint8ClampedArray[];
  dels: number[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.frames = [];
    this.dels = [];
  }

  start(): void {
  }

  addFrame(data: Uint8ClampedArray, del: number): void {
    this.frames.push(data);
    this.dels.push(del);
  }
  finish(): void {
    return UPNG.encode(this.frames, this.width, this.height, 255, this.dels);
  }
}

export const exportImage = (
  frames: Frame[],
  screenWidth: number,
  screenHeight: number,
  x: number,
  y: number,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  onImageProgress: any,
  onImageComplete: any,
  exporter: Exporter
) => {
  const buffer = document.createElement("canvas");
  buffer.width = screenWidth;
  buffer.height = screenHeight;
  const bufferContext = buffer.getContext("2d");

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const canvasContext = canvas.getContext("2d");

  let frameIndex = 0;
  exporter.start();

  const render = () => {
    const frame = frames[frameIndex];

    onImageProgress((1.0 * frameIndex) / frames.length);

    bufferContext?.putImageData(frame.imageData, 0, 0);

    canvasContext?.drawImage(buffer, x, y, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

    const scaledFrame = canvasContext?.getImageData(
      0,
      0,
      targetWidth,
      targetHeight
    )!;

    const lastFrameTimestamp = frameIndex >= 1 ? frames[frameIndex - 1].timestamp : 0;

    exporter.addFrame(scaledFrame.data, frame.timestamp - lastFrameTimestamp);
    frameIndex++;

    if (frameIndex < frames.length) {
      setTimeout(render, 10);
    } else {
      const base64 = exporter.finish();
      onImageComplete(base64);
    }
  };

  setTimeout(render, 10);
};
