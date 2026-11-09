// 轻量浏览器环境模拟：加载站点脚本并暴露 PHYS
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'site');

function makeStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    clear: () => map.clear(),
    get length() { return map.size; }
  };
}

function load() {
  const ctx = {
    console,
    localStorage: makeStorage(),
    setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame: () => 0,
    cancelAnimationFrame: () => {},
    URL, Blob: class {}, FileReader: class {},
    document: {
      addEventListener: () => {},
      createElement: () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, remove() {}, setAttribute() {}, querySelector: () => null, querySelectorAll: () => [] }),
      body: { appendChild: () => {} },
      querySelectorAll: () => [],
      querySelector: () => null,
      getElementById: () => null
    },
    location: { hash: '#/' },
    devicePixelRatio: 1,
    scrollTo: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);

  const files = ['assets/js/ui.js', 'assets/js/md.js', 'assets/js/store.js', 'assets/js/content.js'];
  // 章节正文与题目按编号顺序加载
  for (let n = 1; n <= 15; n++) {
    const nn = String(n).padStart(2, '0');
    files.push(`content/ch${nn}.js`);
  }
  ['assets/js/illustrations.js', 'assets/js/learning.js', 'assets/js/search.js', 'assets/js/labs.js', 'assets/js/views/course.js', 'assets/js/views/learning.js', 'assets/js/views/exam.js', 'assets/js/views/formulas.js',
   'assets/js/views/labs.js', 'assets/js/views/search.js', 'assets/js/views/me.js'
  ].forEach(f => files.push(f));
  files.forEach(f => {
    if (!fs.existsSync(path.join(ROOT, f))) return;
    const code = fs.readFileSync(path.join(ROOT, f), 'utf8');
    vm.runInContext(code, ctx, { filename: f });
  });
  // 题目文件：与 index.html 顺序保持一致
  const qfiles = [];
  for (let n = 2; n <= 15; n++) qfiles.push(`content/questions-ch${String(n).padStart(2, '0')}.js`);
  qfiles.forEach(f => {
    if (!fs.existsSync(path.join(ROOT, f))) return;
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  });

  return ctx.PHYS;
}

module.exports = { load };
