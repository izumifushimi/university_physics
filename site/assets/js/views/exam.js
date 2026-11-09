/* 章末测验：统一交卷，首次记录与后续重做分开保存。 */
(function (global) {
  'use strict';
  const P = global.PHYS, UI = P.UI, S = P.Store;
  function grade(exam, answers) {
    const groups = {}, items = exam.questions.map(function (id) {
      const q = P.getQuestion(id), answer = answers[id];
      const parsed = UI.parseNumber(answer), valid = parsed !== null;
      const correct = valid && UI.answerCorrect(q, parsed);
      const g = groups[q.point] || (groups[q.point] = { total: 0, correct: 0, wrong: [] });
      g.total++; if (correct) g.correct++; else g.wrong.push(id);
      return { id: id, answer: valid ? parsed : null, correct: !!correct };
    });
    return { at: new Date().toISOString(), total: items.length, correct: items.filter(i => i.correct).length, items: items, groups: groups };
  }
  P.gradeExam = grade;
  P.views.exam = function (chapterId) {
    const exam = P.exams.find(e => e.chapter === chapterId);
    if (!exam) return { title: '章末测验待更新', html: '<div class="page"><p>章末测验待更新。</p><a href="#/course">回到课程</a></div>' };
    function render(result) {
      const rec = S.examOf(exam.id);
      return '<div class="page"><div class="wrap-narrow"><a href="#/chapter/' + chapterId + '">← 返回本章</a><h1>' + UI.esc(exam.title) + '</h1>' +
        '<p>答案在本机自动保存，刷新可继续 · 不限时 · 每题 1 分 · 交卷前不显示对错。未答题按错误计分。重做保留首次成绩。</p>' +
        (rec ? '<p>首次成绩：' + rec.first.correct + ' / ' + rec.first.total + '；最近成绩：' + rec.last.correct + ' / ' + rec.last.total + '</p>' : '') +
        (result ? '<div class="summary-box" role="status"><h2>本次成绩：' + result.correct + ' / ' + result.total + '</h2><h3>按知识点回顾</h3><ul>' + Object.keys(result.groups).map(function (point) {
          const g = result.groups[point];
          return '<li>' + UI.esc(point) + '：' + g.correct + '/' + g.total + (g.wrong.length ? '；需复习第 ' + g.wrong.map(id => exam.questions.indexOf(id) + 1).join('、') + ' 题' : '；本次均答对') + '</li>';
        }).join('') + '</ul></div>' : '') + '<form id="examForm">' + exam.questions.map(function (id, i) {
          const q = P.getQuestion(id), item = result && (result.items.find(entry => entry.id === id) || { answer: null, correct: false });
          return '<fieldset class="card" style="min-width:0;margin:18px 0"><legend>第 ' + (i + 1) + ' 题 · ' + UI.esc(q.point) + '</legend>' + P.md.render(q.stem) +
            (result ? '<p>你的答案：' + UI.esc(item.answer == null ? '未作答' : q.type === 'single' ? String.fromCharCode(65 + item.answer) : item.answer + ' ' + q.unit) + ' · ' + (item.correct ? '正确' : '错误') + '</p><p>正确答案：' + (q.type === 'single' ? String.fromCharCode(65 + q.answer) + ' · ' + P.md.inline(q.options[q.answer]) : UI.esc(q.answer + ' ' + q.unit)) + '</p><div class="exam-explanation">' + P.md.render(q.explain) + '</div><a href="#/learn/' + q.section + '">回到对应小节</a>' :
              q.type === 'single' ? q.options.map((o, j) => '<label style="display:block;padding:8px"><input type="radio" name="' + id + '" value="' + j + '"> ' + String.fromCharCode(65 + j) + ' · ' + P.md.inline(o) + '</label>').join('') : '<label>答案 <input type="number" step="any" name="' + id + '" aria-label="第' + (i + 1) + '题数值答案"> ' + UI.esc(q.unit) + '</label>') + '</fieldset>';
        }).join('') + (result ? '<button class="btn" type="button" id="examRetry">重新作答</button>' : '<button class="btn btn-primary" type="submit">交卷并查看解析</button>') + '</form><p><a href="#/challenge/' + chapterId + '">继续做本章独立综合题 →</a></p></div></div>';
    }
    function bind(host, result) {
      if (result) host.querySelector('#examRetry').addEventListener('click', function () { S.setExamDraft(exam.id, {}); host.innerHTML = render(null); bind(host, null); });
      else {
        const form = host.querySelector('#examForm'), draft = S.examDraftOf(exam.id);
        if (draft) form.querySelectorAll('input').forEach(function (input) { const value = draft.answers[input.name]; if (input.type === 'radio') input.checked = String(value) === input.value; else if (value != null) input.value = value; });
        form.addEventListener('input', function () { const values = Object.fromEntries(new FormData(form)); S.setExamDraft(exam.id, values); });
        form.addEventListener('submit', function (event) {
        event.preventDefault();
        const answers = {};
        exam.questions.forEach(function (id) { const q = P.getQuestion(id); const el = host.querySelector('[name="' + id + '"]' + (q.type === 'single' ? ':checked' : '')); answers[id] = el ? el.value : null; });
        const next = grade(exam, answers); S.recordExam(exam.id, next); S.setExamDraft(exam.id, null);
        host.innerHTML = render(next); bind(host, next); global.scrollTo(0, 0);
      });
      }
    }
    const saved = S.examOf(exam.id), result = !S.examDraftOf(exam.id) && saved ? saved.last : null;
    return { title: exam.title, html: render(result), mount: host => bind(host, result) };
  };
})(typeof window !== 'undefined' ? window : globalThis);
