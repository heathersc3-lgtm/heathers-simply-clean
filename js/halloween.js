/* Halloween add-on (Oct 2026) for Heather's Simply Clean Co.
   Remove: delete this file + css/halloween.css and the 2 lines in index.html marked "halloween".
   Auto-off: does nothing after Oct 31, 2026 (visitor's local date).
   Preview overrides (for testing only): ?halloween=on forces the theme, ?hwbanner=1 forces the banner. */
(function () {
  'use strict';
  // ---- settings -------------------------------------------------------------
  var SHOW_BANNER = true;                         // set true to show the "10% off closet organizing" banner
  var END = new Date(2026, 9, 31, 23, 59, 59);     // last moment the theme shows (local time; month 9 = October)
  // ---------------------------------------------------------------------------
  var q = location.search;
  var forced = /[?&]halloween=on\b/.test(q);
  var td = /[?&]test_date=(\d{4})-(\d{1,2})-(\d{1,2})/.exec(q); // preview/testing override only
  var now = td ? new Date(+td[1], td[2] - 1, +td[3], 12) : new Date();
  if (!forced && now > END) return;
  if (/[?&]hwbanner=1\b/.test(q)) SHOW_BANNER = true;
  if (/[?&]hwbanner=0\b/.test(q)) SHOW_BANNER = false;

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('hw-on');
  if (reduce) root.classList.add('hw-static');

  // ---- cute inline SVGs -----------------------------------------------------
  var eyes = function (x1, x2, y, r) {
    return '<circle cx="' + x1 + '" cy="' + y + '" r="' + r + '" fill="#fff"/><circle cx="' + x2 + '" cy="' + y + '" r="' + r + '" fill="#fff"/>' +
      '<circle cx="' + (x1 + r * .25) + '" cy="' + (y + r * .2) + '" r="' + r * .5 + '" fill="#1C1C1C"/><circle cx="' + (x2 + r * .25) + '" cy="' + (y + r * .2) + '" r="' + r * .5 + '" fill="#1C1C1C"/>' +
      '<circle cx="' + (x1 + r * .45) + '" cy="' + (y - r * .1) + '" r="' + r * .18 + '" fill="#fff"/><circle cx="' + (x2 + r * .45) + '" cy="' + (y - r * .1) + '" r="' + r * .18 + '" fill="#fff"/>';
  };
  var legs = '<g fill="none" stroke="#1C1C1C" stroke-width="2.6" stroke-linecap="round">' +
    '<path d="M18 26 Q8 18 4 24"/><path d="M18 30 Q6 28 3 35"/><path d="M19 34 Q8 38 6 45"/><path d="M21 37 Q14 44 13 50"/>' +
    '<path d="M38 26 Q48 18 52 24"/><path d="M38 30 Q50 28 53 35"/><path d="M37 34 Q48 38 50 45"/><path d="M35 37 Q42 44 43 50"/></g>';
  var spiderBody = legs +
    '<ellipse cx="28" cy="31" rx="14.5" ry="14" fill="#1C1C1C"/><path d="M24 18 Q28 15 32 18" stroke="#1C1C1C" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    eyes(24.5, 31.5, 31, 3.6) +
    '<path d="M24.5 37.5 Q28 40.5 31.5 37.5" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>' +
    '<ellipse cx="20.5" cy="36.5" rx="2.2" ry="1.3" fill="#F28C38" opacity=".85"/><ellipse cx="35.5" cy="36.5" rx="2.2" ry="1.3" fill="#F28C38" opacity=".85"/>';
  var SPIDER = '<svg viewBox="0 0 56 56" width="46" height="46" aria-hidden="true">' + spiderBody + '</svg>';
  var broom = function (x1, y1, x2, y2, w, sc) { // handle from (x1,y1) to bristle top (x2,y2)
    var a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    return '<g><line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#8A5A2E" stroke-width="' + (w || 2.6) + '" stroke-linecap="round"/>' +
      '<g transform="translate(' + x2 + ' ' + y2 + ') rotate(' + (a - 90) + ') scale(' + (sc || 1) + ')">' +
      '<path d="M-4 0 L4 0 L9 15 L-9 15 Z" fill="#E9B24A"/><path d="M-6 6 L6 6" stroke="#2F6F6B" stroke-width="2.2"/>' +
      '<path d="M-6 15 L-7 11 M-3 15 L-3.5 9 M0 15 L0 9 M3 15 L3.5 9 M6 15 L7 11" stroke="#C58A2A" stroke-width="1"/></g></g>';
  };
  var SPIDER_BROOM = '<svg viewBox="0 0 76 80" width="64" height="67" aria-hidden="true"><g transform="translate(4 0)">' + spiderBody + '</g>' +
    broom(44, 24, 60, 56, 3, 1.35) + '<circle cx="45.5" cy="34" r="3.4" fill="#1C1C1C"/></svg>';
  var ghostShape = function (fill) {
    return '<path d="M10 44 C6 22 18 6 34 6 C50 6 60 22 57 44 L57 60 Q52 54 47 60 Q41 66 35 60 Q29 54 23 60 Q17 66 12 60 Z" fill="' + fill + '"/>';
  };
  var ghostFace = eyes(26, 41, 30, 4.2) +
    '<path d="M29 39 Q33.5 43 38 39" fill="none" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round"/>' +
    '<ellipse cx="21" cy="38" rx="3.2" ry="1.8" fill="#F5A3B5" opacity=".8"/><ellipse cx="46" cy="38" rx="3.2" ry="1.8" fill="#F5A3B5" opacity=".8"/>';
  var GHOST = '<svg viewBox="0 0 68 70" width="62" height="64" aria-hidden="true"><g transform="translate(2 3)" opacity=".18">' + ghostShape('#2F6F6B') + '</g>' +
    ghostShape('#FFFFFF') + ghostFace + '<path d="M10 40 Q2 34 4 26" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>';
  var spark = function (x, y, s, c) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z" fill="' + c + '"/>'; };
  // ghost riding a broom, flying to the right (bristles trail behind on the left, with brand sparkles)
  var GHOST_BROOM = '<svg viewBox="0 0 150 90" width="128" height="77" aria-hidden="true">' +
    spark(8, 52, 1, '#9FD3CF') + spark(22, 70, .7, '#F28C38') + spark(14, 36, .55, '#B79CE0') +
    '<g transform="rotate(-8 75 62)"><line x1="40" y1="64" x2="138" y2="64" stroke="#8A5A2E" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M42 58 L42 70 L18 78 L14 50 Z" fill="#E9B24A"/><path d="M38 58 L38 70" stroke="#2F6F6B" stroke-width="3.5"/>' +
    '<path d="M18 78 L28 66 M15 66 L30 64 M15 56 L30 61" stroke="#C58A2A" stroke-width="1.2"/></g>' +
    '<g transform="translate(58 2) scale(.92)">' + ghostShape('#FFFFFF') + ghostFace +
    '<path d="M54 38 Q66 44 70 56" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M2 0 L0 0" stroke="none"/>' +
    '<path d="M20 8 L34 -6 L48 8 Z" fill="#5B3A8C"/><ellipse cx="34" cy="8" rx="20" ry="4" fill="#5B3A8C"/><rect x="25" y="3" width="18" height="3.4" fill="#F28C38"/></g></svg>';
  var WEB = '<svg viewBox="0 0 120 120" aria-hidden="true"><g fill="none" stroke="#7C6E93" stroke-width="1.1" stroke-linecap="round">' +
    '<path d="M0 0 L120 0 M0 0 L118 52 M0 0 L92 92 M0 0 L52 118 M0 0 L0 120"/>' +
    '<path d="M30 0 Q27 9 29 13 Q20 15 21 21 Q13 21 9 28 Q5 27 0 30"/>' +
    '<path d="M62 0 Q57 18 58 26 Q42 32 42 42 Q30 44 26 58 Q16 58 0 62"/>' +
    '<path d="M96 0 Q90 26 90 40 Q68 50 66 66 Q50 70 40 90 Q26 92 0 96"/></g></svg>';
  var PUMPKIN = '<svg viewBox="0 0 64 60" aria-hidden="true">' +
    '<path d="M32 12 Q30 4 36 2" fill="none" stroke="#2F6F6B" stroke-width="4" stroke-linecap="round"/><path d="M34 8 Q42 2 46 8 Q40 10 34 8" fill="#B9CBB4"/>' +
    '<ellipse cx="20" cy="35" rx="15" ry="20" fill="#E9852F"/><ellipse cx="44" cy="35" rx="15" ry="20" fill="#E9852F"/><ellipse cx="32" cy="35" rx="14" ry="21" fill="#F49A3E"/>' +
    '<path d="M22 30 L27 26 L28 32 Z M42 30 L37 26 L36 32 Z" fill="#5B3A1A"/><path d="M23 40 Q32 48 41 40 Q32 44 23 40 Z" fill="#5B3A1A"/></svg>';

  // ---- build -----------------------------------------------------------------
  function el(tag, cls, html) { var e = document.createElement(tag); e.className = cls; if (html) e.innerHTML = html; return e; }

  function decorHero() {
    var hero = document.querySelector('.hero'); if (!hero) return;
    hero.appendChild(el('div', 'hw-web hw-web-l', WEB));
    hero.appendChild(el('div', 'hw-web hw-web-r', WEB));
    hero.appendChild(el('div', 'hw-pumpkin', PUMPKIN));
  }

  function layer() {
    var L = el('div', 'hw-layer'); L.setAttribute('aria-hidden', 'true');
    // spiders: [left %, drop depth px, cycle s, delay s, svg]
    var spiders = [[9, 150, 16, 0.6, SPIDER_BROOM], [84, 230, 19, 5.5, SPIDER], [50, 64, 23, 11, SPIDER]];
    var hasBanner = !!document.querySelector('.hw-banner');
    // with the banner showing, keep spiders at the edges (clear of the banner text) and fly the broom ghost lower
    if (hasBanner) spiders = [[8, 150, 16, 0.6, SPIDER_BROOM], [92, 250, 19, 5.5, SPIDER]];
    spiders.forEach(function (s) {
      var w = el('div', 'hw-spider');
      w.style.left = s[0] + '%';
      w.style.setProperty('--drop', s[1] + 'px');
      w.style.animationDuration = s[2] + 's';
      w.style.animationDelay = s[3] + 's';
      w.innerHTML = '<span class="hw-thread"></span><span class="hw-bob">' + s[4] + '</span>';
      L.appendChild(w);
    });
    if (!reduce) {
      // ghosts: [top vh, cycle s, delay s, svg, class]
      [[hasBanner ? 46 : 22, 21, 1.5, GHOST_BROOM, 'hw-ghost hw-ghost-broom'], [58, 27, 12, GHOST, 'hw-ghost hw-ghost-left']].forEach(function (g) {
        var w = el('div', g[4]);
        w.style.top = g[0] + 'vh'; w.style.animationDuration = g[1] + 's'; w.style.animationDelay = g[2] + 's';
        w.innerHTML = '<span class="hw-float">' + g[3] + '</span>';
        L.appendChild(w);
      });
    }
    document.body.appendChild(L);
  }

  function banner() {
    if (!SHOW_BANNER || sessionStorage.getItem('hwBannerClosed')) return;
    var f = document.createElement('link'); f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Cormorant+Garamond:ital,wght@1,600&display=swap';
    document.head.appendChild(f);
    var b = el('aside', 'hw-banner');
    b.setAttribute('aria-label', 'October special');
    b.innerHTML =
      '<p class="hw-b-kicker">Skeletons in your closet? 🦇</p>' +
      '<p class="hw-b-main"><strong>10% OFF</strong> <em>Closet Organizing</em></p>' +
      '<p class="hw-b-dates">October only &middot; offer ends Oct 31</p>' +
      '<p class="hw-b-cta"><a href="#quote">Get a Quote</a> <a href="tel:+16616521915">Call or text 661-652-1915</a></p>' +
      '<button type="button" class="hw-b-close" aria-label="Close October special">&times;</button>';
    b.querySelector('.hw-b-close').addEventListener('click', function () { b.remove(); try { sessionStorage.setItem('hwBannerClosed', '1'); } catch (e) {} });
    var nav = document.querySelector('.nav');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(b, nav.nextSibling); else document.body.insertBefore(b, document.body.firstChild);
  }

  function start() { decorHero(); banner(); layer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
