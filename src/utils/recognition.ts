export type RecognitionState = "idle" | "listening";

export const startRecognition = (onStart: () => void) => {
  // 实现唤起语音识别的逻辑
  onStart();
};

export const endRecognition = (onEnd: (text: string) => void) => {
  // 模拟语音识别到的内容
  // 在实际场景中 语音识别和语音转文字是2个独立的步骤 因此这里的实现会涉及到 异步操作

  // 1. 当用用户触发结束语音识别时, 首先结束语音识别
  // 2. 将语音识别的内容转换成文字
  // 3. 回掉函数返回转换后的文字

  onEnd("今天天气不错啊");
};
