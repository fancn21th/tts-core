import {
  startRecognition,
  endRecognition,
  registerRecognition,
} from "../tts/recognition";
import { postMessage } from "../postMessage";
import { IsChildWindow, IsParentWindow } from "../helper";

export class RecognitionProxy {
  private _onChildStartRecognition: () => void;
  private _onChildRecordEnd: () => void;
  private _onChildVoice2TextEnd: (text: string) => void;

  constructor() {
    this._onChildStartRecognition = () => {
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
    postMessage({ type: "startRecognition" }, "parent");
    this._onChildStartRecognition = onStart;
  }

  endRecognition(option: {
    onRecordEnd: () => void;
    onVoice2TextEnd: (text: string) => void;
  }): () => void {
    postMessage({ type: "endRecognition" }, "parent");

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
    const onParentStartRecognition = () => {
      postMessage({ type: "startRecognitionAccepted" }, "child");
    };

    const onParentRecordEnd = () => {
      this._onChildRecordEnd && this._onChildRecordEnd();
    };

    const onParentVoice2TextEnd = (text: string) => {
      this._onChildVoice2TextEnd && this._onChildVoice2TextEnd(text);
    };

    const onChildStart = () => {
      this._onChildStartRecognition && this._onChildStartRecognition();
    };

    if (IsChildWindow()) {
      // // 父 -> 子
      window.addEventListener("message", function (event: MessageEvent) {
        const eventType = event.data.type;
        if (!eventType) return;

        if (eventType === "startRecognitionAccepted") {
          onChildStart();
        }
      });
    }

    if (IsParentWindow()) {
      // 初始化 wx 能力
      registerRecognition();

      window.addEventListener("message", function (event: MessageEvent) {
        const eventType = event.data.type;
        if (!eventType) return;

        if (eventType === "startRecognition") {
          startRecognition(onParentStartRecognition);
        }

        if (eventType === "endRecognition") {
          endRecognition({
            onRecordEnd: onParentRecordEnd,
            onVoice2TextEnd: onParentVoice2TextEnd,
          });
        }
      });
    }
  }
}
