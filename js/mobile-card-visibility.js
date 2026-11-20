(() => {
  const cards = document.querySelectorAll('.home-page .gallery__item');
  const touch = matchMedia('(hover: none), (pointer: coarse)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.dataset.cardVisible = entry.isIntersecting && entry.intersectionRatio >= .5 ? 'true' : 'false';
      refresh(entry.target);
    });
  }, { threshold: [0, .5] });
  function refresh(card) {
    const active = touch.matches && !reduced.matches && card.dataset.cardVisible === 'true';
    if (card.classList.contains('mobile-card-visible') === active) return;
    card.classList.toggle('mobile-card-visible', active);
    card.dispatchEvent(new Event('cardvisibilitychange'));
  }
  cards.forEach(card => observer.observe(card));
  const refreshAll = () => cards.forEach(refresh);
  touch.addEventListener('change', refreshAll);
  reduced.addEventListener('change', refreshAll);
})();
