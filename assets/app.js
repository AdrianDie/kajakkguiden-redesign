(function () {
  'use strict';
  var d = document;

  /* meny-overlay */
  var menu = d.getElementById('menu');
  var openBtn = d.querySelector('.menu-btn');
  var closeBtn = d.querySelector('.menu-close');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    d.body.classList.toggle('menu-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && closeBtn) closeBtn.focus();
    if (!open && openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false);
  });
  if (menu) menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { d.body.classList.remove('menu-open'); }
  });

  /* lett parallakse i footer-lagene */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ft = d.querySelector('.site-footer');
  var layers = d.querySelectorAll('.fl');
  if (ft && layers.length && !reduce) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var r = ft.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (r.height + vh * 0.3)));
      for (var i = 0; i < layers.length; i++) {
        var depth = (i + 1) * 5;
        layers[i].style.transform = 'translate3d(0,' + ((1 - p) * depth).toFixed(1) + 'px,0)';
      }
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* lysboks i galleriet */
  var lb = d.getElementById('lb');
  if (lb && lb.showModal) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    d.querySelectorAll('[data-full]').forEach(function (b) {
      b.addEventListener('click', function () {
        lbImg.src = b.getAttribute('data-full');
        lbImg.alt = b.getAttribute('data-alt') || '';
        lbCap.textContent = b.getAttribute('data-alt') || '';
        lb.showModal();
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-in')) lb.close(); });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('close', function () { lbImg.removeAttribute('src'); });
  }

  /* pakkliste: lagres i nettleseren */
  var boxes = d.querySelectorAll('.pack input[type=checkbox]');
  if (boxes.length) {
    var KEY = 'kajakkguiden-pakkliste';
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { saved = {}; }
    boxes.forEach(function (b) {
      if (saved[b.id]) b.checked = true;
      b.addEventListener('change', function () {
        saved[b.id] = b.checked;
        try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* privat modus */ }
      });
    });
    var reset = d.getElementById('pack-reset');
    if (reset) reset.addEventListener('click', function () {
      boxes.forEach(function (b) { b.checked = false; });
      try { localStorage.removeItem(KEY); } catch (e) { /* ignorer */ }
    });
  }
})();
