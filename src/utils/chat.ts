export const ask: (question: string) => Promise<string> = async (
  question: string
) => {
  console.log(question);
  return "今天天气确实不错啊";
};
