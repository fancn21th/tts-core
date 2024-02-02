# 语音识别与语音合成 抽象逻辑部分

## 基本设计思想

- 目的

  抽象出 "语音识别与语音合成" 通用的 主要业务流程部分 (覆盖 移动端 和 PC 端).

  底层实现用模拟代码实现 方便不同端替换合适的实现逻辑.

- 设计

  ```
  ├── App.css
  ├── App.tsx
  ├── components
  │   └── Chats.tsx           // 业务流程部分
  ├── hooks                   // 业务逻辑抽象部分
  │   ├── index.ts
  │   ├── useChat.ts
  │   ├── useReadAloud.ts
  │   └── useRecognition.ts
  ├── index.css
  ├── main.tsx
  ├── utils                   // 底层实现部分
  │   ├── chat.ts
  │   ├── helper.ts
  │   ├── index.ts
  │   ├── readaloud.ts
  │   └── recognition.ts
  ```

- 规则

  - `hooks` 目录下的文件是 业务逻辑抽象部分
    - 业务状态都在这里维护
  - `utils` 目录下的文件是 底层实现部分
    - 日志都在这里打印 因为这里是实际调用 TTS 能力的地方
  - `components` 目录下的文件是 业务流程部分
    - 主业务流程都在这里实现
