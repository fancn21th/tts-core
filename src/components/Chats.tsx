import { useRecognition } from "../hooks/";
import { startRecognition } from "../utils";

const Chats: React.FC = () => {
  const [recognitionState, startRecognition, endRecognition] = useRecognition();

  const onRecognitionStart = () => {};

  const start = () => {
    startRecognition(onRecognitionStart);
  };

  return (
    <div className="chats-container">
      <button className="start-button" onClick={start}>
        {recognitionState === "idle" ? "Start" : "Stop"}
      </button>
    </div>
  );
};

export default Chats;
