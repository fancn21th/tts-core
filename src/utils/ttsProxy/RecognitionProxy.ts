import { startRecognition, endRecognition } from "../tts/recognition";
import { postMessage, addEventListener } from "../postMessage";

export class RecognitionProxy {
  private _onChildStart: () => void;
  private _onChildRecordEnd: () => void;
  private _onChildVoice2TextEnd: (text: string) => void;

  constructor() {
    this._onChildStart = () => {
      console.log("_onStart not defined");
    };
    this._onChildRecordEnd = () => {
      console.log("_onRecordEnd not defined");
    };
    this._onChildVoice2TextEnd = () => {
      console.log("_onVoice2TextEnd not defined");
    };
  }

  startRecognition(onStart: () => void): void {
    postMessage({ type: "startRecognition" });
    this._onChildStart = onStart;
  }

  endRecognition(option: {
    onRecordEnd: () => void;
    onVoice2TextEnd: (text: string) => void;
  }): () => void {
    postMessage({ type: "endRecognition" });

    this._onChildRecordEnd = option.onRecordEnd;
    this._onChildVoice2TextEnd = option.onVoice2TextEnd;

    return () => {
      console.log(`录音转文字中被取消`);
    };
  }

  register() {
    /**
     *  编程模型解释
     *    通过闭包的方式, 延迟了对真正的能力调用方法的调用
     */
    const onParentStart = () => {
      postMessage({ type: "startRecognitionAccepted" });
    };

    const onParentRecordEnd = () => {
      this._onChildRecordEnd && this._onChildRecordEnd();
    };

    const onParentVoice2TextEnd = (text: string) => {
      this._onChildVoice2TextEnd && this._onChildVoice2TextEnd(text);
    };

    const onChildStart = () => {
      this._onChildStart && this._onChildStart();
    };

    // 子 -> 父
    addEventListener("startRecognition", () => {
      startRecognition(onParentStart);
    });
    // 子 -> 父
    addEventListener("endRecognition", () => {
      endRecognition({
        onRecordEnd: onParentRecordEnd,
        onVoice2TextEnd: onParentVoice2TextEnd,
      });
    });
    // 父 -> 子
    addEventListener("startRecognitionAccepted", () => {
      onChildStart();
    });
  }
}
