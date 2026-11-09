const browser = require('./support/browser');
const assert = require('node:assert/strict');
const http = require('http');
const PORT = 9336;
const get = p => new Promise((res, rej) => http.get({host:'127.0.0.1',port:PORT,path:p},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)))}).on('error',rej));
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  const chrome = browser.launch(
    ['--headless=new','--disable-gpu',`--remote-debugging-port=${PORT}`,'--user-data-dir='+browser.profile(),'--allow-file-access-from-files=false','about:blank']);
  let t=null; for(let i=0;i<40;i++){try{t=await get('/json/list');if(t.some(x=>x.type==='page'))break}catch(e){} await sleep(250)}
  const ws = new (require('./websocket'))(t.find(x=>x.type==='page').webSocketDebuggerUrl);
  await new Promise(r=>ws.on('open',r));
  let id=0; const pend=new Map(); const events=[];
  ws.on('message',m=>{const o=JSON.parse(m);
    if(o.id&&pend.has(o.id)){pend.get(o.id)(o);pend.delete(o.id);}
    if(o.method==='Runtime.exceptionThrown') events.push('EXCEPTION: '+JSON.stringify(o.params.exceptionDetails.exception&&o.params.exceptionDetails.exception.description||o.params.exceptionDetails.text));
    if(o.method==='Runtime.consoleAPICalled'&&o.params.type==='error') events.push('CONSOLE: '+o.params.args.map(a=>a.value||a.description).join(' '));
    if(o.method==='Log.entryAdded'&&o.params.entry.level==='error') events.push('LOG: '+o.params.entry.text+' '+ (o.params.entry.url||''));
  });
  const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  const url = require('node:url').pathToFileURL(require('node:path').join(browser.ROOT, 'site/index.html')).href;
  await send('Page.navigate',{url});
  await sleep(2500);
  const ev = async e => { const r = await send('Runtime.evaluate',{expression:e,returnByValue:true,awaitPromise:true}); return r.result.result.value };
  console.log('URL:', url);
  console.log('title:', await ev('document.title'));
  console.log('view length:', await ev('document.getElementById("view").innerHTML.length'));
  console.log('katex:', await ev('typeof katex'));
  console.log('localStorage works:', await ev('(()=>{try{localStorage.setItem("t","1");localStorage.removeItem("t");return "yes"}catch(e){return "NO: "+e.name}})()'));
  assert((await ev('document.querySelector(".hero h1")?.textContent')));
  assert.equal(events.length, 0);
  console.log('PROBLEMS:'); events.slice(0,12).forEach(e=>console.log('  '+e));
  ws.close(); chrome.kill();
})().catch(error => { console.error(error); process.exitCode = 1; });
