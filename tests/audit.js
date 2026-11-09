const { load } = require('./harness.js');
const P = load();
const errs = [], warns = [];

// 1. 章节 / 小节 / 题目 / 公式 / 实验 的引用一致性
P.chapters.forEach(ch => {
  if (!P.getModule(ch.module)) errs.push(`章节 ${ch.id} 的模块 ${ch.module} 不存在`);
  ch.sections.forEach(s => {
    if (!/^ch\d\d-s\d\d$/.test(s.id)) errs.push(`小节 id 不规范: ${s.id}`);
    if (s.status === 'published' && !P.content.sections[s.id]) errs.push(`小节 ${s.id} 标记已发布但没有正文`);
  });
});
P.questions.forEach(q => {
  if (!P.getSection(q.section)) errs.push(`题目 ${q.id} 的 section ${q.section} 不存在`);
  if (q.type === 'single') {
    if (!(q.answer >= 0 && q.answer < q.options.length)) errs.push(`题目 ${q.id} 答案越界`);
    if (q.options.length !== 4) warns.push(`题目 ${q.id} 选项数 ${q.options.length}`);
  } else if (q.type === 'numeric') {
    if (typeof q.answer !== 'number') errs.push(`数值题 ${q.id} 答案非数字`);
    if (!q.unit) errs.push(`数值题 ${q.id} 缺少单位`);
  } else errs.push(`题目 ${q.id} 题型未知: ${q.type}`);
  if (!q.hints || !q.hints.length) warns.push(`题目 ${q.id} 无提示`);
  if (!q.explain) errs.push(`题目 ${q.id} 无解析`);
});
P.formulas.forEach(f => {
  if (!P.getSection(f.section)) errs.push(`公式 ${f.id} 的 section 不存在`);
  ['tex','meaning','symbols','type','condition','misuse'].forEach(k => {
    if (!f[k] || (Array.isArray(f[k]) && !f[k].length)) errs.push(`公式 ${f.id} 缺字段 ${k}`);
  });
});
P.labs.forEach(l => {
  if (!P.getChapter(l.chapter)) errs.push(`实验 ${l.id} 章节不存在`);
  (l.sections||[]).forEach(s => { if (!P.getSection(s)) errs.push(`实验 ${l.id} 关联小节 ${s} 不存在`); });
});

