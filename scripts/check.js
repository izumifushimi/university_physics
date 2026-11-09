const fs = require('node:fs'), path = require('node:path'), { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
function syntax(directory) {
  for (const entry of fs.readdirSync(path.join(root, directory), { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== 'vendor') syntax(target);
    else if (entry.isFile() && entry.name.endsWith('.js')) run(['--check', target]);
  }
}
for (const dir of ['site', 'tests', 'scripts']) syntax(dir);
console.log('项目 JavaScript 语法检查通过');
for (const file of ['audit.js', 'check-tex.js', 'katex-check.js', 'physics-check.js', 'engineering.js', 'server-check.js']) run(['tests/' + file]);
