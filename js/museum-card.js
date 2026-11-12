(() => {
  const cover = document.querySelector('img.img2');
  if (!cover) return;
  const stage = cover.parentElement;
  const card = cover.closest('.gallery__item');
  const floor = document.createElement('span');
  floor.className = 'museum-card-floor';
  floor.setAttribute('aria-hidden', 'true');
  stage.append(floor);
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  const startTime = 3;
  const video = document.createElement('video');
  video.className = 'museum-card-video';
  video.src = 'pendel/museum-card-hq.webm';
  video.muted = true;
  video.loop = false;
  video.playbackRate = 3;
  video.playsInline = true;
  video.preload = 'auto';
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('playsinline', '');
  stage.classList.add('museum-card-stage');
  stage.append(video);
  // Retain the cover's soft wall edges over the moving scene.
  const softEdge = cover.cloneNode();
  softEdge.className = 'museum-card-soft-edge';
  softEdge.alt = '';
  softEdge.setAttribute('aria-hidden', 'true');
  stage.append(softEdge);
  let pointerInside = false;
  let requested = false;
  function syncPlaybackRate() {
    const rate = video.currentTime >= 20 ? 1 : 3;
    if (video.playbackRate !== rate) video.playbackRate = rate;
  }
  video.addEventListener('timeupdate', syncPlaybackRate);
  video.addEventListener('seeked', syncPlaybackRate);
  video.addEventListener('loadedmetadata', () => { video.currentTime = startTime; });
  video.addEventListener('ended', () => {
    video.currentTime = startTime;
    syncPlaybackRate();
    if (requested) video.play().catch(stop);
  });

  function layout() {
    const style = getComputedStyle(cover);
    // Match the timeline and floor landmarks in the square cover artwork.
    // The video contains a wider view, and its transparent export is cropped.
    const size = Math.max(cover.offsetWidth, cover.offsetHeight);
    const imageLeft = (cover.offsetWidth - size) / 2;
    const imageTop = (cover.offsetHeight - size) / 2;
    video.style.left = `${cover.offsetLeft + imageLeft - size * .025}px`;
    video.style.top = `${cover.offsetTop + imageTop + size * .102}px`;
    video.style.width = `${size * 1.237}px`;
    video.style.height = `${size * 1.237 * 506 / 796}px`;
    video.style.objectFit = 'fill';
    video.style.objectPosition = 'center';
    video.style.transform = style.transform;
    softEdge.style.left = `${cover.offsetLeft}px`;
    softEdge.style.top = `${cover.offsetTop}px`;
    softEdge.style.width = `${cover.offsetWidth}px`;
    softEdge.style.height = `${cover.offsetHeight}px`;
    softEdge.style.objectFit = style.objectFit;
    softEdge.style.objectPosition = style.objectPosition;
    softEdge.style.transform = style.transform;
  }
  const resize = new ResizeObserver(layout);
  resize.observe(stage);
  resize.observe(cover);
  cover.addEventListener('load', layout);
  function stop() {
    requested = false;
    video.pause();
    if (video.readyState >= 1) video.currentTime = startTime;
    syncPlaybackRate();
    cover.style.visibility = '';
    video.classList.remove('is-playing');
    card.classList.remove('museum-playing');
  }
  function update() {
    if (!document.hidden && ((pointerInside && hover.matches) || card.matches(':focus-visible, :has(:focus-visible)'))) {
      if (requested) return;
      requested = true;
      video.play().catch(stop);
    } else stop();
  }
  video.addEventListener('playing', () => {
    if (!requested) { stop(); return; }
    layout();
    cover.style.visibility = 'hidden';
    video.classList.add('is-playing');
    card.classList.add('museum-playing');
  });
  video.addEventListener('error', stop);
  card.addEventListener('pointerenter', () => { pointerInside = true; update(); });
  card.addEventListener('pointerleave', () => { pointerInside = false; stop(); });
  card.addEventListener('focusin', update);
  card.addEventListener('focusout', () => setTimeout(update, 0));
  document.addEventListener('visibilitychange', update);
  hover.addEventListener('change', update);
  layout();
})();
