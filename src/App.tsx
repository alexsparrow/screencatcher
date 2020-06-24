import React, { useState, useEffect, useRef, useReducer } from "react";
import "./App.css";
import { Button, NonIdealState } from "@blueprintjs/core";
import { Toolbar } from "./components/Toolbar";
import { useContainerDimensions } from "./utils/useContainerDimensions";
import { Cropper } from "./components/Cropper";
import { Video } from "./components/Video";
import { reducer, initialState, Frame } from "./state";
import { exportImage, PNGExporter, GIFExporter } from "./export";

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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stopTime, setStopTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  const frames = useRef<Frame[]>([]);
  const frameTimer = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorder = useRef<typeof MediaRecorder>();

  React.useEffect(() => {
    if (!state.hasData) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      return "You haven't saved your recording. Are you sure you want to leave?";
    };
    window.onbeforeunload = handleBeforeUnload;
    return () => {
      window.onbeforeunload = null;
    };
  }, [state]);

  const startCapture = async (numFrames: number) => {
    const captureStream = await captureDisplay(displayMediaOptions);
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!captureStream) {
      return;
    }

    video.srcObject = captureStream;
    let captureStartTime: number | null = null;

    video.onloadeddata = () => {
      frameTimer.current = setInterval(() => {
        if (!captureStartTime) {
          captureStartTime = Date.now();
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        context?.drawImage(video, 0, 0);

        frames.current.push({
          timestamp: Date.now() - captureStartTime,
          imageData: context?.getImageData(
            0,
            0,
            video.videoWidth,
            video.videoHeight
          )!,
        });

        if (frames.current.length === numFrames) {
          stopCapture();
        }
      }, 100);
    };
    video.play();

    mediaRecorder.current = new MediaRecorder(captureStream);
    dispatch({ type: "startRecording" });

    mediaRecorder.current.ondataavailable = (e: any) =>
      dispatch({ type: "recordChunk", chunk: e.data });

    mediaRecorder.current.onstop = () => {
      dispatch({ type: "stopRecording", captureStream });
      captureStream.getVideoTracks().forEach((track) => track.stop());
    };

    mediaRecorder.current.start();
    setStartTime(Date.now());
  };

  const stopCapture = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    setStopTime(Date.now());
    clearInterval(frameTimer.current!);
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

  const onExport = (type: "gif" | "png") => {
    dispatch({ type: "startExport" });
    console.log(width, height);

    const scaleFactorX = (1.0 * screenWidth!) / videoWidth;
    const scaleFactorY = (1.0 * screenHeight!) / videoHeight;
    const cropDimensions = state.cropDimensions;

    const x = cropDimensions ? Math.round(cropDimensions[0] * scaleFactorX) : 0;
    const y = cropDimensions ? Math.round(cropDimensions[1] * scaleFactorY) : 0;
    const sourceWidth = cropDimensions
      ? Math.round(cropDimensions[2] * scaleFactorX)
      : screenWidth!;
    const sourceHeight = cropDimensions
      ? Math.round(cropDimensions[3] * scaleFactorY)
      : screenHeight!;
    const targetWidth = cropDimensions
      ? Math.round(cropDimensions[2] * scaleFactorX)
      : state.gifWidth;
    const targetHeight = cropDimensions
      ? Math.round(cropDimensions[3] * scaleFactorY)
      : (screenHeight! * state.gifWidth) / screenWidth!;

    exportImage(
      frames.current,
      screenWidth!,
      screenHeight!,
      x,
      y,
      sourceWidth,
      sourceHeight,
      targetWidth,
      targetHeight,
      (progress: number) => dispatch({ type: "setProgress", progress }),
      (png: any) => dispatch({ type: "endExport", [type]: png }),
      type === "gif"
        ? new GIFExporter(targetWidth, targetHeight)
        : new PNGExporter(targetWidth, targetHeight)
    );
  };

  const onCrop = (dimensions: number[]) =>
    dispatch({
      type: "endCropping",
      dimensions,
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

  return (
    <div className="App">
      <main className="bp3-dark">
        <Toolbar
          state={state}
          dispatch={dispatch}
          durationSecs={durationSecs}
          onExport={onExport}
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
              display: "flex",
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
              <Video
                frames={frames.current}
                width={screenWidth!}
                height={screenHeight!}
                displayWidth={videoWidth}
                displayHeight={videoHeight}
              />
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
                    <Button onClick={() => startCapture(0)} icon="record">
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
