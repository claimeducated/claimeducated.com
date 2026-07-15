// Loads the shared header and footer into every page, so nav/footer changes
// only ever need to be made in header.html and footer.html, not per-page.
(async function () {
  const headerSlot = document.getElementById('site-header-slot');
  const footerSlot = document.getElementById('site-footer-slot');

  async function inject(slot, url) {
    if (!slot) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load ' + url);
      slot.outerHTML = await res.text();
    } catch (err) {
      console.error('Include failed:', err);
    }
  }

  await Promise.all([
    inject(headerSlot, 'header.html'),
    inject(footerSlot, 'footer.html'),
  ]);

  // Mark the current page's nav link as active, based on the current URL,
  // instead of hardcoding it per page.
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-nav]').forEach((link) => {
    if (link.getAttribute('data-nav') === currentPage) {
      link.classList.add('active');
    }
  });

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (bound here since the buttons don't exist until injection completes)
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.querySelector('.nav-mobile-close');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => mobileNav.classList.add('open'));
  }
  if (closeBtn && mobileNav) {
    closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  }
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
})();
