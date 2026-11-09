/* 预备知识与综合推导题：提供实际回顾内容、先修入口和自评依据。 */
(function (global) {
  'use strict';
  const P = global.PHYS, UI = P.UI, S = P.Store;
  P.learningNavigation = function (chapterId) {
    const data = P.learningLinks[chapterId];
    if (!data) return '';
    const links = data.chapters.map(function (id) { const ch = P.getChapter(id); return '<a href="#/chapter/' + id + '">第' + ch.num + '章 ' + UI.esc(ch.title) + '</a>'; });
    data.prep.forEach(function (id) { const item = P.preparatory.find(p => p.id === id); if (item) links.push('<a href="#/prep/' + id + '">' + UI.esc(item.title) + '</a>'); });
    return '<div class="card learning-links"><h3>需要时返回补习</h3><p>' + links.join(' · ') + '</p>' + (chapterId === 'ch08' ? '<p>8.6—8.8节的电磁波建议结合第12章波动基础学习；先修提示不锁定章节。</p>' : '') + '</div>';
  };
  P.views.prep = function (id) {
    const item = P.preparatory.find(p => p.id === id);
    if (!item) return P.views.notFoundOf('预备知识');
    const back = Object.entries(P.learningLinks).filter(([, data]) => data.prep.includes(id)).map(([chId]) => P.getChapter(chId));
    return { title: item.title, html: '<div class="page"><div class="wrap-narrow"><a href="#/course">← 课程目录</a><h1>' + UI.esc(item.title) + '</h1><p>预备知识 · 随用随查</p><article class="prose">' + P.md.render(item.body) + '<details><summary>自测答案与解释</summary>' + P.md.render(item.answer) + '</details></article><div class="card"><h2>在这些章节使用</h2><ul>' + back.map(ch => '<li><a href="#/chapter/' + ch.id + '">第' + ch.num + '章 ' + UI.esc(ch.title) + '</a></li>').join('') + '</ul></div></div></div>' };
  };
  P.views.challenge = function (chapterId) {
    const item = P.comprehensive.find(p => p.chapter === chapterId), ch = P.getChapter(chapterId);
    if (!item || !ch) return P.views.notFoundOf('综合题');
    const saved = S.examDraftOf(item.id), draft = saved && saved.answers || {};
    return {
      title: '第' + ch.num + '章综合题',
      html: '<div class="page"><div class="wrap-narrow"><a href="#/chapter/' + ch.id + '">← 返回本章</a><h1>第' + ch.num + '章综合题 · ' + UI.esc(item.title) + '</h1><p>独立推导后展开参考解答。采用自评，不自动判定推导是否等价；勾选表示你按参考标准核对过，不代表系统认证掌握。</p><div class="card prose">' + P.md.render(item.stem) + '</div><label for="challengeWork">你的建模、计算与检查（自动保存在本机）</label><textarea id="challengeWork" rows="10" style="width:100%;box-sizing:border-box" placeholder="先选系统、定坐标并作图，再写规律、条件、计算和量纲检查…">' + UI.esc(draft.text || '') + '</textarea><p id="challengeSaved" role="status"></p><details class="card"><summary>展开五步参考解答与自评标准</summary>' + item.steps.map(([name, text]) => '<h3>' + UI.esc(name) + '</h3>' + P.md.render(text)).join('') + '<h3>逐项自评</h3>' + item.rubric.map((text, i) => '<label style="display:block;padding:8px"><input type="checkbox" data-rubric="' + i + '"' + ((draft.checked || []).includes(i) ? ' checked' : '') + '> ' + UI.esc(text) + '</label>').join('') + '</details><p><a class="btn" href="#/exam/' + ch.id + '">完成后做章末测验</a></p></div></div>',
      mount: function (host) {
        const area = host.querySelector('#challengeWork'), status = host.querySelector('#challengeSaved');
        const checks = Array.from(host.querySelectorAll('[data-rubric]'));
        function save() {
          S.setExamDraft(item.id, { text: area.value, checked: checks.filter(el => el.checked).map(el => Number(el.dataset.rubric)) });
          status.textContent = '已保存到本机';
        }
        area.addEventListener('input', save);
        checks.forEach(el => el.addEventListener('change', save));
      }
    };
  };
})(typeof window !== 'undefined' ? window : globalThis);
