/* ============================================================
   ClaimEducated™ — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky nav scroll state ─────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Active nav link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile nav toggle ───────────────────────────────────── */
  const toggle  = document.querySelector('.nav-toggle');
  const overlay = document.querySelector('.nav-mobile-overlay');
  const close   = document.querySelector('.nav-mobile-close');

  if (toggle && overlay) {
    toggle.addEventListener('click', () => overlay.classList.add('open'));
  }
  if (close && overlay) {
    close.addEventListener('click', () => overlay.classList.remove('open'));
  }
  // Close on link click
  document.querySelectorAll('.nav-mobile-overlay a').forEach(a => {
    a.addEventListener('click', () => overlay && overlay.classList.remove('open'));
  });

  /* ── Scroll reveal ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Smooth in-page anchor scrolling ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

 /* — Contact form (Cloudflare Worker) — */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://claimeducated-contact-worker.claimeducated.workers.dev', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        showToast('Message sent! We\'ll be in touch shortly.');
        contactForm.reset();
      } else {
        showToast('Something went wrong. Please try again.');
      }
    } catch (err) {
      showToast('Something went wrong. Please try again.');
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

  /* ── Toast notification ───────────────────────────────────── */
  window.showToast = (msg) => {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position:fixed; bottom:2rem; right:2rem; z-index:9999;
        background:#0d1f3c; color:#fff; padding:1rem 1.5rem;
        border-radius:8px; font-size:0.9rem; border-left:3px solid #c9a84c;
        box-shadow:0 8px 32px rgba(0,0,0,0.25); opacity:0;
        transform:translateY(12px); transition:all 0.3s ease;
        max-width:320px; line-height:1.5;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 4000);
  };

  /* ── Newsletter form (footer) ─────────────────────────────── */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thanks for subscribing! Check your inbox.');
      newsletterForm.reset();
    });
  }

  /* ── Animated counter (hero stats) ───────────────────────── */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Trigger counters when hero enters view
  const heroTrust = document.querySelector('.hero-trust');
  if (heroTrust && 'IntersectionObserver' in window) {
    const counter_io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counter_io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counter_io.observe(heroTrust);
  }

});
