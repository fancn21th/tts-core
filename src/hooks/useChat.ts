import { useState } from "react";
import { ask } from "../utils";
import type { ChatState } from "../utils";

// state manager & proxy
export function useChat(): [
  ChatState,
  (question: string, onResult: (answer: string) => void) => () => void
] {
  const [chatState, setChatState] = useState<ChatState>("idle");

  const askProxy: (
    question: string,
    onResult: (answer: string) => void
  ) => () => void = (question, onResult) => {
    setChatState("processing");

    const onAskEnd = (answer: string) => {
      setChatState("idle");
      onResult(answer);
    };

    const cancel = ask(question, onAskEnd);

    return () => {
      setChatState("cancelled");
      setTimeout(() => {
        setChatState("idle");
      }, 2000);
      cancel();
    };
  };

  return [chatState, askProxy];
}
