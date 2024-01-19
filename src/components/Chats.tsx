import { useRecognition } from "../hooks/";

const Chats: React.FC = () => {
  const [recognitionState, startRecognition, stopRecognition] =
    useRecognition();

  const onClick = () => {
    if (recognitionState === "idle") {
      startRecognition();
    } else if (recognitionState === "listening") {
      stopRecognition((result) => console.log(result));
    }
  };

  return (
    <div className="chats-container">
      <button className="start-button" onClick={onClick}>
        {recognitionState === "idle" ? "Start" : "Stop"}
      </button>
    </div>
  );
};

export default Chats;
