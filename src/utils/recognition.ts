export type RecognitionState = "idle" | "listening";

export const startRecognition = (onStart: () => void) => {
  onStart();
};

export const endRecognition = (onEnd: () => void) => {};
