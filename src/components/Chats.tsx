import { useRecognition, useChat } from "../hooks/";

const Chats: React.FC = () => {
  const [recognitionState, startRecognition, stopRecognition] =
    useRecognition();

  const [chatState, ask] = useChat();

  const onClick = () => {
    if (recognitionState === "idle") {
      startRecognition();
    } else if (recognitionState === "listening") {
      stopRecognition(async (result) => {
        const answer = await ask(result);

        console.log(answer);
      });
    }
  };

  return (
    <div className="chats-container">
      {/* GPT 状态 */}
      <div className="gpt-state">
        {chatState === "idle" ? "GPT is idle" : "GPT is working ..."}
      </div>
      {/* 触发录音开始 与 结束录音 */}
      <button className="start-button" onClick={onClick}>
        {recognitionState === "idle" ? "Start" : "Stop"}
      </button>
    </div>
  );
};

export default Chats;