// 2b. 反斜杠完整性：普通字符串里的 TeX 若被 JS 当成转义序列，这里能查出来
const TEX_CTRL = /[\x07\x08\x0b\x0c]/;
function scanStrings(v, path, out) {
  if (typeof v === 'string') {
    if (TEX_CTRL.test(v)) out.push(`${path} 含控制字符（TeX 反斜杠被吞）`);
    // 段落里出现 "ec{" "ext{" "imes" 这类失头的命令片段
    if (/\b(ec\{|ext\{|imes|rac\{|heta|ambda|qrt\{|mus)/.test(v) && /\$/.test(v)) {
      out.push(`${path} 疑似 TeX 命令残缺`);
    }
  } else if (v && typeof v === 'object') {
    for (const k in v) scanStrings(v[k], `${path}.${k}`, out);
  }
}
scanStrings(P.content, 'content', errs);
scanStrings(P.questions, 'questions', errs);
scanStrings(P.formulas, 'formulas', errs);
scanStrings(P.labs, 'labs', errs);

// 2. 每节：目标、正文、题量
Object.keys(P.content.sections).forEach(sid => {
  const d = P.content.sections[sid], sec = P.getSection(sid);
  if (!d.objectives || d.objectives.length < 2) errs.push(`${sid} 学习目标过少`);
  if (!d.body || d.body.length < 500) errs.push(`${sid} 正文过短`);
  if (!d.summary || !d.summary.length) errs.push(`${sid} 无小结`);
  if (!d.examples || !d.examples.length) errs.push(`${sid} 无例题`);
  d.examples.forEach((e, i) => {
    if (!e.steps || e.steps.length !== 5) errs.push(`${sid} 例${i+1} 步骤不是 5 步`);
  });
  const n = P.questions.filter(q => q.section === sid).length;
  if (n < 2) errs.push(`${sid} 只有 ${n} 道练习`);
});

// 3. 渲染：每节正文与例题都能渲染出非空 HTML，且无残留标记
Object.keys(P.content.sections).forEach(sid => {
  const d = P.content.sections[sid];
  let html;
  try { html = P.md.render(d.body); } catch (e) { errs.push(`${sid} 正文渲染抛错: ${e.message}`); return; }
  if (/\[\[/.test(html)) warns.push(`${sid} 有未解析的 xref`);
  if (/\{\{/.test(html)) errs.push(`${sid} 正文残留 {{ 标记`);
  if (/data-tex=/.test(html)) errs.push(`${sid} 公式未渲染`);
  // 公式必须被包裹
  if (/\$\$/.test(html)) errs.push(`${sid} 正文残留 $$`);
  // 渲染后的 $ 检查（跳过 HTML 属性）
  const stripped = html.replace(/<[^>]*>/g, '');
  if (/\$/.test(stripped)) errs.push(`${sid} 有未配对的 $ 公式: ` + stripped.match(/.{0,40}\$.{0,40}/));
});

// 4. 所有题目题干/选项/解析可渲染
P.questions.forEach(q => {
  [q.stem, q.explain, ...(q.options||[]), ...(q.hints||[])].forEach(t => {
    const out = P.md.render(String(t)).replace(/<[^>]*>/g, '');
    if (/\$/.test(out)) errs.push(`题目 ${q.id} 有未配对 $: ${out.slice(0,60)}`);
  });
});

// 5. 搜索
['加速度','运动图像','位移','向心','抛体','相对运动','动能定理','向心加速度'].forEach(q => {
  const r = P.search(q, { includePlanned: true });
  if (!r.total) errs.push(`搜索「${q}」无结果`);
});
const r1 = P.search('加速度');
console.log('搜索「加速度」命中分组:', r1.groups.map(g => `${g.kind}:${g.items.length}`).join(' '));
const r2 = P.search('向心加速度');
console.log('搜索「向心加速度」首个结果:', r2.groups[0] && r2.groups[0].items[0].doc.title, '/', r2.groups[0] && r2.groups[0].items[0].doc.kind);

// 6. 视图渲染不抛错
['home','course','labs','me'].forEach(name => {
  try { const v = P.views[name](); if (!v || !v.html || v.html.length < 200) errs.push(`视图 ${name} 输出异常`); }
  catch (e) { errs.push(`视图 ${name} 抛错: ${e.message}`); }
});
['ch01','ch02','ch15'].forEach(id => {
  try { P.views.chapter(id); } catch (e) { errs.push(`chapter(${id}) 抛错: ${e.message}`); }
});
Object.keys(P.content.sections).concat(['ch01-s08']).forEach(sid => {
  try { const v = P.views.section(sid); if (!v) errs.push(`section(${sid}) 返回空`); }
  catch (e) { errs.push(`section(${sid}) 抛错: ${e.message}`); }
});
try { P.views.formulas({}); } catch(e) { errs.push('formulas 抛错: '+e.message); }
try { const s = P.views.search('加速度'); if (!s.html.includes('result')) warns.push('搜索页无结果项样式'); } catch(e) { errs.push('search 视图抛错: '+e.message); }
try { P.views.labPage('lab-constant-accel'); P.views.labPage('lab-collision'); } catch(e){ errs.push('labPage 抛错: '+e.message); }

// 7. 学习记录
const S = P.Store;
S.init();
S.setLearned('ch01-s02', true);
if (!S.isLearned('ch01-s02')) errs.push('已学标记未生效');
S.recordAttempt('q01-s03-01', false, 0, false);
if (S.reviewState('q01-s03-01') !== 'todo') errs.push('答错未进入待复习');
S.recordAttempt('q01-s03-01', true, 1, false);
if (!S.attemptOf('q01-s03-01').first || S.attemptOf('q01-s03-01').first.correct !== false) errs.push('首次作答记录被覆盖');
const dump = S.exportJSON();
S.reset();
const imp = S.importJSON(dump);
if (!imp.ok) errs.push('导入失败: '+imp.error);
if (!S.isLearned('ch01-s02')) errs.push('导入后记录丢失');

console.log('\n错误', errs.length, '警告', warns.length);
errs.forEach(e => console.log('  ✗', e));
warns.forEach(w => console.log('  !', w));
process.exit(errs.length ? 1 : 0);
