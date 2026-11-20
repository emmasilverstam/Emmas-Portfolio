(() => {
  const card = document.querySelector('.home-page .gallery__item:first-child');
  const stage = card?.querySelector('a:first-child');
  if (!stage) return;

  const video = document.createElement('video');
  video.className = 'indie-card-video';
  video.src = 'IndieFlow/1 - kopia.mp4';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.playbackRate = 4;
  video.setAttribute('aria-hidden', 'true');
  stage.append(video);

  let active = false;
  function stop() {
    active = false;
    card.classList.remove('indie-card-playing');
    video.pause();
    if (video.readyState >= 1) video.currentTime = 0;
  }
  function start() {
    if (active || document.hidden || matchMedia('(max-width: 600px)').matches) return;
    active = true;
    video.playbackRate = 4;
    video.play().catch(stop);
  }
  video.addEventListener('playing', () => {
    if (active) card.classList.add('indie-card-playing');
  });
  video.addEventListener('timeupdate', () => {
    const rate = video.currentTime < 6 ? 4 : 2.5;
    if (video.playbackRate !== rate) video.playbackRate = rate;
  });
  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') start();
  });
  card.addEventListener('pointerleave', stop);
  card.addEventListener('focusin', event => {
    if (event.target.matches(':focus-visible')) start();
  });
  card.addEventListener('focusout', stop);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  video.addEventListener('error', stop);
})();
