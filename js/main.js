// js/main.js
(() => {
  'use strict';

  /* ---------------------------------------------------------
     Theme — same storage key as js/profile.js, so the choice
     carries across pages.
     --------------------------------------------------------- */
  const THEME_KEY = 'ea-theme';
  const root = document.documentElement;

  const readStoredTheme = () => {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  };
  const storeTheme = (value) => {
    try { localStorage.setItem(THEME_KEY, value); } catch { /* private mode */ }
  };

  // Applied immediately so there is no flash of the wrong theme.
  const stored = readStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  }

  const initThemeToggle = () => {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      storeTheme(next);
      toggle.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
    });
  };

  /* ---------------------------------------------------------
     Scroll reveal — progressive enhancement only.
     --------------------------------------------------------- */
  const initReveal = () => {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No IntersectionObserver, or the visitor prefers less motion:
    // show everything straight away.
    if (reducedMotion || !('IntersectionObserver' in window)) {
      document.body.classList.add('reveal-off');
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Small stagger so a row of cards arrives in sequence.
        entry.target.style.transitionDelay = `${Math.min(i, 4) * 70}ms`;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  };

  /* ---------------------------------------------------------
     Header shadow once the page is scrolled.
     --------------------------------------------------------- */
  const initHeaderState = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  };

  /* --------------------------------------------------------- */
  const start = () => {
    initThemeToggle();
    initReveal();
    initHeaderState();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
