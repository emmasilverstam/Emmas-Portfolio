(() => {
  const cover = document.querySelector('img.img3[src="kandidaten.png"]');
  if (!cover) return;
  const card = cover.closest('.gallery__item');
  const stage = cover.parentElement;
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  card.classList.add('furniture-card');
  stage.classList.add('furniture-stage');
  // Use the same square camera canvas for the room and furniture at every viewport.
  function sizeScene() {
    stage.style.setProperty('--furniture-scene-size', `${Math.max(stage.clientWidth, stage.clientHeight)}px`);
  }
  new ResizeObserver(sizeScene).observe(stage);
  sizeScene();
  cover.classList.add('furniture-cover');
  const frames = Array.from({ length: 4 }, (_, i) => {
    const img = new Image();
    img.className = 'furniture-frame';
    img.alt = '';
    img.src = [
      'urban/hover-camera-1-fine.png',
      'urban/hover-camera-2.png',
      'urban/hover-camera-3-rear-wheels.png',
      'urban/hover-camera-4-cabinet-wheels.png',
    ][i];
    img.dataset.configuration = String(i + 1);
    stage.append(img);
    return img;
  });
  const room = new Image();
  room.src = 'urban/hover-room-no-window.png';
  let timer, active = false, inside = false, current = 0;
  function show() {
    frames.forEach((frame, i) => frame.classList.toggle('is-current', i === current));
    card.classList.add('furniture-playing');
  }
  function stop() {
    clearTimeout(timer);
    active = false;
    card.classList.remove('furniture-playing');
    frames.forEach(frame => frame.classList.remove('is-current'));
  }
  function advance() {
    if (!active) return;
    const next = (current + 1) % frames.length;
    if (frames[next].complete && frames[next].naturalWidth) {
      current = next;
      show();
    }
    timer = setTimeout(advance, current === 0 ? 800 : 1200);
  }
  function update() {
    const wanted = !document.hidden && !matchMedia('(max-width: 600px), (hover: none)').matches && ((inside && hover.matches) || card.matches(':has(:focus-visible)'));
    if (!wanted) { stop(); return; }
    if (active || !frames[0].complete || !frames[0].naturalWidth || !room.complete || !room.naturalWidth) return;
    active = true;
    current = 0;
    show();
    if (!reduced.matches) timer = setTimeout(advance, 800);
  }
  frames[0].addEventListener('load', update);
  room.addEventListener('load', update);
  card.addEventListener('pointerenter', () => { inside = true; update(); });
  card.addEventListener('cardvisibilitychange', update);
  card.addEventListener('pointerleave', () => { inside = false; update(); });
  card.addEventListener('focusin', update);
  card.addEventListener('focusout', () => setTimeout(update, 0));
  document.addEventListener('visibilitychange', update);
  hover.addEventListener('change', update);
  reduced.addEventListener('change', () => { stop(); update(); });
})();
