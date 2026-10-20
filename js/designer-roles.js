(() => {
  const text = document.querySelector('.designer-roles__text');
  if (!text) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const titles = ['Interaction designer', 'UX designer', 'UI designer', 'Product designer'];
  let frame;
  let index = 0;
  let started;

  function draw(now) {
    if (document.hidden) { started = undefined; return; }
    if (started === undefined) started = now;
    const elapsed = now - started;
    const writing = 1600;
    const hold = 2100;
    const erasing = 900;
    const pause = 300;
    const progress = elapsed < writing + hold
      ? Math.min(elapsed / writing, 1)
      : Math.max(0, 1 - (elapsed - writing - hold) / erasing);
    text.style.clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
    if (elapsed >= writing + hold + erasing + pause) {
      index = (index + 1) % titles.length;
      text.textContent = titles[index];
      started = now;
      text.style.clipPath = 'inset(0 100% 0 0)';
    }
    frame = requestAnimationFrame(draw);
  }

  function restart() {
    cancelAnimationFrame(frame);
    started = undefined;
    text.style.clipPath = 'none';
    if (!reducedMotion.matches && !document.hidden) {
      text.style.clipPath = 'inset(0 100% 0 0)';
      frame = requestAnimationFrame(draw);
    }
  }
  document.fonts.ready.then(restart);
  reducedMotion.addEventListener('change', restart);
  document.addEventListener('visibilitychange', restart);
})();
