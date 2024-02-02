import { useCallback, useState } from "react";
import { startRecognition, endRecognition } from "../utils";
import type { RecognitionState } from "../utils";

// state manager & proxy
export function useRecognition(): [
  RecognitionState,
  () => void,
  (onRecognitionEnd: (text: string) => void) => () => void
] {
  const [recognitionState, setRecognitionState] =
    useState<RecognitionState>("idle");

  const startRecognitionProxy: () => void = () => {
    startRecognition(() => {
      setRecognitionState("listening");
    });
  };

  // TODO: the state of the recognition process is not that accurate, this is just for demonstration purpose only
  type EndRecognitionProxy = (
    onRecognitionEnd: (text: string) => void
  ) => () => void;

  const endRecognitionProxy: EndRecognitionProxy =
    useCallback<EndRecognitionProxy>((onRecognitionEnd) => {
      setRecognitionState("voiceProcessing");

      const onRecordEnd = () => {
        setRecognitionState("voice2TextProcessing");
      };

      const onVoice2TextEnd = (text: string) => {
        setRecognitionState("idle");
        onRecognitionEnd(text);
      };

      // 被代理的取消函数
      const cancel = endRecognition({ onRecordEnd, onVoice2TextEnd });

      // 取消函数代理
      return () => {
        // TODO: 避免重复取消
        setRecognitionState("cancelled");

        setTimeout(() => {
          setRecognitionState("idle");
        }, 2000);

        cancel();
      };
    }, []);

  return [recognitionState, startRecognitionProxy, endRecognitionProxy];
}
