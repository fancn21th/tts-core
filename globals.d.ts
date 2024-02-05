/* eslint-disable @typescript-eslint/no-explicit-any */
interface Wx {
  config(option: any): void;
  ready(callback: () => void): void;
  error(callback: (res: any) => void): void;
  startRecord(): void;
  stopRecord(res: any): void;
  onVoiceRecordEnd(option: any): void;
  onVoicePlayEnd(option: any): void;
  translateVoice(option: any): void;
  playVoice(option: any): void;
}

declare let wx: Wx;
