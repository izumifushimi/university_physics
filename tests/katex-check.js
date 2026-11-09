// 严格调用本地KaTeX，防止渲染器降级显示掩盖解析错误。
const assert = require('assert/strict');
const P = require('./harness').load(), katex = require('../site/vendor/katex/katex.min.js');
let checked = 0;
function tex(src, path) {
  try { katex.renderToString(src, { throwOnError: true, strict: false }); checked++; }
  catch (e) { throw new Error(path + ': ' + e.message); }
}
function walk(value, path) {
  if (typeof value === 'string') {
    for (const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) tex(m[1] || m[2], path);
  } else if (value && typeof value === 'object') for (const k in value) walk(value[k], path + '.' + k);
}
walk(P.content, 'content'); walk(P.questions, 'questions'); walk(P.preparatory, 'preparatory'); walk(P.comprehensive, 'comprehensive');
P.formulas.forEach(f => { tex(f.tex, f.id); f.symbols.forEach(s => tex(s[0], f.id + ' symbol')); });
assert(checked > 1000);
console.log('KaTeX 严格解析通过：' + checked + ' 个公式与符号');
