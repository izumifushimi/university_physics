const assert = require('node:assert/strict');
const { once } = require('node:events');
const { createServer } = require('../scripts/serve');
(async () => {
  const server = createServer(); server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    const home = await fetch(base + '/'); assert.equal(home.status, 200);
    const html = await home.text(); assert(html.includes('大学物理学习站'));
    const urls = Array.from(html.matchAll(/(?:src|href)="\.\/([^"]+)"/g), m => m[1]);
    for (const url of urls) assert.equal((await fetch(base + '/' + url)).status, 200, url);
    const standalone = await fetch(base + '/' + encodeURIComponent('大学物理学习站-单文件版.html'));
    assert.equal(standalone.status, 200); assert((await standalone.text()).includes('Khan Academy and other contributors'));
    const head = await fetch(base + '/', { method: 'HEAD' }); assert.equal(head.status, 200); assert.equal(await head.text(), '');
    assert.equal((await fetch(base + '/missing-file')).status, 404);
    assert.equal((await fetch(base + '/%2e%2e%2fREADME.md')).status, 403);
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
    console.log(`预览服务器通过：首页、${urls.length}个资源、中文文件名、HEAD和路径边界`);
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
