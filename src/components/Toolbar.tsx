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

export const Toolbar = ({
  recording,
  converting,
  startCapture,
  stopCapture,
  setGifWidth,
  gifWidth,
  setCropping,
  durationSecs,
  onExportGif,
  onExportPng,
  gif,
  png,
  progress,
}: {
  recording: boolean;
  converting: boolean;
  startCapture: any;
  stopCapture: any;
  setGifWidth: any;
  gifWidth: number;
  setCropping: any;
  durationSecs: number;
  onExportGif: any;
  onExportPng: any;
  gif: any;
  png: any;
  progress: number;
}) => {
  const base64 = btoa(
    new Uint8Array(png).reduce(
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
        <Button disabled={recording} onClick={startCapture} icon="record">
          Record
        </Button>
        <Button disabled={!recording} onClick={stopCapture} icon="stop">
          Stop
        </Button>
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        <Button icon="zoom-to-fit" onClick={() => setCropping(true)}>
          Crop (PNG Only)
        </Button>
        <NavbarDivider />
        <Popover
          minimal
          content={
            <Menu>
              <MenuItem
                text="Export to PNG"
                disabled={converting}
                onClick={onExportPng}
              />
              <MenuItem
                text="Export to GIF"
                disabled={converting}
                onClick={onExportGif}
              />
              <MenuDivider />

              <MenuItem text="Image Width">
                {imageWidths.map((width: number) => (
                  <MenuItem
                    text={`${width}`}
                    icon={gifWidth === width ? "tick" : null}
                    onClick={() => setGifWidth(width)}
                  />
                ))}
              </MenuItem>
            </Menu>
          }
        >
          <Button icon="export" text="Export..." />
        </Popover>
        {(png || gif) && (
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
                  disabled={!png}
                />
                <MenuItem
                  text="Download GIF"
                  download="screencatcher.gif"
                  href={gif}
                  target="_blank"
                  icon="download"
                  disabled={!gif}
                />
              </Menu>
            }
          >
            <Button icon="download" text="Download..." />
          </Popover>
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
        Duration: {numeral(durationSecs > 0 ? durationSecs : 0).format("0.0")}s
      </NavbarGroup>
    </Navbar>
  );
};
