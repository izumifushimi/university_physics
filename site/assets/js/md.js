/* ==========================================================================
   md.js —— 轻量 Markdown 渲染（面向课程正文）
   支持：h2/h3/h4、段落、无序/有序列表、表格、引用块、代码、行内格式、
         $...$ 与 $$...$$ 公式、公式区块 {{formula}}、提示框 {{callout}}。
   不引入第三方解析器，规则有限且可控。
   ========================================================================== */
(function (global) {
  'use strict';
  const PHYS = global.PHYS || (global.PHYS = {});
  const UI = PHYS.UI;

  /* ---------------------------------------------------------- 行内渲染 */
  function inline(text) {
    // 先把公式抽出来占位，避免下划线/星号被当作强调处理
    const tex = [];
    let s = String(text == null ? '' : text);

    s = s.replace(/\$\$([\s\S]+?)\$\$/g, function (_, body) {
      tex.push(UI.tex(body, true));
      return '\u0000TEX' + (tex.length - 1) + '\u0000';
    });
    s = s.replace(/(?<!\\)\$([^\$\n]+?)(?<!\\)\$/g, function (_, body) {
      tex.push(UI.tex(body, false));
      return '\u0000TEX' + (tex.length - 1) + '\u0000';
    });

    // 行内代码
    const codes = [];
    s = s.replace(/`([^`]+)`/g, function (_, body) {
      codes.push('<code>' + UI.esc(body) + '</code>');
      return '\u0000CODE' + (codes.length - 1) + '\u0000';
    });

    s = UI.esc(s);

    // 例题允许用 <br> 换行：转义后再恢复成真正的标签（只放行 br）
    s = s.replace(/&lt;br\s*\/?&gt;/gi, '<br>');

    // 链接 [文本](地址)
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, href) {
      const safe = String(href).replace(/"/g, '%22');
      if (!/^(?:https?:\/\/|#)/i.test(safe)) return label;
      const ext = /^https?:/i.test(safe);
      return '<a href="' + safe + '"' + (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + label + '</a>';
    });
    // 知识点 / 公式引用 [[id]] 与 [[id|显示文本]]
    s = s.replace(/\[\[([a-z0-9\-\.]+)(?:\|([^\]]+))?\]\]/g, function (_, id, label) {
      return '<a class="xref" href="#/formulas" data-xref="' + id + '">' + (label || id) + '</a>';
    });

    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|\s)\*([^*\n]+)\*(?=\s|[，。；：、,.!?]|$)/g, '$1<em>$2</em>');
    s = s.replace(/==([^=]+)==/g, '<mark>$1</mark>');

    s = s.replace(/\u0000CODE(\d+)\u0000/g, function (_, i) { return codes[+i]; });
    s = s.replace(/\u0000TEX(\d+)\u0000/g, function (_, i) { return tex[+i]; });
    return s;
  }

  /* ---------------------------------------------------------- 块级渲染 */
  // 支持 {{callout title=... type=...}} ... {{/callout}}
  //      {{formula title=... tex=...}} 或 {{formula title=...}} $$...$$ {{/formula}}
  //      {{example ...}} / {{/example}} 由 course.js 预处理（带结构化数据）
  function render(src, state) {
    const st = state || { n: 0 };
    const lines = String(src == null ? '' : src).replace(/\r\n/g, '\n').split('\n');
    const out = [];
    let i = 0;

    function isBlockStart(line) {
      return /^#{2,4}\s/.test(line) ||
        /^\s*\|/.test(line) ||
        /^>\s?/.test(line) ||
        /^\s*([-*+]|(\d+\.))\s+/.test(line) ||
        /^```/.test(line) ||
        /^\{\{/.test(line) ||
        /^\$\$/.test(line) ||
        /^---+$/.test(line);
    }

    while (i < lines.length) {
      const line = lines[i];

      // 空行
      if (!line.trim()) { i++; continue; }

      // 分隔线
      if (/^---+$/.test(line.trim())) { out.push('<hr>'); i++; continue; }

      // 代码块
      if (/^```/.test(line)) {
        const buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push('<pre><code>' + UI.esc(buf.join('\n')) + '</code></pre>');
        continue;
      }

      // 标题
      const h = line.match(/^(#{2,4})\s+(.*)$/);
      if (h) {
        const lvl = h[1].length;
        const text = h[2].trim();
        st.n += 1;
        const idx = st.n - 1;
        out.push('<h' + lvl + ' id="sec-' + (idx + 1) + '">' + inline(text) + '</h' + lvl + '>');
        i++;
        continue;
      }

      // 引用块
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push('<blockquote>' + render(buf.join('\n'), st) + '</blockquote>');
        continue;
      }

      // 自定义块
      if (/^\{\{/.test(line)) {
        const end = findBlockEnd(lines, i);
        const block = lines.slice(i, end + 1);
        out.push(renderCustomBlock(block, st));
        i = end + 1;
        continue;
      }

      // 独立公式块
      if (/^\$\$/.test(line)) {
        let buf = line.replace(/^\$\$/, '');
        if (/\$\$\s*$/.test(buf)) {
          buf = buf.replace(/\$\$\s*$/, '');
          out.push('<div class="formula-block"><div class="eq">' + UI.tex(buf, true) + '</div></div>');
          i++;
          continue;
        }
        const arr = [buf];
        i++;
        while (i < lines.length && !/\$\$\s*$/.test(lines[i])) { arr.push(lines[i]); i++; }
        if (i < lines.length) { arr.push(lines[i].replace(/\$\$\s*$/, '')); i++; }
        out.push('<div class="formula-block"><div class="eq">' + UI.tex(arr.join(' '), true) + '</div></div>');
        continue;
      }

      // 表格
      if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
        const head = splitRow(line);
        i += 2;
        const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
        out.push(
          '<div class="table-wrap"><table class="data-table"><thead><tr>' +
          head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
          '</tr></thead><tbody>' +
          rows.map(function (r) {
            return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
          }).join('') +
          '</tbody></table></div>'
        );
        continue;
      }

      // 列表
      if (/^\s*([-*+]|(\d+\.))\s+/.test(line)) {
        const ordered = /^\s*\d+\./.test(line);
        const items = [];
        while (i < lines.length && (/^\s*([-*+]|(\d+\.))\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
          if (/^\s*([-*+]|(\d+\.))\s+/.test(lines[i])) {
            items.push(lines[i].replace(/^\s*([-*+]|(\d+\.))\s+/, ''));
          } else {
            items[items.length - 1] += ' ' + lines[i].trim();
          }
          i++;
        }
        const tag = ordered ? 'ol' : 'ul';
        out.push('<' + tag + '>' + items.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</' + tag + '>');
        continue;
      }

      // 段落
      const buf = [];
      while (i < lines.length && lines[i].trim() && !isBlockStart(lines[i])) { buf.push(lines[i].trim()); i++; }
      if (!buf.length) { i++; continue; }
      out.push('<p>' + inline(buf.join(' ')) + '</p>');
    }

    return out.join('\n');
  }

  function findBlockEnd(lines, start) {
    const m = lines[start].match(/^\{\{\s*([a-z]+)/);
    const name = m ? m[1] : '';
    // 自闭合形式 {{name ...}}
    if (name === 'formula' && /\}\}\s*$/.test(lines[start]) && lines[start].indexOf('tex=') >= 0) return start;
    let depth = 0;
    for (let i = start; i < lines.length; i++) {
      if (new RegExp('^\\{\\{\\s*' + name).test(lines[i])) depth++;
      if (new RegExp('^\\{\\{\\s*/\\s*' + name).test(lines[i])) { depth--; if (depth === 0) return i; }
    }
    return lines.length - 1;
  }

  function splitRow(line) {
    let s = line.trim();
    if (s.startsWith('|')) s = s.slice(1);
    if (s.endsWith('|')) s = s.slice(0, -1);
    const cells = []; let part = '', math = false, code = false;
    for (let i=0;i<s.length;i++) {
      const ch=s[i];
      if (ch==='\\' && s[i+1]==='|') { part+='|'; i++; continue; }
      if (ch==='$' && s[i-1]!=='\\' && !code) math=!math;
      if (ch==='`' && !math) code=!code;
      if (ch==='|' && !math && !code) { cells.push(part.trim()); part=''; } else part+=ch;
    }
    cells.push(part.trim()); return cells;
  }

  function parseAttrs(s) {
    const attrs = {};
    String(s || '').replace(/([a-z\-]+)=("([^"]*)"|'([^']*)'|([^\s]+))/gi, function (_, k, __, a, b, c) {
      attrs[k] = a != null ? a : (b != null ? b : c);
      return '';
    });
    return attrs;
  }

  function renderCustomBlock(block, st) {
    const first = block[0];
    const last = block[block.length - 1];
    const nameMatch = first.match(/^\{\{\s*([a-z]+)/i);
    const name = nameMatch ? nameMatch[1].toLowerCase() : '';
    const attrText = first.replace(/^\{\{\s*[a-z]+\s*/i, '').replace(/\}\}\s*$/, '');
    const attrs = parseAttrs(attrText);
    const inner = block.slice(1, new RegExp('^\\{\\{\\s*/\\s*' + name).test(last) ? -1 : block.length);
    const innerSrc = inner.join('\n');

    if (name === 'callout') {
      const type = (attrs.type || 'note').toLowerCase();
      const title = attrs.title || ({ warn: '注意', define: '定义', note: '补充', tip: '提示' }[type] || '说明');
      return '<div class="callout ' + UI.esc(type) + '"><span class="co-title">' + UI.esc(title) + '</span>' + render(innerSrc, st) + '</div>';
    }

    if (name === 'formula') {
      const tex = attrs.tex || innerSrc.replace(/\$\$/g, '').trim();
      return '<div class="formula-block">' +
        '<div class="eq">' + UI.tex(tex, true) + '</div>' +
        (attrs.tag ? '<div class="tag">' + inline(attrs.tag) + '</div>' : '') +
        '</div>';
    }

    // 未知块：原样渲染内部
    return render(innerSrc, st);
  }

  PHYS.md = { render: render, inline: inline };
})(typeof window !== 'undefined' ? window : globalThis);
