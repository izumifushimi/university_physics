// 零依赖预览服务器。模块调用时可选随机端口，供浏览器回归独立使用。
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../site');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.ico': 'image/x-icon' };

function createServer() {
  return http.createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return; }
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const filename = path.resolve(ROOT, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
      if (filename !== ROOT && !filename.startsWith(ROOT + path.sep)) { res.writeHead(403); res.end(); return; }
      const relative = path.relative(ROOT, filename).split(path.sep);
      if (relative.some(part => part.startsWith('.') && part !== '.nojekyll')) { res.writeHead(404); res.end(); return; }
      const data = await fs.readFile(filename);
      const type = types[path.extname(filename)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type + (/^(text\/|application\/json)/.test(type) ? '; charset=utf-8' : ''), 'Content-Length': data.length, 'Cache-Control': 'no-cache' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      res.writeHead(error instanceof URIError ? 400 : error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500);
      res.end('无法读取这个资源');
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 8000);
  const server = createServer();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `端口${port}已被占用，可设置PORT后重试。` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`请用 Google Chrome 打开 http://127.0.0.1:${server.address().port}/`));
}
module.exports = { createServer };
