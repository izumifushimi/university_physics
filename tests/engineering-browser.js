const browser = require('./support/browser');
const {spawn}=require('child_process'),fs=require('fs'),os=require('os'),path=require('path'),assert=require('assert/strict');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const profile=browser.profile(),port=9342;
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
 for(const width of [1400,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});
  for(const id of ['lab-collision','lab-shm','lab-double-slit','lab-field-superposition']){
   await goto('#/lab/'+id);
   assert.equal(await ev('document.querySelectorAll("canvas").length'),2);
   assert(await ev('document.querySelector("[data-read]").textContent.length>50'));
   assert(await ev('document.documentElement.scrollWidth<=innerWidth'),id+' overflow '+width);
   await ev('document.querySelector("[data-step]").click()');assert((await ev('document.querySelector("[data-time]").textContent')).includes('0.10'));
   await ev('document.querySelector("[data-play]").click()');await wait(220);await ev('document.querySelector("[data-play]").click()');
   assert.equal(await ev('document.querySelector("[data-play]").textContent'),'开始');
   await ev('document.querySelector("[data-reset]").click()');assert((await ev('document.querySelector("[data-time]").textContent')).includes('0.00'));
   if(width===390&&id==='lab-field-superposition'){const r=await send('Page.captureScreenshot',{captureBeyondViewport:true});fs.writeFileSync(browser.screenshot('field-mobile.png'),Buffer.from(r.result.data,'base64'));}
   console.log('✓ 实验交互与布局 '+id+' '+width+'px');
  }
 }
 await goto('#/chapter/ch01');assert(await ev('Array.from(document.links).some(a=>a.hash==="#/exam/ch01")'));
 await goto('#/exam/ch01');await ev('PHYS.Store.reset();PHYS.App.render()');
 assert.equal(await ev('document.querySelectorAll(".exam-explanation").length'),0);
 assert.equal(await ev('document.querySelectorAll("fieldset").length'),7);
 // 留空交卷、重做满分、刷新、导出导入，再刷新。
 await ev('document.querySelector("#examForm").requestSubmit()');assert.equal(await ev('PHYS.Store.examOf("exam-ch01").first.correct'),0);
 await ev('document.querySelector("#examRetry").click();PHYS.exams[0].questions.forEach(id=>{const q=PHYS.getQuestion(id);const el=document.querySelector(`[name="${id}"]${q.type==="single"?`[value="${q.answer}"]`:""}`);if(q.type==="single")el.checked=true;else el.value=q.answer;});document.querySelector("#examForm").requestSubmit()');
 assert.equal(await ev('PHYS.Store.examOf("exam-ch01").last.correct'),7);assert.equal(await ev('PHYS.Store.examOf("exam-ch01").first.correct'),0);
 await send('Page.reload');await wait(550);assert.equal(await ev('document.querySelectorAll(".exam-explanation").length'),7);
 assert(await ev('(()=>{const dump=PHYS.Store.exportJSON();PHYS.Store.reset();PHYS.Store.importJSON(dump);return PHYS.Store.examOf("exam-ch01").first.correct===0&&PHYS.Store.examOf("exam-ch01").last.correct===7;})()'));
 await goto('#/formulas');assert.equal(await ev('document.querySelectorAll(".formula-card").length'),96);assert.equal(await ev('document.querySelectorAll(".katex-error").length'),0);
 console.log('✓ 测验交卷、重做、首次成绩、刷新与导出导入；96张公式卡');
 const sections=await ev('PHYS.flatSections().map(s=>s.id)');for(const id of sections){await goto('#/learn/'+id);assert.equal(await ev('document.querySelectorAll(".katex-error").length'),0,id);}
 console.log('✓ 102节浏览器渲染无KaTeX错误');
 await send('Page.navigate',{url:require('url').pathToFileURL(path.resolve('site/大学物理学习站-单文件版.html')).href+'#/exam/ch15'});await wait(900);assert.equal(await ev('document.querySelectorAll("fieldset").length'),8);await goto('#/lab/lab-double-slit');assert.equal(await ev('document.querySelectorAll("canvas").length'),2);
 console.log('✓ 单文件版file://测验与新实验');assert.equal(errors.length,0,JSON.stringify(errors));
 }finally{ws?.close();chrome.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
