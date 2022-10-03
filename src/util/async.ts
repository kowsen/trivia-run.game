export function ignoreWhileWait<T extends Function>(cb: T): T;
export function ignoreWhileWait(cb: any): any {
  let inProgressPromise = null;
  return async (...args) => {
    if (inProgressPromise) {
      return inProgressPromise;
    }
    inProgressPromise = cb(...args).then((val) => {
      inProgressPromise = null;
      return val;
    });
  };
}
