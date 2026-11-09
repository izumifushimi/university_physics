/* ==========================================================================
   labs.js —— 互动实验
   --------------------------------------------------------------------------
   统一结构（文档第 8 节）：观察任务、模型假设、可调参数、动态图示、
   数值 / 图像、解释与课程链接。
   首个实验：匀加速直线运动与三种图像联动（P0）。
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;
  const Store = PHYS.Store;

  const registry = {};
  const running = [];

  /* ------------------------------------------------------------ 绘图小工具 */

  function setupCanvas(canvas) {
    const dpr = global.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(280, rect.width || canvas.parentElement.clientWidth || 600);
    const h = Number(canvas.getAttribute('data-h')) || 180;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }

  function niceRange(min, max, pad) {
    if (!isFinite(min) || !isFinite(max)) return [0, 1];
    if (min === max) { min -= 1; max += 1; }
    const p = pad == null ? 0.12 : pad;
    const span = max - min;
    return [min - span * p, max + span * p];
  }

  function drawAxes(ctx, box, opts) {
    const o = opts || {};
    ctx.save();
    ctx.strokeStyle = '#d9d3c6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(box.x, box.y + box.h);
    ctx.lineTo(box.x + box.w, box.y + box.h);
    ctx.stroke();

    // 零线
    if (o.yZero != null && o.yZero > box.y && o.yZero < box.y + box.h) {
      ctx.strokeStyle = '#e7e1d5';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(box.x, o.yZero);
      ctx.lineTo(box.x + box.w, o.yZero);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function label(ctx, text, x, y, opts) {
    const o = opts || {};
    ctx.save();
    ctx.fillStyle = o.color || '#7b837c';
    ctx.font = (o.bold ? '600 ' : '') + (o.size || 10) + 'px -apple-system, "PingFang SC", sans-serif';
    ctx.textAlign = o.align || 'left';
    ctx.textBaseline = o.baseline || 'alphabetic';
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  /* ==========================================================================
     实验一：匀加速直线运动与三种图像联动
     ========================================================================== */

  function ConstantAccel(host, opts) {
    const lab = PHYS.labs.find(function (l) { return l.id === 'lab-constant-accel'; });
    const compact = !!(opts && opts.compact);
    const saved = Store.labStateOf('lab-constant-accel');
    const P = { x0: 0, v0: 2, a: 1.5 };
    if (saved && saved.params) Object.assign(P, saved.params);

    const duration = 5;              // s
    let t = 0;
    let playing = false;
    let rafId = null;
    let lastTs = 0;
    let destroyed = false;

    host.innerHTML = '' +
      '<div class="lab-workspace" style="' + (compact ? 'grid-template-columns:1fr;gap:14px' : '') + '">' +
      '  <div>' +
      '    <div class="stage">' +
      '      <canvas class="lab-track" data-h="128" role="img" aria-label="水平轨道上运动的小车位置示意"></canvas>' +
      '      <div class="chart-block"><h3>x–t 位置—时间 <span class="chart-val" data-val="x">—</span></h3><canvas class="lab-x" data-h="150" role="img" aria-label="位置随时间变化的图像"></canvas></div>' +
      '      <div class="chart-block"><h3>v–t 速度—时间 <span class="chart-val" data-val="v">—</span></h3><canvas class="lab-v" data-h="150" role="img" aria-label="速度随时间变化的图像"></canvas></div>' +
      '      <div class="chart-block"><h3>a–t 加速度—时间 <span class="chart-val" data-val="a">—</span></h3><canvas class="lab-a" data-h="126" role="img" aria-label="加速度随时间变化的图像"></canvas></div>' +
      '      <label class="ctrl" style="margin-top:10px">' +
      '        <span class="ctrl-head"><span>时间 t</span><span class="val" data-out="time">0.0 s</span></span>' +
      '        <input type="range" class="lab-time" min="0" max="' + duration + '" step="0.05" value="0" aria-label="拖动查看任意时刻">' +
      '        <span class="range-hint"><span>0 s</span><span>' + duration + ' s</span></span>' +
      '      </label>' +
      '    </div>' +
      '  </div>' +
      '  <div class="lab-controls">' +
      '    <div class="card card-tight">' +
      '      <div class="side-title" style="margin-bottom:8px">参数</div>' +
      '      <label class="ctrl"><span class="ctrl-head"><span>初位置 x₀</span><span class="val" data-out="x0">0 m</span></span>' +
      '        <input type="range" data-key="x0" min="-20" max="20" step="0.5" value="' + P.x0 + '" aria-label="初位置，单位米">' +
      '        <span class="range-hint"><span>-20</span><span>20 m</span></span></label>' +
      '      <label class="ctrl" style="margin-top:10px"><span class="ctrl-head"><span>初速度 v₀</span><span class="val" data-out="v0">2 m/s</span></span>' +
      '        <input type="range" data-key="v0" min="-10" max="10" step="0.5" value="' + P.v0 + '" aria-label="初速度，单位米每秒">' +
      '        <span class="range-hint"><span>-10</span><span>10 m/s</span></span></label>' +
      '      <label class="ctrl" style="margin-top:10px"><span class="ctrl-head"><span>加速度 a</span><span class="val" data-out="a">1.5 m/s²</span></span>' +
      '        <input type="range" data-key="a" min="-5" max="5" step="0.5" value="' + P.a + '" aria-label="加速度，单位米每二次方秒">' +
      '        <span class="range-hint"><span>-5</span><span>5 m/s²</span></span></label>' +
      '      <p style="font-size:.76rem;color:var(--muted);margin:10px 0 0">参数为沿 x 轴的分量，可为负值。改变参数会复位到 t = 0。</p>' +
      '    </div>' +
      '    <div class="card card-tight">' +
      '      <div class="side-title" style="margin-bottom:8px">播放</div>' +
      '      <div class="transport">' +
      '        <button class="btn btn-sm btn-primary" data-act="play">开始</button>' +
      '        <button class="btn btn-sm" data-act="step">单步 +0.2 s</button>' +
      '        <button class="btn btn-sm" data-act="reset">复位</button>' +
      '      </div>' +
      '      <div class="readouts" style="margin-top:12px">' +
      '        <div class="readout"><span class="k">位置 x</span><span class="v" data-out="rx">0.00</span><span class="u">m</span></div>' +
      '        <div class="readout"><span class="k">速度 v</span><span class="v" data-out="rv">2.00</span><span class="u">m/s</span></div>' +
      '        <div class="readout"><span class="k">加速度 a</span><span class="v" data-out="ra">1.50</span><span class="u">m/s²</span></div>' +
      '        <div class="readout"><span class="k">已走位移 Δx</span><span class="v" data-out="rd">0.00</span><span class="u">m</span></div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="card card-tight">' +
      '      <div class="side-title" style="margin-bottom:6px">4 s 后的解析预测</div>' +
      '      <p style="font-size:.84rem;margin:0 0 6px;color:var(--ink-2)">用 x = x₀ + v₀t + ½at² 与 v = v₀ + at 独立计算，可与图像读数互相检验。</p>' +
      '      <div class="readouts">' +
      '        <div class="readout"><span class="k">x(4 s)</span><span class="v" data-out="p4x">20.00</span><span class="u">m</span></div>' +
      '        <div class="readout"><span class="k">v(4 s)</span><span class="v" data-out="p4v">8.00</span><span class="u">m/s</span></div>' +
      '      </div>' +
      '    </div>' +
      '    <div class="card card-tight lab-task">' +
      '      <div class="side-title" style="margin-bottom:4px">观察任务</div>' +
      '      <ol>' +
      '        <li>设 x₀ = 0 m、v₀ = 2 m/s、a = 1.5 m/s²，拖到 t = 4 s，确认 x = 20 m、v = 8 m/s。</li>' +
      '        <li>把 a 改为原来的两倍（a = 3 m/s²），v–t 图的斜率怎样变化？</li>' +
      '        <li>令 a = 0，三种图像分别是什么形状？</li>' +
      '        <li>把 v₀ 设为负值、a 设为正值，观察什么时刻速度为零，以及 x–t 图的极值出现在哪里。</li>' +
      '      </ol>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    const $ = function (sel) { return host.querySelector(sel); };
    const trackCanvas = $('.lab-track');
    const xCanvas = $('.lab-x');
    const vCanvas = $('.lab-v');
    const aCanvas = $('.lab-a');
    const timeSlider = $('.lab-time');

    const xAt = function (tt) { return P.x0 + P.v0 * tt + 0.5 * P.a * tt * tt; };
    const vAt = function (tt) { return P.v0 + P.a * tt; };

    let yearMax = 1, yearMin = -1;

    function computeRanges() {
      const xs = [], vs = [];
      for (let k = 0; k <= 50; k++) {
        const tt = k * duration / 50;
        xs.push(xAt(tt)); vs.push(vAt(tt));
      }
      yearMin = Math.min.apply(null, xs);
      yearMax = Math.max.apply(null, xs);
      return { xs: xs, vs: vs };
    }

    /* ------------------------------------------------------------- 绘制 */
    function draw() {
      if (destroyed) return;

      const data = computeRanges();
      const xRange = niceRange(yearMin, yearMax, 0.15);
      const vRange = niceRange(Math.min(0, Math.min.apply(null, data.vs)), Math.max(0, Math.max.apply(null, data.vs)), 0.15);

      drawTrack();
      drawChart(xCanvas, 'x', function (tt) { return xAt(tt); }, xRange, '#0e6355', 'x (m)');
      drawChart(vCanvas, 'v', function (tt) { return vAt(tt); }, vRange, '#a9502b', 'v (m/s)');
      drawChart(aCanvas, 'a', function () { return P.a; }, niceRange(Math.min(0, P.a), Math.max(0, P.a), 0.6), '#8a6a13', 'a (m/s²)', true);

      // 数值
      const x = xAt(t), v = vAt(t), d = x - P.x0;
      setOut('time', UI.num(t, 1) + ' s');
      setOut('rx', UI.num(x, 2));
      setOut('rv', UI.num(v, 2));
      setOut('ra', UI.num(P.a, 2));
      setOut('rd', UI.num(d, 2));
      setOut('p4x', UI.num(xAt(4), 2));
      const cv = function (k, txt) { const el = host.querySelector('[data-val="' + k + '"]'); if (el) el.textContent = txt; };
      cv('x', 'x = ' + UI.num(x, 2) + ' m');
      cv('v', 'v = ' + UI.num(v, 2) + ' m/s');
      cv('a', 'a = ' + UI.num(P.a, 2) + ' m/s²');
      setOut('p4v', UI.num(vAt(4), 2));
      setOut('x0', UI.trimNum(P.x0, 1) + ' m');
      setOut('v0', UI.trimNum(P.v0, 1) + ' m/s');
      setOut('a', UI.trimNum(P.a, 1) + ' m/s²');
      if (timeSlider && Number(timeSlider.value) !== Number(t)) timeSlider.value = String(t);

      // 无障碍文本描述
      const desc = 't = ' + UI.num(t, 1) + ' 秒，位置 ' + UI.num(x, 2) + ' 米，速度 ' + UI.num(v, 2) + ' 米每秒，加速度 ' + UI.num(P.a, 2) + ' 米每二次方秒';
      host.querySelectorAll('canvas').forEach(function (c) { c.setAttribute('aria-description', desc); });
    }

    function setOut(k, text) {
      const el = host.querySelector('[data-out="' + k + '"]');
      if (el) el.textContent = text;
    }

    function drawTrack() {
      const c = setupCanvas(trackCanvas);
      const ctx = c.ctx, w = c.w, h = c.h;
      const padL = 26, padR = 22, y = h * 0.58;
      const r = niceRange(Math.min(P.x0, xAt(duration), yearMin), Math.max(P.x0, xAt(duration), yearMax), 0.12);
      const sx = function (x) { return padL + (x - r[0]) / (r[1] - r[0]) * (w - padL - padR); };

      // 地面
      ctx.strokeStyle = '#cfc7b6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(padL, y + 16);
      ctx.lineTo(w - padR, y + 16);
      ctx.stroke();

      // 刻度
      const span = r[1] - r[0];
      const stepM = span > 60 ? 20 : span > 30 ? 10 : span > 12 ? 5 : span > 6 ? 2 : 1;
      ctx.strokeStyle = '#e2dccd';
      ctx.lineWidth = 1;
      const start = Math.ceil(r[0] / stepM) * stepM;
      for (let m = start; m <= r[1]; m += stepM) {
        const px = sx(m);
        ctx.beginPath();
        ctx.moveTo(px, y + 14);
        ctx.lineTo(px, y + 20);
        ctx.stroke();
        label(ctx, String(m), px, y + 33, { align: 'center', size: 9 });
      }

      // 起点标记
      const px0 = sx(P.x0);
      ctx.strokeStyle = '#c9c2b4';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px0, y - 30);
      ctx.lineTo(px0, y + 16);
      ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, 'x₀', px0, y - 34, { align: 'center', size: 9 });

      // 小车（方块 + 轮子），不只靠颜色区分
      const px = sx(xAt(t));
      ctx.fillStyle = '#0e6355';
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(px - 13, y - 12, 26, 20, 4) : ctx.rect(px - 13, y - 12, 26, 20);
      ctx.fill();
      ctx.fillStyle = '#f6f4ef';
      ctx.font = '600 9px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('m', px, y + 2);
      ctx.fillStyle = '#3d4540';
      [px - 7, px + 7].forEach(function (wx) {
        ctx.beginPath();
        ctx.arc(wx, y + 9, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 速度箭头
      const v = vAt(t);
      if (Math.abs(v) > 0.001) {
        const len = Math.min(46, 6 + Math.abs(v) * 3.2) * (v >= 0 ? 1 : -1);
        ctx.strokeStyle = '#a9502b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, y - 24);
        ctx.lineTo(px + len, y - 24);
        ctx.stroke();
        const dir = v >= 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(px + len, y - 24);
        ctx.lineTo(px + len - 6 * dir, y - 28);
        ctx.lineTo(px + len - 6 * dir, y - 20);
        ctx.closePath();
        ctx.fillStyle = '#a9502b';
        ctx.fill();
        label(ctx, 'v = ' + UI.num(v, 1) + ' m/s', px + len + 4 * dir, y - 20, { color: '#a9502b', align: dir > 0 ? 'left' : 'right', size: 9 });
      }

      label(ctx, 't = ' + UI.num(t, 1) + ' s', w - padR, 16, { align: 'right', size: 10, bold: true, color: '#3d4540' });

      // 时间条
      ctx.fillStyle = '#efeae1';
      ctx.fillRect(padL, h - 12, w - padL - padR, 4);
      ctx.fillStyle = '#0e6355';
      ctx.fillRect(padL, h - 12, (w - padL - padR) * (t / duration), 4);
    }

    function drawChart(canvas, key, fn, range, color, yLabel, isConstant) {
      const c = setupCanvas(canvas);
      const ctx = c.ctx, w = c.w, h = c.h;
      // 左留 46px 放纵轴数值，上留 10px，下留 30px 放横轴
      const box = { x: 46, y: 10, w: w - 60, h: h - 42 };
      const PX = function (tt) { return box.x + (tt / duration) * box.w; };
      const PY = function (val) { return box.y + box.h - (val - range[0]) / (range[1] - range[0]) * box.h; };

      const yZero = (range[0] < 0 && range[1] > 0) ? PY(0) : null;
      drawAxes(ctx, box, { yZero: yZero });

      // 曲线
      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x, box.y - 2, box.w + 2, box.h + 4);
      ctx.clip();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k <= 60; k++) {
        const tt = k * duration / 60;
        const yy = PY(fn(tt));
        if (k === 0) ctx.moveTo(PX(tt), yy); else ctx.lineTo(PX(tt), yy);
      }
      ctx.stroke();

      // v–t 图的面积 = 位移
      if (key === 'v' && yZero != null) {
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(PX(0), yZero);
        for (let k = 0; k <= 60; k++) {
          const tt = (t / 60) * k;
          ctx.lineTo(PX(tt), PY(fn(tt)));
        }
        ctx.lineTo(PX(t), yZero);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // 当前时刻竖线与当前点
      const cx = PX(t), cy = PY(fn(t));
      ctx.strokeStyle = 'rgba(23,27,24,.22)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, box.y);
      ctx.lineTo(cx, box.y + box.h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 纵轴：名称在左上角外侧，数值在轴左侧（顶端数值下移，避免压住名称）
      label(ctx, yLabel, 4, box.y + 18, { size: 9, color: '#8a918a' });
      label(ctx, UI.num(range[1], 2), box.x - 7, box.y + 9, { align: 'right', size: 8 });
      label(ctx, UI.num(range[0], 2), box.x - 7, box.y + box.h, { align: 'right', size: 8 });
      if (yZero != null) {
        label(ctx, '0', box.x - 7, yZero + 3, { align: 'right', size: 8 });
      }
      // 横轴刻度
      label(ctx, '0', box.x, box.y + box.h + 14, { align: 'center', size: 8 });
      label(ctx, String(duration) + ' s', box.x + box.w, box.y + box.h + 14, { align: 'right', size: 8 });

      if (isConstant) {
        label(ctx, '水平线：a 不随时间变化', box.x + 8, box.y + 15, { size: 9, color: '#8a6a13' });
      }
    }

    /* ------------------------------------------------------------- 播放 */
    function loop(ts) {
      if (!playing || destroyed) return;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      t += dt;
      if (t >= duration) { t = duration; playing = false; syncPlayBtn(); }
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function play() {
      if (t >= duration) t = 0;
      playing = true;
      lastTs = 0;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
      syncPlayBtn();
    }
    function pause() {
      playing = false;
      cancelAnimationFrame(rafId);
      syncPlayBtn();
    }
    function syncPlayBtn() {
      const b = host.querySelector('[data-act="play"]');
      if (b) b.textContent = playing ? '暂停' : '开始';
      if (b) b.setAttribute('aria-label', playing ? '暂停动画' : '开始动画');
    }

    host.querySelector('[data-act="play"]').addEventListener('click', function () {
      if (playing) pause(); else play();
    });
    host.querySelector('[data-act="step"]').addEventListener('click', function () {
      pause();
      t = Math.min(duration, t + 0.2);
      draw();
    });
    host.querySelector('[data-act="reset"]').addEventListener('click', function () {
      pause();
      t = 0;
      draw();
    });

    timeSlider.addEventListener('input', function () {
      pause();
      t = Number(timeSlider.value);
      draw();
    });

    host.querySelectorAll('input[data-key]').forEach(function (input) {
      input.addEventListener('input', function () {
        const key = input.getAttribute('data-key');
        P[key] = Number(input.value);
        t = 0;
        pause();
        Store.setLabState('lab-constant-accel', { x0: P.x0, v0: P.v0, a: P.a });
        draw();
      });
      // 键盘支持由 range 原生提供（方向键调整）
    });

    // 尺寸变化时重绘
    const onResize = UI.debounce(function () { draw(); }, 140);
    global.addEventListener('resize', onResize);

    draw();
    syncPlayBtn();

    return {
      destroy: function () {
        destroyed = true;
        playing = false;
        cancelAnimationFrame(rafId);
        global.removeEventListener('resize', onResize);
      }
    };
  }

  registry['lab-constant-accel'] = ConstantAccel;

  /* 其余实验共用播放与参数控件；物理计算独立于画布，便于数值验证。 */
  const models = {
    collision: function (p, t) {
      const e = p.e, total = p.m1 + p.m2;
      const v1 = ((p.m1 - e * p.m2) * p.u1 + (1 + e) * p.m2 * p.u2) / total;
      const v2 = ((p.m2 - e * p.m1) * p.u2 + (1 + e) * p.m1 * p.u1) / total;
      return { v1: v1, v2: v2, x1: t < 1 ? p.u1 * (t - 1) : v1 * (t - 1), x2: t < 1 ? p.u2 * (t - 1) : v2 * (t - 1),
        beforeP: p.m1 * p.u1 + p.m2 * p.u2, afterP: p.m1 * v1 + p.m2 * v2,
        beforeK: (p.m1 * p.u1 ** 2 + p.m2 * p.u2 ** 2) / 2, afterK: (p.m1 * v1 ** 2 + p.m2 * v2 ** 2) / 2 };
    },
    harmonic: function (p, t) {
      const w = Math.sqrt(p.k / p.m), x = p.A * Math.cos(w * t), v = -p.A * w * Math.sin(w * t);
      return { x: x, v: v, a: -w * w * x, Ek: p.m * v * v / 2, Ep: p.k * x * x / 2, E: p.k * p.A * p.A / 2, T: 2 * Math.PI / w };
    },
    doubleSlit: function (p, x) {
      const spacing = p.D * p.lambda * 1e-9 / (p.d * 1e-3);
      return { spacing: spacing, intensity: Math.cos(Math.PI * x / spacing) ** 2 };
    },
    field: function (p, x, y) {
      let Ex = 0, Ey = 0, V = 0;
      [[p.q1, p.x1, p.y1], [p.q2, p.x2, p.y2]].forEach(function (q) {
        const dx = x - q[1], dy = y - q[2], r = Math.hypot(dx, dy);
        if (r < 1e-10) { Ex = Ey = V = NaN; return; }
        const kq = 8.9875517923 * q[0]; // q以nC输入
        Ex += kq * dx / r ** 3; Ey += kq * dy / r ** 3; V += kq / r;
      });
      return { Ex: Ex, Ey: Ey, V: V, E: Math.hypot(Ex, Ey) };
    }
  };
  PHYS.labModels = models;

  function plot(canvas, series, xmin, xmax, ymin, ymax, xlabel, ylabel, marker) {
    const c = setupCanvas(canvas), ctx = c.ctx;
    const b = { x: 54, y: 24, w: c.w - 72, h: c.h - 65 };
    const X = v => b.x + (v - xmin) / (xmax - xmin) * b.w;
    const Y = v => b.y + b.h - (v - ymin) / (ymax - ymin) * b.h;
    drawAxes(ctx, b, { yZero: Y(0) });
    label(ctx, ylabel, 4, 14); label(ctx, xlabel, c.w - 8, c.h - 5, { align: 'right' });
    label(ctx, UI.trimNum(ymax, 2), b.x - 5, b.y + 7, { align: 'right' });
    label(ctx, UI.trimNum(ymin, 2), b.x - 5, b.y + b.h, { align: 'right' });
    label(ctx, String(xmin), b.x, c.h - 20); label(ctx, String(xmax), b.x + b.w, c.h - 20, { align: 'right' });
    series.forEach(function (s, j) {
      ctx.save(); ctx.beginPath(); ctx.rect(b.x, b.y, b.w, b.h); ctx.clip();
      ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.setLineDash(j % 2 ? [5, 3] : []); ctx.beginPath();
      for (let i = 0; i <= 600; i++) { const x = xmin + i / 600 * (xmax - xmin), y = Y(s.fn(x)); if (i) ctx.lineTo(X(x), y); else ctx.moveTo(X(x), y); }
      ctx.stroke(); ctx.restore(); label(ctx, s.name, b.x + 8 + j * Math.max(65, b.w / series.length), b.y + 15, { color: s.color });
    });
    if (marker != null) { ctx.strokeStyle = '#333'; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(X(marker), b.y); ctx.lineTo(X(marker), b.y + b.h); ctx.stroke(); ctx.setLineDash([]); }
    return { ctx: ctx, b: b, X: X, Y: Y, w: c.w, h: c.h };
  }

  function Workbench(host, id, defs, duration, draw, options) {
    const lab = PHYS.labs.find(l => l.id === id), p = {}, saved = Store.labStateOf(id);
    defs.forEach(function (d) { const v = saved && saved.params && saved.params[d.key]; p[d.key] = Number.isFinite(v) ? Math.min(d.max, Math.max(d.min, v)) : d.value; });
    let t = 0, playing = false, raf = null, previous = null, destroyed = false;
    host.innerHTML = '<div class="summary-box"><b>观察任务：</b>' + UI.esc(lab.question) + '<ul>' + (options && options.compact ? lab.assumptions.map(a => '<li>' + UI.esc(a) + '</li>').join('') : '') + '</ul></div><div class="lab-workspace"' + (options && options.compact ? ' style="grid-template-columns:1fr"' : '') + '><div><div class="stage"><canvas data-main data-h="300" role="img" aria-label="' + UI.esc(lab.title) + '"></canvas><canvas data-chart data-h="230" role="img" aria-label="带单位和文字标识的实验曲线"></canvas></div><div class="card" data-read aria-live="off"></div></div><div class="lab-controls"><div class="card">' + defs.map(d => '<label class="ctrl"><span class="ctrl-head">' + UI.esc(d.name) + '<output data-out="' + d.key + '"></output></span><input type="range" data-key="' + d.key + '" min="' + d.min + '" max="' + d.max + '" step="' + d.step + '" value="' + p[d.key] + '" aria-label="' + UI.esc(d.name + '，' + d.unit) + '"><span class="range-hint">' + d.min + ' ～ ' + d.max + ' ' + UI.esc(d.unit) + '</span></label>').join('') + '</div>' + (id === 'lab-collision' ? '<label class="card" style="display:block">碰撞类型 <select data-mode><option value="1">弹性碰撞</option><option value="0">完全非弹性碰撞（粘连）</option></select></label>' : '') + '<div class="transport"><button class="btn" data-play>开始</button><button class="btn" data-step>单步</button><button class="btn" data-reset>复位</button></div><p data-time></p><p>' + (id === 'lab-field-superposition' || id === 'lab-double-slit' ? '开始后以 1 倍速扫描探针；场和条纹本身不随时间变化。单步推进 0.1 s。' : '按真实秒播放，单步推进 0.1 s；更改参数会暂停并回到起点。') + '</p></div></div>';
    const main = host.querySelector('[data-main]'), chart = host.querySelector('[data-chart]'), read = host.querySelector('[data-read]');
    if (id === 'lab-collision') { p.e = saved && saved.params && saved.params.e === 0 ? 0 : 1; host.querySelector('[data-mode]').value = p.e; }
    function render() {
      if (destroyed) return;
      defs.forEach(d => { host.querySelector('[data-out="' + d.key + '"]').textContent = UI.trimNum(p[d.key], 3) + ' ' + d.unit; });
      host.querySelector('[data-play]').textContent = playing ? '暂停' : '开始';
      host.querySelector('[data-time]').textContent = 't = ' + t.toFixed(2) + ' / ' + duration + ' s';
      draw(p, t, main, chart, read);
    }
    function pause() { playing = false; cancelAnimationFrame(raf); previous = null; }
    function tick(ts) {
      if (!playing || destroyed) return;
      if (previous != null) t = Math.min(duration, t + Math.min((ts - previous) / 1000, 0.1));
      previous = ts; if (t === duration) pause(); render(); if (playing) raf = requestAnimationFrame(tick);
    }
    host.querySelector('[data-play]').addEventListener('click', function () { if (playing) pause(); else { if (t >= duration) t = 0; playing = true; previous = null; raf = requestAnimationFrame(tick); } render(); });
    host.querySelector('[data-step]').addEventListener('click', function () { pause(); t = Math.min(duration, t + 0.1); render(); });
    host.querySelector('[data-reset]').addEventListener('click', function () { pause(); t = 0; render(); });
    host.querySelectorAll('[data-key], [data-mode]').forEach(function (input) { input.addEventListener('input', function () { pause(); t = 0; p[input.dataset.key || 'e'] = Number(input.value); Store.setLabState(id, p); render(); }); });
    const resize = function () { render(); }; global.addEventListener('resize', resize); render();
    return { destroy: function () { destroyed = true; pause(); global.removeEventListener('resize', resize); } };
  }
  function param(key, name, unit, min, max, step, value) { return { key: key, name: name, unit: unit, min: min, max: max, step: step, value: value }; }
  function Collision(host, opts) {
    return Workbench(host, 'lab-collision', [param('m1','车1质量','kg',0.5,5,0.5,1),param('m2','车2质量','kg',0.5,5,0.5,2),param('u1','车1初速度','m/s',0.5,4,0.5,2),param('u2','车2初速度','m/s',-3,0,0.5,-1)],4,function (p,t,main,chart,read) {
      const r = models.collision(p,t), c = setupCanvas(main), b = {x:30,y:25,w:c.w-60,h:220}; drawAxes(c.ctx,b);
      const start=models.collision(p,0),end=models.collision(p,4),range=niceRange(Math.min(start.x1,start.x2,end.x1,end.x2),Math.max(start.x1,start.x2,end.x1,end.x2));
      const X = x => 30 + (x-range[0])/(range[1]-range[0])*b.w;
      label(c.ctx,'位置 x / m：'+range[0].toFixed(1)+' ～ '+range[1].toFixed(1)+'；向右为正',30,285);
      [1,2].forEach(function (n) { const x = r['x'+n], y = n===1 ? 90 : 180; c.ctx.fillStyle = n===1 ? '#277269' : '#ad751a'; c.ctx.fillRect(X(x)-14,y-12,28,24); label(c.ctx,'车'+n+'：x='+x.toFixed(2)+' m',30,y-30); label(c.ctx,'v='+ (t<1?p['u'+n]:r['v'+n]).toFixed(2)+' m/s',30,y+36); });
      label(c.ctx,'同一直线分两行标记；点车在 t = 1 s 瞬时碰撞',30,20);
      plot(chart,[{name:'车1 x',color:'#277269',fn:tt=>models.collision(p,tt).x1},{name:'车2 x',color:'#ad751a',fn:tt=>models.collision(p,tt).x2}],0,4,range[0],range[1],'t / s','x / m',t);
      read.innerHTML = '<p>总动量：碰前 '+r.beforeP.toFixed(3)+' → 碰后 '+r.afterP.toFixed(3)+' kg·m/s</p><p>总动能：碰前 '+r.beforeK.toFixed(3)+' → 碰后 '+r.afterK.toFixed(3)+' J；损失 '+(r.beforeK-r.afterK).toFixed(3)+' J</p><p>'+ (t<1?'尚未碰撞；表中同时给出理论碰后值。':p.e===1?'弹性碰撞：动量与动能均守恒。':'两车粘连：动量守恒，动能转为内能。')+'</p>';
    },opts);
  }
  function Harmonic(host, opts) {
    return Workbench(host, 'lab-shm', [param('m','质量','kg',0.2,3,0.1,1),param('k','劲度系数','N/m',1,40,1,10),param('A','振幅','m',0.05,0.5,0.01,0.3)],12,function(p,t,main,chart,read){
      const r = models.harmonic(p,t), c=setupCanvas(main), b={x:25,y:30,w:c.w-50,h:220};drawAxes(c.ctx,b);
      const X=x=>c.w/2+x*(c.w-70)/1.2, cy=110;
      c.ctx.strokeStyle='#277269';c.ctx.beginPath();c.ctx.moveTo(30,cy);for(let i=0;i<=24;i++)c.ctx.lineTo(30+(X(r.x)-50)*i/24,cy+(i===0||i===24?0:(i%2?10:-10)));c.ctx.stroke();c.ctx.fillStyle='#277269';c.ctx.fillRect(X(r.x)-12,cy-15,24,30);
      label(c.ctx,'x = 0：平衡位置，向右为正',30,24);label(c.ctx,'位置显示范围 -0.6 ～ +0.6 m',30,160);
      [['动能 Ek',r.Ek,'#ad751a'],['势能 Ep',r.Ep,'#277269']].forEach(function(a,i){c.ctx.fillStyle=a[2];c.ctx.fillRect(100,190+i*38,(c.w-130)*a[1]/r.E,18);label(c.ctx,a[0],30,204+i*38);});
      plot(chart,[{name:'x / A',color:'#277269',fn:tt=>models.harmonic(p,tt).x/p.A},{name:'v / Aω',color:'#ad751a',fn:tt=>models.harmonic(p,tt).v/(p.A*Math.sqrt(p.k/p.m))},{name:'a / Aω²',color:'#7454a6',fn:tt=>models.harmonic(p,tt).a/(p.A*p.k/p.m)}],0,12,-1.1,1.1,'t / s','归一化分量 / 1',t);
      read.innerHTML='<p>x = '+r.x.toFixed(4)+' m；v = '+r.v.toFixed(4)+' m/s；a = '+r.a.toFixed(4)+' m/s²</p><p>Ek = '+r.Ek.toFixed(4)+' J；Ep = '+r.Ep.toFixed(4)+' J；E = '+r.E.toFixed(4)+' J</p><p>T = '+r.T.toFixed(4)+' s；下图分别除以 A、Aω、Aω² 便于比较相位，真实量见读数。复位对应 x=A、v=0。</p>';
    },opts);
  }
  function DoubleSlit(host, opts) {
    return Workbench(host,'lab-double-slit',[param('lambda','波长 λ','nm',390,780,10,550),param('d','缝距 d','mm',0.1,2,0.05,0.5),param('D','屏距 D','m',1,5,0.1,2)],8,function(p,t,main,chart,read){
      const x=-0.012+0.024*t/8,r=models.doubleSlit(p,x),c=setupCanvas(main),b={x:35,y:30,w:c.w-55,h:220};drawAxes(c.ctx,b);
      for(let i=0;i<b.w;i++){const xx=-.012+.024*i/b.w,I=models.doubleSlit(p,xx).intensity;c.ctx.fillStyle='rgb('+Math.round(250*I)+','+Math.round(185*I)+','+Math.round(70*I)+')';c.ctx.fillRect(b.x+i,b.y,1,b.h);}
      label(c.ctx,'屏幕局部：固定范围 -12 ～ +12 mm；颜色仅示意',20,20);label(c.ctx,'-12 mm',35,275);label(c.ctx,'+12 mm',c.w-20,275,{align:'right'});
      const px=b.x+(x+.012)/.024*b.w;c.ctx.strokeStyle='#fff';c.ctx.beginPath();c.ctx.moveTo(px,b.y);c.ctx.lineTo(px,b.y+b.h);c.ctx.stroke();
      plot(chart,[{name:'相对光强 I/Imax',color:'#277269',fn:mm=>models.doubleSlit(p,mm/1000).intensity}],-12,12,0,1,'屏位置 x / mm','I / Imax',x*1000);
      read.innerHTML='<p>Δx = Dλ/d = '+(r.spacing*1000).toFixed(4)+' mm</p><p>探针 x = '+(x*1000).toFixed(3)+' mm；I/Imax = '+r.intensity.toFixed(4)+'</p><p>等强窄缝、远场小角度；忽略单缝衍射包络。图中毫米坐标固定，未改变物理条纹间距。</p>';
    },opts);
  }
  function FieldSuperposition(host, opts) {
    const defs=[param('q1','电荷1','nC',-5,5,0.5,2),param('q2','电荷2','nC',-5,5,0.5,-2),param('x1','电荷1横坐标','m',-1.5,1.5,0.1,-.7),param('y1','电荷1纵坐标','m',-1.5,1.5,.1,0),param('x2','电荷2横坐标','m',-1.5,1.5,.1,.7),param('y2','电荷2纵坐标','m',-1.5,1.5,.1,0)];
    return Workbench(host,'lab-field-superposition',defs,8,function(p,t,main,chart,read){
      const c=setupCanvas(main),ctx=c.ctx,side=Math.min(c.w-62,235),b={x:(c.w-side)/2,y:25,w:side,h:side};drawAxes(ctx,b);
      const X=x=>b.x+(x+2)/4*b.w,Y=y=>b.y+(2-y)/4*b.h,near=(x,y)=>Math.min(Math.hypot(x-p.x1,y-p.y1),Math.hypot(x-p.x2,y-p.y2))<.16;
      // Marching squares：线性内插同一物理电势值的相邻网格交点。
      [-40,-20,-10,-5,0,5,10,20,40].forEach(function(level){ctx.strokeStyle=level===0?'#555':'#b49a72';ctx.setLineDash(level<0?[3,3]:[]);ctx.beginPath();const n=42;
        for(let i=0;i<n;i++)for(let j=0;j<n;j++){
          const x=-2+4*i/n,y=-2+4*j/n,h=4/n,pts=[[x,y],[x+h,y],[x+h,y+h],[x,y+h]];
          if(pts.some(a=>near(a[0],a[1])))continue;
          const vals=pts.map(a=>models.field(p,a[0],a[1]).V),cross=[];
          for(let k=0;k<4;k++){let z=(k+1)%4;if((vals[k]<level)!==(vals[z]<level)){const f=(level-vals[k])/(vals[z]-vals[k]);cross.push([pts[k][0]+f*(pts[z][0]-pts[k][0]),pts[k][1]+f*(pts[z][1]-pts[k][1])]);}}
          for(let k=0;k+1<cross.length;k+=2){ctx.moveTo(X(cross[k][0]),Y(cross[k][1]));ctx.lineTo(X(cross[k+1][0]),Y(cross[k+1][1]));}
        }ctx.stroke();});ctx.setLineDash([]);
      // 箭头等长，仅表达方向，量值由探针读出。
      ctx.strokeStyle='#277269';for(let x=-1.8;x<2;x+=.4)for(let y=-1.8;y<2;y+=.4){if(near(x,y))continue;const r=models.field(p,x,y);if(r.E<1e-10)continue;let dx=r.Ex/r.E*9,dy=-r.Ey/r.E*9,px=X(x),py=Y(y);ctx.beginPath();ctx.moveTo(px-dx/2,py-dy/2);ctx.lineTo(px+dx/2,py+dy/2);ctx.lineTo(px+dx/2-.4*dx+.3*dy,py+dy/2-.4*dy-.3*dx);ctx.moveTo(px+dx/2,py+dy/2);ctx.lineTo(px+dx/2-.4*dx-.3*dy,py+dy/2-.4*dy+.3*dx);ctx.stroke();}
      [[p.q1,p.x1,p.y1,1],[p.q2,p.x2,p.y2,2]].forEach(function(q){ctx.fillStyle=q[0]>=0?'#ad751a':'#7454a6';ctx.beginPath();ctx.arc(X(q[1]),Y(q[2]),7,0,2*Math.PI);ctx.fill();label(ctx,'q'+q[3]+'='+q[0]+' nC',Math.min(c.w-92,Math.max(12,X(q[1])+8)),Y(q[2])-10,{color:'#222'});});
      const x=-1.8+3.6*t/8,y=.7,r=models.field(p,x,y);ctx.fillStyle='#111';ctx.fillRect(X(x)-3,Y(y)-3,6,6);label(ctx,'探针',X(x)+5,Y(y)+15,{color:'#111'});
      label(ctx,'x / m：-2 ～ +2；y / m：-2 ～ +2（向上）',20,285);label(ctx,'实线正V；虚线负V；零线灰色',20,16);
      const vals=Array.from({length:61},(_,i)=>models.field(p,-1.8+i*3.6/60,.7).V).filter(Number.isFinite),range=niceRange(Math.max(-200,Math.min(...vals)),Math.min(200,Math.max(...vals)),.1);
      plot(chart,[{name:'y = 0.7 m 上电势',color:'#7454a6',fn:xx=>near(xx,.7)?NaN:models.field(p,xx,.7).V}],-1.8,1.8,range[0],range[1],'x / m','V / V',x);
      read.innerHTML='<p>探针 ('+x.toFixed(3)+', 0.700) m；V = '+UI.num(r.V,3)+' V</p><p>Ex = '+UI.num(r.Ex,3)+' N/C；Ey = '+UI.num(r.Ey,3)+' N/C；|E| = '+UI.num(r.E,3)+' N/C</p><p>等势线取 0、±5、±10、±20、±40 V；无穷远电势为零。箭头等长只示方向，非场强大小；图中电荷附近0.16 m隐藏奇点区域。探针落在电荷中心时该点场量无定义。</p>';
    },opts);
  }
  registry['lab-collision']=Collision;
  registry['lab-shm']=Harmonic;
  registry['lab-double-slit']=DoubleSlit;
  registry['lab-field-superposition']=FieldSuperposition;

  /* --------------------------------------------------------------- 生命周期 */

  PHYS.lab = {
    register: function (id, factory) { registry[id] = factory; },
    mount: function (id, host, opts) {
      const factory = registry[id];
      if (!factory) {
        host.innerHTML = '<p class="empty">这个实验还在开发中。</p>';
        return null;
      }
      const inst = factory(host, opts);
      running.push(inst);
      return inst;
    },
    destroyAll: function () {
      running.splice(0).forEach(function (inst) {
        try { if (inst && inst.destroy) inst.destroy(); } catch (e) { console.warn(e); }
      });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
