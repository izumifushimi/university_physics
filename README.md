# 大学物理学习站

面向本科生的中文大学物理自学网站。按“理解情境 → 建立模型 → 阅读例题 → 独立练习 → 实验验证 → 复习订正”组织学习。

采用HTML、CSS和原生JavaScript，数学公式由本地KaTeX渲染。无需后端、账号或第三方运行依赖，支持静态托管和离线使用。

## 内容与功能

| 内容 | 数量 |
| --- | ---: |
| 正式课程 | 15章、102节 |
| 五步解析例题 | 204道 |
| 随堂练习 | 306道，包含106道数值题 |
| 公式速查卡 | 96张 |
| 互动实验 | 5个 |
| 章末测验 / 独立综合题 | 各15份 |
| 数学预备模块 / 模型配图 | 6个 / 15幅 |

覆盖力学、电磁学、热学、振动与波动光学、狭义相对论和量子基础。

- 全站搜索、章节先修入口与数学回顾。
- 练习逐条提示、即时反馈、重做与错题复习，保留首次作答。
- 匀加速运动、碰撞、电场叠加、简谐振动、双缝干涉实验。
- 章末测验统一交卷；综合推导题提供参考解答和自评标准。
- 收藏、笔记、阅读位置、测验及综合题草稿自动保存；支持导出、导入记录。
- 适配桌面与手机；图示标注模型、方向及单位。

## 在本机打开

推荐安装Node.js 22或更新版本，在项目根目录运行：

```bash
npm start
```

然后在 **Google Chrome** 地址栏输入 `http://127.0.0.1:8000/`。保持终端运行，按Ctrl+C停止服务。无需执行 `npm install`。

也可使用Python启动：

```bash
python3 -m http.server 8000 --directory site
```

点击GitHub上的 `index.html` 会查看源码。要浏览实际网站，请运行上述本地服务，或按下面说明启用GitHub Pages。

单文件下载版在 `site/大学物理学习站-单文件版.html`；下载到本机后，通过“打开方式 → Google Chrome”打开。

## 上传到GitHub

本仓库根目录应直接包含 `README.md`、`package.json`、`site/`、`tests/`、`docs/` 和 `.github/`，不要只上传 `index.html`。

1. 在GitHub创建一个空仓库，例如 `university-physics`。
2. 使用GitHub Desktop上传整个项目，或在项目根目录执行以下命令。
3. 将最后一条命令的地址替换为自己的仓库地址，然后推送。

```bash
git init
git add .
git commit -m "Initial physics learning website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

如果使用网页上传，先解压源码ZIP，再上传 `university-physics` 目录里面的文件和目录。务必包含隐藏的 `.github/` 等配置；macOS Finder可按Command+Shift+.显示隐藏文件。ZIP本身作为附件上传不会展开成网站源码。

## 发布为可访问的网站

已经提供手动发布工作流，上传代码后按以下顺序操作：

1. 仓库进入 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
2. 进入 **Actions → Publish GitHub Pages → Run workflow**，选择默认分支并运行。
3. 完成后在该次运行的 `deploy` 环境中打开实际网址，通常形如 `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`。

工作流只发布 `site/`，不会把测试和开发文档当作网页发布。使用相对资源路径及哈希路由，支持仓库子目录网址；后续更新后重新运行发布流程。配置方式参考[GitHub官方Pages文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 检查与生成

```bash
npm run check         # JS语法、内容引用、TeX、独立数值复算、记录回归
npm run build         # 更新单文件HTML（不影响多文件版直接运行）
npm run test:browser  # Chrome浏览器回归，自动启动临时服务器
npm run pack:source   # 检查后生成 release/university-physics-github.zip
```

浏览器测试需要已安装Google Chrome。默认自动查找系统路径，也可通过环境变量 `CHROME_PATH` 指定；测试使用独立临时配置，不读取日常浏览记录。截图写入 `test-results/`，不会提交到Git。

推送及Pull Request会运行 `Check website` 工作流，检查内容并执行浏览器回归；Pages发布需要手动触发。修改课程后请先运行检查，再更新单文件版并一起提交。

## 项目结构

```text
.github/workflows/      GitHub自动检查和Pages发布
site/                  可直接静态托管的完整网站
  index.html           网页入口
  assets/js/           路由、练习、学习记录、实验和页面
  assets/css/          响应式样式
  content/             15章正文与分章题库
  vendor/katex/        公式渲染脚本、样式、字体及许可
  大学物理学习站-单文件版.html
scripts/               零依赖预览、检查、测试及打包命令
tests/                 内容、物理计算和浏览器测试
  reference/           独立复算笔记与审校后的变更指纹
docs/                  编写规范、规划、审校及开发记录
```

## 内容维护与记录说明

- [开发与内容维护](docs/DEVELOPMENT.md)
- [章节编写规范](docs/CONTENT-SPEC.md)
- [理论审校与修订记录](docs/CONTENT-REVIEW.md)
- [开发进度与验证范围](docs/PROGRESS.md)
- [原始课程规划](docs/大学物理学习网站规划.md)
- [第三方组件与许可](THIRD_PARTY_NOTICES.md)

已记录204道例题的复核方法及432项独立计算，另重算106道数值练习。自动检查和审校指纹不能替代物理判断，详细范围以审校记录为准。

学习记录保存在当前浏览器的 `localStorage` 中，不会上传到GitHub。清除浏览器数据会移除记录；本机、GitHub Pages和单文件版的存储空间可能不同，迁移请使用导出/导入。账号同步、AI辅导及教师班级功能尚未加入。
