export interface State {
  chunks: any[];
  chunksUrl: string;
  isRecording: boolean;
  isConverting: boolean;
  screenDimensions: number[] | null;
  png: any | null;
  gif: any | null;
  gifWidth: number;
  isCropping: boolean;
  cropDimensions: number[] | null;
  progress: number;
}

interface StartRecording {
  type: "startRecording";
}

interface RecordChunk {
  type: "recordChunk";
  chunk: any;
}

interface StopRecording {
  type: "stopRecording";
  captureStream: any;
}

interface StartExport {
  type: "startExport";
}

interface EndExport {
  type: "endExport";
  png?: any;
  gif?: any;
}

interface SetGifWidth {
  type: "setGifWidth";
  width: number;
}

interface StartCropping {
  type: "startCropping";
}

interface EndCropping {
  type: "endCropping";
  dimensions?: number[];
}

interface SetProgress {
  type: "setProgress";
  progress: number;
}

export type Action =
  | StartRecording
  | RecordChunk
  | StopRecording
  | StartExport
  | EndExport
  | SetGifWidth
  | StartCropping
  | EndCropping
  | SetProgress;

export const initialState: State = {
  chunks: [],
  chunksUrl: "",
  isRecording: false,
  isConverting: false,
  screenDimensions: null,
  png: null,
  gif: null,
  gifWidth: 1024,
  isCropping: false,
  cropDimensions: null,
  progress: 0,
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "startRecording":
      return {
        ...state,
        isRecording: true,
      };

    case "recordChunk":
      return {
        ...state,
        chunks: [...state.chunks, action.chunk],
      };
    case "stopRecording":
      return {
        ...state,
        isRecording: false,
        chunksUrl: URL.createObjectURL(state.chunks[0]),
        screenDimensions: [
          action.captureStream.getVideoTracks()[0].getSettings().width,
          action.captureStream.getVideoTracks()[0].getSettings().height,
        ],
      };
    case "startExport":
      return {
        ...state,
        isConverting: true,
      };
    case "endExport":
      return {
        ...state,
        isConverting: false,
        progress: 0,
        png: action.png ? action.png : state.png,
        gif: action.gif ? action.gif : state.gif,
      };

    case "setGifWidth":
      return {
        ...state,
        gifWidth: action.width,
      };

    case "startCropping":
      return {
        ...state,
        isCropping: true,
      };

    case "endCropping":
      return {
        ...state,
        isCropping: false,
        cropDimensions: action.dimensions
          ? action.dimensions
          : state.cropDimensions,
      };

      case "setProgress":
        return {
          ...state,
          progress: action.progress,
        };
  }

  return state;
};

export interface Frame {
  timestamp: number;
  imageData: ImageData;
}
