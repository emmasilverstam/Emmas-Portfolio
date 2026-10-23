document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.result-player').forEach(player => {
    const video = player.querySelector('video');
    const button = player.querySelector('.result-play');
    if (!video || !button) return;
    video.controls = false;
    button.addEventListener('click', () => {
      video.controls = true;
      video.play().catch(() => {
        player.classList.remove('is-playing');
      });
    });
    video.addEventListener('play', () => player.classList.add('is-playing'));
    video.addEventListener('pause', () => player.classList.remove('is-playing'));
    video.addEventListener('ended', () => player.classList.remove('is-playing'));
  });
});
