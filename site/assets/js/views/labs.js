/* ==========================================================================
   views/labs.js —— 互动实验室目录与单个实验页面
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;

  PHYS.views.labs = function () {
    const cards = PHYS.labs.map(function (l) {
      const ch = PHYS.getChapter(l.chapter);
      const available = l.status === 'available';
      if (!available) {
        return '<div class="lab-card pending">' +
          '<span class="glyph" aria-hidden="true">◌</span>' +
          '<div><h3>' + UI.esc(l.title) + '</h3>' +
          '<p>第 ' + ch.num + ' 章 · ' + UI.esc(l.question) + '</p>' +
          '<p style="margin-top:4px"><span class="badge-pending">待更新</span></p></div></div>';
      }
      return '<a class="lab-card" href="#/lab/' + l.id + '">' +
        '<span class="glyph" aria-hidden="true">▶</span>' +
        '<div><h3>' + UI.esc(l.title) + '</h3>' +
        '<p>第 ' + ch.num + ' 章 · ' + UI.esc(l.question) + '</p></div></a>';
    }).join('');

    return {
      title: '互动实验室',
      html: '<div class="page">' +
        '<div class="page-head"><h1>互动实验室</h1>' +
        '<p>每个实验先给出一个可验证的问题，再让你调参数、看图像、读数值。' +
        '动画只用来建立直觉，结论要靠图像与数值检验。所有实验都会标注理想化假设。</p></div>' +
        '<div class="lab-layout" style="grid-template-columns:1fr">' +
        '<div><div class="side-title">实验目录</div>' + cards + '</div>' +
        '</div>' +
        '<div class="summary-box" style="margin-top:28px"><h3 style="margin-top:0">实验的统一标准</h3>' +
        '<ul style="font-size:.9rem;margin-bottom:0">' +
        '<li>控件给出参数名称、单位、范围与当前值，并支持方向键调整。</li>' +
        '<li>运动类实验提供开始、暂停、单步与复位。</li>' +
        '<li>同时展示关键数值，使你能检验图像，而不是只凭动画判断结论。</li>' +
        '<li>区分真实物理量与为显示而缩放的量，并标注理想化假设。</li>' +
        '<li>不只依赖颜色区分物体或曲线；图示附带文字说明。</li>' +
        '</ul></div>' +
        '</div>'
    };
  };

  PHYS.views.labPage = function (id) {
    if (id === 'lab-harmonic') id = 'lab-shm'; // 任务清单别名兼容既有稳定标识
    const lab = PHYS.labs.find(function (l) { return l.id === id; });
    if (!lab) return PHYS.views.notFoundOf('实验');

    if (lab.status !== 'available') {
      return {
        title: lab.title,
        html: '<div class="page"><div class="wrap-narrow" style="padding-top:30px">' +
          PHYS.views.crumbs([{ label: '首页', href: '#/' }, { label: '互动实验室', href: '#/labs' }, { label: lab.title }]) +
          '<div class="empty-state" style="margin-top:20px"><h2 style="margin-top:0">' + UI.esc(lab.title) + '</h2>' +
          '<p>这个实验还在开发中。计划围绕的问题是：' + UI.esc(lab.question) + '</p>' +
          '<a class="btn" href="#/labs">返回实验目录</a></div></div></div>'
      };
    }

    const ch = PHYS.getChapter(lab.chapter);
    const secs = (lab.sections || []).map(function (sid) { return PHYS.getSection(sid); }).filter(Boolean);

    return {
      title: lab.title,
      html: '<div class="page">' +
        PHYS.views.crumbs([{ label: '首页', href: '#/' }, { label: '互动实验室', href: '#/labs' }, { label: lab.title }]) +
        '<div style="margin:14px 0 20px">' +
        '  <div class="sec-kicker">互动实验 · 第 ' + ch.num + ' 章 ' + UI.esc(ch.title) + '</div>' +
        '  <h1 style="font-family:var(--serif);margin:.3em 0 .2em">' + UI.esc(lab.title) + '</h1>' +
        '  <p style="color:var(--ink-2);max-width:46em;margin:0">' + UI.esc(lab.question) + '</p>' +
        '</div>' +
        '<div class="card" style="margin-bottom:16px">' +
        '  <div class="side-title" style="margin-bottom:6px">模型假设</div>' +
        '  <ul style="margin:0;font-size:.88rem">' + lab.assumptions.map(function (a) { return '<li>' + UI.esc(a) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
        '<div id="labMount"></div>' +
        (id === 'lab-constant-accel' ? '<div class="card" style="margin-top:18px">' +
        '  <div class="side-title" style="margin-bottom:6px">如何读这三种图像</div>' +
        '  <ul style="margin:0;font-size:.9rem">' +
        '  <li><b>x–t 图的斜率</b>是该时刻的速度。斜率为正说明沿 +x 方向运动，斜率变陡说明变快。</li>' +
        '  <li><b>v–t 图的斜率</b>是加速度；加速度恒定时它就是一条直线。</li>' +
        '  <li><b>v–t 图与时间轴围成的有向面积</b>等于位移 Δx（图中浅色区域）。</li>' +
        '  <li><b>a–t 图</b>在匀加速模型中是一条水平线；它的高度就是加速度值。</li>' +
        '  <li>加速度与速度同向时速率增大，反向时速率减小；<b>加速度为正不等于“加速”</b>。</li>' +
        '  </ul>' +
        '</div>' : '') +
        (secs.length ? '<div class="card" style="margin-top:14px"><div class="side-title" style="margin-bottom:6px">关联课程</div>' +
          '<ul style="margin:0;font-size:.9rem">' + secs.map(function (s) {
            return '<li><a href="#/learn/' + s.id + '">' + s.num + ' ' + UI.esc(s.title) + '</a></li>';
          }).join('') + '</ul></div>' : '') +
        '<div class="pager"><a class="prev" href="#/labs"><span class="dir">←</span><span class="ttl">返回实验目录</span></a></div>' +
        '</div>',
      mount: function (host) {
        const mount = host.querySelector('#labMount');
        PHYS.lab.mount(lab.id, mount, { compact: false });
      }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
