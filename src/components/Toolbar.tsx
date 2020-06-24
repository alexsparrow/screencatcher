import React from "react";
import {
  MenuItem,
  Menu,
  NavbarDivider,
  Popover,
  NavbarGroup,
  Navbar,
  Button,
  ProgressBar,
  NavbarHeading,
  Alignment,
  MenuDivider,
} from "@blueprintjs/core";
import numeral from "numeral";
import { State, Action } from "../state";

export const Toolbar = ({
  state,
  dispatch,
  startCapture,
  stopCapture,
  durationSecs,
  onExport,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  startCapture: any;
  stopCapture: any;
  durationSecs: number;
  onExport: any;
}) => {
  const base64 = btoa(
    new Uint8Array(state.png).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  const imageWidths = [256, 512, 1024, 2048];

  return (
    <Navbar>
      <NavbarGroup>
        <NavbarHeading>
          <h3>screencatcher</h3>
        </NavbarHeading>
        <Button
          disabled={state.isRecording}
          onClick={() => startCapture(0)}
          icon="record"
        >
          Record
        </Button>
        <Button disabled={!state.isRecording} onClick={stopCapture} icon="stop">
          Stop
        </Button>
        <Button
          disabled={state.isRecording}
          onClick={() => startCapture(1)}
          icon="camera"
        >
          Screenshot
        </Button>
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          icon="zoom-to-fit"
          onClick={() => dispatch({ type: "startCropping" })}
        >
          Crop
        </Button>
        <NavbarDivider />
        <Popover
          minimal
          content={
            <Menu>
              <MenuItem
                text="Export to PNG"
                disabled={state.isConverting}
                onClick={() => onExport("png")}
              />
              <MenuItem
                text="Export to GIF"
                disabled={state.isConverting}
                onClick={() => onExport("gif")}
              />
              <MenuDivider />

              <MenuItem text="Image Width">
                {imageWidths.map((width: number) => (
                  <MenuItem
                    key={width}
                    text={`${width}`}
                    icon={state.gifWidth === width ? "tick" : null}
                    onClick={() => dispatch({ type: "setGifWidth", width })}
                  />
                ))}
                {state.screenDimensions && (
                  <MenuItem
                    key={"original"}
                    text={`Original: ${state.screenDimensions?.[0]}`}
                    icon={
                      state.gifWidth === state.screenDimensions?.[0]
                        ? "tick"
                        : null
                    }
                    onClick={() =>
                      dispatch({
                        type: "setGifWidth",
                        width: state.screenDimensions![0],
                      })
                    }
                  />
                )}
              </MenuItem>
            </Menu>
          }
        >
          <Button icon="export" text="Export..." />
        </Popover>
        {(state.png || state.gif) && (
          <Popover
            minimal
            content={
              <Menu>
                <MenuItem
                  text="Download PNG"
                  download="screencatcher.png"
                  href={`data:image/png;base64,${base64}`}
                  target="_blank"
                  icon="download"
                  disabled={!state.png}
                />
                <MenuItem
                  text="Download GIF"
                  download="screencatcher.gif"
                  href={`data:image/gif;base64,${state.gif}`}
                  target="_blank"
                  icon="download"
                  disabled={!state.gif}
                />
              </Menu>
            }
          >
            <Button icon="download" text="Download..." />
          </Popover>
        )}
        {state.isConverting && (
          <>
            <NavbarDivider />
            <div style={{ width: "10rem" }}>
              <ProgressBar value={state.progress} />
            </div>
          </>
        )}
        <NavbarDivider />
        Duration: {numeral(durationSecs > 0 ? durationSecs : 0).format("0.0")}s
      </NavbarGroup>
    </Navbar>
  );
};
