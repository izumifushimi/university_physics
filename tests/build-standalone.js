// 生成单文件版：内联 CSS、JS、KaTeX 与字体（base64）
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'site');

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// 1) KaTeX CSS：把 url(./fonts/x.woff2) 换成 base64 data URI
let katexCss = fs.readFileSync(path.join(ROOT, 'vendor/katex/katex.min.css'), 'utf8');
// 本地发布仅带woff2；移除不存在的旧格式回退，避免单文件残留相对URL。
katexCss = katexCss.replace(/,url\(\.\/fonts\/[^)]+\.(?:woff|ttf)\) format\("(?:woff|truetype)"\)/g, '');
const fontDir = path.join(ROOT, 'vendor/katex/fonts');
katexCss = katexCss.replace(/url\(\.?\/?fonts\/([^)]+)\)/g, (m, file) => {
  const p = path.join(fontDir, file);
  if (!fs.existsSync(p)) throw new Error('缺少字体：' + file);
  const b64 = fs.readFileSync(p).toString('base64');
  return `url(data:font/woff2;base64,${b64})`;
});
// 去掉只在有 woff2 时才需要的老格式声明不必要，但保留也无害

// 2) 主样式
const mainCss = fs.readFileSync(path.join(ROOT, 'assets/css/main.css'), 'utf8');

// 3) 合并两个样式表，替换 link 标签
html = html.replace(/<link rel="stylesheet" href="\.\/vendor\/katex\/katex\.min\.css">\s*/,
  '<style>\n/* KaTeX */\n' + katexCss + '\n</style>\n');
html = html.replace(/<link rel="stylesheet" href="\.\/assets\/css\/main\.css">/,
  '<style>\n/* 主样式 */\n' + mainCss + '\n</style>');

// 4) 内联所有脚本
html = html.replace(/<script src="\.\/([^"]+)"><\/script>/g, (m, src) => {
  const p = path.join(ROOT, src);
  if (!fs.existsSync(p)) throw new Error('缺少脚本：' + src);
  let code = fs.readFileSync(p, 'utf8');
  // 防止内容中出现 </script> 提前闭合
  code = code.replace(/<\/script>/gi, '<\\/script>');
  return '<script>\n/* ' + src + ' */\n' + code + '\n</script>';
});

const license = fs.readFileSync(path.join(ROOT, 'vendor/katex/LICENSE'), 'utf8');
html = html.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- Bundled KaTeX 0.16.11\n' + license + '\n-->');

// 5) 标注单文件版
html = html.replace('<title>', '<title>[单文件] ').replace(
  '<meta name="description"',
  '<!-- 单文件版：所有样式、脚本与公式字体已内联，双击即可打开 -->\n<meta name="description"');

const out = path.join(ROOT, '大学物理学习站-单文件版.html');
fs.writeFileSync(out, html, 'utf8');
const size = (fs.statSync(out).size / 1024 / 1024).toFixed(2);
console.log('已生成', path.relative(process.cwd(), out), size + ' MB');
