import { useState } from "react";
import { read } from "../utils";
import type { ReadState } from "../utils";

// state manager & proxy
export function useReadAloud(): [
  ReadState,
  (text: string, onEnd: () => void) => void
] {
  const [readState, setChatState] = useState<ReadState>("idle");

  const readProxy: (text: string, onEnd: () => void) => void = async (
    text,
    onEnd
  ) => {
    setChatState("reading");
    await read(text, () => {
      setChatState("idle");
      onEnd();
    });
  };

  return [readState, readProxy];
}
