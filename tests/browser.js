const browser = require('./support/browser');
// 通过 Chrome DevTools Protocol 驱动无头浏览器，验证交互与验收场景
const { spawn } = require('child_process');
const http = require('http');

const PORT = 9333;

function get(path) {
  return new Promise((res, rej) => {
    http.get({ host: '127.0.0.1', port: PORT, path }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const chrome = browser.launch([
    '--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`,
    '--user-data-dir='+browser.profile(), '--window-size=1440,1200',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 40; i++) {
    try { targets = await get('/json/list'); if (targets.some(t => t.type === 'page')) break; } catch (e) {}
    await sleep(250);
  }
  if (!targets) { console.error('无法连接 Chrome'); chrome.kill(); process.exit(1); }

  const page = targets.find(t => t.type === 'page');
  const WebSocket = require('./websocket');
  let ws;
  try { ws = new WebSocket(page.webSocketDebuggerUrl); }
  catch (e) { console.error('缺少 ws 模块，改用原始实现'); }

  // 无 ws 模块时，用简易 WebSocket 客户端
  if (!ws) { chrome.kill(); process.exit(2); }
  await new Promise(r => ws.on('open', r));

  let id = 0;
  const pending = new Map();
  ws.on('message', m => {
    const msg = JSON.parse(m);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  });
  const send = (method, params = {}) => new Promise(res => {
    const i = ++id;
    pending.set(i, res);
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evaluate = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
    return r.result && r.result.result ? r.result.result.value : undefined;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  const goto = async (hash) => {
    await send('Page.navigate', { url: browser.BASE_URL + '/index.html' + hash });
    await sleep(900);
  };

  const fails = [];
  const check = (name, ok, detail) => {
    console.log((ok ? '✓ ' : '✗ ') + name + (detail !== undefined ? '  → ' + detail : ''));
    if (!ok) fails.push(name);
  };

  // 清空 localStorage，从干净状态开始
  await goto('#/');
  await evaluate('localStorage.clear(); location.hash="#/"; "ok"');
  await sleep(700);

  /* ---------- 验收 1 & 3：实验数值 ---------- */
  await goto('#/lab/lab-constant-accel');
  await sleep(600);
  const lab = await evaluate(`(() => {
    const q = s => document.querySelector(s);
    const set = (sel, v) => { const el = q(sel); el.value = v; el.dispatchEvent(new Event('input', {bubbles:true})); };
    set('input[data-key="x0"]', 0);
    set('input[data-key="v0"]', 2);
    set('input[data-key="a"]', 1.5);
    set('.lab-time', 4);
    return {
      x: q('[data-out="rx"]').textContent,
      v: q('[data-out="rv"]').textContent,
      d: q('[data-out="rd"]').textContent,
      p4x: q('[data-out="p4x"]').textContent,
      p4v: q('[data-out="p4v"]').textContent,
      canvases: document.querySelectorAll('canvas').length,
      hasDesc: !!q('canvas').getAttribute('aria-description')
    };
  })()`);
  check('验收3：x₀=0, v₀=2, a=1.5, t=4s 时 x=20', lab.x === '20.00', lab.x);
  check('验收3：同时 v=8', lab.v === '8.00', lab.v);
  check('验收3：位移 Δx=20', lab.d === '20.00', lab.d);
  check('实验：解析预测 x(4)=20, v(4)=8', lab.p4x === '20.00' && lab.p4v === '8.00', lab.p4x + '/' + lab.p4v);
  check('实验：四个画布（轨道 + 三图）', lab.canvases === 4, lab.canvases);
  check('实验：画布带文字说明', lab.hasDesc === true);

  // 参数变化会复位到 t=0
  const reset = await evaluate(`(() => {
    const el = document.querySelector('input[data-key="a"]');
    el.value = 3; el.dispatchEvent(new Event('input', {bubbles:true}));
    return document.querySelector('[data-out="time"]').textContent;
  })()`);
  check('实验：改参数后复位到 t=0', reset === '0.0 s', reset);

  // 播放/暂停/单步
  const transport = await evaluate(`(async () => {
    const btn = document.querySelector('[data-act="play"]');
    btn.click();
    await new Promise(r => setTimeout(r, 350));
    const during = document.querySelector('[data-out="time"]').textContent;
    btn.click(); // 暂停
    const label = document.querySelector('[data-act="play"]').textContent;
    document.querySelector('[data-act="reset"]').click();
    const afterReset = document.querySelector('[data-out="time"]').textContent;
    document.querySelector('[data-act="step"]').click();
    const afterStep = document.querySelector('[data-out="time"]').textContent;
    return { during, label, afterReset, afterStep };
  })()`);
  check('实验：播放推进时间', parseFloat(transport.during) > 0, transport.during);
  check('实验：暂停按钮文字切换', transport.label === '开始', transport.label);
  check('实验：复位归零', transport.afterReset === '0.0 s', transport.afterReset);
  check('实验：单步 +0.2 s', transport.afterStep === '0.2 s', transport.afterStep);

  /* ---------- 验收 1：读正文、做练习 ---------- */
  await goto('#/learn/ch01-s03');
  await sleep(500);
  const learn = await evaluate(`(() => ({
    title: document.querySelector('.article h1').textContent.trim(),
    formulas: document.querySelectorAll('.katex-display').length,
    inlineFormulas: document.querySelectorAll('.katex').length,
    fallback: document.querySelectorAll('.tex-fallback').length,
    examples: document.querySelectorAll('.example').length,
    questions: document.querySelectorAll('.question').length,
    toc: document.querySelectorAll('#tocList a').length,
    summaryExists: !!document.querySelector('#summary')
  }))()`);
  check('学习页：标题正确', learn.title.startsWith('1.3'), learn.title);
  check('学习页：独立公式已由 KaTeX 渲染', learn.formulas >= 4, learn.formulas + ' 个独立式 / ' + learn.inlineFormulas + ' 个公式对象');
  check('学习页：没有公式降级为纯文本', learn.fallback === 0, learn.fallback);
  check('学习页：有例题', learn.examples >= 1, learn.examples);
  check('学习页：有练习', learn.questions === 3, learn.questions);
  check('学习页：有右侧本页目录', learn.toc >= 4, learn.toc);
  check('学习页：有小节', learn.summaryExists);

  /* ---------- 验收 2：答错 → 解释 → 待复习 → 重做 ---------- */
  const wrong = await evaluate(`(() => {
    const card = document.querySelector('[data-qid="q01-s03-01"]');
    const radios = card.querySelectorAll('input[type="radio"]');
    radios[0].checked = true; // 正确答案是 1(B)，这里故意选 A
    card.querySelector('[data-act="submit"]').click();
    const fb = card.querySelector('.feedback');
    return {
      visible: !fb.hidden,
      cls: fb.className,
      hasAnswer: fb.textContent.includes('正确答案'),
      hasExplain: fb.textContent.includes('斜率'),
      markedCorrect: card.querySelectorAll('.option.is-correct').length,
      markedWrong: card.querySelectorAll('.option.is-wrong').length,
      review: JSON.parse(localStorage.getItem('phys.v1')).review['q01-s03-01']
    };
  })()`);
  check('练习：答错有反馈', wrong.visible && wrong.cls.includes('bad'));
  check('练习：反馈含正确答案与解释', wrong.hasAnswer && wrong.hasExplain);
  check('练习：标出正确项与错选项', wrong.markedCorrect === 1 && wrong.markedWrong === 1);
  check('练习：自动进入待复习', wrong.review === 'todo', wrong.review);

  // 重新加载页面后记录仍在（强制整页重载）
  await send('Page.navigate', { url: browser.BASE_URL + '/index.html#/me' });
  await sleep(500);
  await send('Page.navigate', { url: browser.BASE_URL + '/index.html#/learn/ch01-s03' });
  await sleep(700);
  const persisted = await evaluate(`(() => {
    const card = document.querySelector('[data-qid="q01-s03-01"]');
    return { chip: card.querySelector('.q-head').textContent.includes('上次答错'), hasRetry: !!card.querySelector('[data-act="retry"]') };
  })()`);
  check('验收2：重开页面后错题记录仍在', persisted.chip);
  check('验收2：提供重做按钮', persisted.hasRetry);

  // 重做并答对
  const redo = await evaluate(`(() => {
    const card = document.querySelector('[data-qid="q01-s03-01"]');
    card.querySelector('[data-act="retry"]').click();
    const radios = card.querySelectorAll('input[type="radio"]');
    radios.forEach(r => r.disabled = false);
    radios[1].checked = true;
    card.querySelector('[data-act="submit"]').click();
    const st = JSON.parse(localStorage.getItem('phys.v1'));
    return {
      fb: card.querySelector('.feedback').className,
      firstStill: st.attempts['q01-s03-01'].first.correct,
      tries: st.attempts['q01-s03-01'].tries.length
    };
  })()`);
  check('练习：重做答对显示正确', redo.fb.includes('ok'), redo.fb);
  check('验收2：首次作答记录仍保留为“错”', redo.firstStill === false);

  // 待复习页
  await goto('#/me');
  await sleep(600);
  const me = await evaluate(`(() => ({
    text: document.body.textContent,
    hasReviewItem: document.querySelectorAll('.review-item').length,
    stats: Array.from(document.querySelectorAll('.stat .v')).map(e => e.textContent)
  }))()`);
  check('我的学习：展示统计', me.stats.length >= 4, me.stats.join(' | '));
  check('我的学习：提交后自动进入待复习列表', me.hasReviewItem >= 1, me.hasReviewItem);

  /* ---------- 验收 4：搜索 ---------- */
  await goto('#/search?q=' + encodeURIComponent('加速度'));
  await sleep(500);
  const search = await evaluate(`(() => {
    const groups = Array.from(document.querySelectorAll('.result-group h2')).map(h => h.textContent);
    const kinds = Array.from(document.querySelectorAll('.result-kind')).map(e => e.textContent);
    return { groups, kinds: [...new Set(kinds)], n: document.querySelectorAll('.result').length,
             hasMark: !!document.querySelector('.result mark') };
  })()`);
  check('验收4：搜索“加速度”有结果', search.n > 0, search.n + ' 条');
  check('验收4：结果标注类型', search.kinds.length >= 3, search.kinds.join('/'));
  check('搜索：命中词高亮', search.hasMark);

  // 未发布内容标注待更新
  const planned = await evaluate(`(() => {
    location.hash = '#/search?q=' + encodeURIComponent('高斯定理');
    return new Promise(r => setTimeout(() => {
      const badges = document.querySelectorAll('.badge-pending').length;
      const links = Array.from(document.querySelectorAll('.result')).map(a => a.getAttribute('href'));
      r({ badges, hrefs: links });
    }, 700));
  })()`);
  check('搜索：已发布结果无待更新标记', planned.badges === 0, planned.badges);
  check('搜索：已发布结果可进入学习', planned.hrefs.some(h => h.startsWith('#/learn/')), planned.hrefs.slice(0, 3).join(','));

  /* ---------- 未发布小节 ---------- */
  await goto('#/learn/ch02-s01');
  await sleep(500);
  const notPub = await evaluate(`document.querySelector('.empty-state') ? document.querySelector('.empty-state').textContent : ''`);
  check('已发布小节：可阅读正文', !notPub.includes('仍在编写'), notPub.slice(0, 30));
  const plannedChapter = await evaluate(`(() => {
    location.hash = '#/chapter/ch02';
    return new Promise(r => setTimeout(() => r({
      cards: document.querySelectorAll('.sec-card.pending').length,
      badge: document.querySelectorAll('.badge-pending').length,
      empty: !!document.querySelector('.empty-state')
    }), 700));
  })()`);
  check('已发布章节：无待更新小节', plannedChapter.cards === 0 && !plannedChapter.empty, plannedChapter.cards + ' 节');
  await goto('#/course');
  await sleep(400);
  const coursePage = await evaluate(`(() => ({
    rows: document.querySelectorAll('.ch-row').length,
    pills: document.querySelectorAll('.status-pill.planned').length,
    filters: document.querySelectorAll('.filter-btn').length
  }))()`);
  check('课程目录：15 章全部列出', coursePage.rows === 15, coursePage.rows);
  check('课程目录：所有章节已发布', coursePage.pills === 0, coursePage.pills);

  /* ---------- 验收 5：移动端 ---------- */
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await goto('#/learn/ch01-s04');
  await sleep(500);
  const mobile = await evaluate(`(() => {
    const overflow = document.documentElement.scrollWidth - window.innerWidth;
    const art = document.querySelector('.article').getBoundingClientRect();
    const fb = document.querySelector('.formula-block');
    return { overflow, articleW: Math.round(art.width), winW: window.innerWidth,
             formulaScrolls: fb ? fb.scrollWidth >= fb.clientWidth : null,
             sideHidden: getComputedStyle(document.querySelector('.chapter-side')).display,
             toggleVisible: getComputedStyle(document.querySelector('#sideToggle')).display !== 'none',
             inputUsable: document.querySelector('input[type=text]').getBoundingClientRect().width };
  })()`);
  check('验收5：无横向溢出', mobile.overflow <= 1, mobile.overflow + 'px');
  check('验收5：正文适配屏宽', mobile.articleW <= mobile.winW, mobile.articleW + '/' + mobile.winW);
  check('验收5：目录收起、提供按钮入口', mobile.sideHidden === 'none' && mobile.toggleVisible);
  check('验收5：输入框可操作', mobile.inputUsable > 60, Math.round(mobile.inputUsable));
  await send('Page.captureScreenshot', {}).then(async r => {
    require('fs').writeFileSync(browser.screenshot('mobile.png'), Buffer.from(r.result.data, 'base64'));
  });
  await send('Emulation.clearDeviceMetricsOverride');

  /* ---------- 验收 6：导出 / 导入 ---------- */
  await goto('#/me');
  await sleep(500);
  const io = await evaluate(`(() => {
    const st = PHYS.Store;
    st.setLearned('ch01-s04', true);
    const dump = st.exportJSON();
    st.reset();
    const learnedAfterReset = st.learnedCount();
    const res = st.importJSON(dump);
    return { ok: res.ok, learnedAfterReset, restored: st.isLearned('ch01-s04'), bytes: dump.length };
  })()`);
  check('验收6：导出后导入可恢复', io.ok && io.restored && io.learnedAfterReset === 0, io.bytes + ' B');

  /* ---------- 控制台错误 ---------- */
  const consoleErrs = await evaluate(`window.__errs || []`);
  check('无未捕获的运行时错误', !consoleErrs.length, (consoleErrs || []).join('; '));

  console.log('\n失败项：', fails.length);
  ws.close();
  chrome.kill();
  process.exit(fails.length ? 1 : 0);
})().catch(e => { console.error('测试脚本错误：', e); process.exit(3); });
