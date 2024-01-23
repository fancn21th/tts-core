import { useState } from "react";
import { startRecognition, endRecognition } from "../utils";
import type { RecognitionState } from "../utils";

// state manager & proxy
export function useRecognition(): [
  RecognitionState,
  () => void,
  (onRecognitionEnd: (text: string) => void) => void
] {
  const [recognitionState, setRecognitionState] =
    useState<RecognitionState>("idle");

  const startRecognitionProxy: () => void = () => {
    startRecognition(() => {
      setRecognitionState("listening");
    });
  };

  const endRecognitionProxy: (
    onRecognitionEnd: (text: string) => void
  ) => void = (onRecognitionEnd) => {
    setRecognitionState("processing");

    const onEnd = (text: string) => {
      onRecognitionEnd(text);
      setRecognitionState("idle");
    };

    endRecognition(onEnd);
  };

  return [recognitionState, startRecognitionProxy, endRecognitionProxy];
}
