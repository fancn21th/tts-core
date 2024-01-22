import { delay } from "./helper";

export type ReadState = "idle" | "reading";

export const read: (text: string, onEnd: () => void) => void = async (
  text,
  onEnd
) => {
  console.log(`${text} is being read...`);

  // 播放语音
  await delay(2000);

  onEnd();
};
