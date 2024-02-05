export const postMessage = (
  message: { type: string; text?: string },
  to: "parent" | "child"
) => {
  console.log("message", message);
  if (to === "parent") {
    window.top?.postMessage(message, "*");
  }
  if (to === "child") {
    window.frames[0]?.postMessage(message, "*");
  }
};

// export const addEventListener: (
//   type: string,
//   callback: (event: MessageEvent) => void
// ) => void = (type, callback) => {
//   window.addEventListener("message", function (event: MessageEvent) {
//     const eventType = event.data.type;

//     console.log({
//       eventType,
//       type,
//     });

//     if (eventType == type) {
//       console.log("event.data", event.data);
//       callback(event);
//     }
//   });
// };
