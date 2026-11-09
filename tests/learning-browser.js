const browser = require('./support/browser');
const {spawn}=require('child_process'),fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert/strict');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const profile=browser.profile(),port=9343;
 const chrome=browser.launch(['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--window-size=1400,1100','about:blank']);
 let ws;
 try{
 let targets;for(let n=0;n<50;n++){try{targets=await(await fetch(`http://localhost:${port}/json/list`)).json();if(targets.some(t=>t.type==='page'))break;}catch{}await wait(150);}
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r));
 let seq=0;const pending=new Map(),errors=[];ws.addEventListener('message',e=>{const o=JSON.parse(e.data);if(o.id){pending.get(o.id)?.(o);pending.delete(o.id);}if(o.method==='Runtime.exceptionThrown')errors.push(o.params.exceptionDetails);if(o.method==='Runtime.consoleAPICalled'&&o.params.type==='error')errors.push(o.params.args);});
 const send=(method,params={})=>new Promise(r=>{const id=++seq;pending.set(id,r);ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});assert(!r.result?.exceptionDetails,JSON.stringify(r.result?.exceptionDetails));return r.result.result?.value;};
 const goto=async hash=>{await ev(`location.hash=${JSON.stringify(hash)}`);await wait(180);};
 await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:browser.BASE_URL + '/index.html'});await wait(1000);
 await ev('PHYS.Store.reset()');
 await goto('#/learn/ch01-s01');
 const first=await ev('PHYS.questions.find(q=>q.section==="ch01-s01"&&q.type==="single").id');
 await ev(`(()=>{const q=PHYS.getQuestion(${JSON.stringify(first)}),c=document.querySelector('[data-qid="'+q.id+'"]');c.querySelector('input[value="'+((q.answer+1)%q.options.length)+'"]').checked=true;c.querySelector('[data-act="hint"]').click();c.querySelector('[data-act="submit"]').click();c.querySelector('[data-act="submit"]').click();})()`);
 assert.equal(await ev(`PHYS.Store.attemptOf(${JSON.stringify(first)}).tries.length`),1);
 assert.equal(await ev(`document.querySelector('[data-qid="'+${JSON.stringify(first)}+'"] .hints').querySelectorAll('li:not([hidden])').length`),1);
 await ev(`(()=>{const c=document.querySelector('[data-qid="'+${JSON.stringify(first)}+'"]');c.querySelector('[data-act="retry"]').click();})()`);
 assert(await ev(`(()=>{const c=document.querySelector('[data-qid="'+${JSON.stringify(first)}+'"]');return !c.querySelector('input').disabled&&c.querySelector('.feedback').hidden&&c.querySelector('.hints').hidden;})()`));
 await ev(`(()=>{const q=PHYS.getQuestion(${JSON.stringify(first)}),c=document.querySelector('[data-qid="'+q.id+'"]');c.querySelector('input[value="'+q.answer+'"]').checked=true;c.querySelector('[data-act="submit"]').click();})()`);
 assert(await ev(`(()=>{const a=PHYS.Store.attemptOf(${JSON.stringify(first)});return a.first.correct===false&&a.last.correct===true&&a.last.usedHint===false&&a.tries.length===2;})()`));
 const tiny=await ev('PHYS.questions.filter(q=>q.type==="numeric"&&q.answer>0).sort((a,b)=>a.answer-b.answer)[0]');
 await goto('#/learn/'+tiny.section);
 await ev(`(()=>{const c=document.querySelector('[data-qid="${tiny.id}"]');c.querySelector('input').value='0';c.querySelector('[data-act="submit"]').click();})()`);
 assert.equal(await ev(`PHYS.Store.attemptOf('${tiny.id}').last.correct`),false);
 assert((await ev(`document.querySelector('[data-qid="${tiny.id}"] .fb-answer').textContent`)).includes('e-'));
 await ev(`(()=>{const c=document.querySelector('[data-qid="${tiny.id}"]');c.querySelector('[data-act="retry"]').click();c.querySelector('input').value='${tiny.answer}';c.querySelector('[data-act="submit"]').click();})()`);
 assert.equal(await ev(`PHYS.Store.attemptOf('${tiny.id}').last.correct`),true);
 console.log('✓ 首次提交后原地重做、重复提交锁、首次错误保留、提示重置、微观小量判分');
 await goto('#/learn/ch01-s03');
 await ev('document.querySelector("#tocList a").click()');await wait(250);
 assert((await ev('location.hash')).startsWith('#/learn/ch01-s03#'));
 assert(await ev('document.querySelector("#tocList a.active")!==null'));
 await ev('scrollTo(0,1500)');await wait(750);await goto('#/me');
 await goto('#/learn/ch01-s03');await wait(200);assert(Math.abs((await ev('scrollY'))-1500)<10);
 await goto('#/learn/ch01-s04');assert.equal(await ev('scrollY'),0);
 await goto('#/me');
 const review=await ev('Array.from(document.links).find(a=>a.hash.includes("#q-"))?.hash');
 assert(review);await goto(review);assert(await ev('(()=>{const id=decodeURIComponent(location.hash.split("#")[2]);const r=document.getElementById(id).getBoundingClientRect();return r.top<150&&r.bottom>0;})()'));
 console.log('✓ 目录锚点、错题直达、阅读位置恢复、新小节从顶部开始');
 for(const id of await ev('PHYS.preparatory.map(p=>p.id)')){
  await goto('#/prep/'+id);assert.equal(await ev('document.querySelectorAll("article.prose h2").length'),4);assert(await ev('document.querySelector("article.prose details")!==null'));assert.equal(await ev('document.querySelectorAll(".katex-error").length'),0,id);
 }
 await goto('#/challenge/ch01');await ev('document.querySelector("#challengeWork").value="先作图，积分速度得到位移，再分段求路程。";document.querySelector("#challengeWork").dispatchEvent(new Event("input",{bubbles:true}));document.querySelector("[data-rubric]").click()');
 await send('Page.reload');await wait(600);assert((await ev('document.querySelector("#challengeWork").value')).includes('积分速度'));assert(await ev('document.querySelector("[data-rubric]").checked'));
 for(let n=1;n<=15;n++){
  const id='ch'+String(n).padStart(2,'0');await goto('#/challenge/'+id);assert.equal(await ev('document.querySelectorAll("[data-rubric]").length'),3);await ev('document.querySelector("details").open=true');assert.equal(await ev('document.querySelectorAll(".katex-error").length'),0,id);
 }
 await goto('#/formulas');await ev('document.querySelector("#formulaChapter").value="ch15";document.querySelector("#formulaChapter").dispatchEvent(new Event("change",{bubbles:true}))');await wait(250);
 assert.equal(await ev('document.querySelectorAll(".formula-card").length'),8);assert((await ev('location.hash')).includes('chapter=ch15'));
 const labSecs=await ev('PHYS.labs.flatMap(l=>l.sections)');for(const id of labSecs){await goto('#/learn/'+id);assert(await ev('document.querySelector("#inlineLab canvas")!==null'),id);}
 console.log('✓ 6个预备模块、15章综合题、推导草稿与自评恢复、公式章节筛选、全部嵌入实验');
 await goto('#/exam/ch01');const input=await ev('document.querySelector("#examForm input").name');
 await ev('document.querySelector("#examForm input").click()');await send('Page.reload');await wait(600);assert.equal(await ev(`document.querySelector('[name="${input}"]:checked')!==null`),true);
 await ev('document.querySelector("#examForm").requestSubmit();document.querySelector("#examRetry").click();document.querySelector("#examForm input").click()');await send('Page.reload');await wait(600);
 assert.equal(await ev('document.querySelectorAll(".exam-explanation").length'),0);assert(await ev(`document.querySelector('[name="${input}"]:checked')!==null`));assert.equal(await ev('PHYS.Store.examOf("exam-ch01").first.total'),7);
 assert((await ev('PHYS.Store.examDraftOf("comp-ch01").answers.text')).includes('积分速度'));
 console.log('✓ 章末测验未交卷草稿与重做草稿刷新恢复；切页后综合题草稿不被其他输入改写');
 // 扫描全部页的真实内链，确保路由和来源引用实际存在。
 const routes=['#/','#/course','#/labs','#/formulas','#/me',...await ev('PHYS.chapters.flatMap(c=>["#/chapter/"+c.id,"#/challenge/"+c.id,"#/exam/"+c.id])'),...await ev('PHYS.flatSections().map(s=>"#/learn/"+s.id)'),...await ev('PHYS.preparatory.map(p=>"#/prep/"+p.id)')];
 for(const hash of routes){await goto(hash);const bad=await ev(`Array.from(document.links).map(a=>a.hash).filter(h=>h.startsWith('#/')).filter(h=>{const [p]=h.slice(2).split(/[?#]/),id=h.slice(2).split(/[/?#]/)[1];return p==='learn'&&!PHYS.getSection(id)||['chapter','exam','challenge'].includes(p)&&!PHYS.getChapter(id)||p==='prep'&&!PHYS.preparatory.some(s=>s.id===id)||p==='lab'&&!PHYS.labs.some(s=>s.id===id)&&id!=='lab-harmonic';})`);assert.deepEqual(bad,[],hash);}
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 for(const hash of ['#/course','#/learn/ch02-s04','#/learn/ch13-s02','#/prep/pre-calculus','#/challenge/ch10','#/formulas?chapter=ch15']){
  await goto(hash);assert(await ev('document.documentElement.scrollWidth<=innerWidth'),hash+' mobile overflow');
  if(hash==='#/learn/ch13-s02'||hash==='#/challenge/ch10'){const r=await send('Page.captureScreenshot',{captureBeyondViewport:true});fs.writeFileSync(hash.includes('challenge')?browser.screenshot('challenge-mobile.png'):browser.screenshot('section-mobile.png'),Buffer.from(r.result.data,'base64'));}
 }
 await send('Emulation.setDeviceMetricsOverride',{width:1400,height:1000,deviceScaleFactor:1,mobile:false});await goto('#/learn/ch02-s04');
 const shot=await send('Page.captureScreenshot',{captureBeyondViewport:false});fs.writeFileSync(browser.screenshot('learning-desktop.png'),Buffer.from(shot.result.data,'base64'));
 console.log('✓ 全站内链有效、学习页面手机布局');
 await send('Page.navigate',{url:require('url').pathToFileURL(path.resolve('site/大学物理学习站-单文件版.html')).href+'#/prep/pre-probability'});await wait(800);
 assert.equal(await ev('document.querySelectorAll("article.prose h2").length'),4);
 await goto('#/challenge/ch15');await ev('document.querySelector("#challengeWork").value="离线推导草稿";document.querySelector("#challengeWork").dispatchEvent(new Event("input",{bubbles:true}))');await send('Page.reload');await wait(600);assert.equal(await ev('document.querySelector("#challengeWork").value'),'离线推导草稿');
 assert(await ev('(()=>{const d=PHYS.Store.exportJSON();PHYS.Store.reset();return PHYS.Store.importJSON(d).ok&&PHYS.Store.examDraftOf("comp-ch15").answers.text==="离线推导草稿";})()'));
 assert.equal(errors.length,0,JSON.stringify(errors));console.log('✓ file://预备知识、综合题草稿刷新与导出导入；控制台无异常');
 }finally{ws?.close();chrome.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
