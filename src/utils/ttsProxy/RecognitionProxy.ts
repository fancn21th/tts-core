import { startRecognition, endRecognition } from "../tts/recognition";
import { postMessage, addEventListener } from "../postMessage";

export class RecognitionProxy {
  private _onChildStart: () => void;
  private _onChildRecordEnd: () => void;
  private _onChildVoice2TextEnd: (text: string) => void;
  private _onParentCancelRecognition: () => void;

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
    this._onParentCancelRecognition = () => {
      console.log("_onParentCancelRecognition not defined");
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
      console.log("子程序---发送取消识别消息");
      postMessage({ type: "cancelRecognition" });
    };
  }

  register() {
    /**
     *  编程模型解释
     *    通过闭包的方式, 延迟了对真正的能力调用方法的调用
     */
    const onParentStart = () => {
      // postMessage({ type: "startRecognitionAccepted" });
      this._onChildStart && this._onChildStart();
    };

    const onParentRecordEnd = () => {
      this._onChildRecordEnd && this._onChildRecordEnd();
    };

    const onParentVoice2TextEnd = (text: string) => {
      this._onChildVoice2TextEnd && this._onChildVoice2TextEnd(text);
    };

    const onChildStart = () => {
      // this._onChildStart && this._onChildStart();
    };

    // 子 -> 父  通知父容器开始录音
    addEventListener("startRecognition", () => {
      startRecognition(onParentStart);
    });
    // 子 -> 父  通知父容器停止录音
    addEventListener("endRecognition", () => {
      this._onParentCancelRecognition = endRecognition({
        onRecordEnd: onParentRecordEnd,
        onVoice2TextEnd: onParentVoice2TextEnd,
      });
    });
    // 子 -> 父  通知父容器取消语音识别
    addEventListener("cancelRecognition", () => {
      this._onParentCancelRecognition?.();
      console.log("父程序---语音识别 转文字已取消");
    });
    // 父 -> 子
    addEventListener("startRecognitionAccepted", () => {
      onChildStart();
    });
  }
}
