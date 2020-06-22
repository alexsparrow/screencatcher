import React from "react";

export const Video = ({ chunksUrl }: { chunksUrl: any }) => {
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