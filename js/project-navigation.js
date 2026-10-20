document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.site-header .hamburger-menu');
  const links = document.querySelector('#primary-nav');
  if (!menu || !links) return;
  const navigation = menu.closest('nav');
  let scrollAnchor = window.scrollY;
  window.addEventListener('scroll', () => {
    const current = Math.max(0, window.scrollY);
    if (current < 180) {
      navigation.classList.remove('nav-floating');
      scrollAnchor = current;
      return;
    }
    if (Math.abs(current - scrollAnchor) < 8) return;
    navigation.classList.toggle('nav-floating', current < scrollAnchor);
    scrollAnchor = current;
  }, { passive: true });
  const sync = () => menu.setAttribute('aria-expanded', String(links.classList.contains('active')));
  new MutationObserver(sync).observe(links, { attributes: true, attributeFilter: ['class'] });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      menu.click();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('active')) {
      links.classList.remove('active');
      menu.classList.remove('active');
      menu.focus();
    }
  });
});
