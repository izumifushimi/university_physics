/* ==========================================================================
   views/formulas.js —— 公式速查
   卡片按文档要求携带：公式、物理意义、符号定义、单位、标量/矢量属性、
                     适用条件、常见误用、返回正文的链接。
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;
  const md = PHYS.md;
  const Store = PHYS.Store;

  function formulaCard(f, highlight) {
    const sec = PHYS.getSection(f.section);
    const ch = PHYS.getChapter(f.chapter);
    const fav = Store.isFavorite(f.id);
    return '<article class="formula-card" id="f-' + f.id + '"' + (highlight ? ' style="border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)"' : '') + '>' +
      '<div class="fc-title"><h3>' + UI.esc(f.title) + '</h3>' +
      '<span class="chip">' + (ch ? '第 ' + ch.num + ' 章' : '') + '</span></div>' +
      '<div class="eq">' + UI.tex(f.tex, true) + '</div>' +
      // 文字字段允许行内公式（$...$）与 xref，交给 md.inline 统一转义与渲染
      '<p class="formula-meaning">' + md.inline(f.meaning) + '</p><dl>' +
      f.symbols.map(function (s) {
        return '<dt>' + UI.tex(s[0]) + '</dt><dd>' + md.inline(s[1]) + '，' + md.inline(s[2]) + '</dd>';
      }).join('') +
      '<dt>属性</dt><dd>' + md.inline(f.type) + '</dd>' +
      '</dl>' +
      '<p class="cond"><b>适用条件：</b>' + md.inline(f.condition) + '</p>' +
      '<p class="misuse"><b>常见误用：</b>' + md.inline(f.misuse) + '</p>' +
      '<div class="formula-actions">' +
      '<button class="fav-btn" data-fav="' + f.id + '" aria-pressed="' + (fav ? 'true' : 'false') + '">' + (fav ? '★ 已收藏' : '☆ 收藏') + '</button>' +
      (sec ? '<a class="btn btn-sm btn-ghost" href="#/learn/' + sec.id + '">回到 ' + sec.num + ' →</a>' : '') +
      '</div>' +
      '</article>';
  }

  function pickList(open) {
    let html = '<ul class="toc-list" style="font-size:.85rem">';
    PHYS.chapters.forEach(function (ch) {
      if (ch.status !== 'published') return;
      const fs = PHYS.formulas.filter(function (f) { return f.chapter === ch.id; });
      if (!fs.length) return;
      html += '<li style="margin:8px 0 3px"><span class="side-title" style="margin:0">第 ' + ch.num + ' 章</span></li>';
      fs.forEach(function (f) {
        html += '<li><a href="#/formulas?focus=' + f.id + '">' + UI.esc(f.title) + '</a></li>';
      });
    });
    html += '</ul>';
    return html;
  }

  PHYS.views.formulas = function (query) {
    const q = (query && query.q) || '';
    const focus = (query && query.focus) || '';
    const chapter = (query && query.chapter) || '';
    let list = PHYS.formulas.filter(function (f) { return !chapter || f.chapter === chapter; });

    if (q.trim()) {
      const terms = q.trim().toLowerCase().split(/\s+/);
      list = list.filter(function (f) {
        const hay = [f.title, f.meaning, (f.tags || []).join(' '), (f.symbols || []).map(function (s) { return s[1]; }).join(' '), f.condition].join(' ').toLowerCase();
        return terms.every(function (t) { return hay.indexOf(t) >= 0; });
      });
    }

    const favorites = list.filter(function (f) { return Store.isFavorite(f.id); });
    const rest = list.filter(function (f) { return !Store.isFavorite(f.id); });

    const cards = (favorites.length ? '' : '') +
      list.map(function (f) { return formulaCard(f, f.id === focus); }).join('');

    return {
      title: '公式速查',
      html: '<div class="page">' +
        '<div class="page-head"><h1>公式速查</h1>' +
        '<p>每张卡片给出公式、物理意义、符号与单位、标量或矢量属性、适用条件和常见误用。' +
        '力学、热学、电磁学中的同名字母可能含义不同，请按卡片注明的上下文理解。</p></div>' +
        '<form class="search-box" id="formulaSearch" role="search">' +
        '<label class="sr-only" for="fq">按名称、符号或关键词筛选公式</label>' +
        '<input type="search" id="fq" name="q" placeholder="例如：加速度、向心、v²/R、相对运动" value="' + UI.esc(q) + '">' +
        '<label for="formulaChapter">按章节筛选</label><select id="formulaChapter" name="chapter"><option value="">全部章节</option>' + PHYS.chapters.map(function (ch) { return '<option value="' + ch.id + '"' + (chapter === ch.id ? ' selected' : '') + '>第' + ch.num + '章 ' + UI.esc(ch.title) + '</option>'; }).join('') + '</select><button class="btn" type="submit">检索</button></form>' +
        '<div class="filter-bar" style="margin-top:14px" role="group" aria-label="按章节筛选">' +
        '<a class="filter-btn" href="#/formulas" aria-pressed="' + (!q ? 'true' : 'false') + '" style="text-decoration:none">全部 ' + PHYS.formulas.length + '</a>' +
        (favorites.length ? '<span class="filter-btn" aria-pressed="true" style="cursor:default">已收藏 ' + favorites.length + '</span>' : '') +
        '</div>' +
        (focus ? '<p style="font-size:.85rem;color:var(--muted)">已定位到：<a href="#/formulas">清除定位</a></p>' : '') +
        (list.length
          ? '<div class="formula-grid">' + cards + '</div>'
          : '<div class="empty-state">没有匹配“' + UI.esc(q) + '”的公式。<a href="#/formulas">查看全部公式</a></div>') +
        '<div class="summary-box" style="margin-top:34px"><h3 style="margin-top:0">使用提醒</h3>' +
        '<p style="margin-bottom:0;font-size:.9rem">公式卡是记忆与检索工具，不能代替条件判断。' +
        '同一个符号在不同语境下的含义见卡片说明；遇到“何时适用”不确定时，回到对应小节的条件讨论。</p></div>' +
        '</div>',
      mount: function (host) {
        host.querySelectorAll('[data-fav]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const on = Store.toggleFavorite(btn.getAttribute('data-fav'));
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
            btn.textContent = on ? '★ 已收藏' : '☆ 收藏';
            UI.toast(on ? '已收藏（在“我的学习”中查看）' : '已取消收藏');
          });
        });

        const form = host.querySelector('#formulaSearch');
        const input = host.querySelector('#fq');
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          const v = input.value.trim();
          const params = new URLSearchParams();
          if (v) params.set('q', v);
          const selected = host.querySelector('#formulaChapter').value; if (selected) params.set('chapter', selected);
          location.hash = '#/formulas' + (params.size ? '?' + params.toString() : '');
        });

        host.querySelector('#formulaChapter').addEventListener('change', function () { form.requestSubmit(); });
        if (focus) {
          const el = host.querySelector('#f-' + focus);
          if (el) setTimeout(function () { el.scrollIntoView({ block: 'center' }); }, 60);
        }

      }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
