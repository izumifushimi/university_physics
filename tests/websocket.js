// Node >= 22 内置WebSocket适配现有CDP脚本，无第三方依赖。
module.exports = class extends WebSocket {
  on(name, fn) { this.addEventListener(name, name === 'message' ? event => fn(event.data) : fn); return this; }
};
