/* =========================================================
   Comrade / Portfolio interactions
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Header stuck state ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Active navigation link ---------- */
  var nav = document.getElementById('nav');
  var page = document.body.dataset.page;
  if (nav && page) {
    var target = page === 'home' ? 'index.html' : page + '.html';
    nav.querySelectorAll('a').forEach(function (link) {
      if (link.getAttribute('href') === target) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- Menu ---------- */
  var menuBtn = document.getElementById('menu-btn');

  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
  }

  if (nav) {
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
  }

  document.addEventListener('click', function (event) {
    if (!menuBtn || !nav) return;
    if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
    if (event.target.closest('#menu-btn') || event.target.closest('#nav')) return;
    setMenu(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement ? Array.prototype.slice.call(el.parentElement.children) : [];
        var index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index * 60, 320) + 'ms';
        el.classList.add('in');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var start = performance.now();
        var duration = 1000;
        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(target * eased));
          if (p < 1) window.requestAnimationFrame(tick);
        }
        window.requestAnimationFrame(tick);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Copy-to-clipboard buttons (Discord username) ---------- */
  document.querySelectorAll('.copy-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.dataset.copy || '';
      var done = function () {
        var previous = button.textContent;
        button.textContent = 'Copied!';
        window.setTimeout(function () { button.textContent = previous; }, 1600);
      };
      var copyFallback = function () {
        var input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try { document.execCommand('copy'); } catch (error) {}
        document.body.removeChild(input);
      };

      done();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(copyFallback);
      } else {
        copyFallback();
      }
    });
  });

  /* ---------- Ambient 3D background ---------- */
  function initBackground() {
    var canvas = document.createElement('canvas');
    canvas.id = 'bg-3d';
    document.body.insertBefore(canvas, document.body.firstChild);

    if (!window.THREE) {
      document.body.classList.add('no-webgl');
      return;
    }

    try {
      var smallScreen = window.innerWidth < 700;
      var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#e08a52';
      var color = new THREE.Color(accent);

      var scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0f0e0c, 0.075);

      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 7;

      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !smallScreen,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallScreen ? 1 : 1.5));
      renderer.setClearColor(0x000000, 0);

      var group = new THREE.Group();

      var wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.6, 1)),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.18 })
      );
      group.add(wire);

      var points = new THREE.Points(
        new THREE.IcosahedronGeometry(3.4, 2),
        new THREE.PointsMaterial({ color: color, size: 0.022, transparent: true, opacity: 0.3, sizeAttenuation: true })
      );
      group.add(points);

      var ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.7, 0.006, 6, 120),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.1 })
      );
      ring.rotation.x = 1.1;
      group.add(ring);

      scene.add(group);

      function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var narrow = width < 700;
        group.position.set(narrow ? 0 : 2.4, narrow ? 1.1 : 0.6, 0);
        group.scale.setScalar(narrow ? 0.72 : 1);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.render(scene, camera);
      }
      resize();
      window.addEventListener('resize', resize);

      var pointer = { x: 0, y: 0 };
      window.addEventListener('pointermove', function (event) {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });

      if (reduceMotion) {
        renderer.render(scene, camera);
        return;
      }

      var running = true;
      var frame = null;

      function draw() {
        if (frame !== null) return;
        frame = window.requestAnimationFrame(tick);
      }

      function tick() {
        frame = null;
        if (!running) return;
        group.rotation.y += 0.0012;
        group.rotation.x += (pointer.y * 0.08 - group.rotation.x) * 0.02;
        group.rotation.z += 0.0003;
        camera.position.x += (pointer.x * 0.25 - camera.position.x) * 0.02;
        camera.position.y += (-pointer.y * 0.18 - camera.position.y) * 0.02;
        renderer.render(scene, camera);
        draw();
      }

      document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        if (running) draw();
        else if (frame !== null) {
          window.cancelAnimationFrame(frame);
          frame = null;
        }
      });

      draw();
    } catch (error) {
      document.body.classList.add('no-webgl');
      canvas.remove();
    }
  }

  var threeScript = document.createElement('script');
  threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  threeScript.onload = initBackground;
  threeScript.onerror = function () { document.body.classList.add('no-webgl'); };
  document.head.appendChild(threeScript);
})();
