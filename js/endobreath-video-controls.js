document.addEventListener('DOMContentLoaded', () => {
  const player = document.querySelector('.endobreath-player');
  if (!player) return;
  const video = player.querySelector('video');
  const button = player.querySelector('.endobreath-play');
  if (!video || !button) return;

  const showPlayButton = () => {
    video.controls = false;
    button.hidden = false;
  };
  button.addEventListener('click', () => {
    if (video.ended) video.currentTime = 0;
    video.play().catch(showPlayButton);
  });
  video.addEventListener('play', () => {
    button.hidden = true;
    video.controls = true;
  });
  video.addEventListener('pause', showPlayButton);
  video.addEventListener('ended', showPlayButton);
  showPlayButton();
});
