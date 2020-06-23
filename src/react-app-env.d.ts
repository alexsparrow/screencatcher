/// <reference types="react-scripts" />

declare module 'gif-encoder' {
  var x: any;
  export = x;
}

declare module 'upng-js' {
  var x: any;
  export = x;
}

declare var MediaRecorder: any;

// See: https://github.com/microsoft/TypeScript/issues/33232
interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
}

// if constraints config still lose some prop, you can define it by yourself also
interface MediaTrackConstraintSet {
  displaySurface?: ConstrainDOMString;
  logicalSurface?: ConstrainBoolean;
  // more....
}

declare module 'workerize-loader!*' {
    class WebpackWorker extends Worker {
        constructor();
    }

    export = WebpackWorker;
}