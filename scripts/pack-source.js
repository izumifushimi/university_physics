// 使用Node内置模块生成可直接解压上传的ZIP，无额外依赖。
const fs = require('node:fs'), path = require('node:path'), zlib = require('node:zlib');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
for (const script of ['scripts/check.js', 'tests/build-standalone.js']) {
  const result = spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
const table = Array.from({ length: 256 }, (_, i) => {
  let c = i; for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0;
});
function crc32(data) { let c = 0xffffffff; for (const b of data) c = table[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
const selected = ['README.md', 'THIRD_PARTY_NOTICES.md', 'package.json', 'package-lock.json', '.gitignore', '.gitattributes', '.editorconfig', '.github', 'docs', 'scripts', 'site', 'tests'];
const files = [];
function collect(relative) {
  const filename = path.join(root, relative), name = path.basename(relative);
  if (['.DS_Store', 'Thumbs.db', 'node_modules', 'test-results', 'release', '.git'].includes(name) || name.startsWith('._') || /^physics-progress-.*\.json$/.test(name)) return;
  const stat = fs.lstatSync(filename);
  if (stat.isSymbolicLink()) throw new Error('源码包不接收符号链接：' + relative);
  if (stat.isDirectory()) for (const entry of fs.readdirSync(filename).sort()) collect(path.join(relative, entry));
  else if (stat.isFile()) files.push(relative);
}
for (const name of selected) if (fs.existsSync(path.join(root, name))) collect(name);
const local = [], central = []; let offset = 0;
for (const relative of files) {
  const data = fs.readFileSync(path.join(root, relative));
  if (/\.(?:js|json|md|html|yml|css)$/.test(relative) && /\/(?:Users|home)\/[^/\s]+\//.test(data.toString('utf8'))) throw new Error('发现个人绝对路径：' + relative);
  const compressed = zlib.deflateRawSync(data), crc = crc32(data);
  const name = Buffer.from('university-physics/' + relative.split(path.sep).join('/'));
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50); header.writeUInt16LE(20, 4); header.writeUInt16LE(0x800, 6); header.writeUInt16LE(8, 8); header.writeUInt16LE(33, 12);
  header.writeUInt32LE(crc, 14); header.writeUInt32LE(compressed.length, 18); header.writeUInt32LE(data.length, 22); header.writeUInt16LE(name.length, 26);
  local.push(header, name, compressed);
  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50); entry.writeUInt16LE(20, 4); entry.writeUInt16LE(20, 6); entry.writeUInt16LE(0x800, 8); entry.writeUInt16LE(8, 10); entry.writeUInt16LE(33, 14);
  entry.writeUInt32LE(crc, 16); entry.writeUInt32LE(compressed.length, 20); entry.writeUInt32LE(data.length, 24); entry.writeUInt16LE(name.length, 28); entry.writeUInt32LE(offset, 42);
  central.push(entry, name); offset += header.length + name.length + compressed.length;
}
const directory = Buffer.concat(central), end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(directory.length, 12); end.writeUInt32LE(offset, 16);
const out = path.join(root, 'release/university-physics-github.zip');
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, Buffer.concat([...local, directory, end]));
console.log(`源码包已生成：${path.relative(root, out)}（${files.length}个文件，${(fs.statSync(out).size/1024/1024).toFixed(2)} MB）`);
