// Shared behavior for every page. No build step.
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var background3D = null;

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  function update3DColors() {
    if (!background3D || !window.THREE) return;
    var accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#6aa1ff';
    background3D.wire.material.color.set(accent);
    background3D.points.material.color.set(accent);
    background3D.renderer.render(background3D.scene, background3D.camera);
  }

  var nav = document.getElementById('site-nav');

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

  // Live background 3D scene. Falls back to a CSS animation when WebGL is unavailable.
  function load3DBackground() {
    var canvas = document.createElement('canvas');
    canvas.id = 'bg-3d';
    document.body.insertBefore(canvas, document.body.firstChild);

    if (!window.THREE) {
      document.body.classList.add('no-webgl');
      return;
    }

    try {
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 6;

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.setClearColor(0x000000, 0);

      var group = new THREE.Group();
      var globe = new THREE.IcosahedronGeometry(2.35, 2);
      var wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(globe),
        new THREE.LineBasicMaterial({ color: 0x6aa1ff, transparent: true, opacity: 0.26 })
      );
      var dust = new THREE.Points(
        new THREE.IcosahedronGeometry(3.1, 3),
        new THREE.PointsMaterial({ color: 0x6aa1ff, size: 0.028, transparent: true, opacity: 0.5 })
      );
      group.add(wire);
      group.add(dust);
      scene.add(group);

      background3D = { scene: scene, camera: camera, renderer: renderer, group: group, wire: wire, points: dust };
      update3DColors();

      var pointer = { x: 0, y: 0 };
      window.addEventListener('pointermove', function (event) {
        pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      });
      window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
      });

      if (reduceMotion) {
        renderer.render(scene, camera);
        return;
      }

      function tick() {
        group.rotation.y += 0.0016;
        group.rotation.x += (pointer.y * 0.12 - group.rotation.x) * 0.03;
        camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03;
        camera.position.y += (-pointer.y * 0.25 - camera.position.y) * 0.03;
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      }
      tick();
    } catch (error) {
      document.body.classList.add('no-webgl');
    }
  }

  var threeScript = document.createElement('script');
  threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  threeScript.onload = load3DBackground;
  threeScript.onerror = function () { document.body.classList.add('no-webgl'); };
  document.head.appendChild(threeScript);
})();
