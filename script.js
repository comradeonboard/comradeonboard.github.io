/* =========================================================
   Comrade / Portfolio interactions
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var themeBtn = document.getElementById('theme-btn');
  var themeMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, save) {
    var next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', 'Switch to ' + (next === 'light' ? 'dark' : 'light') + ' theme');
    }
    if (themeMeta) {
      themeMeta.setAttribute('content', next === 'light' ? '#f6f3ee' : '#0f0e0c');
    }
    if (save) {
      try { localStorage.setItem('comrade-theme', next); } catch (error) {}
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  applyTheme(document.documentElement.getAttribute('data-theme') || 'dark', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
    });
  }

  window.addEventListener('storage', function (event) {
    if (event.key === 'comrade-theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
      applyTheme(event.newValue, false);
    }
  });

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
      var rootStyle = getComputedStyle(document.documentElement);
      var accent = rootStyle.getPropertyValue('--accent').trim() || '#e08a52';
      var bg = rootStyle.getPropertyValue('--bg').trim() || '#0f0e0c';
      var faint = rootStyle.getPropertyValue('--faint').trim() || '#78736a';
      var color = new THREE.Color(accent);

      var scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(new THREE.Color(bg), 0.075);

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

      /* Small crypto chart in the ambient scene */
      var cryptoGroup = new THREE.Group();
      var cryptoDim = new THREE.Color(faint);
      var cryptoBaseY = -1.5;
      var tickCount = 0;
      var coin;

      var candles = [
        { o: 0.00, c: 0.28, h: 0.38, l: -0.08 },
        { o: 0.28, c: 0.18, h: 0.36, l: 0.10 },
        { o: 0.18, c: 0.46, h: 0.52, l: 0.14 },
        { o: 0.46, c: 0.40, h: 0.58, l: 0.32 },
        { o: 0.40, c: 0.64, h: 0.72, l: 0.34 },
        { o: 0.64, c: 0.56, h: 0.76, l: 0.48 },
        { o: 0.56, c: 0.82, h: 0.90, l: 0.52 },
        { o: 0.82, c: 0.74, h: 0.96, l: 0.66 },
        { o: 0.74, c: 1.02, h: 1.12, l: 0.70 }
      ];

      var upMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.22 });
      var downMaterial = new THREE.MeshBasicMaterial({ color: cryptoDim, transparent: true, opacity: 0.2 });
      var wickMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.14 });
      var trendPoints = [];

      candles.forEach(function (candle, index) {
        var x = (index - (candles.length - 1) / 2) * 0.36;
        var isUp = candle.c >= candle.o;
        var bodyHeight = Math.max(Math.abs(candle.c - candle.o), 0.09);

        var body = new THREE.Mesh(new THREE.BoxGeometry(0.16, bodyHeight, 0.02), isUp ? upMaterial : downMaterial);
        body.position.set(x, (candle.o + candle.c) / 2, 0);
        cryptoGroup.add(body);

        var wick = new THREE.Mesh(new THREE.BoxGeometry(0.012, candle.h - candle.l, 0.012), wickMaterial);
        wick.position.set(x, (candle.h + candle.l) / 2, -0.01);
        cryptoGroup.add(wick);

        trendPoints.push(new THREE.Vector3(x, candle.c + 0.07, 0.03));
      });

      var trend = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(trendPoints),
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.28 })
      );
      cryptoGroup.add(trend);

      var axisPoints = [
        new THREE.Vector3(-1.6, -0.22, 0), new THREE.Vector3(1.6, -0.22, 0)
      ];
      [-0.72, 0, 0.72].forEach(function (x) {
        axisPoints.push(new THREE.Vector3(x, -0.22, 0), new THREE.Vector3(x, 0.92, 0));
      });
      var axisMaterial = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.08 });
      cryptoGroup.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(axisPoints),
        axisMaterial
      ));

      coin = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.012, 6, 48),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.24 })
      );
      var lastPoint = trendPoints[trendPoints.length - 1];
      coin.position.set(lastPoint.x, lastPoint.y + 0.26, 0.05);
      cryptoGroup.add(coin);
      scene.add(cryptoGroup);

      var accentMaterials = [
        wire.material, points.material, ring.material,
        upMaterial, wickMaterial, trend.material, axisMaterial, coin.material
      ];

      function syncSceneColors() {
        var styles = getComputedStyle(document.documentElement);
        var nextAccent = styles.getPropertyValue('--accent').trim() || '#e08a52';
        var nextBg = styles.getPropertyValue('--bg').trim() || '#0f0e0c';
        var nextFaint = styles.getPropertyValue('--faint').trim() || '#78736a';
        accentMaterials.forEach(function (material) { material.color.set(nextAccent); });
        scene.fog.color.set(nextBg);
        cryptoDim.set(nextFaint);
        downMaterial.color.set(nextFaint);
        renderer.render(scene, camera);
      }

      document.addEventListener('themechange', syncSceneColors);

      function resize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var narrow = width < 700;
        group.position.set(narrow ? 0 : 2.4, narrow ? 1.1 : 0.6, 0);
        group.scale.setScalar(narrow ? 0.72 : 1);
        cryptoBaseY = narrow ? -1.9 : -1.5;
        cryptoGroup.position.set(narrow ? -0.4 : -2.9, cryptoBaseY, 0);
        cryptoGroup.scale.setScalar(narrow ? 0.62 : 0.85);
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
        tickCount += 1;
        cryptoGroup.position.y = cryptoBaseY + Math.sin(tickCount * 0.012) * 0.05;
        cryptoGroup.rotation.z = Math.sin(tickCount * 0.008) * 0.025;
        coin.rotation.z += 0.012;
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
