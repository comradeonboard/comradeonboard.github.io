// Shared behavior for every page. No dependencies.
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });
  }

  // Highlight the current page in the navigation
  var page = document.body.dataset.page;
  if (page && nav) {
    var links = nav.querySelectorAll('a:not(.btn)');
    var target = page === 'home' ? 'index.html' : page + '.html';
    links.forEach(function (link) {
      if (link.getAttribute('href') === target) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // Subtle pointer-driven 3D tilt on the hero cube (desktop only)
  var visual = document.querySelector('.hero-visual');
  if (visual && finePointer && !reduceMotion) {
    visual.addEventListener('pointermove', function (event) {
      var rect = visual.getBoundingClientRect();
      var dx = (event.clientX - rect.left) / rect.width - 0.5;
      var dy = (event.clientY - rect.top) / rect.height - 0.5;
      visual.style.setProperty('--tilt-x', (-8 - dy * 12).toFixed(2) + 'deg');
      visual.style.setProperty('--tilt-y', (dx * 18).toFixed(2) + 'deg');
    });
    visual.addEventListener('pointerleave', function () {
      visual.style.setProperty('--tilt-x', '-8deg');
      visual.style.setProperty('--tilt-y', '0deg');
    });
  }

  // Gentle 3D tilt on cards
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.classList.add('tilt-ready');
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var dx = (event.clientX - rect.left) / rect.width - 0.5;
        var dy = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty('--rx', (-dy * 4).toFixed(2) + 'deg');
        card.style.setProperty('--ry', (dx * 4).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Copy-to-clipboard buttons (Discord username)
  document.querySelectorAll('.copy-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.dataset.copy || '';
      var done = function () {
        var previous = button.textContent;
        button.textContent = 'Copied!';
        window.setTimeout(function () { button.textContent = previous; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done).catch(function () {});
      } else {
        var input = document.createElement('textarea');
        input.value = value;
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); done(); } catch (error) {}
        document.body.removeChild(input);
      }
    });
  });
})();
