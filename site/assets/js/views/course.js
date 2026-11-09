/* ==========================================================================
   views/course.js —— 课程相关页面
     home()            首页
     course()          课程总目录
     chapter(id)       章节概览
     section(id)       小节学习页
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;
  const md = PHYS.md;
  const Store = PHYS.Store;

  /* ============================================================== 公共片段 */

  function crumbs(items) {
    return '<nav class="crumbs" aria-label="面包屑">' + items.map(function (it, i) {
      const last = i === items.length - 1;
      const node = it.href && !last
        ? '<a href="' + it.href + '">' + UI.esc(it.label) + '</a>'
        : '<span' + (last ? ' aria-current="page"' : '') + '>' + UI.esc(it.label) + '</span>';
      return node + (last ? '' : '<span class="sep" aria-hidden="true">›</span>');
    }).join('') + '</nav>';
  }

  function chapterSideList(chapter, activeSectionId) {
    const flat = PHYS.flatSections();
    const idx = flat.findIndex(function (s) { return s.id === activeSectionId; });
    const prevEntry = idx > 0 ? flat[idx - 1] : null;
    const nextEntry = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
    // 同章内换节时不显示“相邻章节”里的本章自身
    const prevChapter = prevEntry && prevEntry.chapterId !== chapter.id ? PHYS.getChapter(prevEntry.chapterId) : null;
    const nextChapter = nextEntry && nextEntry.chapterId !== chapter.id ? PHYS.getChapter(nextEntry.chapterId) : null;

    let html = '<div class="side-block">' +
      '<div class="side-title"><a href="#/course">← 课程总目录</a></div>' +
      '<div class="side-title" style="margin-top:14px"><a href="#/chapter/' + chapter.id + '">第 ' + chapter.num + ' 章 · ' + UI.esc(chapter.title) + '</a></div>' +
      '<ul class="side-list">';
    chapter.sections.forEach(function (s) {
      if (s.status === 'published') {
        const learned = Store.isLearned(s.id);
        html += '<li><a href="#/learn/' + s.id + '"' + (s.id === activeSectionId ? ' aria-current="page"' : '') + '>' +
          '<span class="num">' + s.num + '</span><span>' + UI.esc(s.title) + '</span>' +
          (learned ? '<span class="check" aria-label="已学">✓</span>' : '') + '</a></li>';
      } else {
        html += '<li><a class="pending" href="#/learn/' + s.id + '"><span class="num">' + s.num + '</span><span>' + UI.esc(s.title) + '（待更新）</span></a></li>';
      }
    });
    html += '</ul></div>';

    if (prevChapter || nextChapter) {
      html += '<div class="side-block"><div class="side-title">相邻章节</div><ul class="side-list">';
      if (prevChapter) {
        html += '<li><a href="#/chapter/' + prevChapter.id + '"><span class="num">←</span><span>' + prevChapter.num + ' ' + UI.esc(prevChapter.title) + '</span></a></li>';
      }
      if (nextChapter) {
        html += '<li><a href="#/chapter/' + nextChapter.id + '"><span class="num">→</span><span>' + nextChapter.num + ' ' + UI.esc(nextChapter.title) + '（待更新）</span></a></li>';
      }
      html += '</ul></div>';
    }
    return html;
  }

  /* ================================================================ 首页 */

  function heroFigure() {
    // 一条抛物线与速度分量示意（纯装饰 + 文字说明）
    return '' +
      '<svg viewBox="0 0 420 260" role="img" aria-labelledby="heroFigTitle">' +
      '<title id="heroFigTitle">示意图：抛体运动的轨迹，水平方向匀速、竖直方向匀加速</title>' +
      '<defs><pattern id="gridp" width="28" height="28" patternUnits="userSpaceOnUse">' +
      '<path d="M28 0H0V28" fill="none" stroke="#e8e3d8" stroke-width="1"/></pattern></defs>' +
      '<rect x="0" y="0" width="420" height="260" fill="url(#gridp)" rx="8"/>' +
      '<g stroke="#cfc7b6" stroke-width="1.2">' +
      '<line x1="30" y1="228" x2="400" y2="228"/><line x1="30" y1="228" x2="30" y2="30"/>' +
      '</g>' +
      '<text x="404" y="232" font-size="11" fill="#8c938c">x</text>' +
      '<text x="22" y="26" font-size="11" fill="#8c938c">y</text>' +
      '<path d="M40 218 Q 210 30 390 218" fill="none" stroke="#0e6355" stroke-width="2.4" stroke-dasharray="0"/>' +
      '<circle cx="120" cy="105" r="5.5" fill="#a9502b"/>' +
      '<line x1="120" y1="105" x2="164" y2="105" stroke="#a9502b" stroke-width="1.8" marker-end="url(#ar)"/>' +
      '<line x1="120" y1="105" x2="120" y2="61" stroke="#8a6a13" stroke-width="1.8" marker-end="url(#ar2)"/>' +
      '<line x1="120" y1="105" x2="164" y2="61" stroke="#171b18" stroke-width="1.4" stroke-dasharray="3 3"/>' +
      '<defs>' +
      '<marker id="ar" markerWidth="7" markerHeight="7" refX="5" refY="3.2" orient="auto"><path d="M0 0L6 3.2L0 6.4z" fill="#a9502b"/></marker>' +
      '<marker id="ar2" markerWidth="7" markerHeight="7" refX="5" refY="3.2" orient="auto"><path d="M0 0L6 3.2L0 6.4z" fill="#8a6a13"/></marker>' +
      '</defs>' +
      '<text x="168" y="109" font-size="11" fill="#a9502b">vₓ 恒定</text>' +
      '<text x="124" y="56" font-size="11" fill="#8a6a13">v_y 变化</text>' +
      '<text x="44" y="240" font-size="11" fill="#6a736c">位置、速度、加速度都是时间的函数</text>' +
      '</svg>';
  }

  function continueCard() {
    const pos = Store.getPosition();
    if (!pos) {
      return '<div class="continue-card">' +
        '<div class="cc-main"><div class="cc-kicker">从这里开始</div>' +
        '<h3>第 01 章 · 1.1 质点模型、参考系与坐标系</h3>' +
        '<p>还没有学习记录。打开第一节后，最近位置会自动保存到本机。</p></div>' +
        '<a class="btn btn-primary" href="#/learn/ch01-s01">开始学习</a></div>';
    }
    const sec = PHYS.getSection(pos.sectionId);
    const ch = sec ? PHYS.getChapter(sec.chapterId) : null;
    return '<div class="continue-card">' +
      '<div class="cc-main"><div class="cc-kicker">继续学习</div>' +
      '<h3>' + (ch ? '第 ' + ch.num + ' 章 · ' : '') + UI.esc(sec ? sec.num + ' ' + sec.title : '上次的小节') + '</h3>' +
      '<p>上次浏览于 ' + UI.formatDate(pos.at) + '。学习记录只保存在本机浏览器。</p></div>' +
      '<a class="btn btn-primary" href="#/learn/' + (sec ? sec.id : 'ch01-s01') + '">继续</a></div>';
  }

  function pathStrip() {
    return '<div class="path-strip" aria-label="推荐自学路径"><a href="#/course#prepSection">预备知识</a> → <a href="#/chapter/ch01">01—04 力学</a><span>之后可分支学习：<a href="#/chapter/ch05">电磁学</a> · <a href="#/chapter/ch09">热学</a> · <a href="#/chapter/ch11">振动、波动与光学</a> · <a href="#/chapter/ch14">相对论</a>，再结合波动与概率进入<a href="#/chapter/ch15">量子基础</a>。建议关系不锁章。</span></div>';
  }

  function home() {
    const published = PHYS.publishedChapters();
    const firstCh = PHYS.chapters[0];
    const reviewCount = Store.reviewList().filter(function (r) { return r.status === 'todo'; }).length;

    const moduleCards = PHYS.modules.map(function (m) {
      const chs = m.chapters.map(function (id) { return PHYS.getChapter(id); }).filter(Boolean);
      const live = chs.filter(function (c) { return c.status === 'published'; }).length;
      return '<a class="module-card" href="#/course">' +
        '<span class="glyph" aria-hidden="true">' + m.icon + '</span>' +
        '<h3>' + UI.esc(m.name) + (live ? '<span class="badge-live">' + live + ' 章已发布</span>' : '') + '</h3>' +
        '<div class="chapters-list">' + chs.map(function (c) { return c.num; }).join(' · ') + '</div>' +
        '<p>' + UI.esc(m.goal) + '</p></a>';
    }).join('');

    return {
      title: '首页',
      html: '' +
        '<div class="page">' +
        '<section class="hero">' +
        '  <div class="hero-grid">' +
        '    <div>' +
        '      <div class="eyebrow">大学物理 · 含微积分深度</div>' +
        '      <h1>先把物理情境读懂，<br>再把公式写对。</h1>' +
        '      <p class="lede">理解情境 → 建立模型 → 学习概念与公式 → 分析例题 → 独立练习 → 复习薄弱点。' +
        '      15 章课程、102 节正文已全部发布。</p>' +
        '      <div class="hero-actions">' +
        '        <a class="btn btn-primary" href="#/learn/ch01-s01">开始第 01 章</a>' +
        '        <a class="btn" href="#/course">查看完整目录</a>' +
        '        <a class="btn btn-ghost" href="#/lab/lab-constant-accel">体验互动实验</a>' +
        '      </div>' +
        '    </div>' +
        '    <div class="hero-figure">' + heroFigure() + '</div>' +
        '  </div>' +
        pathStrip() +
        '</section>' +

        continueCard() +

        '<div class="section-head"><h2>五个课程模块</h2><a class="more" href="#/course">全部 15 章 →</a></div>' +
        '<div class="module-grid">' + moduleCards + '</div>' +

        '<div class="section-head"><h2>建议复习</h2><a class="more" href="#/me">我的学习 →</a></div>' +
        (reviewCount
          ? '<div class="card"><p style="margin:0">你还有 <strong>' + reviewCount + '</strong> 道题在“待复习”。' +
            '<a href="#/me">去重做错题 →</a></p></div>'
          : '<div class="card"><p style="margin:0;color:var(--muted)">做过的错题会自动进入“我的学习 → 待复习”。' +
            '目前没有待复习题目。可以先从 <a href="#/learn/ch01-s03">1.3 加速度与运动图像</a> 的随堂练习开始。</p></div>') +

        '<div class="section-head"><h2>怎么用这个站</h2></div>' +
        '<div class="two-col">' +
        '  <div class="card"><h3 style="margin-top:0;font-size:1rem">每节的统一结构</h3>' +
        '    <ol style="font-size:.9rem;margin-bottom:0">' +
        '      <li>学习目标与先修提示</li><li>现象或问题引入</li><li>模型、概念与假设</li>' +
        '      <li>公式及必要推导</li><li>典型例题（分级提示）</li><li>互动探究</li>' +
        '      <li>随堂练习（单选 / 数值）</li><li>小结与后续连接</li>' +
        '    </ol></div>' +
        '  <div class="card"><h3 style="margin-top:0;font-size:1rem">关于学习记录</h3>' +
        '    <ul style="font-size:.9rem;margin-bottom:0">' +
        '      <li>“已学”由你主动标记，不代表掌握。</li>' +
        '      <li>正确率保留题量与是否查看提示的上下文。</li>' +
        '      <li>不合成“掌握度百分比”。</li>' +
        '      <li>记录保存在本机浏览器，可导出与导入；清除浏览器数据会移除记录。</li>' +
        '    </ul></div>' +
        '</div>' +
        '</div>'
    };
  }

  /* ============================================================ 课程总目录 */

  function course() {
    const groups = PHYS.modules.map(function (m) {
      const chs = m.chapters.map(function (id) { return PHYS.getChapter(id); }).filter(Boolean);
      return '<section class="module-section" data-module="' + m.id + '">' +
        '<header><h2>' + UI.esc(m.name) + '</h2><p>' + UI.esc(m.goal) + '</p></header>' +
        '<div class="ch-list">' + chs.map(renderChapterRow).join('') + '</div></section>';
    }).join('');

    return {
      title: '课程总目录',
      html: '<div class="page">' +
        '<div class="page-head">' +
        '  <h1>课程总目录</h1>' +
        '  <p>15 章按教材式顺序排列，归为 5 个模块。另设“预备知识”随用随查，不占正式章节编号。' +
        '  先修关系只作提示，不锁章。</p>' +
        '</div>' +
        '<div class="filter-bar" role="group" aria-label="按模块筛选">' +
        '<button class="filter-btn" data-filter="all" aria-pressed="true">全部</button>' +
        PHYS.modules.map(function (m) {
          return '<button class="filter-btn" data-filter="' + m.id + '" aria-pressed="false">' + UI.esc(m.name) + '</button>';
        }).join('') +
        '</div>' +
        groups +
        renderPreparatory() +
        '</div>',
      mount: function (host) {
        host.querySelectorAll('.filter-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const f = btn.getAttribute('data-filter');
            host.querySelectorAll('.filter-btn').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
            host.querySelectorAll('.module-section').forEach(function (sec) {
              const show = f === 'all' || sec.getAttribute('data-module') === f;
              sec.style.display = show ? '' : 'none';
            });
            const prep = host.querySelector('#prepSection');
            if (prep) prep.style.display = (f === 'all' || f === 'prep') ? '' : 'none';
          });
        });
        // 支持 #/course?section=ch01 展开
      }
    };
  }

  function renderChapterRow(ch) {
    const pub = ch.status === 'published';
    const secs = ch.sections.map(function (s) {
      const learned = Store.isLearned(s.id);
      if (s.status === 'published') {
        return '<li><a href="#/learn/' + s.id + '"><span class="num">' + s.num + '</span><span>' + UI.esc(s.title) + '</span>' +
          (learned ? '<span class="check" style="margin-left:auto;color:var(--ok);font-size:.76rem">✓ 已学</span>' : '') + '</a></li>';
      }
      return '<li><span class="pending"><span class="num">' + s.num + '</span><span>' + UI.esc(s.title) + '</span></span></li>';
    }).join('');

    return '<article class="ch-row">' +
      '<div class="num">' + ch.num + '</div>' +
      '<div>' +
      '<h3>' + (pub ? '<a href="#/chapter/' + ch.id + '">' + UI.esc(ch.title) + '</a>' : UI.esc(ch.title)) + '</h3>' +
      '<p>' + UI.esc(ch.goal) + '</p>' +
      '<ul class="sec-list">' + secs + '</ul>' +
      '</div>' +
      '<div class="status">' + UI.statusPill(ch.status) + '</div>' +
      '</article>';
  }

  function renderPreparatory() {
    return '<section class="module-section" id="prepSection">' +
      '<header><h2>预备知识</h2><p>随用随查。每节正文会链接到实际需要的数学卡片。</p></header>' +
      '<div class="card"><div class="formula-grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">' +
      PHYS.preparatory.map(function (p) {
        return '<div><h4 style="margin:.2em 0 .3em;font-size:.92rem">' + UI.esc(p.title) + '</h4>' +
          '<p style="margin:0;font-size:.85rem;color:var(--ink-2)">' + UI.esc(PHYS.search.plain(p.body).slice(0,95)) + '… <a href="#/prep/' + p.id + '">打开回顾与自测 →</a></p></div>';
      }).join('') +
      '</div><p style="margin:14px 0 0;font-size:.82rem;color:var(--muted)">“梯度、散度、旋度”作为拓展卡片，不作为所有章节的进入门槛。</p></div>' +
      '</section>';
  }

  /* ============================================================ 章节概览 */

  function chapter(chId) {
    const ch = PHYS.getChapter(chId);
    if (!ch) return notFoundOf('章节');
    const mod = PHYS.getModule(ch.module);

    const secCards = ch.sections.map(function (s) {
      const pub = s.status === 'published';
      const learned = Store.isLearned(s.id);
      if (!pub) {
        return '<div class="sec-card pending"><div class="num">' + s.num + '</div>' +
          '<div><h3>' + UI.esc(s.title) + '</h3><p class="sub">本节内容仍在编写中。</p></div>' +
          '<div class="status">' + UI.statusPill('planned') + '</div></div>';
      }
      const qs = PHYS.questions.filter(function (q) { return q.section === s.id; }).length;
      const lab = PHYS.labForSection(s.id);
      return '<a class="sec-card" href="#/learn/' + s.id + '">' +
        '<div class="num">' + s.num + '</div>' +
        '<div><h3>' + UI.esc(s.title) + '</h3><p class="sub">' + qs + ' 道随堂练习' +
        (lab ? ' · 含互动实验' : '') + (learned ? ' · ✓ 已学' : '') + '</p></div>' +
        '<div class="status">' + (learned ? '<span class="status-pill live"><span class="dot"></span>已学</span>' : '<span class="status-pill planned"><span class="dot"></span>未学</span>') + '</div></a>';
    }).join('');

    const prereqHtml = ch.prereq.length
      ? '<div class="card"><h3>建议先修</h3><ul>' + ch.prereq.map(function (p) {
        return '<li>' + UI.esc(p.label || p.note) + '</li>';
      }).join('') + '</ul></div>'
      : '<div class="card"><h3>建议先修</h3><p>第 01 章是整套课程起点；只用到矢量的分解与初等微积分，正文会在需要时补回顾卡。</p></div>';

    const publishedSecs = ch.sections.filter(function (s) { return s.status === 'published'; });

    return {
      title: '第 ' + ch.num + ' 章 ' + ch.title,
      html: '<div class="page"><div class="wrap-narrow" style="max-width:1100px">' +
        crumbs([{ label: '首页', href: '#/' }, { label: '课程目录', href: '#/course' }, { label: '第 ' + ch.num + ' 章' }]) +
        '<div class="ch-head">' +
        '  <div><div class="sec-kicker">' + UI.esc(mod ? mod.name : '力学') + '</div>' +
        '  <h1>第 ' + ch.num + ' 章　' + UI.esc(ch.title) + '</h1>' +
        '  <p class="goal">' + UI.esc(ch.goal) + '</p></div>' +
        '  <div class="num-big" aria-hidden="true">' + ch.num + '</div>' +
        '</div>' +
        '<div class="meta-grid">' +
        '  <div class="card"><h3>本章概览</h3><p>' + UI.esc(ch.summary) + '</p></div>' +
        prereqHtml +
        (ch.points && ch.points.length
          ? '<div class="card"><h3>知识结构</h3><ul>' + ch.points.map(function (p) { return '<li>' + UI.esc(p) + '</li>'; }).join('') + '</ul></div>'
          : '') +
        '</div>' +
        (PHYS.learningNavigation ? PHYS.learningNavigation(ch.id) : '') +
        '<div class="section-head" style="margin-top:10px"><h2>小节</h2>' +
        (publishedSecs.length ? '<a class="more" href="#/learn/' + publishedSecs[0].id + '">开始本章 →</a>' : '<span class="badge-pending">本章待更新</span>') +
        '</div>' +
        '<div class="sec-cards">' + secCards + '</div>' +
        '<div class="summary-box"><h3>章末练习</h3><p style="margin-bottom:0">' + UI.esc(ch.examNote || '可用各节随堂练习自测。') + '</p>' + (PHYS.exams.some(e => e.chapter === ch.id) ? '<p><a class="btn btn-primary" href="#/exam/' + ch.id + '">开始章末测验</a> <a class="btn" href="#/challenge/' + ch.id + '">综合推导与自评</a></p>' : '<p>章末测验待更新</p>') + '</div>' +
        (ch.status !== 'published'
          ? '<div class="empty-state">本章正文尚未发布。上面的小节标题来自已规划目录，点击不会进入空白的学习页。</div>'
          : '') +
        '</div></div>'
    };
  }

  /* ========================================================== 小节学习页 */

  // 将正文拆分为：前置区块（已由数据提供）、Markdown 主体、练习、小结
  function sectionView(secId) {
    const sec = PHYS.getSection(secId);
    if (!sec) return notFoundOf('小节');
    const ch = PHYS.getChapter(sec.chapterId);
    const data = PHYS.content && PHYS.content.sections ? PHYS.content.sections[secId] : null;

    if (!data) {
      // 未发布
      const planned = ch.sections.some(function (s) { return s.id === secId && s.status !== 'published'; }) || sec.status !== 'published';
      return {
        title: sec.num + ' ' + sec.title,
        html: '<div class="page"><div class="wrap-narrow">' +
          crumbs([{ label: '首页', href: '#/' }, { label: '课程目录', href: '#/course' }, { label: '第 ' + ch.num + ' 章', href: '#/chapter/' + ch.id }, { label: sec.num }]) +
          '<div class="empty-state" style="margin-top:20px">' +
          '<h2 style="margin-top:0">' + UI.esc(sec.num + ' ' + sec.title) + '</h2>' +
          '<p>' + (planned ? '这一节的内容仍在编写中，尚未发布。' : '内容不存在。') + '</p>' +
          (planned ? '<p style="font-size:.86rem">这里不会显示虚假的学习进度，也不会提供空按钮。' +
            '可以先回到 <a href="#/chapter/' + ch.id + '">第 ' + ch.num + ' 章概览</a> 或 <a href="#/course">课程目录</a>。</p>' : '') +
          '</div></div></div>'
      };
    }

    const flat = PHYS.flatSections();
    const idx = flat.findIndex(function (s) { return s.id === secId; });
    const prev = idx > 0 ? flat[idx - 1] : null;
    const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

    const qs = PHYS.questions.filter(function (q) { return q.section === secId; });
    const lab = PHYS.labForSection(secId);

    const objectives = (data.objectives || []).map(function (o) { return '<li>' + md.inline(o) + '</li>'; }).join('');
    // 先修提示只作文字说明，不做超链接（避免指向尚未编写的内容）
    const prereqLinks = (data.prereq || []).map(function (p) {
      return UI.esc(p.label);
    }).join('；');

    const bodyHtml = '<div class="prose">' + md.render(data.body) + '</div>' +
      (data.examples && data.examples.length
        ? '<div class="examples">' + data.examples.map(function (ex, i) { return renderExample(ex, i); }).join('') + '</div>'
        : '');

    const labHtml = lab ? '' +
      '<div class="lab-embed"><div class="lab-embed-head"><h3>互动探究 · ' + UI.esc(lab.title) + '</h3>' +
      '<a class="btn btn-sm" href="#/lab/' + lab.id + '">在实验室中打开</a></div>' +
      '<div class="lab-frame" id="inlineLab" data-lab="' + lab.id + '"></div></div>' : '';

    const pager = '<div class="pager">' +
      (prev ? '<a class="prev" href="#/learn/' + prev.id + '"><span class="dir">← 上一节</span><span class="ttl">' + prev.num + ' ' + UI.esc(prev.title) + '</span></a>' : '<span></span>') +
      (next ? '<a class="next" href="#/learn/' + next.id + '"><span class="dir">下一节 →</span><span class="ttl">' + next.num + ' ' + UI.esc(next.title) + '</span></a>' : '<span></span>') +
      '</div>';

    // 本页锚点目录：取正文中已渲染的 h2 标题（含“随堂练习”“小结”）
    const bodyHtmlForToc = bodyHtml;
    const tocEntries = [];
    const reHead = /<h2 id="(sec-\d+)">([\s\S]*?)<\/h2>/g;
    let hm;
    while ((hm = reHead.exec(bodyHtmlForToc)) !== null) {
      tocEntries.push({ id: hm[1], text: hm[2].replace(/<[^>]+>/g, '') });
    }
    tocEntries.push({ id: 'practice', text: '随堂练习' });
    tocEntries.push({ id: 'summary', text: '小结' });
    const tocItems = tocEntries.map(function (t) {
      return '<li><a href="#/learn/' + secId + '#' + t.id + '">' + UI.esc(t.text) + '</a></li>';
    }).join('');

    const relatedFormulas = PHYS.formulas.filter(function (f) { return f.section === secId; });

    return {
      title: sec.num + ' ' + sec.title,
      sectionId: secId,
      keepScroll: true,
      html: '<div class="page"><div class="learn-layout">' +
        // 左：章节目录
        '<aside class="chapter-side" id="chapterSide" aria-label="本章目录">' + chapterSideList(ch, secId) + '</aside>' +
        // 中：正文
        '<main id="main" class="main">' +
        crumbs([{ label: '首页', href: '#/' }, { label: '课程目录', href: '#/course' }, { label: '第 ' + ch.num + ' 章', href: '#/chapter/' + ch.id }, { label: sec.num }]) +
        '<button class="side-toggle" id="sideToggle" aria-expanded="false" aria-controls="chapterSide">本章目录</button>' +
        '<article class="article">' +
        '  <div class="sec-head"><div class="sec-kicker">第 ' + ch.num + ' 章 · ' + UI.esc(ch.title) + '</div>' +
        '    <h1>' + sec.num + '　' + UI.esc(sec.title) + '</h1>' +
        (data.lead ? '    <p class="lead">' + md.inline(data.lead) + '</p>' : '') +
        '  </div>' +
        '  <div class="objectives"><h3>学习目标</h3><ul>' + objectives + '</ul>' +
        (prereqLinks ? '<p class="prereq"><b>需要的准备：</b>' + prereqLinks + '</p>' : '') +
        '  </div>' +
        (PHYS.learningNavigation ? PHYS.learningNavigation(ch.id) : '') +
        (PHYS.renderIllustration ? PHYS.renderIllustration(secId) : '') +
        bodyHtml +
        labHtml +
        '<section class="practice" id="practice"><h2>随堂练习</h2>' +
        '<p style="font-size:.9rem;color:var(--muted)">作答后立即判分并给出解释。答错的题目会自动加入“我的学习 → 待复习”，可以重做，首次作答记录会保留。</p>' +
        '<div id="questionList">' + qs.map(function (q, i) { return renderQuestionCard(q, i); }).join('') + '</div>' +
        (qs.length ? '' : '<div class="empty">本节暂未发布随堂练习。</div>') +
        '</section>' +
        '<div class="summary-box" id="summary"><h3>小结</h3>' +
        (data.summary || []).map(function (s) { return '<p>' + md.inline(s) + '</p>'; }).join('') +
        (data.nextNote ? '<p style="font-size:.88rem;color:var(--muted);margin-bottom:0">' + md.inline(data.nextNote) + '</p>' : '') +
        '</div>' +
        '<details class="note-panel" id="notePanel" style="margin-top:26px;border:1px solid var(--line);border-radius:var(--radius);padding:14px 18px;background:var(--surface-2)">' +
        '<summary style="cursor:pointer;font-weight:600;font-size:.92rem">我的笔记' +
        (Store.noteOf(secId) ? '<span style="font-weight:400;color:var(--muted);font-size:.8rem"> · 已记录</span>' : '') +
        '</summary>' +
        '<p style="font-size:.8rem;color:var(--muted);margin:8px 0">只保存在本机浏览器，可在“我的学习”中查看全部笔记。笔记与课程正文分开保存，不影响正文内容。</p>' +
        '<label class="sr-only" for="noteInput">本节笔记</label>' +
        '<textarea id="noteInput" placeholder="写下本节的关键结论、容易混淆的地方，或你自己的推导…">' +
        UI.esc(Store.noteOf(secId) ? Store.noteOf(secId).text : '') + '</textarea>' +
        '<div style="display:flex;gap:8px;align-items:center;margin-top:8px">' +
        '<button class="btn btn-sm" id="saveNote">保存笔记</button>' +
        '<button class="btn btn-sm btn-ghost" id="clearNote">清空</button>' +
        '<span style="font-size:.76rem;color:var(--muted)" id="noteStatus"></span>' +
        '</div></details>' +
        '<div class="mark-row">' +
        '<label style="display:inline-flex;gap:8px;align-items:center;cursor:pointer">' +
        '<input type="checkbox" id="markLearned"' + (Store.isLearned(secId) ? ' checked' : '') + ' style="accent-color:var(--accent)">' +
        '<span>我已学完本节</span></label>' +
        '<span style="font-size:.8rem">“已学”由你主动标记，表示完成阅读，不等同于掌握。</span>' +
        '</div>' +
        pager +
        '</article></main>' +
        // 右：本页锚点与关键公式
        '<aside class="toc-side" aria-label="本页导航">' +
        '<div class="side-block"><div class="side-title">本页内容</div><ul class="toc-list" id="tocList">' + tocItems + '</ul></div>' +
        (relatedFormulas.length ? '<div class="side-block toc-formulas"><div class="side-title">关键公式</div>' +
          relatedFormulas.map(function (f) {
            return '<div style="margin-bottom:10px"><div class="formula-mini">' + UI.tex(f.tex, true) + '</div>' +
              '<a href="#/formulas?focus=' + f.id + '" style="font-size:.76rem">' + UI.esc(f.title) + '</a></div>';
          }).join('') + '</div>' : '') +
        '<div class="side-block"><div class="side-title">本页操作</div>' +
        '<p style="font-size:.8rem;color:var(--muted)">按 <kbd>/</kbd> 聚焦搜索；<kbd>Tab</kbd> 可在选项与按钮之间移动。</p></div>' +
        '</aside>' +
        '</div></div>',

      mount: function (host) {
        // 记录位置
        const previousPosition = Store.getPosition();
        Store.setPosition(secId, previousPosition && previousPosition.sectionId === secId ? previousPosition.scroll : 0);
        let saveTick = null;
        const onScroll = function () {
          clearTimeout(saveTick);
          saveTick = setTimeout(function () {
            const st = PHYS.Store.get();
            st.lastPosition = { sectionId: secId, at: new Date().toISOString(), scroll: Math.round(global.scrollY) };
            PHYS.Store.get(); // 保持接口一致
            try { localStorage.setItem('phys.v1', JSON.stringify(st)); } catch (e) {}
          }, 600);
        };
        global.addEventListener('scroll', onScroll, { passive: true });
        PHYS.App.onCleanup(function () { global.removeEventListener('scroll', onScroll); clearTimeout(saveTick); Store.setPosition(secId, Math.round(global.scrollY)); });

        mountQuestions(host);

        const mark = host.querySelector('#markLearned');
        if (mark) {
          mark.addEventListener('change', function () {
            Store.setLearned(secId, mark.checked);
            UI.toast(mark.checked ? '已标记为已学' : '已取消“已学”标记');
            document.querySelectorAll('.side-list a[aria-current="page"] .check').forEach(function (n) { n.remove(); });
            if (mark.checked) {
              const cur = document.querySelector('.side-list a[aria-current="page"]');
              if (cur) cur.insertAdjacentHTML('beforeend', '<span class="check" aria-label="已学">✓</span>');
            }
          });
        }

        const noteInput = host.querySelector('#noteInput');
        if (noteInput) {
          const status = host.querySelector('#noteStatus');
          host.querySelector('#saveNote').addEventListener('click', function () {
            Store.setNote(secId, noteInput.value);
            if (status) status.textContent = '已保存 ' + UI.formatDate(new Date().toISOString());
            UI.toast(Store.noteOf(secId) ? '笔记已保存' : '笔记已清空');
          });
          host.querySelector('#clearNote').addEventListener('click', function () {
            noteInput.value = '';
            Store.setNote(secId, '');
            if (status) status.textContent = '已清空';
          });
        }

        const sideToggle = host.querySelector('#sideToggle');
        if (sideToggle) {
          sideToggle.addEventListener('click', function () {
            const side = host.querySelector('#chapterSide');
            const open = side.classList.toggle('open');
            sideToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          });
        }

        // 本页锚点高亮
        const heads = Array.from(host.querySelectorAll('.prose h2[id]'));
        const tocLinks = Array.from(host.querySelectorAll('#tocList a'));
        if (heads.length && 'IntersectionObserver' in global) {
          const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (!en.isIntersecting) return;
              tocLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#/learn/' + secId + '#' + en.target.id); });
            });
          }, { rootMargin: '-80px 0px -70% 0px' });
          heads.forEach(function (h) { io.observe(h); });
          PHYS.App.onCleanup(function () { io.disconnect(); });
        }

        // 嵌入实验
        const labMount = host.querySelector('#inlineLab');
        if (labMount) {
          const labId = labMount.getAttribute('data-lab');
          if (PHYS.lab && PHYS.lab.mount) {
            PHYS.lab.mount(labId, labMount, { compact: true });
          } else {
            labMount.innerHTML = '<p style="color:var(--muted);font-size:.9rem">实验组件未能加载。</p>';
          }
        }
      }
    };
  }


  /* ------------------------------------------------------------ 例题卡片 */
  // 统一步骤（文档第 5 节）：明确对象与过程 → 作图 → 选择规律并说明条件 → 列式求解 → 检查
  function renderExample(ex, idx) {
    const stepHtml = (ex.steps || []).map(function (st, i) {
      return '<div class="step"><span class="step-label">第 ' + (i + 1) + ' 步 · ' + UI.esc(st[0]) + '</span>' +
        md.inline(st[1]) + '</div>';
    }).join('');
    return '<section class="example">' +
      '<div class="example-head"><span class="tag">例题</span><h4>' + md.inline(ex.title) + '</h4></div>' +
      '<div class="example-body">' +
      '<p style="margin:10px 0 0">' + md.inline(ex.stem) + '</p>' +
      '<details><summary>展开解答（' + (ex.steps || []).length + ' 步）</summary>' + stepHtml +
      (ex.note ? '<div class="callout note" style="margin-top:14px"><span class="co-title">评注</span>' + md.inline(ex.note) + '</div>' : '') +
      '</details>' +
      '</div></section>';
  }

  /* ------------------------------------------------------------ 练习题组件 */

  function renderQuestionCard(q, index) {
    const a = Store.attemptOf(q.id);
    const last = a && a.last;
    const reviewState = Store.reviewState(q.id);
    let inputHtml = '';

    if (q.type === 'single') {
      inputHtml = '<div class="options" role="radiogroup" aria-label="选项">' +
        q.options.map(function (opt, i) {
          return '<label class="option" data-i="' + i + '">' +
            '<input type="radio" name="opt-' + q.id + '" value="' + i + '">' +
            '<span class="letter" aria-hidden="true">' + 'ABCD'[i] + '</span>' +
            '<span>' + md.inline(opt) + '</span></label>';
        }).join('') + '</div>';
    } else {
      inputHtml = '<div class="numeric-row">' +
        '<label class="sr-only" for="ans-' + q.id + '">你的答案</label>' +
        '<input type="text" id="ans-' + q.id + '" inputmode="decimal" autocomplete="off" placeholder="输入数值">' +
        '<span class="unit">' + UI.esc(q.unit || '') + '</span>' +
        '<span class="fmt-hint">可写小数或科学计数法，如 3.5 或 3.5e3</span>' +
        '</div>';
    }

    return '<div class="question" id="q-' + q.id + '" data-qid="' + q.id + '" data-type="' + q.type + '" data-answer="' + (q.type === 'single' ? q.answer : q.answer) + '" data-tol="' + (q.tol || 0) + '">' +
      '<div class="q-head">' +
      '<span class="q-id">' + UI.esc(q.id) + '</span>' +
      '<span class="chip type">' + (q.type === 'single' ? '单选题' : '数值题') + '</span>' +
      '<span class="chip">难度 ' + '●'.repeat(q.difficulty) + '○'.repeat(Math.max(0, 4 - q.difficulty)) + '</span>' +
      (q.point ? '<span class="chip">' + UI.esc(q.point) + '</span>' : '') +
      (reviewState === 'todo' ? '<span class="chip" style="background:var(--amber-soft);border-color:#e8d9a6;color:var(--amber)">待复习</span>' : '') +
      (last ? '<span class="chip" style="' + (last.correct ? 'background:var(--ok-soft);border-color:#bfdcc8;color:var(--ok)' : 'background:var(--bad-soft);border-color:#ecc6c3;color:var(--bad)') + '">上次' + (last.correct ? '答对' : '答错') + '</span>' : '') +
      '</div>' +
      '<p class="q-stem"><span class="q-no">' + (index + 1) + '.</span>' + md.inline(q.stem) + '</p>' +
      inputHtml +
      '<div class="q-actions">' +
      '<button class="btn btn-primary" data-act="submit">提交答案</button>' +
      '<button class="btn" data-act="hint" aria-expanded="false">查看提示</button>' +
      (last ? '<button class="btn btn-ghost" data-act="retry">重做</button>' : '') +
      '<span class="spacer"></span>' +
      (a && !a.last.correct ? '<button class="btn btn-ghost btn-sm" data-act="understood">标记已理解</button>' : '') +
      '</div>' +
      '<div class="hints" hidden id="hint-' + q.id + '"><ol>' + (q.hints || []).map(function (h) { return '<li hidden>' + md.inline(h) + '</li>'; }).join('') + '</ol></div>' +
      '<div class="feedback" hidden id="fb-' + q.id + '"></div>' +
      '</div>';
  }

  function mountQuestions(host) {
    host.querySelectorAll('.question').forEach(function (card) {
      const qid = card.getAttribute('data-qid');
      const q = PHYS.getQuestion(qid);
      if (!q) return;
      const isSingle = q.type === 'single';
      const fb = card.querySelector('.feedback');
      const hints = card.querySelector('.hints');
      let usedHint = false, submitted = false, hintCount = 0;
      function retryQuestion() {
        submitted = false; usedHint = false; hintCount = 0;
        hints.querySelectorAll('li').forEach(function (li) { li.hidden = true; });
        card.querySelectorAll('input').forEach(function (input) { input.disabled = false; input.checked = false; input.value = input.type === 'radio' ? input.value : ''; input.style.borderColor = ''; input.style.background = ''; });
        card.querySelectorAll('.option').forEach(function (o) { o.classList.remove('is-correct', 'is-wrong'); o.removeAttribute('data-disabled'); });
        fb.hidden = true; hints.hidden = true;
        const hintButton = card.querySelector('[data-act="hint"]'); hintButton.textContent = '查看提示'; hintButton.setAttribute('aria-expanded', 'false');
        const button = card.querySelector('[data-act="submit"]'); button.disabled = false;
        const retry = card.querySelector('[data-act="retry"]'); if (retry) retry.remove();
        const input = card.querySelector('input'); if (input) input.focus();
      }

      card.querySelectorAll('[data-act]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const act = btn.getAttribute('data-act');

          if (act === 'hint') {
            usedHint = true;
            const items = hints.querySelectorAll('li');
            if (hintCount < items.length) {
              items[hintCount++].hidden = false; hints.hidden = false;
            } else hints.hidden = !hints.hidden;
            btn.setAttribute('aria-expanded', hints.hidden ? 'false' : 'true');
            btn.textContent = hints.hidden ? '查看提示' : hintCount < items.length ? '下一条提示（' + hintCount + '/' + items.length + '）' : '收起提示';
            return;
          }

          if (act === 'retry') { retryQuestion(); return; }

          if (act === 'understood') {
            Store.setReview(qid, 'understood');
            UI.toast('已标记为“已理解”，不再出现在待复习列表');
            btn.remove();
            const chip = card.querySelector('.q-head .chip[style*="amber"]');
            if (chip) chip.remove();
            return;
          }

          if (act === 'submit') { submit(); }
        });
      });

      // 单选题：选项点击直接提交？不，保留显式提交，避免误触
      function submit() {
        if (submitted) return;
        let userAns = null, correct = false;

        if (isSingle) {
          const picked = card.querySelector('input[type="radio"]:checked');
          if (!picked) { UI.toast('请先选择一个选项'); return; }
          userAns = Number(picked.value);
          correct = userAns === q.answer;
        } else {
          const field = card.querySelector('input[type="text"]');
          if (!field) return;
          const raw = field.value.trim().replace(/，/g, ',').replace(/\s+/g, '');
          if (!raw) { UI.toast('请先填入答案'); field.focus(); return; }
          const val = UI.parseNumber(raw);
          if (val === null || !isFinite(val)) {
            fb.hidden = false;
            fb.className = 'feedback bad';
            fb.innerHTML = '<div class="fb-title">无法识别这个数字</div><p>请只填写数值，可带正负号或使用科学计数法（如 3.5e3）。单位已写在输入框右侧，不需要重复填写。</p>';
            return;
          }
          userAns = val;
          correct = UI.answerCorrect(q, val);
        }

        submitted = true;
        card.querySelector('[data-act="submit"]').disabled = true;
        Store.recordAttempt(qid, correct, userAns, usedHint);

        // 视觉反馈
        if (isSingle) {
          card.querySelectorAll('.option').forEach(function (opt) {
            const i = Number(opt.getAttribute('data-i'));
            opt.setAttribute('data-disabled', '1');
            const input = opt.querySelector('input');
            if (input) input.disabled = true;
            if (i === q.answer) opt.classList.add('is-correct');
            else if (i === userAns) opt.classList.add('is-wrong');
          });
        } else {
          const field = card.querySelector('input[type="text"]');
          if (field) { field.disabled = true; field.style.borderColor = correct ? '#86b79b' : '#d9a1a0'; field.style.background = correct ? 'var(--ok-soft)' : 'var(--bad-soft)'; }
        }

        const ansText = isSingle
          ? 'ABCD'[q.answer] + '．' + stripTags(md.inline(q.options[q.answer]))
          : UI.answerNumber(q.answer) + ' ' + (q.unit || '');

        fb.hidden = false;
        fb.className = 'feedback ' + (correct ? 'ok' : 'bad');
        fb.innerHTML = '<div class="fb-title">' + (correct ? '正确' : '再想想') + '</div>' +
          '<p class="fb-answer">正确答案：' + ansText + '</p>' +
          '<p>' + md.inline(q.explain) + '</p>' +
          (q.commonError ? '<p style="font-size:.85rem;color:var(--muted)">常见问题：' + md.inline(q.commonError) + '</p>' : '') +
          (!correct ? '<p style="font-size:.85rem">这道题已加入 <a href="#/me">待复习</a>，可以点“重做”再试。</p>' : '');

        // 更新按钮
        if (!card.querySelector('[data-act="retry"]')) {
          const retry = document.createElement('button');
          retry.className = 'btn btn-ghost';
          retry.setAttribute('data-act', 'retry');
          retry.textContent = '重做';
          retry.addEventListener('click', retryQuestion);
          card.querySelector('.q-actions').insertBefore(retry, card.querySelector('.spacer'));
        }
        const under = card.querySelector('[data-act="understood"]');
        if (!correct && !under) {
          const b = document.createElement('button');
          b.className = 'btn btn-ghost btn-sm';
          b.setAttribute('data-act', 'understood');
          b.textContent = '标记已理解';
          b.addEventListener('click', function () {
            Store.setReview(qid, 'understood');
            UI.toast('已标记为“已理解”');
            b.remove();
          });
          card.querySelector('.q-actions').appendChild(b);
        }
        if (correct && under) under.remove();
      }
    });
  }

  function stripTags(html) { return String(html).replace(/<[^>]+>/g, ''); }

  /* ------------------------------------------------------------ 404 */

  function notFoundOf(what) {
    return {
      title: '未找到',
      html: '<div class="page"><div class="wrap-narrow" style="padding-top:40px"><div class="empty-state">' +
        '<h2 style="margin-top:0">没有找到这个' + UI.esc(what) + '</h2>' +
        '<p>链接可能已更新，或内容尚未发布。</p>' +
        '<a class="btn" href="#/course">回到课程目录</a></div></div></div>'
    };
  }

  PHYS.views = PHYS.views || {};
  PHYS.views.home = home;
  PHYS.views.course = course;
  PHYS.views.chapter = chapter;
  PHYS.views.section = sectionView;
  PHYS.views.notFound = function (path) {
    return {
      title: '页面不存在',
      html: '<div class="page"><div class="wrap-narrow" style="padding-top:40px"><div class="empty-state">' +
        '<h2 style="margin-top:0">页面不存在</h2><p><code>' + UI.esc(path) + '</code> 没有对应的内容。</p>' +
        '<a class="btn" href="#/">回到首页</a></div></div></div>'
    };
  };
  PHYS.views.renderQuestionCard = renderQuestionCard;
  PHYS.views.crumbs = crumbs;
  PHYS.views.notFoundOf = notFoundOf;
})(typeof window !== 'undefined' ? window : globalThis);
