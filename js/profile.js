// js/profile.js
(() => {
  'use strict';

  /* ---------------------------------------------------------
     Theme toggle — remembers the choice, defaults to the OS
     --------------------------------------------------------- */
  const THEME_KEY = 'ea-theme';
  const root = document.documentElement;

  const readStoredTheme = () => {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  };
  const storeTheme = (value) => {
    try { localStorage.setItem(THEME_KEY, value); } catch { /* private mode */ }
  };

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
     Tabs — accessible tablist with keyboard support
     --------------------------------------------------------- */
  const initTabs = () => {
    const tabs = Array.from(document.querySelectorAll('.tabs [role="tab"]'));
    const panels = Array.from(document.querySelectorAll('.tab-content'));
    if (!tabs.length || !panels.length) return;

    const activate = (tab, { setFocus = false, updateHash = true } = {}) => {
      if (!tab) return;
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle('active', selected);
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
      });

      panels.forEach((p) => p.classList.toggle('active', p.id === target));

      if (setFocus) tab.focus();

      if (updateHash && window.history.replaceState) {
        window.history.replaceState(null, '', `#${target}`);
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activate(tab));

      tab.addEventListener('keydown', (event) => {
        const index = tabs.indexOf(tab);
        let next = null;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            next = tabs[(index + 1) % tabs.length];
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            next = tabs[(index - 1 + tabs.length) % tabs.length];
            break;
          case 'Home':
            next = tabs[0];
            break;
          case 'End':
            next = tabs[tabs.length - 1];
            break;
          default:
            return;
        }

        event.preventDefault();
        activate(next, { setFocus: true });
      });
    });

    // Deep-link support: profile.html#projects opens that tab directly.
    const fromHash = window.location.hash.replace('#', '');
    const matching = tabs.find((t) => t.dataset.tab === fromHash);
    if (matching) activate(matching, { updateHash: false });
  };

  /* --------------------------------------------------------- */
  const start = () => {
    initThemeToggle();
    initTabs();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
