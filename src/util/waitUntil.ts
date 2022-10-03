const checkInterval = 2500;

export function waitUntil(cb: () => void, timer: () => boolean): () => void {
  let timeout: ReturnType<typeof setTimeout>;

  const setLoop = (isImmediate = false) => {
    timeout = setTimeout(
      () => {
        if (timer()) {
          cb();
        } else {
          setLoop();
        }
      },
      isImmediate ? 0 : checkInterval
    );
  };
  setLoop(true);

  return () => {
    clearTimeout(timeout);
  };
}
