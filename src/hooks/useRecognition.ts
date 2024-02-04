import { useState, useRef, useEffect } from "react";
import {
  startRecognitionProxy as startRecognition,
  endRecognitionProxy as endRecognition,
} from "../utils";
import type { RecognitionState } from "../utils";

// state manager & proxy
export function useRecognition(): [
  RecognitionState,
  () => void,
  (onRecognitionEnd: (text: string) => void) => () => void
] {
  const [recognitionState, setRecognitionState] =
    useState<RecognitionState>("idle");

  const recognitionStateRef = useRef<RecognitionState>("idle");

  // 解决 stale closure 问题
  useEffect(() => {
    recognitionStateRef.current = recognitionState;
  }, [recognitionState]);

  const startRecognitionProxy: () => void = () => {
    startRecognition(() => {
      setRecognitionState("listening");
    });
  };

  // TODO: the state of the recognition process is not that accurate, this is just for demonstration purpose only
  type EndRecognitionProxy = (
    onRecognitionEnd: (text: string) => void
  ) => () => void;

  const endRecognitionProxy: EndRecognitionProxy = (onRecognitionEnd) => {
    setRecognitionState("voiceProcessing");

    const onRecordEnd = () => {
      // 录音结束立即 设置状态为语音转文字处理中
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
      const state = recognitionStateRef.current;

      if (state === "voice2TextProcessing") {
        setRecognitionState("cancelled");

        setTimeout(() => {
          setRecognitionState("idle");
        }, 2000);

        cancel();
      }
    };
  };

  return [recognitionState, startRecognitionProxy, endRecognitionProxy];
}
