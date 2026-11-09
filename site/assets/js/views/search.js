/* ==========================================================================
   views/search.js —— 搜索结果页
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;

  PHYS.views.search = function (q) {
    const res = PHYS.search(q, { includePlanned: true });
    const raw = String(q || '').trim();

    const groupsHtml = res.total
      ? res.groups.map(function (g) {
        return '<section class="result-group"><h2>' + UI.esc(g.kind) + '　' + g.items.length + ' 条</h2>' +
          g.items.map(function (it) {
            const d = it.doc;
            return '<a class="result" href="' + d.href + '">' +
              '<h3>' + it.titleHtml + (d.published ? '' : ' <span class="badge-pending">待更新</span>') + '</h3>' +
              '<div class="r-meta"><span class="result-kind">' + UI.esc(g.kind) + '</span><span>' + it.metaHtml + '</span></div>' +
              '<p class="r-snip">' + it.snippetHtml + '</p></a>';
          }).join('') + '</section>';
      }).join('')
      : '';

    const suggestEmpty = raw
      ? '<div class="empty-state"><h2 style="margin-top:0;font-size:1.1rem">没有找到“' + UI.esc(raw) + '”</h2>' +
        '<p>试试更短的关键词，或使用公式中的中文名称，例如：加速度、向心、动量、干涉。</p>' +
        '<p style="font-size:.86rem">搜索范围：已发布小节的标题、术语与正文，公式名称与标签，互动实验。' +
        '未发布内容只会出现在“小节”结果中并标注待更新。</p></div>'
      : '<div class="empty-state"><h2 style="margin-top:0;font-size:1.1rem">输入关键词开始搜索</h2>' +
        '<p>可以直接搜中文名，例如“动能定理”“向心加速度”“伽利略变换”。</p></div>';

    const quick = ['加速度', '运动图像', '位移', '向心加速度', '抛体运动', '相对运动'];

    return {
      title: raw ? '搜索：' + raw : '搜索',
      html: '<div class="page"><div class="wrap-narrow">' +
        '<div class="page-head" style="padding-top:32px"><h1>搜索</h1>' +
        '<p>检索已发布的课程内容、公式与术语。</p></div>' +
        '<form class="search-box" id="searchPageForm" role="search">' +
        '<label class="sr-only" for="searchPageInput">搜索课程、公式与术语</label>' +
        '<input type="search" id="searchPageInput" name="q" value="' + UI.esc(raw) + '" placeholder="例如：加速度、v–t 图、伽利略变换">' +
        '</form>' +
        '<div class="filter-bar" style="margin-top:12px">' +
        '<span style="font-size:.78rem;color:var(--muted);align-self:center">常用：</span>' +
        quick.map(function (t) { return '<a class="filter-btn" href="#/search?q=' + encodeURIComponent(t) + '" style="text-decoration:none">' + t + '</a>'; }).join('') +
        '</div>' +
        (raw ? '<p style="font-size:.86rem;color:var(--muted)">找到 <strong>' + res.total + '</strong> 条相关结果。</p>' : '') +
        '<div class="search-results">' + (res.total ? groupsHtml : suggestEmpty) + '</div>' +
        '<p style="font-size:.76rem;color:var(--muted);margin-top:30px">结果按类型分组：小节 / 公式 / 术语 / 实验。' +
        '“待更新”表示该内容尚未发布，点击会跳到章节概览而不是空白页。</p>' +
        '</div></div>',
      mount: function (host) {
        const form = host.querySelector('#searchPageForm');
        const input = host.querySelector('#searchPageInput');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          const v = input.value.trim();
          location.hash = '#/search' + (v ? '?q=' + encodeURIComponent(v) : '');
        });
        if (!raw) input.focus();
      }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
