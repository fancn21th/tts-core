import { useRef } from "react";
import { useRecognition, useChat, useReadAloud } from "../hooks/";

const Chats: React.FC = () => {
  const [recognitionState, startRecognition, stopRecognition] =
    useRecognition();

  const cancelRecognitionRef = useRef<() => void>(() => {
    console.log(
      "cancelRecognitionRef.current is not defined 没有可以取消的动作"
    );
  });

  const [chatState, ask] = useChat();

  const [readState, read] = useReadAloud();

  const onClick = () => {
    if (recognitionState === "idle") {
      startRecognition();
    } else if (recognitionState === "listening") {
      cancelRecognitionRef.current = stopRecognition(async (result: string) => {
        const answer = await ask(result);
        await read(answer, () => {});
      });
    }
  };

  const onStopClick = () => {
    if (cancelRecognitionRef.current) {
      cancelRecognitionRef.current();
    }
  };

  return (
    <div className="chats-container">
      {/* 语音识别 状态 */}
      <div className="recognition-state">
        {recognitionState === "idle"
          ? "语音识别 is idle"
          : recognitionState === "listening"
          ? "语音识别 is listening ..."
          : "语音识别 is processing ..."}
      </div>
      {/* GPT 状态 */}
      <div className="gpt-state">
        {chatState === "idle" ? "GPT is idle" : "GPT is progressing ..."}
      </div>
      {/* 语音合成 状态 */}
      <div className="read-state">
        {readState === "idle" ? "语音播放 is idle" : "语音正在播放 ..."}
      </div>
      {/* 底部 */}
      <div className="action-bar">
        {/* 触发录音开始 与 结束录音 */}
        <button className="start-button" onClick={onClick}>
          {recognitionState === "idle" ? "Start" : "Stop"}
        </button>
        {/* 取消按钮 */}
        <button className="stop-button" onClick={onStopClick}>
          Stop
        </button>
      </div>
    </div>
  );
};

export default Chats;
