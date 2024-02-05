export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function cancelRunningTask(
  runningTask?: { cancel?: () => void } | null
) {
  if (runningTask && runningTask.cancel) runningTask.cancel();
}

export function IsParentWindow() {
  return window.self === window.top;
}

export function IsChildWindow() {
  return !IsParentWindow();
}
