// 检查所有章节正文里的 TeX 完整性：缺反斜杠、控制字符、未配对的 $
const { load } = require('./harness.js');
const P = load();

const CMDS = ['Delta','vec','le','ge','frac','tau','beta','omega','theta','rho','alpha','lambda','mu','nu',
  'sigma','pi','cdot','times','approx','sqrt','int','sum','partial','infty','text','hat','bar','quad',
  'left','right','max','min','sin','cos','tan','ln','lim','psi','hbar','gamma','eta','varphi','varepsilon',
  'Phi','Omega','ne','pm','circ','prime','ldots','propto','rightarrow','Rightarrow','mathbf','tfrac','dfrac',
  'overline','overrightarrow','nabla','rho','ell','oint','iint','ln','det','exp'];

const problems = [];
const fileOf = {};
function walk(v, path) {
  if (typeof v === 'string') {
    if (/[\x07\x08\x0b\x0c]/.test(v)) problems.push({ path, kind: '控制字符', text: JSON.stringify(v).slice(0, 100) });
    if (/\\\$/.test(v) === false) {
      // 只检查含公式的片段
    }
    // 先去掉 $$...$$ 独立公式块，避免被当成两个空行内公式
    const stripped = v.replace(/\$\$[\s\S]*?\$\$/g, '');
    // 检查每个 $...$ 内是否出现「失头」的命令名
    const re = /\$([^$]+)\$/g;
    let m;
    while ((m = re.exec(stripped)) !== null) {
      const inner = m[1].replace(/\\(?:text|mathrm)\{[^}]*\}/g, '');
      for (const c of CMDS) {
        // 只在「命令名的典型语境」下判缺反斜杠：
        //   \frac12 / \frac{  → 紧跟数字或 {
        //   \times / \cdot     → 紧跟空格或数字
        //   其余                → 前一个字符不是字母/下划线/反斜杠
        let bad;
        if (c === 'min') {
          // "r/min" 是单位写法，不是 \min
          bad = /(?<![A-Za-z_\\])(min)(?![A-Za-z])/;
          if (/[A-Za-z]\/min|r\/min|\/min\b/.test(inner)) bad = null;
        } else if (c === 'ne') {
          bad = null;   // "ne" 多为变量名，不判
        } else if (c === 'frac' || c === 'dfrac' || c === 'tfrac') {
          bad = new RegExp('(?<![A-Za-z_\\\\])' + c + '(?=[0-9{])');
        } else if (c === 'times' || c === 'cdot' || c === 'approx') {
          bad = new RegExp('(?<![A-Za-z_\\\\])' + c + '(?=[\\s0-9])');
        } else {
          bad = new RegExp('(^|[^A-Za-z_\\\\])' + c + '(?![A-Za-z])');
        }
        if (bad && bad.test(inner)) {
          problems.push({ path, kind: '缺反斜杠 \\' + c, text: inner.slice(0, 90) });
          break;
        }
      }
      if (m[1].trim() === '') problems.push({ path, kind: '空公式', text: '' });
    }
    // 独立公式块同样检查命令完整性
    const dbl = /\$\$([\s\S]*?)\$\$/g;
    let dm;
    while ((dm = dbl.exec(v)) !== null) {
      const inner = dm[1].replace(/\\text\{[^}]*\}/g, '').replace(/\\mathrm\{[^}]*\}/g, '');
      for (const c of CMDS) {
        // 只在「命令名的典型语境」下判缺反斜杠：
        //   \frac12 / \frac{  → 紧跟数字或 {
        //   \times / \cdot     → 紧跟空格或数字
        //   其余                → 前一个字符不是字母/下划线/反斜杠
        let bad;
        if (c === 'min') {
          // "r/min" 是单位写法，不是 \min
          bad = /(?<![A-Za-z_\\])(min)(?![A-Za-z])/;
          if (/[A-Za-z]\/min|r\/min|\/min\b/.test(inner)) bad = null;
        } else if (c === 'ne') {
          bad = null;   // "ne" 多为变量名，不判
        } else if (c === 'frac' || c === 'dfrac' || c === 'tfrac') {
          bad = new RegExp('(?<![A-Za-z_\\\\])' + c + '(?=[0-9{])');
        } else if (c === 'times' || c === 'cdot' || c === 'approx') {
          bad = new RegExp('(?<![A-Za-z_\\\\])' + c + '(?=[\\s0-9])');
        } else {
          bad = new RegExp('(^|[^A-Za-z_\\\\])' + c + '(?![A-Za-z])');
        }
        if (bad && bad.test(inner)) {
          problems.push({ path, kind: '缺反斜杠 \\' + c + '（独立公式）', text: inner.slice(0, 90) });
          break;
        }
      }
    }

    // $ 数量为奇数（排除 $$）
    const noDisplay = v.replace(/\$\$[\s\S]*?\$\$/g, '');
    const count = (noDisplay.match(/\$/g) || []).length;
    if (count % 2 !== 0) problems.push({ path, kind: '$ 未配对', text: noDisplay.slice(0, 90) });
  } else if (v && typeof v === 'object') {
    for (const k in v) walk(v[k], path + '.' + k);
  }
}

walk(P.content, 'content');
walk(P.questions, 'questions');
walk(P.preparatory, 'preparatory');
walk(P.comprehensive, 'comprehensive');
walk(P.formulas, 'formulas');

// 渲染层面的检查：正文渲染后不应残留裸 TeX 命令
Object.keys(P.content.sections).forEach(sid => {
  const d = P.content.sections[sid];
  let html;
  try { html = P.md.render(d.body); } catch (e) { problems.push({ path: sid, kind: '渲染抛错', text: e.message }); return; }
  const text = html.replace(/<[^>]*>/g, '');
  if (/[\x07\x08\x0b\x0c]/.test(text)) problems.push({ path: sid, kind: '渲染后含控制字符', text: '' });
  if (/\$\$/.test(text)) problems.push({ path: sid, kind: '渲染后残留 $$', text: '' });
  if (/\{\{/.test(html)) problems.push({ path: sid, kind: '渲染后残留 {{ 标记', text: '' });
});

const byPath = {};
problems.forEach(p => { byPath[p.path] = (byPath[p.path] || []); byPath[p.path].push(p); });
const keys = Object.keys(byPath);
console.log('检查节数:', Object.keys(P.content.sections).length, '题目数:', P.questions.length);
console.log('问题条目:', problems.length);
keys.slice(0, 40).forEach(k => {
  console.log('\n' + k);
  byPath[k].slice(0, 3).forEach(p => console.log('  [' + p.kind + '] ' + p.text));
});
process.exit(problems.length ? 1 : 0);
