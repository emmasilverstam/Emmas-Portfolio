(() => {
  const cover = document.querySelector('img.img5');
  if (!cover) return;
  const stage = cover.parentElement;
  const card = cover.closest('.gallery__item');
  const floor = document.createElement('span');
  floor.className = 'pillow-card-floor';
  floor.setAttribute('aria-hidden', 'true');
  stage.append(floor);
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let pointerInside = false;
  let requested = false;
  let attempt = 0;
  let soundEnabled = false;
  const loopStart = 6.5;
  const loopEnd = 22;
  const video = document.createElement('video');
  video.className = 'pillow-card-video';
  video.muted = true;
  video.volume = 1;
  video.loop = false;
  video.playsInline = true;
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('playsinline', '');
  video.preload = 'auto';
  video.src = 'EndoBreathe/card-animation-breath-sound.webm';
  stage.classList.add('pillow-card-stage');
  stage.append(video);
  const soundButton = document.createElement('button');
  soundButton.type = 'button';
  soundButton.className = 'pillow-sound';
  card.append(soundButton);
  function updateSoundButton() {
    soundButton.textContent = video.muted ? 'Sound on' : 'Sound off';
    soundButton.setAttribute('aria-label', video.muted ? 'Turn sound on' : 'Turn sound off');
    soundButton.setAttribute('aria-pressed', String(!video.muted));
  }
  soundButton.addEventListener('click', event => {
    event.stopPropagation();
    soundEnabled = video.muted;
    video.muted = !soundEnabled;
    video.volume = 1;
    if (!requested) start();
    else video.play().catch(() => {
      soundEnabled = false;
      video.muted = true;
      updateSoundButton();
    });
    updateSoundButton();
  });
  video.addEventListener('volumechange', updateSoundButton);
  updateSoundButton();
  const body = document.createElement('canvas');
  body.className = 'pillow-card-video';
  body.width = 960;
  body.height = 552;
  body.setAttribute('aria-hidden', 'true');
  const bodyContext = body.getContext('2d');
  stage.append(body);
  video.classList.add('pillow-card-source');
  let lastBodyTime = -1;
  function drawBody(level) {
    if (!bodyContext || lastBodyTime === video.currentTime) return;
    lastBodyTime = video.currentTime;
    const ctx = bodyContext;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 960, 552);
    // Deform only the abdomen, pillow and resting hands. Head and mat stay still.
    function point(x, y) {
      const radius = Math.pow((x - 590) / 255, 2) + Math.pow((y - 280) / 185, 2);
      const influence = Math.pow(Math.max(0, 1 - radius), 2) * level;
      return { x: x + (x - 590) * .055 * influence, y: y + ((y - 280) * .075 - 4) * influence };
    }
    function triangle(x, y, w, h, p, q, r, lower) {
      const a = (lower ? r.x - q.x : q.x - p.x) / w;
      const b = (lower ? r.y - q.y : q.y - p.y) / w;
      const c = (r.x - p.x) / h;
      const d = (r.y - p.y) / h;
      const origin = lower ? r : p;
      const sx = lower ? x + w : x;
      const sy = lower ? y + h : y;
      ctx.save();
      ctx.beginPath();
      // Overlap cell edges slightly to avoid transparent seams in the pillow.
      const centerX = (p.x + q.x + r.x) / 3;
      const centerY = (p.y + q.y + r.y) / 3;
      const expanded = [p, q, r].map(vertex => {
        const distance = Math.hypot(vertex.x - centerX, vertex.y - centerY);
        return { x: vertex.x + .8 * (vertex.x - centerX) / distance, y: vertex.y + .8 * (vertex.y - centerY) / distance };
      });
      ctx.moveTo(expanded[0].x, expanded[0].y);
      ctx.lineTo(expanded[1].x, expanded[1].y);
      ctx.lineTo(expanded[2].x, expanded[2].y);
      ctx.closePath();
      ctx.clip();
      ctx.setTransform(a, b, c, d, origin.x - a * sx - c * sy, origin.y - b * sx - d * sy);
      ctx.drawImage(video, x - 1, y - 1, w + 2, h + 2, x - 1, y - 1, w + 2, h + 2);
      ctx.restore();
    }
    const w = 40, h = 24;
    for (let y = 0; y < 552; y += h) {
      for (let x = 0; x < 960; x += w) {
        const p00 = point(x, y), p10 = point(x + w, y);
        const p01 = point(x, y + h), p11 = point(x + w, y + h);
        triangle(x, y, w, h, p00, p10, p01, false);
        triangle(x, y, w, h, p10, p01, p11, true);
      }
    }
  }
  video.addEventListener('loadedmetadata', () => { video.currentTime = loopStart; });
  video.addEventListener('timeupdate', () => {
    if (requested && video.currentTime >= loopEnd) video.currentTime = loopStart;
  });
  const mouth = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  mouth.classList.add('pillow-mouth');
  mouth.setAttribute('viewBox', '0 0 960 552');
  mouth.setAttribute('preserveAspectRatio', 'xMaxYMid meet');
  mouth.setAttribute('aria-hidden', 'true');
  mouth.innerHTML = `
    <defs>
      <radialGradient id="pillow-eye-shade"><stop stop-color="#ad7458" stop-opacity=".25"/><stop offset="1" stop-color="#ad7458" stop-opacity="0"/></radialGradient>
      <linearGradient id="pillow-upper-lip" x2="0" y2="1"><stop stop-color="#a76158"/><stop offset="1" stop-color="#80473f"/></linearGradient>
      <linearGradient id="pillow-lower-lip" x2="0" y2="1"><stop stop-color="#d59683"/><stop offset=".5" stop-color="#c58576"/><stop offset="1" stop-color="#aa6d60"/></linearGradient>
    </defs>
    <g transform="translate(240 282) rotate(-90) scale(1.18 1.35)" stroke-linecap="round" stroke-linejoin="round">
      <ellipse cx="-24" cy="-45" rx="18" ry="10" fill="url(#pillow-eye-shade)"/>
      <ellipse cx="24" cy="-45" rx="18" ry="10" fill="url(#pillow-eye-shade)"/>
      <g fill="none">
        <path d="M-39-44C-32-40-22-39-11-43M11-43C22-39 32-40 39-44" stroke="#6b493b" stroke-width="1.8"/>
        <path d="M-38-43l-2 1m6 1-1.8 1.5m5-.6-1 1.3M38-43l2 1m-6 1 1.8 1.5m-5-.6 1 1.3" stroke="#684536" stroke-width=".75"/>
        <path d="M-36-48Q-25-52-14-47M14-47Q25-52 36-48" stroke="#a16f55" stroke-width=".65" opacity=".45"/>
        <g transform="translate(0 10) scale(.94 1.08)">
          <path d="M-39-55C-31-61-21-62-12-56Q-23-59-35-55Z M12-56C21-62 32-61 43-54L39-54Q25-59 12-56Z" fill="#76503b" opacity=".8"/>
          <path d="M-35-56l2-2m2 1 2-2m2 1 1.5-2m3 1 1-1.5m3 1 .5-1M40-55l-2-1.5M35-56l-2-2m-2 1-2-2m-2 1-1.5-2m-3 1-1-1.5m-3 1-.5-1" stroke="#5e3d2c" stroke-width=".55" opacity=".55"/>
        </g>
        <path d="M-3-39C-4-32-3-27-7-22Q-10-17-4-16M4-36Q3-27 7-22Q10-18 6-16" stroke="#ad7759" stroke-width=".8" opacity=".65"/>
        <path d="M-7-18Q-4-20-2-17M2-17Q5-20 7-18M-2-15Q0-14 2-15" stroke="#8d5b46" stroke-width=".95"/>
        <path d="M-1-32Q-2-26-2-22M-3-11l1 4m4-4-1 4" stroke="#fbd0ab" stroke-width="1.3" opacity=".6"/>
        <path d="M-8 11Q0 14 8 11" stroke="#a46d52" stroke-width=".7" opacity=".25"/>
      </g>
      <g transform="translate(0 -1) scale(1.35 1.05)">
      <path class="pillow-mouth__upper" fill="url(#pillow-upper-lip)"/>
      <path class="pillow-mouth__lower" fill="url(#pillow-lower-lip)"/>
      <path class="pillow-mouth__lips" fill="#694038"/>
      <path class="pillow-mouth__pencil" fill="none" stroke="#efb6a0" stroke-width=".75" opacity=".65"/>
      </g>
      <g class="pillow-nose-air" transform="translate(0 -18)" fill="none" stroke="#f8eee0" stroke-width="1.5" opacity="0">
        <path pathLength="1" stroke-dasharray=".28 .72" d="M-6 0C-18 3-24-4-34 0S-49 7-59 3"/>
        <path pathLength="1" stroke-dasharray=".24 .76" d="M6 0C18 3 24-4 34 0S49 7 59 3"/>
        <path pathLength="1" stroke-dasharray=".2 .8" stroke-width=".75" d="M9-2C22-1 29-8 41-5S54-1 65-5"/>
      </g>
    </g>`;
  stage.append(mouth);
  const lips = mouth.querySelector('.pillow-mouth__lips');
  const pencil = mouth.querySelector('.pillow-mouth__pencil');
  const upperLip = mouth.querySelector('.pillow-mouth__upper');
  const lowerLip = mouth.querySelector('.pillow-mouth__lower');
  const noseAir = mouth.querySelector('.pillow-nose-air');
  // Pillow redness sampled every quarter second from this exact video.
  const breath = [49,60,70,77,88,97,106,107,107,107,107,107,107,107,107,107,107,107,107,107,101,90,81,71,62,56,52,60,68,77,87,97,105,100,90,82,76,66,59,50,56,66,77,87,98,107,100,91,84,74,65,58,50,59,65,75,85,94,103,103,94,84,77,68,60,52,56,67,75,86,95,105,103,95,87,79,70,61,52,54,63,71,80,90,99,107,98,88,78,73,64,56,50,50,50,50];
  let mouthFrame;
  function animateMouth() {
    if (!requested || video.paused) return;
    const sample = Math.min(video.currentTime * 4, breath.length - 1);
    const index = Math.floor(sample);
    const redness = breath[index] + ((breath[index + 1] ?? breath[index]) - breath[index]) * (sample - index);
    const opening = .45 + 2.2 * Math.max(0, Math.min(1, (redness - 49) / 58));
    drawMouth(opening);
    const level = Math.max(0, Math.min(1, (redness - 49) / 58));
    drawBody(level);
    const exhaling = (breath[index + 1] ?? breath[index]) < breath[index];
    const exhaleProgress = 1 - level;
    noseAir.setAttribute('opacity', exhaling ? .8 * Math.sin(Math.PI * exhaleProgress) : 0);
    noseAir.setAttribute('stroke-dashoffset', 1 - exhaleProgress * 1.8);
    mouthFrame = requestAnimationFrame(animateMouth);
  }
  function drawMouth(opening) {
    lips.setAttribute('d', `M-11 0C-6 ${-opening} -3 ${-opening} 0 ${-opening * .65}C3 ${-opening} 6 ${-opening} 11 0Q0 ${opening * 1.7} -11 0Z`);
    upperLip.setAttribute('d', `M-11 0C-7 ${-opening - 2} -4 ${-opening - 4.1} -1.8 ${-opening - 2.5}Q0 ${-opening - 1} 1.8 ${-opening - 2.5}C4 ${-opening - 4.1} 7 ${-opening - 2} 11 0Q4 ${-opening} 0 ${-opening * .65}Q-4 ${-opening} -11 0Z`);
    lowerLip.setAttribute('d', `M-11 0Q0 ${opening * 1.7} 11 0C7 ${opening + 4.5} -7 ${opening + 4.5} -11 0Z`);
    pencil.setAttribute('d', `M-4 ${opening + 2.1}Q0 ${opening + 2.9} 4 ${opening + 1.9}`);
  }
  // Follow the original image's responsive geometry, including its right bleed.
  function layout() {
    video.style.left = `${cover.offsetLeft}px`;
    video.style.top = `${cover.offsetTop}px`;
    video.style.width = `${cover.offsetWidth}px`;
    video.style.height = `${cover.offsetHeight}px`;
    video.style.objectPosition = getComputedStyle(cover).objectPosition;
    video.style.transform = getComputedStyle(cover).transform;
    for (const property of ['left', 'top', 'width', 'height', 'transform']) {
      mouth.style[property] = video.style[property];
      body.style[property] = video.style[property];
    }
    body.style.objectPosition = video.style.objectPosition;
  }
  const resize = new ResizeObserver(layout);
  resize.observe(stage);
  resize.observe(cover);
  cover.addEventListener('load', layout);
  video.addEventListener('playing', () => {
    if (!requested) { stop(); return; }
    layout();
    lastBodyTime = -1;
    drawBody(0);
    cover.style.visibility = 'hidden';
    video.classList.add('is-playing');
    body.classList.add('is-playing');
    card.classList.add('pillow-playing');
    cancelAnimationFrame(mouthFrame);
    animateMouth();
  });
  video.addEventListener('error', () => {
    cancelAnimationFrame(mouthFrame);
    noseAir.setAttribute('opacity', 0);
    drawMouth(.45);
    cover.style.visibility = '';
    video.classList.remove('is-playing');
    body.classList.remove('is-playing');
    card.classList.remove('pillow-playing');
  });
  function stop() {
    cancelAnimationFrame(mouthFrame);
    noseAir.setAttribute('opacity', 0);
    drawMouth(.45);
    requested = false;
    attempt++;
    video.pause();
    if (video.readyState >= 1) video.currentTime = loopStart;
    cover.style.visibility = '';
    video.classList.remove('is-playing');
    body.classList.remove('is-playing');
    card.classList.remove('pillow-playing');
  }
  async function start() {
    if (requested) return;
    requested = true;
    const currentAttempt = ++attempt;
    if (video.readyState >= 1) video.currentTime = loopStart;
    video.muted = !soundEnabled;
    video.volume = 1;
    try {
      await video.play();
    } catch {
      if (!requested || currentAttempt !== attempt) return;
      video.muted = true;
      soundEnabled = false;
      updateSoundButton();
      try { await video.play(); } catch { /* Keep the original image visible. */ }
    }
  }
  function update() {
    if (!document.hidden && ((pointerInside && hover.matches) || card.classList.contains('mobile-card-visible') || card.matches(':focus-within'))) start();
    else stop();
  }
  card.addEventListener('pointerenter', () => { pointerInside = true; update(); });
  card.addEventListener('cardvisibilitychange', update);
  card.addEventListener('pointerleave', () => {
    pointerInside = false;
    // A mouse click leaves the sound button focused; end the hover preview anyway.
    if (hover.matches) {
      if (document.activeElement === soundButton) soundButton.blur();
      stop();
    } else update();
  });
  card.addEventListener('focusin', update);
  card.addEventListener('focusout', () => setTimeout(update, 0));
  hover.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  drawMouth(.45);
  layout();
})();
