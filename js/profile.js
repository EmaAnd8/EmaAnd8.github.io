// js/profile.js
document.addEventListener('DOMContentLoaded', () => {
  const tabs     = document.querySelectorAll('.tabs button');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      contents.forEach(c =>
        c.id === target
          ? c.classList.add('active')
          : c.classList.remove('active')
      );
    });
  });
});

