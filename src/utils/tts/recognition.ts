import makeCancellable from "make-cancellable-promise";
import { delay, cancelRunningTask } from "../helper";
import { postData } from "../request";

const CORPID = "";
// sv/workweixin
const CORPSECRET = "";

export type RecognitionState =
  | "idle" // 空闲
  | "listening" // 录音中
  | "voiceProcessing" // 录音处理中
  | "voice2TextProcessing" // 录音转文字处理中
  | "cancelled"; // 录音转文字取消

export type StartRecognition = (onStart: () => void) => void;

export const startRecognition: StartRecognition = (onStart) => {
  // 实现唤起语音识别的逻辑
  onStart();
  wx.startRecord();
};

// 停止录音的模拟实现
const stopRecord = async () => {
  const voiceId: string = "123";

  // 模拟录音结束的处理逻辑
  console.log("录音结束处理中 开始...");
  await delay(2000);
  console.log("录音结束处理中 结束...");

  return voiceId;
};

// 语音转文字的模拟实现
const voice2Text = async (voiceId: string) => {
  const translateResult: string = "武汉天气不错啊";

  // 模拟录音结束的处理逻辑
  console.log(`录音 ${voiceId} 转文字中 开始...`);
  await delay(4000);
  console.log(`录音 ${voiceId} 转文字中 结束...`);

  return translateResult;
};

// 获取签名
const getSignature = async () => {
  const url = `http://wxwork.digitalchina.com/dcg-wx/getjsapi-config`;
  const body = {
    secret: CORPSECRET,
    urlflag: "http://wxwork.digitalchina.com/sv/workweixin/",
    flag: "DCG",
  };
  const res = await postData(url, body);
  return res;
};

export type EndRecognition = (option: {
  onRecordEnd: () => void;
  onVoice2TextEnd: (text: string) => void;
}) => () => void;

export const endRecognition: EndRecognition = ({
  onRecordEnd,
  onVoice2TextEnd,
}) => {
  // 模拟语音识别到的内容
  // 在实际场景中 语音识别和语音转文字是2个独立的步骤 因此这里的实现会涉及到 异步操作

  // 1. 当用用户触发结束语音识别时, 首先结束语音识别
  // 2. 将语音识别的内容转换成文字
  // 3. 回掉函数返回转换后的文字

  let cancellable: {
    promise: Promise<string>;
    cancel(): void;
  } | null = null;

  // 不可取消 任务
  stopRecord()
    .then((voiceId) => {
      onRecordEnd();
      // 可取消 任务
      cancellable = makeCancellable(voice2Text(voiceId));

      cancellable.promise
        .then((translateResult) => {
          onVoice2TextEnd(translateResult);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.error(error);
    });

  return () => {
    console.log(`录音转文字中被取消`);
    cancelRunningTask(cancellable);
  };
};

export type RegisterRecognition = () => void;

export const registerRecognition: RegisterRecognition = async () => {
  const { signature, nonceStr, timestamp } = await getSignature();

  wx.config({
    beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: CORPID, // 必填，企业微信的corpID，必须是本企业的corpID，不允许跨企业使用
    timestamp, // 必填，生成签名的时间戳
    nonceStr, // 必填，生成签名的随机串
    signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
    jsApiList: [
      "startRecord",
      "stopRecord",
      "onVoiceRecordEnd",
      "playVoice",
      "pauseVoice",
      "stopVoice",
      "onVoicePlayEnd",
      "uploadVoice",
      "downloadVoice",
      "translateVoice",
    ], // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
  });

  wx.ready(function () {
    alert("wx 初始化成功");
  });

  wx.error(function () {
    alert("wx 初始化失败");
  });
};
