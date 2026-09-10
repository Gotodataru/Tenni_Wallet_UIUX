(function () {
  'use strict';

  const root = document.documentElement;
  const phone = document.getElementById('phone');
  const toggle = document.getElementById('themeToggle');
  const labels = toggle ? toggle.querySelectorAll('.t-label') : [];

  // Initial theme
  let current = root.getAttribute('data-theme') || 'dark';
  apply(current);

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (phone) {
      phone.classList.remove('phone-dark', 'phone-light');
      phone.classList.add(theme === 'light' ? 'phone-light' : 'phone-dark');
    }
    labels.forEach((l, i) => {
      l.classList.toggle('is-active', (theme === 'dark' && i === 0) || (theme === 'light' && i === 1));
    });
    current = theme;
  }

  // Toggle button
  if (toggle) {
    toggle.addEventListener('click', () => {
      apply(current === 'dark' ? 'light' : 'dark');
      if (navigator.vibrate) navigator.vibrate(8);
    });
  }

  // Click on phone → flip theme
  if (phone) {
    phone.addEventListener('click', (e) => {
      // Ignore clicks on inner interactive elements
      if (e.target.closest('button, a, [role="button"]')) return;
      apply(current === 'dark' ? 'light' : 'dark');
      if (navigator.vibrate) navigator.vibrate(15);
    });
  }

  // Keyboard shortcut: T
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) || e.key.toLowerCase() === 't' && !e.target.matches('input, textarea')) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const btn = document.querySelector('.gf-btn');
        if (btn) btn.focus();
        return;
      }
    }
  });

  // Tabbar per phone
  document.querySelectorAll('.tabbar').forEach((bar) => {
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab');
      if (!btn) return;
      bar.querySelectorAll('.tab').forEach((t) => t.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (navigator.vibrate) navigator.vibrate(8);
    });
  });

  // Balance eye toggle
  document.querySelectorAll('[data-eye]').forEach((eye) => {
    const phone2 = eye.closest('.phone');
    const bal = phone2 && phone2.querySelector('[data-balance]');
    if (!bal) return;
    let shown = true;
    const original = bal.innerHTML;
    eye.addEventListener('click', (ev) => {
      ev.stopPropagation();
      shown = !shown;
      bal.innerHTML = shown ? original : '$••,•••.<em>••</em>';
    });
  });

  // Quick actions feedback
  document.querySelectorAll('.qa').forEach((b) => {
    b.addEventListener('click', (ev) => {
      ev.stopPropagation();
      b.style.transform = 'scale(.96)';
      setTimeout(() => (b.style.transform = ''), 140);
      if (navigator.vibrate) navigator.vibrate(10);
    });
  });

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();