/* ==========================================================================
   search.js —— 全站搜索
   检索范围：已发布小节的标题与正文片段、章节标题与目标、公式（名称/符号/标签）、
             知识点标签、互动实验。
   每条结果标注类型：小节 / 公式 / 术语 / 实验。
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS || (global.PHYS = {});
  const UI = PHYS.UI;

  function norm(s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[\s　]+/g, '')
      .replace(/[—–\-_·・]/g, '');
  }

  // 正文去 Markdown 标记，保留纯文本用于检索与摘要
  function plain(mdText) {
    return String(mdText || '')
      .replace(/\{\{[^}]*\}\}/g, ' ')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/\$[^$\n]*\$/g, ' ')
      .replace(/[#>*`|_]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  let index = null;

  function buildIndex() {
    const docs = [];

    PHYS.chapters.forEach(function (ch) {
      docs.push({
        kind: '章节', href: '#/chapter/' + ch.id, title: '第 ' + ch.num + ' 章　' + ch.title,
        text: [ch.goal, ch.summary, (ch.points || []).join(' ')].join(' '),
        published: ch.status === 'published',
        meta: ch.num
      });
    });

    PHYS.chapters.forEach(function (ch) {
      ch.sections.forEach(function (s) {
        const data = PHYS.content && PHYS.content.sections ? PHYS.content.sections[s.id] : null;
        const published = s.status === 'published' && !!data;
        const bodyPlain = data ? plain(data.body) : '';
        const lead = data && data.lead ? plain(data.lead) : '';
        docs.push({
          kind: '小节',
          href: published ? '#/learn/' + s.id : '#/chapter/' + ch.id,
          title: s.num + '　' + s.title,
          text: [lead, bodyPlain, (data && data.summary ? data.summary.join(' ') : ''), (ch.points || []).join(' ')].join(' '),
          published: published,
          meta: '第 ' + ch.num + ' 章 · ' + ch.title,
          sectionId: s.id
        });
      });
    });

    PHYS.formulas.forEach(function (f) {
      const ch = PHYS.getChapter(f.chapter);
      const sec = PHYS.getSection(f.section);
      docs.push({
        kind: '公式', href: '#/formulas?focus=' + f.id, title: f.title,
        text: [f.meaning, (f.symbols || []).map(function (s) { return s[0] + ' ' + s[1]; }).join(' '),
          (f.tags || []).join(' '), f.condition, f.misuse].join(' '),
        published: true,
        meta: '第 ' + ch.num + ' 章' + (sec ? ' · ' + sec.num : ''),
        extra: f
      });
    });

    // 知识点：由小节标题与题目标签合成
    const points = {};
    PHYS.questions.forEach(function (q) {
      (q.tags || []).forEach(function (t) { points[t] = points[t] || { href: '#/learn/' + q.section, ch: q.chapter }; });
      if (q.point) points[q.point] = points[q.point] || { href: '#/learn/' + q.section, ch: q.chapter };
    });
    Object.keys(points).forEach(function (name) {
      const ch = PHYS.getChapter(points[name].ch);
      docs.push({
        kind: '术语', href: points[name].href, title: name,
        text: name + ' ' + ch.title, published: true, meta: '第 ' + ch.num + ' 章'
      });
    });

    PHYS.labs.forEach(function (l) {
      const ch = PHYS.getChapter(l.chapter);
      docs.push({
        kind: '实验', href: l.status === 'available' ? '#/lab/' + l.id : '#/labs',
        title: l.title,
        text: [l.question, (l.assumptions || []).join(' '), ch.title].join(' '),
        published: l.status === 'available',
        meta: '第 ' + ch.num + ' 章'
      });
    });

    (PHYS.preparatory || []).forEach(function (p) { docs.push({ kind: '预备知识', href: '#/prep/' + p.id, title: p.title, text: plain(p.body), published: true, meta: '回顾与自测' }); });
    (PHYS.comprehensive || []).forEach(function (p) { docs.push({ kind: '综合题', href: '#/challenge/' + p.chapter, title: p.title, text: plain(p.stem), published: true, meta: '独立推导与自评' }); });
    docs.forEach(function (d) {
      d.haystack = norm(d.title) + '\u0001' + norm(d.text);
      d.hayTitle = norm(d.title);
      d.hayText = norm(d.text);
    });

    return docs;
  }

  function snippet(text, terms, len) {
    const L = len || 110;
    if (!text) return '';
    for (let i = 0; i < terms.length; i++) {
      const t = terms[i];
      if (!t) continue;
      const low = text.toLowerCase();
      const at = low.indexOf(t.toLowerCase());
      if (at >= 0) {
        const start = Math.max(0, at - 30);
        const end = Math.min(text.length, at + t.length + L - 30);
        return (start > 0 ? '…' : '') + text.slice(start, end).trim() + (end < text.length ? '…' : '');
      }
    }
    return text.slice(0, L).trim() + (text.length > L ? '…' : '');
  }

  function splitTerms(q) {
    return String(q || '').trim().split(/[\s　,，、+]+/).filter(Boolean);
  }

  PHYS.search = function (query, opts) {
    if (!index) index = buildIndex();
    const options = opts || {};
    const raw = String(query || '').trim();
    if (!raw) return { query: raw, groups: [], total: 0, includePlanned: !!options.includePlanned };

    const terms = splitTerms(raw).map(norm).filter(Boolean);
    if (!terms.length) return { query: raw, groups: [], total: 0 };

    const scored = [];
    index.forEach(function (d) {
      let score = 0;
      let titleHit = 0;
      terms.forEach(function (t) {
        if (d.hayTitle.indexOf(t) >= 0) { score += 12; titleHit++; }
        if (d.hayText.indexOf(t) >= 0) { score += 4; }
        // 标题以该词开头再加分
        if (d.hayTitle.startsWith(t)) score += 6;
      });
      if (titleHit === 0 && score < 4) return; // 至少要命中正文
      if (!d.published) score *= 0.35;
      // 全部词都命中才保留（对多词查询更精确）
      if (terms.length > 1) {
        const all = terms.every(function (t) { return d.haystack.indexOf(t) >= 0; });
        if (!all) score *= 0.4;
      }
      if (d.kind === '公式' || d.kind === '小节') score += 1;
      scored.push({ doc: d, score: score });
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      if (a.doc.published !== b.doc.published) return a.doc.published ? -1 : 1;
      return a.doc.title.localeCompare(b.doc.title, 'zh');
    });

    const order = ['小节', '公式', '术语', '实验', '章节', '预备知识', '综合题'];
    const groups = [];
    order.forEach(function (kind) {
      const items = scored.filter(function (s) {
        return s.doc.kind === kind && (options.includePlanned || s.doc.published);
      });
      if (!items.length) return;
      groups.push({
        kind: kind,
        items: items.slice(0, kind === '术语' ? 8 : 12).map(function (s) {
          const d = s.doc;
          return {
            doc: d,
            titleHtml: UI.highlight(d.title, splitTerms(raw)),
            metaHtml: UI.esc(d.meta) + (d.published ? '' : ' · 待更新'),
            snippetHtml: kind === '公式'
              ? UI.highlight(d.extra.meaning, splitTerms(raw))
              : UI.highlight(snippet(d.text.replace(/\s+/g, ' '), splitTerms(raw)), splitTerms(raw))
          };
        })
      });
    });

    const total = groups.reduce(function (n, g) { return n + g.items.length; }, 0);
    return { query: raw, groups: groups, total: total, includePlanned: !!options.includePlanned };
  };

  // 供其他页面直接取正文纯文本
  PHYS.search.plain = plain;
})(typeof window !== 'undefined' ? window : globalThis);
