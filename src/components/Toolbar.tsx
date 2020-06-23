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
  onExportGif,
  onExportPng,
  progress,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
  startCapture: any;
  stopCapture: any;
  durationSecs: number;
  onExportGif: any;
  onExportPng: any;
  progress: number;
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
          onClick={startCapture}
          icon="record"
        >
          Record
        </Button>
        <Button disabled={!state.isRecording} onClick={stopCapture} icon="stop">
          Stop
        </Button>
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        <Button
          icon="zoom-to-fit"
          onClick={() => dispatch({ type: "startCropping" })}
        >
          Crop (PNG Only)
        </Button>
        <NavbarDivider />
        <Popover
          minimal
          content={
            <Menu>
              <MenuItem
                text="Export to PNG"
                disabled={state.isConverting}
                onClick={onExportPng}
              />
              <MenuItem
                text="Export to GIF"
                disabled={state.isConverting}
                onClick={onExportGif}
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
                  href={state.gif}
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
              <ProgressBar value={progress} />
            </div>
          </>
        )}
        <NavbarDivider />
        Duration: {numeral(durationSecs > 0 ? durationSecs : 0).format("0.0")}s
      </NavbarGroup>
    </Navbar>
  );
};
