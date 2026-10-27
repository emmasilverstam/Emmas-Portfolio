document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll('.feature__media, .feature__text');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    revealTargets.forEach(target => observer.observe(target));
  } else {
    revealTargets.forEach(target => target.classList.add('in-view'));
  }

  document.querySelectorAll('.benefit-player').forEach(player => {
    const video = player.querySelector('video');
    const button = player.querySelector('.benefit-play');
    let hasStarted = false;
    const showButton = () => {
      video.controls = hasStarted;
      button.hidden = hasStarted;
    };
    button.addEventListener('click', () => {
      if (video.ended) video.currentTime = 0;
      video.play().catch(showButton);
    });
    video.addEventListener('play', () => {
      hasStarted = true;
      button.hidden = true;
      video.controls = true;
    });
    video.addEventListener('pause', showButton);
    video.addEventListener('ended', showButton);
    showButton();
  });
});
