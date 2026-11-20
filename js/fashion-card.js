(() => {
  const first = document.querySelector('.fashion-model');
  if (!first) return;
  const card = first.closest('.gallery__item');
  const stage = first.parentElement;
  card.classList.add('fashion-card');
  stage.classList.add('fashion-stage');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const models = [2, 1, 3, 7, 6, 4, 5].map((number, index) => {
    const image = index === 0 ? first : first.cloneNode();
    image.src = `Fashion/model${number}-cutout.png`;
    if (index !== 0) stage.append(image);
    return image;
  });
  let timer, active = false, pointerInside = false, center = 0;
  function position() {
    models.forEach((image, index) => {
      const offset = (index - center + models.length + 3) % models.length - 3;
      image.style.setProperty('--slot', offset);
      image.classList.toggle('is-center', offset === 0);
      image.classList.toggle('is-side', Math.abs(offset) === 1);
      image.style.zIndex = offset === 0 ? '3' : '2';
      // Wrap hidden models behind the carousel without a sweep across it.
      if (Math.abs(offset) > 1) image.style.transition = 'none';
      else image.style.removeProperty('transition');
    });
  }
  function stop() {
    clearTimeout(timer);
    active = false;
    card.classList.remove('fashion-playing');
  }
  function start() {
    if (active) return;
    active = true;
    center = 0;
    position();
    card.classList.add('fashion-playing');
    if (reducedMotion.matches) return;
    function advance() {
      if (!active) return;
      const next = (center + 1) % models.length;
      if (!models[next].complete || !models[next].naturalWidth) {
        timer = setTimeout(advance, 150);
        return;
      }
      center = next;
      position();
      timer = setTimeout(advance, 1500);
    }
    timer = setTimeout(advance, 500);
  }
  function update() {
    if (!document.hidden && !matchMedia('(max-width: 600px), (hover: none)').matches && ((pointerInside && hover.matches) || card.matches(':focus-within'))) start();
    else stop();
  }
  position();
  card.addEventListener('pointerenter', () => { pointerInside = true; update(); });
  card.addEventListener('cardvisibilitychange', update);
  card.addEventListener('pointerleave', () => { pointerInside = false; update(); });
  card.addEventListener('focusin', update);
  card.addEventListener('focusout', () => setTimeout(update, 0));
  document.addEventListener('visibilitychange', update);
  hover.addEventListener('change', update);
  reducedMotion.addEventListener('change', () => { stop(); update(); });
})();
