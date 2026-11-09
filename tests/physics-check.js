// 独立算式来自逐例审校笔记；不从题目答案反推计算式。
const assert = require('assert/strict'), crypto = require('crypto');
const P = require('./harness').load();
const {refs} = require('./reference/example-calculations');
const {recipes} = require('./reference/question-calculations');
const reviewed = require('./reference/content-review.json');
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const calc = expression => Function('"use strict";return (' + expression + ')')();
let examples = 0, calculations = 0;
for (const section of P.flatSections()) {
  const data = P.content.sections[section.id];
  assert.equal(hash(data), reviewed.sections[section.id], section.id + ' 内容有变化，须重新审查并更新该项审校指纹');
  assert.equal(P.questions.filter(q => q.section === section.id).length, 3);
  data.examples.forEach((example, i) => {
    const id = section.id + '-e' + (i + 1), ref = refs[id];
    assert(ref && ref.method, id + ' 缺少独立审校方法'); examples++;
    for (const [expression, rounded, unit] of ref.calculations) {
      const value = calc(expression); assert(Number.isFinite(value) && unit);
      // 原文末值有1—3位有效数字，逐项保留原文舍入值，统一上限3.5%。
      // 这项仅检查复算笔记；正文与其对应关系由人工审查及上面的内容指纹锁定。
      assert(Math.abs(value-rounded) <= .035*Math.max(Math.abs(value), Math.abs(rounded), Number.MIN_VALUE), id + ': ' + expression);
      calculations++;
    }
  });
}
assert.equal(examples, 204); assert.equal(Object.keys(refs).length, examples);
for (const q of P.questions) {
  assert.equal(hash(q), reviewed.questions[q.id], q.id + ' 题目变化后须重审');
  if (q.type === 'numeric') {
    assert(recipes[q.id], q.id + ' 缺少独立算式');
    assert(P.UI.answerCorrect(q, calc(recipes[q.id])), q.id + ' 复算结果超出判分容差');
    if (Math.abs(q.answer) > (q.tol || 0)) assert(!P.UI.answerCorrect(q, 0), q.id + ' 不应把0判对');
  }
  for (const invalid of ['', ' ', null, true, '0x10', 'Infinity', '1e999', '3m']) assert(!P.UI.answerCorrect(q, invalid));
}
assert.equal(P.questions.length, 306); assert.equal(Object.keys(recipes).length, 106);
assert.equal(P.UI.parseNumber('−3.5 × 10^-4'), -.00035);
assert(P.UI.answerCorrect({type:'numeric',answer:4e-23,tol:1e-25},'4e-23'));
assert(!P.UI.answerCorrect({type:'numeric',answer:4e-23,tol:1e-25},'0'));
assert(P.UI.answerNumber(4e-23).includes('e-23'));
assert.equal(hash(P.formulas),reviewed.formulas);
assert.equal(hash(P.preparatory),reviewed.preparatory);
assert.equal(hash(P.comprehensive),reviewed.comprehensive);
assert.equal(P.preparatory.length,6);assert.equal(P.comprehensive.length,15);
for(const ch of P.chapters){
  const comp=P.comprehensive.find(c=>c.chapter===ch.id);assert(comp && comp.steps.length===5 && comp.rubric.length>=3);
  const links=P.learningLinks[ch.id];assert(links);for(const id of links.chapters)assert(P.getChapter(id));for(const id of links.prep)assert(P.preparatory.some(p=>p.id===id));
  assert(P.views.chapter(ch.id).html.includes('#/challenge/'+ch.id));
  assert(P.views.challenge(ch.id).html.includes('challengeWork'));
}
assert.equal(Object.keys(P.illustrations).length,15);
for(const term of ['量纲','往返','综合'])assert(P.search(term).total>0);
// 表格不能把公式中的绝对值符号或转义竖线拆成额外列。
const table=P.md.render('| 公式 | 含义 |\n| --- | --- |\n| $|x|$ | 大小 |');
assert.equal((table.match(/<td/g)||[]).length,2);
assert(!P.md.inline('[危险](javascript:alert(1))').includes('href="javascript:'));
// 错误导入须保持当前记录；旧版有效记录仍可迁移。
P.Store.reset();P.Store.setNote('ch01-s01','应保留');const before=P.Store.exportJSON();
const bad=JSON.parse(before);bad.data.attempts={bad:{first:{correct:'yes'},last:{correct:false},tries:[]}};
assert(!P.Store.importJSON(JSON.stringify(bad)).ok);assert.equal(P.Store.noteOf('ch01-s01').text,'应保留');
P.Store.setExamDraft('exam-ch01',{'q01-s01-01':'1'});P.Store.setExamDraft('comp-ch01',{text:'建模草稿',checked:[0,2]});
const dump=P.Store.exportJSON();P.Store.reset();assert(P.Store.importJSON(dump).ok);assert.equal(P.Store.examDraftOf('comp-ch01').answers.text,'建模草稿');
console.log(`物理复核通过：${examples}例题、${calculations}项独立计算、106数值题；102节/306题/96公式卡/预备知识/综合题审校指纹一致`);
