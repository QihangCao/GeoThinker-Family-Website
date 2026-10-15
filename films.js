(() => {
  'use strict';
  const dialog = document.querySelector('#film-viewer');
  const player = document.querySelector('#research-player');
  const captions = document.querySelector('#film-captions');
  let trigger = null;
  document.querySelectorAll('[data-film]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog?.showModal) return;
      event.preventDefault();
      trigger = link;
      document.querySelector('#film-title').textContent = link.dataset.filmTitle;
      document.querySelector('#film-length').textContent = link.dataset.filmDuration;
      player.setAttribute('aria-label', `${link.dataset.filmTitle} research film`);
      player.poster = link.dataset.filmPoster;
      captions.src = link.dataset.filmCaptions;
      player.src = link.href;
      document.body.classList.add('film-open');
      dialog.showModal();
      player.play().catch(() => { /* Native controls remain available if playback needs another tap. */ });
    });
  });
  document.querySelector('#film-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    player.pause();
    player.removeAttribute('src');
    captions.removeAttribute('src');
    player.load();
    document.body.classList.remove('film-open');
    trigger?.focus({preventScroll: true});
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) player.pause(); });
  addEventListener('pagehide', () => player.pause());
})();
