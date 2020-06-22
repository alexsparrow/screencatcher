import React from "react";
import { Button } from "@blueprintjs/core";
import reactable from "reactablejs";
import interact from "interactjs";

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
      pointerEvents: "all",
    }}
  >
    <div style={{ width: "100%", height: "100%" }}>
      {props.x},{props.y},{props.width},{props.height}{" "}
      <Button
        onClick={() =>
          props.onCrop([props.x, props.y, props.width, props.height])
        }
      >
        Crop
      </Button>
      <Button onClick={() => props.onCropCancel()}>Cancel</Button>
    </div>
  </div>
);
const Reactable = reactable(Demo);

export const Cropper = ({
  onCrop,
  onCancel,
}: {
  onCrop: any;
  onCancel: any;
}) => {
  const [coordinate, setCoordinate] = React.useState({
    x: 0,
    y: 0,
    width: 300,
    height: 200,
  });
  return (
    <Reactable
      onCrop={onCrop}
      onCropCancel={onCancel}
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
