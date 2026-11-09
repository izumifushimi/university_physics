const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { createServer } = require('./serve');
const root = require('node:path').resolve(__dirname, '..');
async function run(file, baseURL) {
  const child = spawn(process.execPath, [file], { cwd: root, stdio: 'inherit', env: { ...process.env, PHYS_BASE_URL: baseURL } });
  const timer = setTimeout(() => { console.error('浏览器测试超时：' + file); child.kill(); }, 180000);
  try { const [code] = await once(child, 'exit'); if (code !== 0) throw new Error(file + ' 未通过'); }
  finally { clearTimeout(timer); }
}
(async () => {
  const server = createServer();
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  try {
    const baseURL = 'http://127.0.0.1:' + server.address().port;
    for (const file of ['tests/build-standalone.js', 'tests/browser.js', 'tests/engineering-browser.js', 'tests/learning-browser.js', 'tests/standalone-check.js', 'tests/filecheck.js']) await run(file, baseURL);
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
