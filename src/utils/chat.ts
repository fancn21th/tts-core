import { delay } from "./helper";

export type ChatState = "idle" | "processing";

export const ask: (question: string) => Promise<string> = async (
  question: string
) => {
  console.log(question);

  // 模拟网络请求
  await delay(2000);

  const result = "GPT:今天天气确实不错啊";

  console.log(result);

  return result;
};
