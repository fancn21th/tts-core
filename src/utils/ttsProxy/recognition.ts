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
  private _onStart: () => void;
  private _onRecordEnd: () => void;
  private _onVoice2TextEnd: (text: string) => void;

  constructor() {
    this._onStart = () => {
      console.log("_onStart not defined");
    };
    this._onRecordEnd = () => {
      console.log("_onRecordEnd not defined");
    };
    this._onVoice2TextEnd = () => {
      console.log("_onVoice2TextEnd not defined");
    };
  }

  startRecognition(onStart: () => void): void {
    window.postMessage({ type: "startRecognition" }, "*");
    this._onStart = onStart;
  }

  endRecognition(option: {
    onRecordEnd: () => void;
    onVoice2TextEnd: (text: string) => void;
  }): () => void {
    window.postMessage({ type: "endRecognition" }, "*");
    this._onRecordEnd = option.onRecordEnd;
    this._onVoice2TextEnd = option.onVoice2TextEnd;

    return () => {
      console.log(`录音转文字中被取消`);
    };
  }

  register() {
    const onStart = () => {
      this._onStart();
    };

    const onRecordEnd = () => {
      this._onRecordEnd();
    };

    const onVoice2TextEnd = (text: string) => {
      this._onVoice2TextEnd(text);
    };

    // 父亲窗口注册监听
    // 孩子窗口注册监听
    window.addEventListener("message", function (event: MessageEvent) {
      // start recognition
      const type = event.data.type;
      if (type === "startRecognition") {
        // 调用被代理的能力
        startRecognition(onStart);
      } else if (type === "endRecognition") {
        // 调用被代理的能力
        endRecognition({
          onRecordEnd,
          onVoice2TextEnd,
        });
      }
    });
  }
}
