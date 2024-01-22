import { delay } from "./helper";

export type RecognitionState = "idle" | "listening" | "processing";

export const startRecognition: (onStart: () => void) => void = (onStart) => {
  // 实现唤起语音识别的逻辑
  onStart();
};

export const endRecognition: (onEnd: (text: string) => void) => void = async (
  onEnd
) => {
  // 模拟语音识别到的内容
  // 在实际场景中 语音识别和语音转文字是2个独立的步骤 因此这里的实现会涉及到 异步操作

  // 1. 当用用户触发结束语音识别时, 首先结束语音识别
  // 2. 将语音识别的内容转换成文字
  // 3. 回掉函数返回转换后的文字

  // 模拟录音 与 文本识别
  console.log("语音识别中...");

  await delay(2000);

  onEnd("今天天气不错啊");
};
