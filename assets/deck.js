/* ============================================================
   Motor del deck — navegación, escalado, cronómetro, notas, gráficos
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Paleta de los imaginarios ---------- */
  var PAL = { i1: '#0d4f9e', i2: '#1aa3bf', i3: '#e0a52e', i4: '#64708f' };
  var MARCO = '#c4c8cf';

  /* ===========================================================
     GRÁFICOS SVG (datos reales de la muestra analítica, N = 325)
     =========================================================== */

  function svgWrap(vb, inner) {
    return '<svg class="chart" viewBox="0 0 ' + vb + '" preserveAspectRatio="xMidYMid meet" role="img">' + inner + '</svg>';
  }

  /* Distribución de los cuatro imaginarios (Figura 1) */
  function chartDist() {
    var rows = [
      { k: 'i1', name: 'I1 · IA gobernada',          v: 44.6, seg: 145 },
      { k: 'i3', name: 'I3 · Bienestar aumentado',   v: 26.2, seg: 85 },
      { k: 'i2', name: 'I2 · IA en español',         v: 17.2, seg: 56 },
      { k: 'i4', name: 'I4 · Mediación hispana',     v: 12.0, seg: 39 }
    ];
    var x0 = 360, x1 = 892, maxV = 50, rowH = 86, top = 14, bh = 46;
    var s = '';
    rows.forEach(function (r, i) {
      var y = top + i * rowH, cy = y + rowH / 2;
      var w = (r.v / maxV) * (x1 - x0);
      s += '<circle cx="12" cy="' + (cy - 8) + '" r="9" fill="' + PAL[r.k] + '"/>';
      s += '<text class="cat-label" x="34" y="' + (cy - 2) + '">' + r.name + '</text>';
      s += '<text class="axis-label" x="34" y="' + (cy + 22) + '">' + r.seg + ' segmentos</text>';
      s += '<rect x="' + x0 + '" y="' + (cy - bh / 2) + '" width="' + w + '" height="' + bh + '" rx="5" fill="' + PAL[r.k] + '" class="gx" style="transition-delay:' + (i * 0.08) + 's"/>';
      s += '<text class="bignum fadein" x="' + (x0 + w + 18) + '" y="' + (cy + 9) + '" font-size="34" fill="' + PAL[r.k] + '">' + String(r.v).replace('.', ',') + ' %</text>';
    });
    return svgWrap('1000 ' + (top + rows.length * rowH), s);
  }

  /* Arquitectura bipartita: España vs UE (proyectivo / operativo) */
  function chartBipartite() {
    var groups = [
      { name: 'ESPAÑA', sub: 'discurso institucional', proj: 60.3, op: 39.7 },
      { name: 'UNIÓN EUROPEA', sub: 'muestra de referencia', proj: 13.0, op: 87.0 }
    ];
    var x0 = 0, W = 1000, barH = 78, gap = 118, top = 30;
    var s = '';
    groups.forEach(function (g, i) {
      var y = top + i * (barH + gap);
      var pw = (g.proj / 100) * W, ow = (g.op / 100) * W;
      s += '<text class="cat-label" x="0" y="' + (y - 14) + '" font-size="19">' + g.name +
           '<tspan class="axis-label" font-size="14"> · ' + g.sub + '</tspan></text>';
      // proyectivo
      s += '<rect x="0" y="' + y + '" width="' + pw + '" height="' + barH + '" rx="4" fill="' + PAL.i1 + '" class="gx"/>';
      s += '<text class="fadein" x="18" y="' + (y + barH / 2 + 8) + '" font-size="26" font-weight="700" fill="#fff">' + String(g.proj).replace('.', ',') + ' %</text>';
      // operativo
      s += '<rect x="' + pw + '" y="' + y + '" width="' + ow + '" height="' + barH + '" rx="4" fill="' + MARCO + '" class="gx" style="transform-origin:' + pw + 'px center;transition-delay:.12s"/>';
      var oLabelX = pw + ow - 18;
      s += '<text class="fadein" x="' + oLabelX + '" y="' + (y + barH / 2 + 8) + '" text-anchor="end" font-size="26" font-weight="700" fill="#2c2d33">' + String(g.op).replace('.', ',') + ' %</text>';
    });
    // leyenda
    var ly = top + 2 * (barH + gap) - gap + barH + 34;
    s += '<rect x="0" y="' + ly + '" width="15" height="15" rx="3" fill="' + PAL.i1 + '"/>';
    s += '<text class="axis-label" x="24" y="' + (ly + 13) + '" font-size="15">Imaginarios (proyección de futuro)</text>';
    s += '<rect x="430" y="' + ly + '" width="15" height="15" rx="3" fill="' + MARCO + '"/>';
    s += '<text class="axis-label" x="454" y="' + (ly + 13) + '" font-size="15">Marcos (acción presente)</text>';
    return svgWrap('1000 ' + (ly + 30), s);
  }

  /* Evolución temporal por fases (Figura 2) — columnas apiladas, valores absolutos */
  function chartTemporal() {
    var phases = [
      { lbl: '2020–22', tot: 42,  d: { i1: 14, i3: 20, i2: 3,  i4: 5 } },
      { lbl: '2023',    tot: 19,  d: { i1: 8,  i3: 7,  i2: 1,  i4: 3 } },
      { lbl: '2024',    tot: 99,  d: { i1: 26, i3: 27, i2: 39, i4: 7 } },
      { lbl: '2025–T1·26', tot: 165, d: { i1: 97, i3: 31, i2: 13, i4: 24 } }
    ];
    var order = ['i1', 'i3', 'i2', 'i4'];
    var W = 1000, H = 430, padL = 54, padB = 64, padT = 16;
    var plotH = H - padB - padT, baseY = padT + plotH;
    var maxY = 170, colW = 150, slot = (W - padL) / phases.length;
    var s = '';
    // gridlines
    [0, 50, 100, 150].forEach(function (g) {
      var gy = baseY - (g / maxY) * plotH;
      s += '<line class="grid-line" x1="' + padL + '" y1="' + gy + '" x2="' + W + '" y2="' + gy + '"/>';
      s += '<text class="axis-label" x="' + (padL - 12) + '" y="' + (gy + 4) + '" text-anchor="end" font-size="13">' + g + '</text>';
    });
    phases.forEach(function (p, pi) {
      var cx = padL + pi * slot + (slot - colW) / 2;
      var yCursor = baseY;
      order.forEach(function (k, ki) {
        var val = p.d[k];
        var h = (val / maxY) * plotH;
        yCursor -= h;
        s += '<rect x="' + cx + '" y="' + yCursor + '" width="' + colW + '" height="' + h + '" fill="' + PAL[k] + '" class="gy" style="transition-delay:' + (pi * 0.08 + ki * 0.04) + 's"/>';
        if (val >= 12) {
          s += '<text class="fadein" x="' + (cx + colW / 2) + '" y="' + (yCursor + h / 2 + 6) + '" text-anchor="middle" font-size="17" font-weight="700" fill="#fff">' + val + '</text>';
        }
      });
      s += '<text class="cat-label" x="' + (cx + colW / 2) + '" y="' + (baseY + 30) + '" text-anchor="middle" font-size="17">' + p.lbl + '</text>';
      s += '<text class="axis-label" x="' + (cx + colW / 2) + '" y="' + (baseY + 50) + '" text-anchor="middle" font-size="13">' + p.tot + ' seg.</text>';
    });
    return svgWrap(W + ' ' + H, s);
  }

  /* Perfiles de los actores (Figura 3) — barras 100% apiladas por actor */
  function chartActors() {
    var actors = [
      { name: 'AESIA',            d: [85.0, 12.5, 0.0, 2.5] },
      { name: 'Pedro Sánchez',    d: [18.5, 33.3, 11.1, 37.0] },
      { name: 'Óscar López',      d: [28.6, 28.6, 28.6, 14.3] },
      { name: 'J. L. Escrivá',    d: [57.1, 14.3, 28.6, 0.0] },
      { name: 'M. Robles',        d: [25.0, 25.0, 0.0, 50.0] },
      { name: 'Gob./SEDIA + norm.', d: [42.0, 27.9, 19.9, 10.2] }
    ];
    var keys = ['i1', 'i3', 'i2', 'i4'];
    var x0 = 250, W = 980, barH = 40, rowH = 60, top = 8;
    var s = '';
    actors.forEach(function (a, i) {
      var y = top + i * rowH, cy = y + barH / 2;
      s += '<text class="cat-label" x="0" y="' + (cy + 6) + '" font-size="16">' + a.name + '</text>';
      var cx = x0, tot = (W - x0);
      a.d.forEach(function (v, ki) {
        var w = (v / 100) * tot;
        if (w > 0) {
          s += '<rect x="' + cx + '" y="' + y + '" width="' + w + '" height="' + barH + '" fill="' + PAL[keys[ki]] + '" class="gx" style="transform-origin:' + cx + 'px center;transition-delay:' + (i * 0.05 + ki * 0.03) + 's"/>';
          if (v >= 14) {
            s += '<text class="fadein" x="' + (cx + w / 2) + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="13.5" font-weight="700" fill="#fff">' + String(Math.round(v)) + '</text>';
          }
        }
        cx += w;
      });
    });
    return svgWrap('1000 ' + (top + actors.length * rowH + 6), s);
  }

  /* Penetración del léxico de innovación por imaginario (Figura 4) */
  function chartInnovation() {
    var rows = [
      { k: 'i2', name: 'I2 · IA en español',       v: 89.3 },
      { k: 'i3', name: 'I3 · Bienestar aumentado', v: 76.5 },
      { k: 'i4', name: 'I4 · Mediación hispana',   v: 71.8 },
      { k: 'i1', name: 'I1 · IA gobernada',        v: 46.2 }
    ];
    var x0 = 320, W = 892, rowH = 78, top = 14, bh = 42, mean = 64.6;
    var s = '';
    var meanX = x0 + (mean / 100) * (W - x0);
    rows.forEach(function (r, i) {
      var y = top + i * rowH, cy = y + rowH / 2;
      var w = (r.v / 100) * (W - x0);
      s += '<text class="cat-label" x="0" y="' + (cy + 6) + '" font-size="16.5">' + r.name + '</text>';
      s += '<rect x="' + x0 + '" y="' + (cy - bh / 2) + '" width="' + w + '" height="' + bh + '" rx="5" fill="' + PAL[r.k] + '" class="gx" style="transition-delay:' + (i * 0.08) + 's"/>';
      s += '<text class="fadein" x="' + (x0 + w + 16) + '" y="' + (cy + 8) + '" font-size="25" font-weight="700" fill="' + PAL[r.k] + '">' + String(r.v).replace('.', ',') + ' %</text>';
    });
    var hgt = top + rows.length * rowH;
    // línea de media
    s += '<line x1="' + meanX + '" y1="2" x2="' + meanX + '" y2="' + (hgt - 8) + '" stroke="rgba(24,24,27,0.5)" stroke-width="2" stroke-dasharray="3 5" class="fadein"/>';
    s += '<text class="fadein" x="' + (meanX + 8) + '" y="' + (hgt + 4) + '" font-size="14" font-weight="600" fill="#18181b">media global 64,6 %</text>';
    return svgWrap('1000 ' + (hgt + 16), s);
  }

  var CHARTS = {
    'chart-dist': chartDist,
    'chart-bipartite': chartBipartite,
    'chart-temporal': chartTemporal,
    'chart-actors': chartActors,
    'chart-innovation': chartInnovation
  };

  function renderCharts() {
    Object.keys(CHARTS).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = CHARTS[id]();
    });
  }

  /* ===========================================================
     NAVEGACIÓN Y ESTADO
     =========================================================== */
  var slides = [], current = 0, deck, stage;

  function scaleDeck() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var sc = Math.min(vw / 1280, vh / 720);
    deck.style.transform = 'translate(-50%, -50%) scale(' + sc + ')';
  }

  function show(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    slides[current].classList.remove('active');
    current = n;
    slides[current].classList.add('active');
    updateChrome();
    updateNotes();
  }
  function next() { if (current < slides.length - 1) { startTimer(); show(current + 1); } }
  function prev() { show(current - 1); }

  function updateChrome() {
    var pct = (current) / (slides.length - 1) * 100;
    document.getElementById('progress').style.width = pct + '%';
    document.getElementById('counter').innerHTML = '<b>' + (current + 1) + '</b> / ' + slides.length;
  }

  /* ---------- Cronómetro (objetivo 15:00) ---------- */
  var t0 = null, tick = null;
  function startTimer() {
    if (t0 !== null) return;
    t0 = Date.now();
    tick = setInterval(updateTimer, 1000);
    updateTimer();
  }
  function updateTimer() {
    var el = document.getElementById('timer');
    var secs = Math.floor((Date.now() - t0) / 1000);
    var m = Math.floor(secs / 60), sx = secs % 60;
    el.querySelector('.val').textContent = m + ':' + (sx < 10 ? '0' : '') + sx;
    el.classList.toggle('warn', secs >= 13 * 60 && secs < 15 * 60);
    el.classList.toggle('over', secs >= 15 * 60);
  }

  /* ---------- Notas del ponente (privadas, tecla N) ---------- */
  function updateNotes() {
    var panel = document.getElementById('notes');
    var dataEl = slides[current].querySelector('.note-data');
    var title = slides[current].getAttribute('data-title') || ('Slide ' + (current + 1));
    var time = slides[current].getAttribute('data-time') || '';
    var html = '<div class="nkick">Notas · ' + (current + 1) + '/' + slides.length +
               (time ? ' · <span class="time">' + time + '</span>' : '') + '</div>';
    html += '<h4>' + title + '</h4>';
    if (dataEl) html += '<ul>' + dataEl.innerHTML + '</ul>';
    else html += '<p class="time">—</p>';
    panel.innerHTML = html;
  }
  function toggleNotes() { document.getElementById('notes').classList.toggle('open'); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    } else { document.exitFullscreen(); }
  }

  /* ---------- Eventos ---------- */
  function onKey(e) {
    switch (e.key) {
      case 'ArrowRight': case ' ': case 'PageDown': case 'Enter':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace':
        e.preventDefault(); prev(); break;
      case 'Home': e.preventDefault(); show(0); break;
      case 'End': e.preventDefault(); show(slides.length - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'n': case 'N': case 's': case 'S': toggleNotes(); break;
      case 't': case 'T':
        t0 = null; if (tick) clearInterval(tick);
        document.getElementById('timer').querySelector('.val').textContent = '0:00';
        document.getElementById('timer').classList.remove('warn', 'over');
        startTimer(); break;
    }
  }

  function init() {
    deck = document.getElementById('deck');
    stage = document.getElementById('stage');
    slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
    // numeración de esquina dinámica (NN / total) — robusta a inserciones
    slides.forEach(function (s, i) {
      var el = s.querySelector('.slide-num-lg');
      if (el) el.textContent = ('0' + (i + 1)).slice(-2) + ' / ' + ('0' + slides.length).slice(-2);
    });
    renderCharts();
    scaleDeck();
    show(0);
    window.addEventListener('resize', scaleDeck);
    document.addEventListener('keydown', onKey);
    // clic para avanzar (mitad derecha) / retroceder (mitad izquierda)
    stage.addEventListener('click', function (e) {
      if (e.target.closest('#notes')) return;
      var x = e.clientX / window.innerWidth;
      if (x > 0.5) next(); else prev();
    });
    // swipe táctil
    var sx = 0;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) { if (dx < 0) next(); else prev(); }
    }, { passive: true });
    // ocultar la pista tras unos segundos
    setTimeout(function () { document.getElementById('hint').classList.add('hidden'); }, 5500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
