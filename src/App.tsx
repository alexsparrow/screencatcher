import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Button, NonIdealState } from "@blueprintjs/core";
import { exportPng } from "./export/exportPng";
import { exportGif } from "./export/exportGif";
import { Toolbar } from "./components/Toolbar";
import { useContainerDimensions } from "./utils/useContainerDimensions";
import { Cropper } from "./components/Cropper";
import { Video } from "./components/Video";

async function captureDisplay(displayMediaOptions: any) {
  let captureStream = null;

  try {
    captureStream = await (navigator.mediaDevices as any).getDisplayMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error("Error: " + err);
  }
  return captureStream;
}

const displayMediaOptions = {
  video: {
    cursor: "always",
  },
  audio: false,
};

const App = () => {
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [chunksUrl, setChunksUrl] = useState<string>("");
  const [recording, setRecording] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stopTime, setStopTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [gifWidth, setGifWidth] = useState<number>(1024);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [screenHeight, setScreenHeight] = useState<number | null>(null);
  const [gif, setGif] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [png, setPng] = useState<any>(null);
  const [cropping, setCropping] = useState(false);
  const [cropDimensions, setCropDimensions] = useState<null | number[]>();

  const startCapture = async () => {
    const captureStream = await captureDisplay(displayMediaOptions);
    const _mediaRecorder = new MediaRecorder(captureStream);
    setRecording(true);

    _mediaRecorder.ondataavailable = (e: any) =>
      setChunks((existing) => {
        existing.push(e.data);
        return existing;
      });

    _mediaRecorder.onstop = () => {
      setRecording(false);
      setChunksUrl(URL.createObjectURL(chunks[0]));
      setScreenWidth(captureStream.getVideoTracks()[0].getSettings().width);
      setScreenHeight(captureStream.getVideoTracks()[0].getSettings().height);
    };

    _mediaRecorder.start();
    setStartTime(Date.now());
    setMediaRecorder(_mediaRecorder);
  };

  const stopCapture = async () => {
    mediaRecorder.stop();
    setStopTime(Date.now());
  };

  const videoRef = useRef();
  const { width, height } = useContainerDimensions(videoRef);

  const browserAspectRatio = width / height;
  const videoAspectRatio = screenWidth! / screenHeight!;

  let videoLeft = 0,
    videoTop = 0,
    videoWidth = width,
    videoHeight = height;

  if (videoAspectRatio > browserAspectRatio) {
    const scale = width / screenWidth!;
    const scaledHeight = scale * screenHeight!;

    videoTop = 0.5 * (height - scaledHeight);
    videoHeight = scaledHeight;
  } else if (browserAspectRatio > videoAspectRatio) {
    const scale = height / screenHeight!;
    const scaledWidth = scale * screenWidth!;

    videoLeft = 0.5 * (width - scaledWidth);
    videoWidth = scaledWidth;
  }

  console.log(videoLeft, videoTop, videoWidth, videoHeight);

  const onExportPng = () => {
    const vid = document.createElement("video");
    vid.src = chunksUrl;
    vid.width = screenWidth!;
    vid.height = screenHeight!;
    setConverting(true);

    const scaleFactorX = (1.0 * screenWidth!) / width;
    const scaleFactorY = (1.0 * screenHeight!) / height;

    exportPng(
      vid,
      cropDimensions ? Math.round(cropDimensions[0] * scaleFactorX) : 0,
      cropDimensions ? Math.round(cropDimensions[1] * scaleFactorY) : 0,
      cropDimensions
        ? Math.round(cropDimensions[2] * scaleFactorX)
        : screenWidth!,
      cropDimensions
        ? Math.round(cropDimensions[3] * scaleFactorY)
        : screenHeight!,
      cropDimensions ? Math.round(cropDimensions[2] * scaleFactorX) : gifWidth,
      cropDimensions
        ? Math.round(cropDimensions[3] * scaleFactorY)
        : (screenHeight! * gifWidth) / screenWidth!,
      (png: any) => {
        setConverting(false);
        setPng(png);
      }
    );
  };

  const onCrop = (dimensions: number[]) => {
    setCropDimensions(dimensions);
    setCropping(false);
  };

  const onCropCancel = () => {
    setCropping(false);
  };

  useEffect(() => {
    setTimeout(() => setCurrentTime(Date.now()), 1000);
  }, [currentTime]);

  const durationSecs =
    ((stopTime ? stopTime : currentTime) -
      (startTime ? startTime : currentTime)) /
    1000.0;

  const onExportGif = () => {
    setConverting(true);
    exportGif(
      chunks,
      startTime!,
      stopTime!,
      screenWidth!,
      screenHeight!,
      (img: any) => {
        setGif(img);
        setConverting(false);
      },
      setProgress,
      gifWidth
    );
  };

  return (
    <div className="App">
      <main className="bp3-dark">
        <Toolbar
          converting={converting}
          durationSecs={durationSecs}
          gif={gif}
          gifWidth={gifWidth}
          onExportGif={onExportGif}
          onExportPng={onExportPng}
          png={png}
          progress={progress}
          recording={recording}
          setCropping={setCropping}
          setGifWidth={setGifWidth}
          startCapture={startCapture}
          stopCapture={stopCapture}
        />
        <div
          style={{
            height: "calc(100vh - 50px)",
            maxHeight: "calc(100vh - 50px)",
            width: "100vw",
            maxWidth: "100vw",
            padding: "1rem",
            backgroundColor: "#293742",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              height: "100%",
              maxHeight: "100%",
              position: "relative",
            }}
            ref={videoRef as any}
          >
            <div
              style={{
                position: "absolute",
                left: videoLeft,
                top: videoTop,
                width: videoWidth,
                height: videoHeight,
                pointerEvents: "none",
              }}
            >
              {cropping && <Cropper onCrop={onCrop} onCancel={onCropCancel} />}
            </div>
            {chunksUrl ? (
              <Video chunksUrl={chunksUrl} />
            ) : (
              <NonIdealState
                title="Nothing on tape yet"
                description="Record something"
                icon="warning-sign"
                action={
                  !recording ? (
                    <Button
                      disabled={recording}
                      onClick={startCapture}
                      icon="record"
                    >
                      Record
                    </Button>
                  ) : undefined
                }
              ></NonIdealState>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
