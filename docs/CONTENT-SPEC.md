# 章节正文编写规范

新增章节必须严格遵守以下约定。`node tests/audit.js` 会逐条检查。

## 文件位置与注册

第 NN 章写到 `site/content/chNN.js`，结构：

```js
/* content/chNN.js —— 第 NN 章 标题（正文） */
(function (global) {
  'use strict';
  const PHYS = global.PHYS || (global.PHYS = {});
  PHYS.content = PHYS.content || { sections: {} };

  PHYS.registerSection('chNN-s01', { ... });

})(typeof window !== 'undefined' ? window : globalThis);
```

不要重复定义 `register`，直接用 `PHYS.registerSection`（`content/ch01.js` 里已经定义好了）。

## 每节字段

```js
{
  objectives: ['…', '…', '…'],        // 至少 3 条，学会什么
  prereq: [{ label: '…' }, { label: '…' }],  // 至少 1 条，纯文字，不要 to 字段
  lead: '本节一句话导语',
  body: String.raw`
## 小节标题一
正文…

## 小节标题二
正文…
`,                                     // Markdown，600 字以上
  examples: [ { title, stem, steps, note }, … ],   // 恰好 2 个
  summary: ['…', '…', '…'],           // 至少 3 条
  nextNote: '下一节要解决什么'
}
```

## 关键：反斜杠必须用 String.raw

`body` 一律写成 `String.raw`…``。**其他所有字段（objectives / lead / examples / summary / note / stem / steps）都是普通字符串，TeX 命令必须写双反斜杠：**

```js
objectives: ['写出 $\\Delta x = v_0 t + \\tfrac12 a t^2$'],   // 正确
objectives: ['写出 $\Delta x = v_0 t + \tfrac12 a t^2$'],    // 错误：\t 会变成制表符
```

最容易出错的是 `\t`（`\tau`、`\text`、`\times`）、`\b`（`\beta`、`\bar`）、`\v`（`\vec`）、`\f`（`\frac`）、`\n`（`\nu`、`\nabla`）。

## 例题：必须 5 步

```js
{
  title: '例 1　标题',
  stem: '题干，可含 $行内公式$ 与 <br>',
  steps: [
    ['明确对象与过程', '…'],
    ['作图', '…'],
    ['选择规律并说明条件', '…'],
    ['列式求解', '(1) …<br>(2) …'],
    ['检查', '量纲 / 方向 / 极限 / 数量级']
  ],
  note: '可选的评注'
}
```

五步顺序固定，`audit.js` 会断言 `steps.length === 5`。

## 正文 Markdown 子集

| 写法 | 用途 |
| --- | --- |
| `## 标题` | 二级标题，自动生成锚点与右侧本页目录 |
| `$…$` / `$$…$$` | KaTeX 行内 / 独立公式 |
| `**粗体**`、`*斜体*`、`` `代码` `` | 行内格式 |
| `- ` / `1. ` | 列表 |
| `> ` | 引用 |
| `\| a \| b \|` | 表格（第二行写 `\| --- \| --- \|`） |
| `{{callout type=warn title=注意}}…{{/callout}}` | 提示框，type 取 `warn` / `define` / `tip` / `note` |
| `{{formula tex="…" tag="…"}}` | 带说明的公式块 |
| `[文字](#/learn/chNN-sMM)` | 站内链接 |

正文里**不要**写 HTML 标签（`<br>` 只在例题中可用）。公式一律用 `$…$`，不要用 Unicode 上下标（如 `x²`、`v₀`）代替。

## 物理严谨性（audit 之外，人工检查）

- 每个守恒律都写明系统和适用条件；动量守恒与机械能守恒要分清。
- 热学全站统一 `ΔU = Q − W`，其中 W 为系统对外做功，正文必须显式说明。
- 电势零点、势能零点、坐标正方向、初始条件、边界条件要写清楚。
- 图表必须注明坐标、单位、方向、控制变量。
- 例题最后一步必须真的做量纲或数量级检查。
- 不要编造实验数据或参考文献。

## 题目

题目写在 `site/assets/js/content.js` 的 `PHYS.questions` 数组里：

```js
{
  id: 'q02-s01-01', chapter: 'ch02', section: 'ch02-s01',
  type: 'single',            // 或 'numeric'
  difficulty: 1,             // 1—4
  point: '惯性',             // 知识点
  tags: ['惯性', '参考系'],
  stem: '题干',
  options: ['A', 'B', 'C', 'D'],   // single 必须有 4 项
  answer: 1,                       // single 写索引；numeric 写数字
  tol: 0.01, unit: 'm/s',          // 仅 numeric
  explain: '解析',
  hints: ['提示一', '提示二'],
  commonError: '常见错误'
}
```

每节 3 道题（2 单选 + 1 数值），难度 1—4。数值题答案要能精确复算。

## 章节状态

正文写完后，把 `content.js` 里对应章节的 `status` 改成 `'published'`，其下所有小节同理。
