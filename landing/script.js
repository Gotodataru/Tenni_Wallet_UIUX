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
    phone.addEventListener('click', () => {
      apply(current === 'dark' ? 'light' : 'dark');
      if (navigator.vibrate) navigator.vibrate(15);
    });
  }

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