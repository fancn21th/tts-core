import { useState } from "react";
import { ask } from "../utils";
import type { ChatState } from "../utils";

// state manager & proxy
export function useChat(): [ChatState, (question: string) => Promise<string>] {
  const [chatState, setChatState] = useState<ChatState>("idle");

  const askProxy: (question: string) => Promise<string> = async (question) => {
    setChatState("processing");
    const answer = await ask(question);
    setChatState("idle");
    return answer;
  };

  return [chatState, askProxy];
}
