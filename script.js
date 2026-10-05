(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js-ready');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuToggle = document.querySelector('#menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');

  function setMenuOpen(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileMenu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  }

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  document.querySelectorAll('a[data-scroll]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      setMenuOpen(false);
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', targetId);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const demo = document.querySelector('#route-demo');
  const blockToggle = document.querySelector('#block-toggle');
  const resetDemo = document.querySelector('#reset-demo');
  const routeStatus = document.querySelector('#route-status');
  const routeExit = document.querySelector('#route-exit');
  const routeDistance = document.querySelector('#route-distance');
  const routeCost = document.querySelector('#route-cost');
  const routeSequence = document.querySelector('#route-sequence');
  const toggleLabel = document.querySelector('#toggle-label');

  function setDemoBlocked(blocked) {
    if (!demo || !blockToggle) return;
    demo.dataset.state = blocked ? 'rerouted' : 'clear';
    blockToggle.setAttribute('aria-pressed', String(blocked));
    if (routeStatus) routeStatus.textContent = blocked ? 'Rerouted around C2' : 'Clear route';
    if (routeExit) routeExit.textContent = blocked ? 'E2' : 'E1';
    if (routeDistance) routeDistance.textContent = blocked ? '4 connections' : '3 connections';
    if (routeCost) routeCost.textContent = blocked ? '11' : '7';
    if (routeSequence) routeSequence.innerHTML = blocked
      ? 'R1 <i>→</i> C1 <i>→</i> C3 <i>→</i> C4 <i>→</i> E2'
      : 'R1 <i>→</i> C1 <i>→</i> C2 <i>→</i> E1';
    if (toggleLabel) toggleLabel.textContent = blocked ? 'Restore corridor C2' : 'Block corridor C2';
  }

  blockToggle?.addEventListener('click', () => {
    setDemoBlocked(blockToggle.getAttribute('aria-pressed') !== 'true');
  });
  resetDemo?.addEventListener('click', () => setDemoBlocked(false));

  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());

  const shareText = encodeURIComponent('Explore Smart Escape — a clear, local route simulation for building safety practice.');
  const currentUrl = encodeURIComponent(window.location.href);
  const shareX = document.querySelector('#share-x');
  const shareLinkedIn = document.querySelector('#share-linkedin');
  if (shareX) shareX.href = `https://x.com/intent/post?text=${shareText}&url=${currentUrl}`;
  if (shareLinkedIn) shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
})();
