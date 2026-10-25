/* Hiệu ứng game cho ebook: thanh EXP, LEVEL UP + mưa xu khi đọc hết chương, khối chữ bật ra khi cuộn,
   tung xu khi bấm nút, đánh dấu ngày đã qua trên mục lục. Đi kèm phần CSS trong theme-game/_fx.css.
   Tự sinh vào assets/ bởi them-theme-game.mjs — sửa ở theme-game/game-fx.js. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.innerWidth < 600;
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var KEY = 'gfx-cleared';
  var cleared = [];
  try { cleared = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) {}

  /* ---------- Thanh EXP ---------- */
  var exp = document.createElement('div');
  exp.id = 'gfx-exp';
  exp.setAttribute('aria-hidden', 'true');
  exp.innerHTML = '<i></i><b>EXP 0%</b>';
  document.body.appendChild(exp);
  var bar = exp.firstChild, label = exp.lastChild, ticking = false;
  function updateExp() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 1;
    bar.style.setProperty('--p', p.toFixed(4));
    label.textContent = 'EXP ' + Math.round(p * 100) + '%';
    exp.classList.toggle('show', p > 0.02);
    if (p > 0.985) levelUp();
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateExp); }
  }, { passive: true });
  addEventListener('resize', updateExp);

  /* ---------- Khối chữ bật ra khi cuộn tới ---------- */
  var body = document.querySelector('.ch-body');
  if (body && !reduce && 'IntersectionObserver' in window) {
    var SEL = 'p, li, h3.ch-sub, .say, figure, .ch-fig, .magic-task, .gift-card, .quote-gold, .quote-sweep, .wisdom, .infog';
    var all = [].slice.call(body.querySelectorAll(SEL));
    var picked = all.filter(function (el) {
      for (var a = el.parentElement; a && a !== body; a = a.parentElement) if (a.matches(SEL)) return false;
      return !el.closest('svg');
    });
    var kind = function (el) {
      if (el.matches('.magic-task, .gift-card')) return 'gfx-pop';
      if (el.matches('figure, .ch-fig, .infog')) return 'gfx-zoom';
      if (el.matches('.quote-gold, .quote-sweep, .wisdom, .say')) return 'gfx-tilt';
      if (el.matches('li, h3.ch-sub')) return 'gfx-left';
      return 'gfx-up';
    };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('gfx-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    picked.forEach(function (el) {
      el.classList.add(kind(el));
      if (el.tagName === 'LI') {
        var i = [].indexOf.call(el.parentElement.children, el);
        el.style.animationDelay = Math.min(i * 0.07, 0.42) + 's';
      }
      // Khối đang nằm trong màn hình lúc mở trang: hiện luôn (không ẩn đi rồi mới hiện).
      if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('gfx-in'); return; }
      el.classList.add('gfx-pre');
      io.observe(el);
    });
    // In / lưu PDF: hiện hết.
    addEventListener('beforeprint', function () {
      picked.forEach(function (el) { el.classList.add('gfx-in'); });
    });
  }

  /* Bấm vào emoji: lắc lư */
  document.addEventListener('click', function (ev) {
    var emo = ev.target.closest && ev.target.closest('.emo-ctx');
    if (!emo || reduce) return;
    emo.classList.remove('gfx-wiggle');
    void emo.offsetWidth;
    emo.classList.add('gfx-wiggle');
    setTimeout(function () { emo.classList.remove('gfx-wiggle'); }, 650);
  });

  /* ---------- Đồng xu ---------- */
  var COINS = ['🪙', '✨', '💰', '⭐', '🪙', '💎'];
  function coin(x, y, anim, dur, delay, vars) {
    var c = document.createElement('span');
    c.className = 'gfx-coin';
    c.setAttribute('aria-hidden', 'true');
    c.textContent = COINS[(Math.random() * COINS.length) | 0];
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    for (var k in vars) c.style.setProperty(k, vars[k]);
    c.style.animation = anim + ' ' + dur + 's ' + delay + 's cubic-bezier(.2,.7,.3,1) both';
    c.addEventListener('animationend', function () { c.remove(); });
    document.body.appendChild(c);
  }
  function burst(x, y) {
    var n = small ? 6 : 9;
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
      var d = 50 + Math.random() * 45;
      coin(x, y, 'gfx-burst', 0.7, 0, {
        '--dx': Math.cos(a) * d + 'px',
        '--dy': Math.sin(a) * d - 20 + 'px',
        '--r': (Math.random() * 360 - 180) + 'deg',
      });
    }
  }
  document.addEventListener('click', function (ev) {
    if (reduce || ev.defaultPrevented) return;
    var t = ev.target.closest && ev.target.closest('.btn, .card, .ch-nav a, .ch-body li > a, .hero a');
    if (!t) return;
    var r = t.getBoundingClientRect();
    burst(ev.clientX || r.left + r.width / 2, ev.clientY || r.top + r.height / 2);
    // Link sang trang khác: chờ xu bay một chút rồi mới chuyển trang.
    var a = t.closest('a');
    var href = a && a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank' || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
    ev.preventDefault();
    setTimeout(function () { location.href = a.href; }, 240);
  });

  /* ---------- LEVEL UP khi đọc hết chương ---------- */
  var done = false;
  var end = document.querySelector('.end-mark, .ch-nav');
  var isChapter = !!(body && end && page !== 'index.html');
  function levelUp() {
    if (done || !isChapter) return;
    done = true;
    if (cleared.indexOf(page) < 0) {
      cleared.push(page);
      try { localStorage.setItem(KEY, JSON.stringify(cleared)); } catch (e) {}
    }
    if (reduce) return;
    var day = /^ngay-0*(\d+)/.exec(page);
    var t = document.querySelector('.ch-title');
    var name = day ? 'Ngày ' + day[1] : t ? '“' + t.textContent.replace(/\s+/g, ' ').trim() + '”' : '';
    var box = document.createElement('div');
    box.id = 'gfx-lvl';
    box.setAttribute('role', 'status');
    box.innerHTML = '<span class="t">LEVEL UP! 🎉</span><span class="s"></span>';
    box.lastChild.textContent = (name ? 'Hoàn thành ' + name : 'Hoàn thành chương này') + ' · +100 EXP ✨';
    document.body.appendChild(box);
    box.addEventListener('animationend', function () { box.remove(); });
    var n = small ? 16 : 30;
    for (var i = 0; i < n; i++) {
      coin(Math.random() * innerWidth, -30, 'gfx-rain', 1.8 + Math.random() * 1.2, Math.random() * 0.8, {
        '--dx': (Math.random() * 80 - 40) + 'px',
        '--r': (Math.random() * 720 - 360) + 'deg',
      });
    }
  }
  if (isChapter && 'IntersectionObserver' in window) {
    var eo = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { levelUp(); eo.disconnect(); }
    }, { threshold: 0.6 });
    eo.observe(end);
  }

  /* ---------- Mục lục: đánh dấu ngày đã qua, emoji thẻ nhún so le ---------- */
  [].forEach.call(document.querySelectorAll('.card'), function (card, i) {
    var emo = card.querySelector('.emo');
    if (emo) emo.style.setProperty('--i', i);
    var href = (card.getAttribute('href') || '').toLowerCase();
    if (href && cleared.indexOf(href.split('/').pop()) >= 0) card.classList.add('gfx-cleared');
  });

  updateExp();
})();
