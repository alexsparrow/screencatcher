import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import gifshot from "gifshot";
import { Button, ProgressBar, Navbar, NavbarGroup, NavbarHeading, Alignment, NavbarDivider, AnchorButton, NonIdealState } from "@blueprintjs/core";

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

declare var MediaRecorder: any;
declare var ClipboardItem: any;

const displayMediaOptions = {
  video: {
    cursor: "always",
  },
  audio: false,
};

const GifRenderer = ({
  chunks,
  startTime,
  stopTime,
  screenWidth,
  screenHeight,
  onImageComplete,
  onImageProgress
}: {
  chunks: any[];
  startTime: number;
  stopTime: number;
  screenWidth: number;
  screenHeight: number;
  onImageComplete: any;
  onImageProgress: any;
}) => {
  const gifWidth = 1024;
  const scaleFactor = gifWidth / screenWidth;
  const gifHeight = scaleFactor * screenHeight;
  const durationMillis = 1.0 * (stopTime - startTime);
  const framesPerSecond = 5;
  const frameDuration = 10.0 / framesPerSecond;
  const numFrames = Math.trunc((framesPerSecond * durationMillis) / 1000.0);
  const interval = 1.0 / framesPerSecond; 

  useEffect(() => {
    console.log("Rendering");
    onImageProgress(0);
    gifshot.createGIF(
      {
        video: chunks,
        gifWidth,
        gifHeight,
        numFrames,
        interval,
        frameDuration,
        progressCallback: onImageProgress
      },
      function (obj: any) {
        if (!obj.error) {
          var image = obj.image;
          onImageComplete(image);
        }
      }
    );
  }, [chunks]);

  return (
    <>
    </>
  );
};

const Video = ({ chunksUrl }: { chunksUrl:any }) => {
  return (
    <video
      autoPlay
      controls
      style={{ height: "100%" }}
      src={chunksUrl ? chunksUrl : undefined}
    />
  );
};

const App = () => {
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [chunks, setChunks] = useState<any[]>([]);
  const [chunksUrl, setChunksUrl] = useState<string>("");
  const [recording, setRecording] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stopTime, setStopTime] = useState<number | null>(null);
  const [screenWidth, setScreenWidth] = useState<number | null>(null);
  const [screenHeight, setScreenHeight] = useState<number | null>(null);
  const [img, setImg] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const startCapture = async () => {
    const captureStream = await captureDisplay(displayMediaOptions);
    const _mediaRecorder = new MediaRecorder(captureStream);
    setRecording(true);

    _mediaRecorder.ondataavailable = (e: any) =>
      setChunks((existing) => {
        existing.push(e.data);
        return existing;
      });

    _mediaRecorder.onstop = (e: any) => {
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

  return (
    <div className="App">
      <main className="bp3-dark">
        <Navbar>
          <NavbarGroup>
            <NavbarHeading>
              <h3>screen2gif</h3>
            </NavbarHeading>
            <Button disabled={recording} onClick={startCapture} icon="record">
              Record
            </Button>
            <Button disabled={!recording} onClick={stopCapture} icon="stop">
              Stop
            </Button>
          </NavbarGroup>

          <NavbarGroup align={Alignment.RIGHT}>
            {(progress != 1 || !img) && (
              <div style={{ width: "10rem" }}>
                <ProgressBar value={progress} />
              </div>
            )}
            {img && (
              <>
                <img src={img} width={64} />
                <AnchorButton
                  download="screen2gif.gif"
                  href={img}
                  target="_blank"
                >
                  Download GIF
                </AnchorButton>
              </>
            )}
            <NavbarDivider />
            Duration: {(stopTime! - startTime!) / 1000.0}s
          </NavbarGroup>
        </Navbar>

        <div
          style={{
            height: "calc(100vh - 75px)",
            width: "100vw",
            backgroundColor: "#293742",
          }}
        >
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

        {startTime && stopTime && screenWidth && screenHeight && (
          <GifRenderer
            chunks={chunks}
            startTime={startTime}
            stopTime={stopTime}
            screenWidth={screenWidth!}
            screenHeight={screenHeight!}
            onImageComplete={setImg}
            onImageProgress={setProgress}
          />
        )}
      </main>
    </div>
  );
};

export default App;
