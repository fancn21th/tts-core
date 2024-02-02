import makeCancellable from "make-cancellable-promise";
import { delay, cancelRunningTask } from "./helper";

export type RecognitionState = "idle" | "listening" | "processing";

export const startRecognition: (onStart: () => void) => void = (onStart) => {
  // 实现唤起语音识别的逻辑
  onStart();
};

// 停止录音的模拟实现
const stopRecord = async () => {
  const voiceId: string = "123";

  // 模拟录音结束的处理逻辑
  console.log("录音结束处理中 开始...");
  await delay(2000);
  console.log("录音结束处理中 结束...");

  return voiceId;
};

// 语音转文字的模拟实现
const voice2Text = async (voiceId: string) => {
  const translateResult: string = "武汉天气不错啊";

  // 模拟录音结束的处理逻辑
  console.log(`录音 ${voiceId} 转文字中 开始...`);
  await delay(4000);
  console.log(`录音 ${voiceId} 转文字中 结束...`);

  return translateResult;
};

export const endRecognition: (onEnd: (text: string) => void) => () => void = (
  onEnd
) => {
  // 模拟语音识别到的内容
  // 在实际场景中 语音识别和语音转文字是2个独立的步骤 因此这里的实现会涉及到 异步操作

  // 1. 当用用户触发结束语音识别时, 首先结束语音识别
  // 2. 将语音识别的内容转换成文字
  // 3. 回掉函数返回转换后的文字

  let cancellable: {
    promise: Promise<string>;
    cancel(): void;
  } | null = null;

  // 不可取消 任务
  stopRecord()
    .then((voiceId) => {
      // 可取消 任务
      cancellable = makeCancellable(voice2Text(voiceId));

      cancellable.promise
        .then((translateResult) => {
          onEnd(translateResult);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });

  return () => {
    console.log(`录音转文字中被取消`);
    cancelRunningTask(cancellable);
  };
};
