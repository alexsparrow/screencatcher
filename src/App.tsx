import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import {
  Button,
  ProgressBar,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  Alignment,
  NavbarDivider,
  AnchorButton,
  NonIdealState,
  Slider,
} from "@blueprintjs/core";
import numeral from "numeral";
import { exportPng } from "./export/exportPng";
import { exportGif } from "./export/exportGif";
import reactable from "reactablejs";
import interact from "interactjs";

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

const displayMediaOptions = {
  video: {
    cursor: "always",
  },
  audio: false,
};



const Video = ({ chunksUrl }: { chunksUrl: any }) => {
  return (
    <video
      autoPlay
      controls
      style={{
        maxHeight: "100%",
        height: "100%",
        maxWidth: "100%",
        width: "100%",
      }}
      src={chunksUrl ? chunksUrl : undefined}
    />
  );
};

const Demo = (props: any) => (
  <div
    ref={props.getRef}
    style={{
      position: "absolute",
      left: props.x,
      top: props.y,
      width: props.width,
      height: props.height,
      touchAction: "none",
      borderWidth: 5,
      borderColor: "red",
      borderStyle: "solid",
      pointerEvents: "all"
    }}
  >
    <div style={{ width: "100%", height: "100%" }}>
      {props.x},{props.y},{props.width},{props.height}{" "}
      <Button onClick={() => props.onCrop([props.x, props.y, props.width, props.height])}>Crop</Button>
    </div>
  </div>
);
const Reactable = reactable(Demo);

const useContainerDimensions = (myRef:any) => {
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight
  })

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getDimensions())
    }

    if (myRef.current) {
      setDimensions(getDimensions())
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [myRef])

  return dimensions;
};

const ResizeDemo = ({ onCrop }: { onCrop: any }) => {
  const [coordinate, setCoordinate] = React.useState({ x: 0, y: 0, width: 300, height: 200 });
  return (
    <Reactable
      onCrop={onCrop}
      resizable={{
        edges: { left: true, right: true, bottom: true, top: true },
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
          }),
        ],
      }}
      draggable={{
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: "parent",
          }),
        ],
      }}
      onDragMove={(event: any) =>
        setCoordinate((prev: any) => ({
          x: prev.x + event.dx,
          y: prev.y + event.dy,
          width: prev.width,
          height: prev.height,
        }))
      }
      onResizeMove={(e: any) => {
        const { width, height } = e.rect;
        const { left, top } = e.deltaRect;
        setCoordinate((prev) => {
          return {
            x: prev.x + left,
            y: prev.y + top,
            width,
            height,
          };
        });
      }}
      {...coordinate}
    />
  );
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

  const videoRef = useRef();
  const { width, height } = useContainerDimensions(videoRef);

  const browserAspectRatio = width / height;
  const videoAspectRatio = screenWidth! / screenHeight!;

  let videoLeft = 0, videoTop = 0, videoWidth = width, videoHeight = height;

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

    console.log(cropDimensions);
    console.log(width);
    console.log(screenWidth);
    console.log(height);
    console.log(screenHeight);

    const scaleFactorX = 1.0 * screenWidth! / width;
    const scaleFactorY = 1.0 * screenHeight! / height;

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
      cropDimensions
        ? Math.round(cropDimensions[2] * scaleFactorX)
        : gifWidth,
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
  }

  useEffect(() => {
    setTimeout(() => setCurrentTime(Date.now()), 1000);
  }, [currentTime]);

  const durationSecs =
    ((stopTime ? stopTime : currentTime) -
      (startTime ? startTime : currentTime)) /
    1000.0;

  const base64 = btoa(
    new Uint8Array(png).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const onExportGif = () => {
    setConverting(true);
    exportGif(chunks,
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
  }

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
            <NavbarDivider />
            Width (px)
            <div style={{ paddingLeft: "1rem" }}>
              <Slider
                min={256}
                max={2048}
                stepSize={256}
                labelStepSize={512}
                onChange={setGifWidth}
                value={gifWidth}
              />
            </div>
          </NavbarGroup>

          <NavbarGroup align={Alignment.RIGHT}>
            <Button onClick={() => setCropping(true)}>Crop (PNG Only)</Button>
            <Button disabled={converting} onClick={onExportGif}>
              Export (GIF)
            </Button>
            {gif && (
              <>
                <AnchorButton
                  download="screen2gif.gif"
                  href={gif}
                  target="_blank"
                  icon="download"
                  disabled={!gif}
                >
                  Download GIF
                </AnchorButton>
              </>
            )}
            <NavbarDivider />
            <Button onClick={onExportPng} disabled={converting}>
              Export (PNG)
            </Button>
            {png && (
              <>
                <AnchorButton
                  download="screen2gif.png"
                  href={`data:image/png;base64,${base64}`}
                  target="_blank"
                  icon="download"
                  disabled={!png}
                >
                  Download PNG
                </AnchorButton>
              </>
            )}
            {converting && (
              <>
                <NavbarDivider />
                <div style={{ width: "10rem" }}>
                  <ProgressBar value={progress} />
                </div>
              </>
            )}
            <NavbarDivider />
            Duration:{" "}
            {numeral(durationSecs > 0 ? durationSecs : 0).format("0.0")}s
          </NavbarGroup>
        </Navbar>

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
              {cropping && <ResizeDemo onCrop={onCrop} />}
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
