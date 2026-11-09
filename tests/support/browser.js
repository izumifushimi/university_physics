const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const ROOT = path.resolve(__dirname, '../..');
const BASE_URL = (process.env.PHYS_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const shots = path.resolve(process.env.PHYS_SCREENSHOTS || path.join(ROOT, 'test-results'));
fs.mkdirSync(shots, { recursive: true });
function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = process.platform === 'darwin'
    ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
    : process.platform === 'win32'
      ? [process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean).map(p => path.join(p, 'Google/Chrome/Application/chrome.exe'))
      : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  for (const candidate of candidates) if (fs.existsSync(candidate)) return candidate;
  const probe = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['google-chrome'], { encoding: 'utf8' });
  if (probe.status === 0) return probe.stdout.trim().split(/\r?\n/)[0];
  throw new Error('找不到 Google Chrome，请安装浏览器或通过 CHROME_PATH 指定路径。');
}
function profile() { return fs.mkdtempSync(path.join(os.tmpdir(), 'phys-browser-')); }
function launch(args) {
  const extra = process.platform === 'linux' && process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : [];
  const child = spawn(chromePath(), [...extra, ...args], { stdio: 'ignore' });
  // 测试抛错、超时退出时，也要关闭本测试创建的浏览器，避免影响日常Chrome。
  const cleanup = () => child.kill();
  process.once('exit', cleanup);
  child.once('exit', () => process.removeListener('exit', cleanup));
  child.once('error', error => { console.error('启动测试浏览器失败：' + error.message); process.exit(1); });
  return child;
}
module.exports = { ROOT, BASE_URL, profile, launch, screenshot: name => path.join(shots, name) };
