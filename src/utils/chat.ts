export type ChatState = "idle" | "progressing";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const ask: (question: string) => Promise<string> = async (
  question: string
) => {
  console.log(question);

  // 模拟网络请求
  await delay(2000);

  return "GPT:今天天气确实不错啊";
};
