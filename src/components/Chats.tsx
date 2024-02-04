import { useRef } from "react";
import { useRecognition, useChat, useReadAloud } from "../hooks/";

const recognitionStateMap = {
  idle: "空闲",
  listening: "录音中...",
  voiceProcessing: "录音处理中...",
  voice2TextProcessing: "录音转文字处理中 (可以取消)...",
  cancelled: "录音转文字取消",
};

const chatStateMap = {
  idle: "空闲",
  processing: "GPT 思考中...",
};

const readStateMap = {
  idle: "空闲",
  reading: "文字打印中 | 语音播放中...",
};

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
        {Object.values(recognitionStateMap).map((val) => {
          return (
            <span
              key={val}
              className={
                val === recognitionStateMap[recognitionState] ? "highlight" : ""
              }
            >
              {val}
            </span>
          );
        })}
      </div>
      {/* GPT 状态 */}
      <div className="chat-state">
        {Object.values(chatStateMap).map((val) => {
          return (
            <span
              key={val}
              className={val === chatStateMap[chatState] ? "highlight" : ""}
            >
              {val}
            </span>
          );
        })}
      </div>
      {/* 语音合成 状态 */}
      <div className="read-state">
        {Object.values(readStateMap).map((val) => {
          return (
            <span
              key={val}
              className={val === readStateMap[readState] ? "highlight" : ""}
            >
              {val}
            </span>
          );
        })}
      </div>
      {/* 底部 */}
      <div className="action-bar">
        {/* 触发录音开始 与 结束录音 */}
        <button className="start-button" onClick={onClick}>
          {recognitionState === "idle" ? "开始录音" : "停止录音"}
        </button>
        {/* 取消按钮 */}
        <button className="stop-button" onClick={onStopClick}>
          中断流程
        </button>
      </div>
    </div>
  );
};

export default Chats;
