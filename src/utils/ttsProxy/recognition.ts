import { startRecognition, endRecognition } from "../tts/recognition";

let proxy: RecognitionProxy | null = null;

export const startRecognitionProxy: (onStart: () => void) => void = (
  onStart
) => {
  proxy?.startRecognition(onStart);
};

type EndRecognitionProxy = (option: {
  onRecordEnd: () => void;
  onVoice2TextEnd: (text: string) => void;
}) => () => void;

export const endRecognitionProxy: EndRecognitionProxy = ({
  onRecordEnd,
  onVoice2TextEnd,
}) => {
  if (!proxy) {
    console.error("proxy is null");
    return () => {}; // Return an empty function when proxy is null
  }
  return proxy.endRecognition({ onRecordEnd, onVoice2TextEnd });
};

export const registerRecognition: () => void = () => {
  if (!proxy) {
    proxy = new RecognitionProxy();
    proxy.register();
  }
};

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
    window.postMessage({ type: "startRecognition" }, "*");
    this._onChildStart = onStart;
  }

  endRecognition(option: {
    onRecordEnd: () => void;
    onVoice2TextEnd: (text: string) => void;
  }): () => void {
    window.postMessage({ type: "endRecognition" }, "*");
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
      window.postMessage({ type: "startRecognitionComplete" }, "*");
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

    window.addEventListener("message", function (event: MessageEvent) {
      // start recognition
      const type = event.data.type;
      if (type === "startRecognition") {
        // 调用被代理的能力
        startRecognition(onParentStart);
      } else if (type === "endRecognition") {
        // 调用被代理的能力
        endRecognition({
          onRecordEnd: onParentRecordEnd,
          onVoice2TextEnd: onParentVoice2TextEnd,
        });
      } else if (type === "startRecognitionComplete") {
        onChildStart();
      }
    });
  }
}
