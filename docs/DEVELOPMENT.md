# 开发与内容维护

## 内容与呈现分离

编辑课程内容只需要改两个地方：

1. **`assets/js/content.js`** —— 章节、小节、公式、题目、实验的元数据与稳定标识。小节标题改了，`id`（如 `ch01-s03`）保持不变。
2. **`content/chXX.js`** —— 正文。每节调用 `PHYS.registerSection('ch01-s03', {...})`，字段：`objectives`、`prereq`、`lead`、`body`、`examples`、`summary`、`nextNote`。

正文是 Markdown 子集，支持：

| 写法 | 效果 |
| --- | --- |
| `$...$` / `$$...$$` | KaTeX 行内 / 独立公式 |
| `## 标题` | 节内二级标题，自动生成 `#sec-N` 锚点与右侧本页目录 |
| `{{callout type=warn title=注意}} ... {{/callout}}` | 提示框（`warn`/`define`/`tip`/`note`） |
| `| 表头 | ... |` | 表格 |
| `[[formula-id]]` | 跳转到公式卡 |

例题的 `steps` 必须是 **5 步**，顺序固定（对象与过程 → 作图 → 规律与条件 → 列式求解 → 检查），这是文档第 5 节的要求，`tests/audit.js` 会检查。

## 新增一节

1. 在 `content.js` 对应章节的 `sections` 里加一条，`status` 设为 `'published'`。
2. 在 `content/chXX.js` 里 `register('chXX-sNN', {...})`。
3. 在 `content.js` 的 `PHYS.questions` 里加题目，`section` 指向该小节。
4. 跑 `node tests/audit.js`。

未发布的小节会自动显示“仍在编写中”，不会出现空白页或假按钮——这是文档明确要求的。

## 学习记录

存在浏览器 `localStorage` 的 `phys.v1` 下，包含：上次位置与滚动位置、主动标记的已学小节、每题首次作答与后续订正、复习状态、收藏公式、笔记、实验参数，以及章末测验的首次和后续成绩、尚未交卷的测验草稿、综合推导草稿与自评勾选。

- 不计算“掌握度百分比”。
- 答错自动进入“待复习”，可重做或标记“已理解”；复习建议依据真实错题。
- 提示逐条展开；重做会重置提示状态并保留首次作答。
- 章末测验复用随堂题库作全章抽查；15道独立综合题采用五步解答与自评，不自动判定推导等价。
- 清除浏览器数据会移除记录，这一点在“我的学习”页有说明。
- 导出为 JSON，导入会覆盖当前记录。


## 检查与生成

修改后运行 `npm run check`、`npm run build` 和 `npm run test:browser`。浏览器测试自动启动临时端口服务器，截图写入被Git忽略的 `test-results/`。需要指定Chrome时设置环境变量 `CHROME_PATH`。

物理计算与审校指纹见 `../tests/reference/`。正文变更必须先重审对应模型与计算，再更新对应指纹；不要为了通过测试直接批量覆盖指纹。
