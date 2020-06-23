import React, { useState, useEffect, useRef, useReducer } from "react";
import "./App.css";
import { Button, NonIdealState } from "@blueprintjs/core";
import { exportPng } from "./export/exportPng";
import { exportGif } from "./export/exportGif";
import { Toolbar } from "./components/Toolbar";
import { useContainerDimensions } from "./utils/useContainerDimensions";
import { Cropper } from "./components/Cropper";
import { Video } from "./components/Video";
import { reducer, initialState } from "./state";

async function captureDisplay(
  displayMediaOptions: any
): Promise<MediaStream | null> {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(
      displayMediaOptions
    );
  } catch (err) {
    console.error("Error: " + err);
    return null;
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stopTime, setStopTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [progress, setProgress] = useState(0);

  const startCapture = async () => {
    const captureStream = await captureDisplay(displayMediaOptions);

    if (!captureStream) {
      return;
    }

    const _mediaRecorder = new MediaRecorder(captureStream);
    dispatch({ type: "startRecording" });

    _mediaRecorder.ondataavailable = (e: any) =>
      dispatch({ type: "recordChunk", chunk: e.data });

    _mediaRecorder.onstop = () => {
      dispatch({ type: "stopRecording", captureStream });
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
  const screenWidth = state.screenDimensions?.[0];
  const screenHeight = state.screenDimensions?.[1];

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

  const onExportPng = () => {
    const vid = document.createElement("video");
    vid.src = state.chunksUrl;
    vid.width = screenWidth!;
    vid.height = screenHeight!;
    dispatch({ type: "startExport" });

    const scaleFactorX = (1.0 * screenWidth!) / width;
    const scaleFactorY = (1.0 * screenHeight!) / height;
    const cropDimensions = state.cropDimensions;

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
      cropDimensions ? Math.round(cropDimensions[2] * scaleFactorX) : state.gifWidth,
      cropDimensions
        ? Math.round(cropDimensions[3] * scaleFactorY)
        : (screenHeight! * state.gifWidth) / screenWidth!,
      (png: any) => dispatch({ type: "endExport", png })
    );
  };

  const onCrop = (dimensions: number[]) => dispatch({
    type: "endCropping",
    dimensions
  });

  const onCropCancel = () =>
    dispatch({
      type: "endCropping",
    });

  useEffect(() => {
    setTimeout(() => setCurrentTime(Date.now()), 1000);
  }, [currentTime]);

  const durationSecs =
    ((stopTime ? stopTime : currentTime) -
      (startTime ? startTime : currentTime)) /
    1000.0;

  const onExportGif = () => {
    dispatch({ type: "startExport" });
    exportGif(
      state.chunks,
      startTime!,
      stopTime!,
      screenWidth!,
      screenHeight!,
      (img: any) =>
        dispatch({
          type: "endExport",
          gif: img,
        }),
      setProgress,
      state.gifWidth
    );
  };

  return (
    <div className="App">
      <main className="bp3-dark">
        <Toolbar
          state={state}
          dispatch={dispatch}
          durationSecs={durationSecs}
          onExportGif={onExportGif}
          onExportPng={onExportPng}
          progress={progress}
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
              {state.isCropping && (
                <Cropper onCrop={onCrop} onCancel={onCropCancel} />
              )}
            </div>
            {state.chunksUrl ? (
              <Video chunksUrl={state.chunksUrl} />
            ) : (
              <NonIdealState
                title={
                  <>
                    <p>
                      screencatcher lets you record your desktop to an animated
                      GIF or PNG.
                    </p>
                  </>
                }
                description={
                  <>
                    <p>
                      It works entirely from your browser so doesn't require any
                      other applications to be installed and doesn't share data
                      with the outside world.
                    </p>
                  </>
                }
                icon="mobile-video"
                action={
                  !state.isRecording ? (
                    <Button onClick={startCapture} icon="record">
                      Click here to start recording
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
