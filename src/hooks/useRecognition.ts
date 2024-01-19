import { useState } from "react";
import { startRecognition, endRecognition } from "../utils";
import type { RecognitionState } from "../utils";

// state manager & proxy
export function useRecognition() {
  const [recognitionState, setRecognitionState] =
    useState<RecognitionState>("idle");

  const startRecognitionProxy = () => {
    startRecognition(() => {
      setRecognitionState("listening");
    });
  };

  return [recognitionState, startRecognitionProxy, endRecognition];
}
