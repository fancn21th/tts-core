import makeCancellablePromise from "make-cancellable-promise";
import { cancelRunningTask, delay } from "../helper";

export type ChatState = "idle" | "processing" | "cancelled";

const chatCompletion = async (question: string) => {
  console.log("question:--- " + question);
  const completionResult = `
  ChatGPT具有以下功能：
  - 回答常见问题：ChatGPT可以回答各种常见问题，例如天气、时间、地点等。
  - 提供建议：ChatGPT可以提供关于餐厅、旅行、购物等方面的建议。
  - 进行闲聊：ChatGPT可以与用户进行闲聊，回答一些有趣的问题或进行轻松的对话。
  - 翻译文本：ChatGPT可以将文本翻译成不同的语言。
  - 播放音乐：ChatGPT可以为用户播放他们喜欢的音乐。
  请注意，这只是一些ChatGPT的功能，它还可以执行其他任务。`;

  console.log("发送聊天消息  开始...");
  await delay(4000);
  console.log("发送聊天消息  结束...");

  return completionResult;
};

export const ask: (
  question: string,
  onAskEnd: (answer: string) => void
) => () => void = (question: string, onAskEnd) => {
  console.log(question);

  let cancellable: {
    promise: Promise<string>;
    cancel(): void;
  } | null = null;

  cancellable = makeCancellablePromise(chatCompletion(question));
  cancellable.promise
    .then((answer) => {
      onAskEnd(answer);
    })
    .catch((error) => {
      console.log(error);
    });

  return () => {
    console.log(`录音转文字中被取消`);
    cancelRunningTask(cancellable);
  };
};
