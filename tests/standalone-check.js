const browser = require('./support/browser');
const assert = require('node:assert/strict');
const http = require('http');
const PORT = 9337;
const get = p => new Promise((res, rej) => http.get({host:'127.0.0.1',port:PORT,path:p},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = browser.launch(
    ['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,'--user-data-dir='+browser.profile(),'--window-size=1200,1000','about:blank']);
  let t=null; for(let i=0;i<40;i++){try{t=await get('/json/list');if(t.some(x=>x.type==='page'))break}catch(e){} await sleep(250)}
  const ws = new (require('./websocket'))(t.find(x=>x.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>ws.on('open',r));
  let id=0; const pend=new Map(); const problems=[];
  ws.on('message',m=>{const o=JSON.parse(m);
    if(o.id&&pend.has(o.id)){pend.get(o.id)(o);pend.delete(o.id);}
    if(o.method==='Runtime.exceptionThrown') problems.push('EXC '+(o.params.exceptionDetails.exception?.description||'').slice(0,120));
    if(o.method==='Log.entryAdded'&&o.params.entry.level==='error') problems.push('ERR '+o.params.entry.text.slice(0,120));
  });
  const send=(m,p={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}))});
  const ev = async e=>{const r=await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true});return r.result.result?.value};
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  const url = require('node:url').pathToFileURL(require('node:path').join(browser.ROOT, 'site/大学物理学习站-单文件版.html')).href;
  await send('Page.navigate',{url});
  await sleep(2500);
  console.log('标题:', await ev('document.title'));
  console.log('首页渲染:', (await ev('document.querySelector(".hero h1").textContent')));
  console.log('KaTeX:', await ev('typeof katex'));
  // 进入学习页并检查公式
  await ev(`location.hash = '#/learn/ch01-s03'`);
  await sleep(900);
  console.log('学习页标题:', await ev('document.querySelector(".article h1").textContent.trim()'));
  console.log('独立公式:', await ev(`document.querySelectorAll('.katex-display').length`));
  console.log('例题:', await ev(`document.querySelectorAll('.example').length`));
  console.log('练习:', await ev(`document.querySelectorAll('.question').length`));
  // 实验页
  await ev(`location.hash = '#/lab/lab-constant-accel'`);
  await sleep(900);
  console.log('实验画布:', await ev(`document.querySelectorAll('canvas').length`));
  await send('Page.captureScreenshot',{}).then(r=>require('fs').writeFileSync(browser.screenshot('standalone.png'),Buffer.from(r.result.data,'base64')));
  console.log('问题:', problems.length ? problems.slice(0,5) : '无');
  assert.equal(problems.length, 0);
  assert.equal(await ev('document.querySelectorAll("canvas").length'), 4);
  ws.close(); chrome.kill();
})().catch(error => { console.error(error); process.exitCode = 1; });
