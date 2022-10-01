export function buildEnterHandler(callback: () => void) {
  return (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      callback();
    }
  }
}