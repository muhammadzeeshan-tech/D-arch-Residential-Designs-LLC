(function () {
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');

  // sticky header shadow
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  // sub menus on touch / small screens
  document.querySelectorAll('.has-sub > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width: 900px)').matches || a.getAttribute('href') === '#') {
        e.preventDefault();
        var li = a.parentElement;
        var was = li.classList.contains('open');
        document.querySelectorAll('.has-sub.open').forEach(function (x) { x.classList.remove('open'); });
        if (!was) li.classList.add('open');
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) {
      document.querySelectorAll('.has-sub.open').forEach(function (x) { x.classList.remove('open'); });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.has-sub.open').forEach(function (x) { x.classList.remove('open'); });
  });

  // drag-to-scroll project slider
  var s = document.querySelector('.slider'), down = false, sx = 0, sl = 0;
  s.addEventListener('pointerdown', function (e) { down = true; sx = e.pageX; sl = s.scrollLeft; });
  window.addEventListener('pointerup', function () { down = false; });
  s.addEventListener('pointermove', function (e) { if (down) s.scrollLeft = sl - (e.pageX - sx); });

  // count-up stats
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var counters = document.querySelectorAll('.count');
  function run(el) {
    var t = +el.dataset.target;
    if (reduce) { el.textContent = t; return; }
    var start = null;
    (function step(ts) {
      start = start || ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.round(t * p);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } });
    }, { threshold: .4 });
    counters.forEach(function (c) { io.observe(c); });
  } else { counters.forEach(run); }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
