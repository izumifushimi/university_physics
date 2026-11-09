/* ==========================================================================
   store.js —— 本地学习记录
   --------------------------------------------------------------------------
   首版本地保存（localStorage），键名 phys.v1。
   记录内容：上次位置、主动标记的已学小节、阅读位置、作答记录、复习状态、
             收藏的公式、个人笔记。
   文档规定：不把浏览次数当掌握证据；不合成“掌握度百分比”。
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS || (global.PHYS = {});

  const KEY = 'phys.v1';
  const SCHEMA = 1;

  function blank() {
    return {
      schema: SCHEMA,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastPosition: null,          // { sectionId, at, scroll }
      learned: {},                 // sectionId -> { markedAt }
      attempts: {},                // questionId -> { first: {correct, answer, at, usedHint}, tries: [ {correct, answer, at, usedHint} ], last: {...} }
      review: {},                  // questionId -> 'todo' | 'understood'
      favorites: [],               // formulaId 数组
      notes: {},                   // sectionId -> { text, updatedAt }
      examDrafts: {},              // examId -> { answers, updatedAt }
      exams: {},                   // examId -> { first, last, tries }
      labState: {}                 // labId -> 参数快照
    };
  }

  let state = null;
  const listeners = [];

  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return blank();
      return migrate(parsed);
    } catch (err) {
      console.warn('读取本地学习记录失败：', err);
      return blank();
    }
  }

  function plain(value) { return value && typeof value === 'object' && !Array.isArray(value); }
  function validData(obj) {
    if (!plain(obj)) return false;
    for (const key of ['learned','attempts','review','notes','labState','exams','examDrafts']) {
      if (obj[key] != null && !plain(obj[key])) return false;
    }
    if (obj.favorites != null && (!Array.isArray(obj.favorites) || obj.favorites.some(x => typeof x !== 'string'))) return false;
    if (obj.lastPosition != null && (!plain(obj.lastPosition) || typeof obj.lastPosition.sectionId !== 'string' || !Number.isFinite(obj.lastPosition.scroll || 0))) return false;
    for (const r of Object.values(obj.attempts || {})) {
      if (!plain(r) || !Array.isArray(r.tries) || !plain(r.first) || !plain(r.last) || typeof r.first.correct !== 'boolean' || typeof r.last.correct !== 'boolean') return false;
      if (r.tries.some(x => !plain(x) || typeof x.correct !== 'boolean')) return false;
    }
    for (const r of Object.values(obj.exams || {})) {
      if (!plain(r) || !Array.isArray(r.tries)) return false;
      for (const entry of [r.first,r.last,...r.tries]) {
        if (!plain(entry) || !Number.isInteger(entry.total) || !Number.isInteger(entry.correct) || entry.correct < 0 || entry.correct > entry.total || !Array.isArray(entry.items) || !plain(entry.groups)) return false;
        if (entry.items.some(x => !plain(x) || typeof x.id !== 'string' || typeof x.correct !== 'boolean' || (x.answer !== null && !Number.isFinite(x.answer)))) return false;
        if (Object.values(entry.groups).some(x => !plain(x) || !Array.isArray(x.wrong) || !Number.isInteger(x.total) || !Number.isInteger(x.correct))) return false;
      }
    }
    if (Object.values(obj.notes || {}).some(x => !plain(x) || typeof x.text !== 'string')) return false;
    if (Object.values(obj.labState || {}).some(x => !plain(x) || !plain(x.params))) return false;
    if (Object.values(obj.examDrafts || {}).some(x => !plain(x) || !plain(x.answers))) return false;
    return true;
  }
  function migrate(obj) {
    if (!validData(obj)) throw new Error('学习记录结构不完整或字段类型不正确');
    const out = blank();
    Object.keys(out).forEach(function (key) { if (Object.prototype.hasOwnProperty.call(obj,key) && obj[key] != null) out[key] = obj[key]; });
    out.schema = SCHEMA;
    ['learned','attempts','review','notes','labState','exams','examDrafts'].forEach(function (key) {
      out[key] = Object.fromEntries(Object.entries(out[key]).filter(([id]) => !['__proto__','constructor','prototype'].includes(id)));
    });
    return out;
  }

  function persist() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      // 隐私模式或配额已满
      console.warn('保存本地学习记录失败：', err);
      if (PHYS.toast) PHYS.toast('无法保存到本地：浏览器存储不可用或被占满');
    }
    listeners.forEach(function (fn) { try { fn(state); } catch (e) { console.warn(e); } });
  }

  const Store = {
    init: function () { state = read(); return state; },
    get: function () { if (!state) this.init(); return state; },
    subscribe: function (fn) { listeners.push(fn); },
    blank: blank,

    /* ---------------------------------------------------------- 学习位置 */
    setPosition: function (sectionId, scroll) {
      this.get().lastPosition = { sectionId: sectionId, at: new Date().toISOString(), scroll: scroll || 0 };
      persist();
    },
    getPosition: function () { return this.get().lastPosition; },

    /* ---------------------------------------------------------- 已学标记 */
    isLearned: function (sectionId) { return !!this.get().learned[sectionId]; },
    setLearned: function (sectionId, on) {
      const s = this.get();
      if (on) s.learned[sectionId] = { markedAt: new Date().toISOString() };
      else delete s.learned[sectionId];
      persist();
    },
    learnedCount: function () { return Object.keys(this.get().learned).length; },

    /* ---------------------------------------------------------- 作答记录 */
    attemptOf: function (qid) { return this.get().attempts[qid] || null; },
    recordAttempt: function (qid, correct, answer, usedHint) {
      const s = this.get();
      const rec = s.attempts[qid] || { first: null, tries: [] };
      const entry = { correct: !!correct, answer: answer, at: new Date().toISOString(), usedHint: !!usedHint };
      if (!rec.first) rec.first = entry;
      rec.tries.push(entry);
      if (rec.tries.length > 30) rec.tries = rec.tries.slice(-30);
      rec.last = entry;
      s.attempts[qid] = rec;
      // 首次答错 → 自动进入待复习（除非已标记已理解）
      if (!correct && s.review[qid] !== 'understood') s.review[qid] = 'todo';
      persist();
      return rec;
    },
    clearAttempt: function (qid) {
      const s = this.get();
      delete s.attempts[qid];
      persist();
    },

    /* ---------------------------------------------------------- 复习状态 */
    reviewState: function (qid) { return this.get().review[qid] || null; },
    setReview: function (qid, status) {
      const s = this.get();
      if (status) s.review[qid] = status; else delete s.review[qid];
      persist();
    },
    reviewList: function () {
      const s = this.get();
      return Object.keys(s.review).map(function (qid) {
        return { qid: qid, status: s.review[qid], attempt: s.attempts[qid] || null };
      });
    },

    examDraftOf: function (id) { return this.get().examDrafts[id] || null; },
    setExamDraft: function (id, answers) {
      const s = this.get();
      if (answers === null) delete s.examDrafts[id];
      else s.examDrafts[id] = { answers: answers, updatedAt: new Date().toISOString() };
      persist();
    },
    examOf: function (id) { return this.get().exams[id] || null; },
    recordExam: function (id, result) {
      const s = this.get(), rec = s.exams[id] || { first: null, last: null, tries: [] };
      const entry = JSON.parse(JSON.stringify(result));
      if (!rec.first) rec.first = entry;
      rec.last = entry;
      rec.tries.push(entry);
      rec.tries = rec.tries.slice(-30);
      s.exams[id] = rec;
      entry.items.forEach(function (item) {
        if (!item.correct && s.review[item.id] !== 'understood') s.review[item.id] = 'todo';
      });
      persist();
      return rec;
    },

    /* ---------------------------------------------------------- 统计 */
    stats: function () {
      const s = this.get();
      const ids = Object.keys(s.attempts);
      let firstCorrect = 0, firstTotal = 0, triesTotal = 0, triesCorrect = 0, hinted = 0;
      ids.forEach(function (qid) {
        const a = s.attempts[qid];
        if (a.first) { firstTotal++; if (a.first.correct) firstCorrect++; if (a.first.usedHint) hinted++; }
        a.tries.forEach(function (t) { triesTotal++; if (t.correct) triesCorrect++; });
      });
      return {
        questionsAttempted: firstTotal,
        firstCorrect: firstCorrect,
        triesTotal: triesTotal,
        triesCorrect: triesCorrect,
        hinted: hinted,
        learned: Object.keys(s.learned).length,
        reviewTodo: Object.keys(s.review).filter(function (k) { return s.review[k] === 'todo'; }).length,
        favorites: s.favorites.length,
        notes: Object.keys(s.notes).length
      };
    },

    /* ---------------------------------------------------------- 公式收藏 */
    isFavorite: function (fid) { return this.get().favorites.indexOf(fid) >= 0; },
    toggleFavorite: function (fid) {
      const s = this.get();
      const i = s.favorites.indexOf(fid);
      if (i >= 0) s.favorites.splice(i, 1); else s.favorites.push(fid);
      persist();
      return i < 0;
    },

    /* ---------------------------------------------------------- 笔记 */
    noteOf: function (sectionId) { return this.get().notes[sectionId] || null; },
    setNote: function (sectionId, text) {
      const s = this.get();
      const trimmed = (text || '').trim();
      if (trimmed) s.notes[sectionId] = { text: trimmed, updatedAt: new Date().toISOString() };
      else delete s.notes[sectionId];
      persist();
    },

    /* ---------------------------------------------------------- 实验参数 */
    labStateOf: function (labId) { return this.get().labState[labId] || null; },
    setLabState: function (labId, params) {
      const s = this.get();
      s.labState[labId] = { params: params, at: new Date().toISOString() };
      persist();
    },

    /* ------------------------------------------------- 导出 / 导入 / 清空 */
    exportJSON: function () {
      const s = this.get();
      return JSON.stringify({
        app: '大学物理学习站',
        schema: SCHEMA,
        exportedAt: new Date().toISOString(),
        data: s
      }, null, 2);
    },
    importJSON: function (text) {
      let parsed;
      try { parsed = JSON.parse(text); } catch (e) { return { ok: false, error: '文件不是有效的 JSON。' }; }
      const data = parsed && parsed.data ? parsed.data : parsed;
      if (!data || typeof data !== 'object' || (!data.attempts && !data.learned && !data.lastPosition)) {
        return { ok: false, error: '文件内容不是本站导出的学习记录。' };
      }
      let next;
      try { next = migrate(data); } catch (e) { return { ok: false, error: '学习记录字段不完整或类型错误，当前记录未被覆盖。' }; }
      state = next;
      persist();
      return { ok: true };
    },
    reset: function () {
      state = blank();
      try { localStorage.removeItem(KEY); } catch (e) {}
      persist();
    }
  };

  PHYS.Store = Store;
  PHYS.store = Store; // 便捷别名
})(typeof window !== 'undefined' ? window : globalThis);
