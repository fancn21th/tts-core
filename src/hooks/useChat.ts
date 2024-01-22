import { useState } from "react";
import { startRecognition, endRecognition } from "../utils";
import type { RecognitionState } from "../utils";

// state manager & proxy
export function useChat() {
  const [recognitionState, setRecognitionState] =
    useState<RecognitionState>("idle");

  const startRecognitionProxy: () => void = () => {
    startRecognition(() => {
      setRecognitionState("listening");
    });
  };

  const endRecognitionProxy = (onRecognitionEnd: (text: string) => void) => {
    endRecognition((text) => {
      setRecognitionState("idle");
      onRecognitionEnd(text);
    });
  };

  return [recognitionState, startRecognitionProxy, endRecognitionProxy];
}
