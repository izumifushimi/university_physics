/* ==========================================================================
   views/me.js —— 我的学习
   学习记录、错题（待复习）、收藏公式、笔记、导出 / 导入 / 清空。
   文档要求：不显示虚假进度；说明清除浏览器数据会移除本地记录的事实。
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  const UI = PHYS.UI;
  const md = PHYS.md;
  const Store = PHYS.Store;

  function emptyBlock(text, cta) {
    return '<p class="empty">' + text + '</p>' + (cta || '');
  }

  PHYS.views.me = function () {
    const s = Store.get();
    const st = Store.stats();
    const pos = s.lastPosition;
    const posSec = pos ? PHYS.getSection(pos.sectionId) : null;
    const posCh = posSec ? PHYS.getChapter(posSec.chapterId) : null;

    /* ---- 待复习（含未答题的错题） ---- */
    const review = Store.reviewList()
      .filter(function (r) { return r.status === 'todo'; })
      .map(function (r) { return { q: PHYS.getQuestion(r.qid), a: r.attempt }; })
      .filter(function (r) { return r.q; });

    const reviewHtml = review.length
      ? review.map(function (r) {
        const q = r.q;
        const sec = PHYS.getSection(q.section);
        return '<div class="review-item">' +
          '<div class="ri-main">' +
          '<p class="ri-stem">' + UI.esc(stripMd(q.stem)).slice(0, 120) + '</p>' +
          '<div class="ri-meta">' +
          '<span class="q-id">' + q.id + '</span>' +
          (sec ? '<a href="#/learn/' + sec.id + '#q-' + q.id + '">' + sec.num + ' ' + UI.esc(sec.title) + '</a>' : '') +
          (r.a && r.a.last ? '<span>最近一次：' + (r.a.last.correct ? '正确' : '错误') + '</span>' : '') +
          (r.a && r.a.last && r.a.last.at ? '<span>' + UI.formatDate(r.a.last.at) + '</span>' : '') +
          '</div></div>' +
          '<div class="ri-actions">' +
          '<a class="btn btn-sm btn-primary" href="#/learn/' + q.section + '#q-' + q.id + '">重做</a>' +
          '<button class="btn btn-sm btn-ghost" data-understood="' + q.id + '">已理解</button>' +
          '</div></div>';
      }).join('')
      : emptyBlock('目前没有待复习的题目。答错的题会自动出现在这里。');

    /* ---- 全部作答记录 ---- */
    const attempted = Object.keys(s.attempts).map(function (qid) {
      const a = s.attempts[qid];
      return { q: PHYS.getQuestion(qid), a: a };
    }).filter(function (r) { return r.q; });

    const attemptsHtml = attempted.length
      ? '<table class="data-table"><thead><tr><th>题目</th><th>首次</th><th>尝试</th><th>最近</th></tr></thead><tbody>' +
      attempted.map(function (r) {
        const a = r.a;
        const sec = PHYS.getSection(r.q.section);
        return '<tr><td><a href="#/learn/' + r.q.section + '#q-' + r.q.id + '">' + UI.esc(r.q.id) + '</a>' +
          '<div class="mono">' + (sec ? sec.num : '') + '</div></td>' +
          '<td>' + (a.first ? (a.first.correct ? '✓ 正确' : '✗ 错误') : '—') + '</td>' +
          '<td>' + a.tries.length + ' 次' + (a.first && a.first.usedHint ? ' · 看过提示' : '') + '</td>' +
          '<td class="mono">' + (a.last && a.last.at ? UI.formatDate(a.last.at) : '') + '</td></tr>';
      }).join('') + '</tbody></table>'
      : emptyBlock('还没有作答记录。做完练习后，这里会保留首次作答与订正记录。');

    /* ---- 已学小节 ---- */
    const learnedIds = Object.keys(s.learned);
    const learnedHtml = learnedIds.length
      ? '<ul class="side-list">' + learnedIds.map(function (sid) {
        const sec = PHYS.getSection(sid);
        if (!sec) return '';
        return '<li><a href="#/learn/' + sid + '"><span class="num"></span><span>' + sec.num + ' ' + UI.esc(sec.title) + '</span>' +
          '<span class="check">✓</span></a></li>';
      }).join('') + '</ul>'
      : emptyBlock('还没有主动标记的已学小节。在小节页面底部勾选“我已学完本节”即可记录。');

    /* ---- 收藏公式 ---- */
    const favs = s.favorites.map(function (id) { return PHYS.getFormula(id); }).filter(Boolean);
    const favHtml = favs.length
      ? favs.map(function (f) {
        return '<div style="padding:8px 0;border-bottom:1px solid var(--line-soft)">' +
          '<div class="formula-mini">' + UI.tex(f.tex, true) + '</div>' +
          '<a href="#/formulas?focus=' + f.id + '" style="font-size:.84rem">' + UI.esc(f.title) + '</a></div>';
      }).join('')
      : emptyBlock('收藏的公式会出现在这里。<a href="#/formulas">前往公式速查 →</a>');

    /* ---- 笔记 ---- */
    const noteEntries = Object.keys(s.notes).map(function (sid) {
      return { sec: PHYS.getSection(sid), note: s.notes[sid], sid: sid };
    }).filter(function (n) { return n.sec; });
    const noteHtml = noteEntries.length
      ? '<ul class="note-list">' + noteEntries.map(function (n) {
        return '<li><div class="n-sec"><a href="#/learn/' + n.sid + '">' + n.sec.num + ' ' + UI.esc(n.sec.title) + '</a>' +
          ' · ' + UI.formatDate(n.note.updatedAt) + '</div><div class="n-body">' + UI.esc(n.note.text) + '</div></li>';
      }).join('') + '</ul>'
      : emptyBlock('还没有笔记。在小节页面的“我的笔记”中写点东西试试。');

    const weakSections = {};
    Store.reviewList().filter(r => r.status === 'todo').forEach(function (r) { const q=PHYS.getQuestion(r.qid); if(q) weakSections[q.section]=(weakSections[q.section]||0)+1; });
    const suggestions = Object.entries(weakSections).sort((a,b)=>b[1]-a[1]).slice(0,4).map(function ([id,count]) {
      const sec=PHYS.getSection(id);
      return '<li><a href="#/learn/'+id+'#practice">'+UI.esc(sec.num+' '+sec.title)+'</a>：'+count+'道题仍待复习。先回看条件与例题，再重做练习；需要数学基础时使用该页“返回补习”。</li>';
    }).join('');

    const examRows = (PHYS.exams || []).filter(e => Store.examOf(e.id)).map(function (e) {
      const r = Store.examOf(e.id);
      return '<li><a href="#/exam/' + e.chapter + '">' + UI.esc(e.title) + '</a>：首次 ' + r.first.correct + '/' + r.first.total + '；最近 ' + r.last.correct + '/' + r.last.total + '</li>';
    }).join('');

    return {
      title: '我的学习',
      html: '<div class="page">' +
        '<div class="page-head"><h1>我的学习</h1>' +
        '<p>记录保存在这台设备的浏览器中（localStorage）。清除浏览器数据会移除这些记录；' +
        '换设备时可用“导出 / 导入”迁移。</p></div>' +

        (pos ? '<div class="continue-card" style="margin-top:0">' +
          '<div class="cc-main"><div class="cc-kicker">继续学习</div>' +
          '<h3>' + (posCh ? '第 ' + posCh.num + ' 章 · ' : '') + UI.esc(posSec ? posSec.num + ' ' + posSec.title : pos.sectionId) + '</h3>' +
          '<p>上次浏览：' + UI.formatDate(pos.at) + '</p></div>' +
          '<a class="btn btn-primary" href="#/learn/' + pos.sectionId + '">继续</a></div>' : '') +

        '<div class="stat-row" style="margin-top:20px">' +
        '<div class="stat"><div class="k">已答题目</div><div class="v">' + st.questionsAttempted + '<small> 题</small></div>' +
        '<div class="k" style="margin-top:2px">首次正确 ' + st.firstCorrect + ' 题</div></div>' +
        '<div class="stat"><div class="k">总尝试次数</div><div class="v">' + st.triesTotal + '<small> 次</small></div>' +
        '<div class="k" style="margin-top:2px">含订正；其中 ' + st.hinted + ' 题看过提示</div></div>' +
        '<div class="stat"><div class="k">待复习</div><div class="v">' + st.reviewTodo + '<small> 题</small></div></div>' +
        '<div class="stat"><div class="k">已学小节</div><div class="v">' + st.learned + '<small> 节</small></div>' +
        '<div class="k" style="margin-top:2px">由你主动标记</div></div>' +
        '</div>' +

        '<div class="dash-grid">' +
        // 左栏
        '<div>' +
        '<div class="card"><div class="side-title">待复习</div>' + reviewHtml + '</div>' +
        '<div class="card" style="margin-top:16px"><h2>按错题安排复习</h2>' + (suggestions ? '<ul>' + suggestions + '</ul>' : '<p>目前没有待复习题目。可完成章末测验或独立综合题，再根据作答结果安排回顾。</p>') + '</div>' +
        '<div class="card" style="margin-top:16px"><h2>章末测验记录</h2>' + (examRows ? '<ul>' + examRows + '</ul>' : '<p>还没有交卷记录，可从各章概览进入测验。</p>') + '</div>' +
        '<div class="card" style="margin-top:16px"><div class="side-title">作答记录</div>' + attemptsHtml + '</div>' +
        '<div class="card note-panel" style="margin-top:16px"><div class="side-title">笔记</div>' + noteHtml + '</div>' +
        '</div>' +
        // 右栏
        '<div>' +
        '<div class="card"><div class="side-title">已学小节</div>' + learnedHtml + '</div>' +
        '<div class="card" style="margin-top:16px"><div class="side-title">收藏的公式</div>' + favHtml + '</div>' +
        '<div class="card" style="margin-top:16px"><div class="side-title">学习记录管理</div>' +
        '<p style="font-size:.85rem;color:var(--ink-2)">导出文件包含全部已学标记、作答记录、复习状态、收藏与笔记，可在其他浏览器导入恢复。</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px">' +
        '<button class="btn btn-sm" id="btnExport">导出记录（JSON）</button>' +
        '<label class="btn btn-sm" style="cursor:pointer">导入记录<input type="file" id="fileImport" accept="application/json,.json" class="sr-only"></label>' +
        '</div>' +
        '<p style="font-size:.78rem;color:var(--muted);margin:10px 0 0">导入会覆盖当前记录；导入前建议先导出一份备份。</p>' +
        '</div>' +
        '<div class="danger-zone"><h3>清除本地记录</h3>' +
        '<p>清除后无法恢复。清除浏览器数据（历史/网站数据）同样会移除这些记录。</p>' +
        '<button class="btn btn-sm" id="btnReset" style="border-color:#d9a1a0;color:var(--bad)">清除全部记录</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>',

      mount: function (host) {
        host.querySelectorAll('[data-understood]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            Store.setReview(btn.getAttribute('data-understood'), 'understood');
            UI.toast('已标记为“已理解”');
            PHYS.App.render();
          });
        });

        host.querySelector('#btnExport').addEventListener('click', function () {
          const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const d = new Date();
          const p = function (n) { return String(n).padStart(2, '0'); };
          a.href = url;
          a.download = 'physics-progress-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '.json';
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
          UI.toast('已导出学习记录');
        });

        host.querySelector('#fileImport').addEventListener('change', function (e) {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = function () {
            const res = Store.importJSON(String(reader.result));
            if (res.ok) {
              UI.toast('导入成功');
              PHYS.App.render();
            } else {
              UI.toast('导入失败：' + res.error);
            }
          };
          reader.readAsText(file);
          e.target.value = '';
        });

        host.querySelector('#btnReset').addEventListener('click', function () {
          if (!window.confirm('确定清除全部本地学习记录吗？此操作不可撤销。')) return;
          Store.reset();
          UI.toast('已清除本地记录');
          PHYS.App.render();
        });
      }
    };
  };

  function stripMd(s) {
    return String(s || '')
      .replace(/\$[^$]*\$/g, '')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
})(typeof window !== 'undefined' ? window : globalThis);
