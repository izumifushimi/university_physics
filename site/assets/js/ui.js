/* ==========================================================================
   ui.js —— 通用工具：转义、公式渲染、提示条、锚点
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS || (global.PHYS = {});

  const UI = {};

  UI.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  /* ------------------------------------------------------------ KaTeX */
  let katexReady = false;
  if (global.katex) katexReady = true;

  UI.katexOK = function () { return !!global.katex; };

  UI.tex = function (src, display) {
    const clean = String(src == null ? '' : src).trim();
    if (!global.katex) {
      // 公式库未加载（例如离线打开且未带 vendor）时的降级显示
      return '<code class="tex-fallback">' + UI.esc(clean) + '</code>';
    }
    try {
      return global.katex.renderToString(clean, {
        displayMode: !!display,
        throwOnError: false,
        strict: false,
        trust: false,
        macros: {
          '\\vec': '\\overrightarrow{#1}'
        }
      });
    } catch (e) {
      return '<code class="tex-fallback">' + UI.esc(clean) + '</code>';
    }
  };

  /* ------------------------------------------------------------ 数字格式 */
  UI.num = function (v, digits) {
    if (!isFinite(v)) return '—';
    const d = digits == null ? 2 : digits;
    let s = v.toFixed(d);
    if (s === '-' + (0).toFixed(d)) s = (0).toFixed(d);
    return s;
  };

  UI.trimNum = function (v, maxDigits) {
    const d = maxDigits == null ? 2 : maxDigits;
    let s = Number(v).toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/\.?0+$/, '');
    if (s === '-0') s = '0';
    return s;
  };


  // 判分与展示共用规则，绝不为微观小量添加固定的1e-9误差地板。
  UI.parseNumber = function (value) {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value !== 'string') return null;
    let s = value.trim().replace(/−/g, '-').replace(/×\s*10\s*\^/gi, 'e').replace(/\s+/g, '');
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(s)) return null;
    const n = Number(s); return Number.isFinite(n) ? n : null;
  };
  UI.answerCorrect = function (q, value) {
    const n = UI.parseNumber(value);
    if (n === null) return false;
    if (q.type === 'single') return Number.isInteger(n) && n === q.answer;
    const tolerance = Math.max(Number(q.tol) || 0, (Number(q.relTol) || 0) * Math.abs(q.answer));
    const roundoff = 8 * Number.EPSILON * Math.max(Math.abs(n), Math.abs(q.answer), tolerance, Number.MIN_VALUE);
    return Math.abs(n - q.answer) <= tolerance + roundoff;
  };
  UI.answerNumber = function (n) {
    return n !== 0 && (Math.abs(n) < 0.001 || Math.abs(n) >= 1e6) ? n.toExponential(5).replace(/0+e/, 'e') : UI.trimNum(n, 6);
  };

  /* ------------------------------------------------------------ 提示条 */
  let toastEl = null, toastTimer = null;
  UI.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  };
  PHYS.toast = UI.toast;

  /* ------------------------------------------------------------ 小工具 */
  UI.slugify = function (s, i) { return 'sec-' + (i + 1); };

  UI.debounce = function (fn, wait) {
    let t;
    return function () {
      const args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, wait || 160);
    };
  };

  UI.formatDate = function (iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  };

  // 高亮搜索词（输入为纯文本，输出转义后的 HTML）
  UI.highlight = function (text, terms) {
    let out = UI.esc(text);
    if (!terms || !terms.length) return out;
    terms.forEach(function (t) {
      if (!t) return;
      const safe = UI.esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      out = out.replace(new RegExp('(' + safe + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  };

  UI.statusPill = function (status) {
    if (status === 'published' || status === 'available') {
      return '<span class="status-pill live"><span class="dot"></span>已发布</span>';
    }
    return '<span class="status-pill planned"><span class="dot"></span>待更新</span>';
  };

  PHYS.UI = UI;
})(typeof window !== 'undefined' ? window : globalThis);
