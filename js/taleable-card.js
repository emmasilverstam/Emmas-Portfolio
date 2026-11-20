(() => {
  const cover = document.querySelector('.home-page .gallery .img4');
  const stage = cover?.parentElement;
  const card = cover?.closest('.gallery__item');
  if (!stage || !card) return;
  stage.classList.add('taleable-card-stage');

  const videos = ['TaleAble/Klipp1.mp4', 'TaleAble/klipp2.mp4'].map(src => {
    const video = document.createElement('video');
    video.className = 'taleable-card-video';
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.playbackRate = 1.5;
    video.setAttribute('aria-hidden', 'true');
    stage.append(video);
    return video;
  });

  let active = false;
  function stop() {
    active = false;
    card.classList.remove('taleable-card-playing');
    videos.forEach(video => {
      video.pause();
      video.classList.remove('is-current');
      if (video.readyState >= 1) video.currentTime = 0;
    });
  }
  function start() {
    if (active || document.hidden || matchMedia('(max-width: 600px)').matches) return;
    active = true;
    videos[0].playbackRate = 2;
    videos[0].play().catch(stop);
  }
  videos.forEach((video, index) => {
    video.addEventListener('playing', () => {
      if (!active) { video.pause(); return; }
      videos.forEach(item => item.classList.toggle('is-current', item === video));
      card.classList.add('taleable-card-playing');
    });
    video.addEventListener('ended', () => {
      if (!active) return;
      const next = videos[(index + 1) % videos.length];
      next.currentTime = 0;
      next.playbackRate = next === videos[0] ? 2 : 1.5;
      next.play().catch(stop);
    });
    video.addEventListener('error', stop);
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
})();
