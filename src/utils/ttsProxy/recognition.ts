import type { StartRecognition, EndRecognition } from "../tts/recognition";
import { RecognitionProxy } from "./RecognitionProxy";

let proxy: RecognitionProxy | null = null;

export const startRecognitionProxy: StartRecognition = (onStart) => {
  proxy?.startRecognition(onStart);
};

export const endRecognitionProxy: EndRecognition = ({
  onRecordEnd,
  onVoice2TextEnd,
}) => {
  if (!proxy) {
    console.error("proxy is null");
    return () => {}; // Return an empty function when proxy is null
  }
  return proxy.endRecognition({ onRecordEnd, onVoice2TextEnd });
};

export const registerRecognition: () => void = () => {
  if (!proxy) {
    proxy = new RecognitionProxy();
    proxy.register();
  }
};
