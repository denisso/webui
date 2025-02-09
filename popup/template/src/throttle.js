export default function throttle(callback, delay = 200) {
  let ticking = false;
  let lastCall = 0;

  return () => {
    const now = performance.now();
    if (now - lastCall < delay) return;

    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
        lastCall = performance.now();
      });
      ticking = true;
    }
  };
}
