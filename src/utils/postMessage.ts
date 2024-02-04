export const postMessage = (message: { type: string }) => {
  console.log("message", message);
  window.postMessage(message, "*");
};

export const addEventListener: (
  type: string,
  callback: (event: MessageEvent) => void
) => void = (type, callback) => {
  window.addEventListener("message", function (event: MessageEvent) {
    const eventType = event.data.type;
    if (eventType == type) {
      console.log("event.data", event.data);
      callback(event);
    }
  });
};
