/* ==========================================================================
   课程索引 content.js
   --------------------------------------------------------------------------
   章 / 节 / 知识点 / 公式 / 题目 / 实验的稳定标识都集中在这里。
   正文放在 content/chXX.js 中，通过 PHYS.registerSection({...}) 注册。
   显示标题可以改，稳定标识（id）不随标题改动。
   ========================================================================== */
(function (global) {
  'use strict';

  const PHYS = global.PHYS || (global.PHYS = {});

  /* ---------------------------------------------------------------- 模块 */
  PHYS.modules = [
    { id: 'mechanics', name: '力学', chapters: ['ch01', 'ch02', 'ch03', 'ch04'], goal: '从描述运动，过渡到受力、守恒和转动分析', icon: '↗' },
    { id: 'electromagnetism', name: '电磁学', chapters: ['ch05', 'ch06', 'ch07', 'ch08'], goal: '理解电磁场、物质响应与时变电磁现象', icon: '⚡' },
    { id: 'thermal', name: '热学', chapters: ['ch09', 'ch10'], goal: '连接微观统计模型与宏观热力学规律', icon: '◍' },
    { id: 'oscillation', name: '振动、波动与光学', chapters: ['ch11', 'ch12', 'ch13'], goal: '从单个振子，理解波的传播、叠加和光学现象', icon: '∿' },
    { id: 'modern', name: '近代物理', chapters: ['ch14', 'ch15'], goal: '理解经典模型的适用范围，建立相对论与量子基础', icon: '✦' }
  ];

  /* ---------------------------------------------------------------- 章节 */
  // status: 'published' 已发布 | 'planned' 待更新
  // prereq: [{ id, note }]，id 为章号，note 为进入本章前需要补的基础
  PHYS.chapters = [
    {
      id: 'ch01', module: 'mechanics', num: '01', title: '质点运动学', status: 'published',
      goal: '能在运动情境、数学表达式和运动图像之间转换。',
      summary: '先建立“质点、参考系、坐标系”，再用位置、速度、加速度的函数关系与图像描述运动，最后把直线、曲线、抛体与相对运动统一到同一套分析方法。',
      prereq: [{ id: 'pre', note: '矢量的分解与分量；导数和定积分的物理意义' }],
      points: ['质点模型与参考系', '位置、位移、路程、速度与速率', '加速度', '三种运动图像', '匀变速直线运动', '切向与法向加速度', '抛体运动', '伽利略速度变换'],
      sections: [
        { id: 'ch01-s01', num: '1.1', title: '质点模型、参考系与坐标系', status: 'published' },
        { id: 'ch01-s02', num: '1.2', title: '位置、位移、路程、速度与速率', status: 'published' },
        { id: 'ch01-s03', num: '1.3', title: '加速度与位置—时间、速度—时间、加速度—时间图像', status: 'published' },
        { id: 'ch01-s04', num: '1.4', title: '直线运动：由运动方程求导，由速度或加速度积分', status: 'published' },
        { id: 'ch01-s05', num: '1.5', title: '曲线运动：切向加速度、法向加速度与圆周运动', status: 'published' },
        { id: 'ch01-s06', num: '1.6', title: '抛体运动及运动分解', status: 'published' },
        { id: 'ch01-s07', num: '1.7', title: '相对运动与伽利略速度变换', status: 'published' }
      ],
      examNote: '本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。'
    }
  ];

  // 已完成章节；标识与正文注册保持一致。
  PHYS.chapters.push(...[
  {
    "id": "ch02",
    "module": "mechanics",
    "num": "02",
    "title": "牛顿运动定律",
    "status": "published",
    "goal": "先选研究对象、画受力图，再列运动方程；区分平衡力和相互作用力。",
    "summary": "从惯性与相互作用出发，建立牛顿运动定律的适用范围。核心方法是选定对象、画受力图，再沿坐标方向列运动方程。本章承接运动学，为动量、能量及刚体动力学提供受力分析基础。",
    "prereq": [
      {
        "label": "矢量分解；第 01 章速度与加速度"
      }
    ],
    "points": [
      "惯性与惯性系",
      "牛顿第二定律",
      "作用力与反作用力",
      "重力弹力摩擦力",
      "受力图",
      "连接体与斜面",
      "圆周运动动力学",
      "惯性力"
    ],
    "sections": [
      {
        "id": "ch02-s01",
        "num": "2.1",
        "title": "惯性、惯性参考系与牛顿第一定律",
        "status": "published"
      },
      {
        "id": "ch02-s02",
        "num": "2.2",
        "title": "牛顿第二定律及分量形式",
        "status": "published"
      },
      {
        "id": "ch02-s03",
        "num": "2.3",
        "title": "牛顿第三定律与相互作用力",
        "status": "published"
      },
      {
        "id": "ch02-s04",
        "num": "2.4",
        "title": "重力、弹力、摩擦力与受力图",
        "status": "published"
      },
      {
        "id": "ch02-s05",
        "num": "2.5",
        "title": "连接体、斜面及圆周运动的动力学",
        "status": "published"
      },
      {
        "id": "ch02-s06",
        "num": "2.6",
        "title": "非惯性参考系与惯性力入门",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch03",
    "module": "mechanics",
    "num": "03",
    "title": "动量与能量",
    "status": "published",
    "goal": "能说明所选守恒律的适用条件，并判断碰撞过程中哪些量守恒。",
    "summary": "本章从力的时间累积和空间累积引出动量与能量。通过选择系统、区分内外力和检验守恒条件，处理碰撞及多阶段运动问题。它把牛顿定律转化为整体方法，并为刚体的角动量与转动能量作准备。",
    "prereq": [
      {
        "label": "牛顿定律；定积分与功的点积"
      }
    ],
    "points": [
      "冲量与动量定理",
      "动量守恒",
      "质心运动",
      "功与功率",
      "动能定理",
      "保守力与势能",
      "机械能守恒",
      "碰撞与分阶段建模"
    ],
    "sections": [
      {
        "id": "ch03-s01",
        "num": "3.1",
        "title": "冲量与质点动量定理",
        "status": "published"
      },
      {
        "id": "ch03-s02",
        "num": "3.2",
        "title": "质点系、内外力及动量守恒",
        "status": "published"
      },
      {
        "id": "ch03-s03",
        "num": "3.3",
        "title": "质心与质心运动",
        "status": "published"
      },
      {
        "id": "ch03-s04",
        "num": "3.4",
        "title": "功、功率与动能定理",
        "status": "published"
      },
      {
        "id": "ch03-s05",
        "num": "3.5",
        "title": "保守力、势能与机械能守恒",
        "status": "published"
      },
      {
        "id": "ch03-s06",
        "num": "3.6",
        "title": "碰撞：弹性、非弹性与完全非弹性碰撞",
        "status": "published"
      },
      {
        "id": "ch03-s07",
        "num": "3.7",
        "title": "综合建模：何时使用动力学、动量或能量方法",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch04",
    "module": "mechanics",
    "num": "04",
    "title": "刚体力学",
    "status": "published",
    "goal": "理解质量分布对转动的影响，并区分平动、转动与纯滚动的约束条件。",
    "summary": "本章把质点动力学扩展到具有质量分布的刚体。用角量、力矩和转动惯量描述定轴转动，再以功和角动量处理转动过程。末节将平动与转动联立，分析平衡和纯滚动，连接前两章的力与守恒方法。",
    "prereq": [
      {
        "label": "质点动力学；功、能量与动量；圆周运动"
      }
    ],
    "points": [
      "角运动学",
      "力矩与转动惯量",
      "平行轴定理",
      "定轴转动定律",
      "转动功与功率",
      "角动量及守恒",
      "刚体平衡",
      "纯滚动约束"
    ],
    "sections": [
      {
        "id": "ch04-s01",
        "num": "4.1",
        "title": "刚体模型与定轴转动的运动学",
        "status": "published"
      },
      {
        "id": "ch04-s02",
        "num": "4.2",
        "title": "力矩、转动惯量与平行轴定理",
        "status": "published"
      },
      {
        "id": "ch04-s03",
        "num": "4.3",
        "title": "定轴转动定律",
        "status": "published"
      },
      {
        "id": "ch04-s04",
        "num": "4.4",
        "title": "转动动能、力矩的功与功率",
        "status": "published"
      },
      {
        "id": "ch04-s05",
        "num": "4.5",
        "title": "角动量、角动量定理与守恒",
        "status": "published"
      },
      {
        "id": "ch04-s06",
        "num": "4.6",
        "title": "刚体平衡与纯滚动入门",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch05",
    "module": "electromagnetism",
    "num": "05",
    "title": "静电场",
    "status": "published",
    "goal": "区分场强与电势，并识别何时能方便地使用高斯定理求场。",
    "summary": "本章建立电荷产生静电场的场描述。用叠加积分和高斯定理求场，再通过电场力的功引入电势及其梯度关系。带电粒子的运动把电场与力学连接起来，也为导体、电介质和电容器打下基础。",
    "prereq": [
      {
        "label": "矢量叠加；积分、通量与功能关系"
      }
    ],
    "points": [
      "库仑定律与叠加",
      "连续分布电场",
      "电通量与高斯定理",
      "对称性求场",
      "电势与电势差",
      "电场与电势梯度",
      "等势面",
      "带电粒子运动"
    ],
    "sections": [
      {
        "id": "ch05-s01",
        "num": "5.1",
        "title": "电荷、库仑定律与叠加原理",
        "status": "published"
      },
      {
        "id": "ch05-s02",
        "num": "5.2",
        "title": "电场强度：点电荷与连续电荷分布",
        "status": "published"
      },
      {
        "id": "ch05-s03",
        "num": "5.3",
        "title": "电场线、电通量与高斯定理",
        "status": "published"
      },
      {
        "id": "ch05-s04",
        "num": "5.4",
        "title": "利用对称性计算电场",
        "status": "published"
      },
      {
        "id": "ch05-s05",
        "num": "5.5",
        "title": "电场力的功、电势与电势差",
        "status": "published"
      },
      {
        "id": "ch05-s06",
        "num": "5.6",
        "title": "电场与电势的关系、等势面",
        "status": "published"
      },
      {
        "id": "ch05-s07",
        "num": "5.7",
        "title": "带电粒子在静电场中的运动",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch06",
    "module": "electromagnetism",
    "num": "06",
    "title": "静电场中的导体和电介质",
    "status": "published",
    "goal": "解释导体和电介质的不同响应；区分接电源与断开电源时插入电介质的变化。",
    "summary": "本章研究物质对静电场的响应及其对电荷分布的影响。先用静电平衡和接地条件分析导体，再以电容、电位移和能量描述电介质系统。计算时始终区分固定电荷与固定电压，承接静电场并为电路与磁场能量作铺垫。",
    "prereq": [
      {
        "label": "静电场高斯定理；电势；能量守恒"
      }
    ],
    "points": [
      "导体静电平衡",
      "屏蔽与接地",
      "电容器模型",
      "电容串并联",
      "固定电荷与固定电压",
      "电介质极化",
      "电位移及高斯定理",
      "电场储能"
    ],
    "sections": [
      {
        "id": "ch06-s01",
        "num": "6.1",
        "title": "导体的静电平衡条件与电荷分布",
        "status": "published"
      },
      {
        "id": "ch06-s02",
        "num": "6.2",
        "title": "静电屏蔽、接地及典型导体系统",
        "status": "published"
      },
      {
        "id": "ch06-s03",
        "num": "6.3",
        "title": "电容与常见电容器",
        "status": "published"
      },
      {
        "id": "ch06-s04",
        "num": "6.4",
        "title": "电容器的串联、并联及电路边界条件",
        "status": "published"
      },
      {
        "id": "ch06-s05",
        "num": "6.5",
        "title": "电介质极化与电位移矢量",
        "status": "published"
      },
      {
        "id": "ch06-s06",
        "num": "6.6",
        "title": "电介质中的高斯定理",
        "status": "published"
      },
      {
        "id": "ch06-s07",
        "num": "6.7",
        "title": "电容器储能与电场能量",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch07",
    "module": "electromagnetism",
    "num": "07",
    "title": "稳恒磁场",
    "status": "published",
    "goal": "理解电流产生磁场，以及磁场如何作用于运动电荷和载流导体。",
    "summary": "本章先用电流密度和电荷守恒连接静电场与稳恒电流。随后以毕奥—萨伐尔定律、安培环路定理及对称性求磁场，并分析磁场对电荷和电流的作用。磁通量、磁矩与磁介质为下一章的电磁感应提供概念和模型。",
    "prereq": [
      {
        "label": "静电场与通量；矢量叉积；圆周运动"
      }
    ],
    "points": [
      "电流密度与欧姆定律",
      "磁感应强度与磁通量",
      "毕奥—萨伐尔定律",
      "安培环路定理",
      "洛伦兹力",
      "带电粒子轨迹",
      "安培力与磁矩",
      "磁介质"
    ],
    "sections": [
      {
        "id": "ch07-s01",
        "num": "7.1",
        "title": "稳恒电流衔接：电流、电流密度、电荷守恒和欧姆定律",
        "status": "published"
      },
      {
        "id": "ch07-s02",
        "num": "7.2",
        "title": "磁感应强度、磁场线与磁通量",
        "status": "published"
      },
      {
        "id": "ch07-s03",
        "num": "7.3",
        "title": "毕奥—萨伐尔定律及直导线、圆电流的磁场",
        "status": "published"
      },
      {
        "id": "ch07-s04",
        "num": "7.4",
        "title": "磁场的高斯定理与稳恒条件下的安培环路定理",
        "status": "published"
      },
      {
        "id": "ch07-s05",
        "num": "7.5",
        "title": "洛伦兹力及带电粒子在磁场中的运动",
        "status": "published"
      },
      {
        "id": "ch07-s06",
        "num": "7.6",
        "title": "安培力、载流线圈的磁矩与磁力矩",
        "status": "published"
      },
      {
        "id": "ch07-s07",
        "num": "7.7",
        "title": "磁介质基础：顺磁、抗磁与铁磁现象",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch08",
    "module": "electromagnetism",
    "num": "08",
    "title": "电磁感应与电磁波",
    "status": "published",
    "goal": "用磁通量变化判断感应效应，理解时变电磁场与电磁波的联系。",
    "summary": "本章从电动势和磁通量变化建立电磁感应规律。用楞次定律与能量守恒检验感应方向，区分动生、感生及自感互感。再以位移电流补全麦克斯韦方程，连接稳恒电磁场与电磁波、能流和波谱。",
    "prereq": [
      {
        "label": "稳恒磁场；磁通量；能量守恒与积分"
      }
    ],
    "points": [
      "电动势",
      "法拉第定律与楞次定律",
      "动生与感生电动势",
      "自感互感",
      "磁场储能与涡旋电场",
      "位移电流与麦克斯韦方程",
      "真空电磁波",
      "坡印廷矢量与辐射压"
    ],
    "sections": [
      {
        "id": "ch08-s01",
        "num": "8.1",
        "title": "电动势与电源做功的基本含义",
        "status": "published"
      },
      {
        "id": "ch08-s02",
        "num": "8.2",
        "title": "磁通量变化、法拉第电磁感应定律与楞次定律",
        "status": "published"
      },
      {
        "id": "ch08-s03",
        "num": "8.3",
        "title": "动生电动势与感生电动势",
        "status": "published"
      },
      {
        "id": "ch08-s04",
        "num": "8.4",
        "title": "自感、互感与磁场能量",
        "status": "published"
      },
      {
        "id": "ch08-s05",
        "num": "8.5",
        "title": "涡旋电场及电磁感应的能量分析",
        "status": "published"
      },
      {
        "id": "ch08-s06",
        "num": "8.6",
        "title": "位移电流与麦克斯韦方程组的积分形式",
        "status": "published"
      },
      {
        "id": "ch08-s07",
        "num": "8.7",
        "title": "电磁波的产生、传播及真空中平面波的基本关系",
        "status": "published"
      },
      {
        "id": "ch08-s08",
        "num": "8.8",
        "title": "电磁波能量、电磁波谱与典型应用",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch09",
    "module": "thermal",
    "num": "09",
    "title": "气体动理论",
    "status": "published",
    "goal": "从微观统计解释压强、温度和内能，区分单个分子的运动与整体分布。",
    "summary": "本章用大量分子的统计模型解释气体的宏观状态。通过分子碰壁、能量均分和速率分布，建立压强、温度和内能的联系。平均自由程与输运现象说明模型的微观机制，并为热力学的能量分析提供状态量关系。",
    "prereq": [
      {
        "label": "牛顿定律与动能；概率密度与平均值"
      }
    ],
    "points": [
      "理想气体状态方程",
      "压强微观解释",
      "温度与平均平动动能",
      "自由度与能量均分",
      "理想气体内能",
      "麦克斯韦速率分布",
      "三种特征速率",
      "平均自由程与输运"
    ],
    "sections": [
      {
        "id": "ch09-s01",
        "num": "9.1",
        "title": "理想气体的微观模型与状态方程",
        "status": "published"
      },
      {
        "id": "ch09-s02",
        "num": "9.2",
        "title": "压强的微观解释",
        "status": "published"
      },
      {
        "id": "ch09-s03",
        "num": "9.3",
        "title": "温度、平均平动动能与热运动",
        "status": "published"
      },
      {
        "id": "ch09-s04",
        "num": "9.4",
        "title": "自由度、能量均分与理想气体内能",
        "status": "published"
      },
      {
        "id": "ch09-s05",
        "num": "9.5",
        "title": "麦克斯韦速率分布及三种特征速率",
        "status": "published"
      },
      {
        "id": "ch09-s06",
        "num": "9.6",
        "title": "分子碰撞、平均自由程与输运现象概念",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch10",
    "module": "thermal",
    "num": "10",
    "title": "热学（以热力学为主）",
    "status": "published",
    "goal": "结合过程条件与状态变化进行能量分析，理解过程方向与热机效率限制。",
    "summary": "本章在宏观层面区分状态量与过程量，用第一定律分析吸热、内能变化和系统对外做功。结合过程条件与 p–V 图计算理想气体及循环的能量收支。第二定律、卡诺极限和熵把能量守恒推进到过程方向，承接气体动理论而形成完整热学框架。",
    "prereq": [
      {
        "label": "理想气体状态方程与内能；定积分"
      }
    ],
    "points": [
      "热平衡与状态量",
      "准静态过程与功",
      "热力学第一定律",
      "理想气体四类过程",
      "循环与热机效率",
      "制冷系数",
      "第二定律与卡诺循环",
      "熵变与熵增加"
    ],
    "sections": [
      {
        "id": "ch10-s01",
        "num": "10.1",
        "title": "热平衡、温度、热量与内能",
        "status": "published"
      },
      {
        "id": "ch10-s02",
        "num": "10.2",
        "title": "准静态过程、热力学功与 p–V 图",
        "status": "published"
      },
      {
        "id": "ch10-s03",
        "num": "10.3",
        "title": "热力学第一定律",
        "status": "published"
      },
      {
        "id": "ch10-s04",
        "num": "10.4",
        "title": "理想气体的等温、等容、等压与绝热过程",
        "status": "published"
      },
      {
        "id": "ch10-s05",
        "num": "10.5",
        "title": "循环过程、热机与制冷机",
        "status": "published"
      },
      {
        "id": "ch10-s06",
        "num": "10.6",
        "title": "热力学第二定律与卡诺循环",
        "status": "published"
      },
      {
        "id": "ch10-s07",
        "num": "10.7",
        "title": "熵、熵变与熵增加原理",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch11",
    "module": "oscillation",
    "num": "11",
    "title": "振动",
    "status": "published",
    "goal": "能由初始条件确定振动，并用相位和能量描述运动。",
    "summary": "本章以线性回复力建立简谐振动模型，由初始条件确定振幅和初相。用相位与能量同时描述弹簧振子和小角度单摆，并讨论振动合成。阻尼、受迫振动和共振刻画实际系统的响应，为机械波的传播与叠加作准备。",
    "prereq": [
      {
        "label": "牛顿定律与机械能；三角函数及微分方程"
      }
    ],
    "points": [
      "简谐运动方程",
      "初始条件与初相",
      "周期频率相位",
      "弹簧振子与单摆",
      "动能势能转化",
      "同向振动合成",
      "拍",
      "阻尼受迫振动与共振"
    ],
    "sections": [
      {
        "id": "ch11-s01",
        "num": "11.1",
        "title": "简谐振动模型、运动方程及初始条件",
        "status": "published"
      },
      {
        "id": "ch11-s02",
        "num": "11.2",
        "title": "振幅、周期、频率与相位",
        "status": "published"
      },
      {
        "id": "ch11-s03",
        "num": "11.3",
        "title": "弹簧振子、单摆及小振幅条件",
        "status": "published"
      },
      {
        "id": "ch11-s04",
        "num": "11.4",
        "title": "简谐振动的能量",
        "status": "published"
      },
      {
        "id": "ch11-s05",
        "num": "11.5",
        "title": "同方向振动的合成与拍",
        "status": "published"
      },
      {
        "id": "ch11-s06",
        "num": "11.6",
        "title": "阻尼振动、受迫振动与共振",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch12",
    "module": "oscillation",
    "num": "12",
    "title": "波动",
    "status": "published",
    "goal": "区分介质质点的振动与波形传播，并用相位差解释干涉和驻波。",
    "summary": "本章把单个质元的振动扩展为振动状态在介质中的传播。用行波的相位表达式区分波速与质元速度，并从叠加分析干涉、驻波及边界条件。能流与多普勒效应连接观测和应用，也为波动光学提供共同语言。",
    "prereq": [
      {
        "label": "简谐振动、相位与能量；空间偏导数"
      }
    ],
    "points": [
      "机械波与介质",
      "行波表达式与传播方向",
      "波速波长频率",
      "波的能流与强度",
      "相干与干涉",
      "驻波与正常模式",
      "边界条件",
      "声波多普勒效应"
    ],
    "sections": [
      {
        "id": "ch12-s01",
        "num": "12.1",
        "title": "机械波的形成、横波与纵波",
        "status": "published"
      },
      {
        "id": "ch12-s02",
        "num": "12.2",
        "title": "行波表达式、传播方向与相位",
        "status": "published"
      },
      {
        "id": "ch12-s03",
        "num": "12.3",
        "title": "波速、波长、频率与介质性质",
        "status": "published"
      },
      {
        "id": "ch12-s04",
        "num": "12.4",
        "title": "波的能量、能流与强度",
        "status": "published"
      },
      {
        "id": "ch12-s05",
        "num": "12.5",
        "title": "叠加原理、干涉与相干条件",
        "status": "published"
      },
      {
        "id": "ch12-s06",
        "num": "12.6",
        "title": "驻波、边界条件与正常模式",
        "status": "published"
      },
      {
        "id": "ch12-s07",
        "num": "12.7",
        "title": "多普勒效应及声波应用",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch13",
    "module": "oscillation",
    "num": "13",
    "title": "波动光学",
    "status": "published",
    "goal": "从光程差、相位差和边界条件解释条纹，区分干涉、衍射和偏振。",
    "summary": "本章用光程差与相位差统一分析相干光的叠加。双缝、薄膜、单缝及光栅各自的几何与边界条件决定条纹位置和包络。偏振揭示光的横波性质，分辨本领连接波动规律与实验观测，并为光的量子性质作对照。",
    "prereq": [
      {
        "label": "波的叠加、相干和相位；电磁波"
      }
    ],
    "points": [
      "光程与相干",
      "杨氏双缝干涉",
      "薄膜与等厚干涉",
      "单缝衍射",
      "光栅与缺级",
      "分辨本领",
      "马吕斯与布儒斯特定律",
      "干涉衍射实验分析"
    ],
    "sections": [
      {
        "id": "ch13-s01",
        "num": "13.1",
        "title": "光程、光程差与相干光",
        "status": "published"
      },
      {
        "id": "ch13-s02",
        "num": "13.2",
        "title": "杨氏双缝干涉",
        "status": "published"
      },
      {
        "id": "ch13-s03",
        "num": "13.3",
        "title": "薄膜干涉、劈尖与牛顿环",
        "status": "published"
      },
      {
        "id": "ch13-s04",
        "num": "13.4",
        "title": "惠更斯—菲涅耳原理与单缝衍射",
        "status": "published"
      },
      {
        "id": "ch13-s05",
        "num": "13.5",
        "title": "光栅衍射与分辨本领",
        "status": "published"
      },
      {
        "id": "ch13-s06",
        "num": "13.6",
        "title": "偏振、马吕斯定律与布儒斯特定律",
        "status": "published"
      },
      {
        "id": "ch13-s07",
        "num": "13.7",
        "title": "干涉与衍射的综合比较及实验分析",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch14",
    "module": "modern",
    "num": "14",
    "title": "狭义相对论",
    "status": "published",
    "goal": "明确事件、参考系和测量定义，避免脱离条件套用时间延缓和长度收缩公式。",
    "summary": "本章从相对性原理和光速不变出发，重新定义不同惯性系的时空测量。通过事件、洛伦兹变换与时空间隔，理解同时性、固有时、长度及速度变换。相对论动量与能量给出经典力学的低速极限，并为光子及量子现象提供能量关系。",
    "prereq": [
      {
        "label": "经典运动学与参考系；能量和动量；代数变换"
      }
    ],
    "points": [
      "两条基本假设",
      "同时性的相对性",
      "洛伦兹变换",
      "固有时与时间延缓",
      "固有长度与收缩",
      "相对论速度变换",
      "相对论能量动量",
      "时空图与因果关系"
    ],
    "sections": [
      {
        "id": "ch14-s01",
        "num": "14.1",
        "title": "经典时空观的局限与狭义相对论的两个基本假设",
        "status": "published"
      },
      {
        "id": "ch14-s02",
        "num": "14.2",
        "title": "同时性的相对性与洛伦兹变换",
        "status": "published"
      },
      {
        "id": "ch14-s03",
        "num": "14.3",
        "title": "时间延缓、固有时与长度收缩",
        "status": "published"
      },
      {
        "id": "ch14-s04",
        "num": "14.4",
        "title": "相对论速度变换",
        "status": "published"
      },
      {
        "id": "ch14-s05",
        "num": "14.5",
        "title": "相对论动量、能量及能量—动量关系",
        "status": "published"
      },
      {
        "id": "ch14-s06",
        "num": "14.6",
        "title": "时空图、典型问题与低速极限",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  },
  {
    "id": "ch15",
    "module": "modern",
    "num": "15",
    "title": "量子力学（大学物理基础层）",
    "status": "published",
    "goal": "用概率描述和离散能级理解微观现象，区分波函数与概率密度。",
    "summary": "本章从黑体辐射、光电效应和物质波说明经典描述的局限。以波函数、概率密度、归一化和不确定关系建立量子态的基本语言。薛定谔方程配合边界条件解释离散能级、隧穿及原子光谱，连接前述波动与相对论知识。",
    "prereq": [
      {
        "label": "波动与干涉；概率密度；相对论能量动量"
      }
    ],
    "points": [
      "黑体辐射与量子化",
      "光电效应与康普顿散射",
      "德布罗意物质波",
      "波函数与概率密度",
      "不确定关系",
      "薛定谔方程与定态",
      "无限深势阱",
      "隧穿与原子能级"
    ],
    "sections": [
      {
        "id": "ch15-s01",
        "num": "15.1",
        "title": "黑体辐射与能量量子化",
        "status": "published"
      },
      {
        "id": "ch15-s02",
        "num": "15.2",
        "title": "光电效应、光子与康普顿效应",
        "status": "published"
      },
      {
        "id": "ch15-s03",
        "num": "15.3",
        "title": "德布罗意物质波与波粒二象性",
        "status": "published"
      },
      {
        "id": "ch15-s04",
        "num": "15.4",
        "title": "波函数、概率密度与归一化",
        "status": "published"
      },
      {
        "id": "ch15-s05",
        "num": "15.5",
        "title": "不确定关系及其物理含义",
        "status": "published"
      },
      {
        "id": "ch15-s06",
        "num": "15.6",
        "title": "薛定谔方程与定态的基本概念",
        "status": "published"
      },
      {
        "id": "ch15-s07",
        "num": "15.7",
        "title": "一维无限深势阱与能级量子化",
        "status": "published"
      },
      {
        "id": "ch15-s08",
        "num": "15.8",
        "title": "势垒隧穿、原子能级与量子现象概览",
        "status": "published"
      }
    ],
    "examNote": "本章已提供不限时章末测验，题目选自各节随堂练习，保留首次成绩与后续重做记录。另可用各节练习逐项自测。"
  }
]);

  /* ------------------------------------------------------------ 预备知识 */
  PHYS.preparatory = [
    { id: 'pre-units', title: '单位、量纲、有效数字、数量级估算', body: '量纲式检查可以拦住大部分代入错误；有效数字决定结果该写到第几位。' },
    { id: 'pre-vector', title: '矢量的分解、点积、叉积及方向判断', body: '建立坐标系后，每个矢量写成两个或三个分量，矢量运算就变成标量运算。' },
    { id: 'pre-calculus', title: '导数、定积分及其物理意义', body: '导数描述“变化率”，定积分把“一段一段的贡献”累加成总量。' },
    { id: 'pre-function', title: '三角函数、指数函数、复数表示与简单微分方程', body: '振动与波动的表达式都离不开 sin/cos；衰减过程用指数函数。' },
    { id: 'pre-probability', title: '概率、概率密度、平均值与分布', body: '气体动理论与量子力学用分布描述，而不是追踪单个个体。' },
    { id: 'pre-field', title: '场的通量与环流；梯度、散度、旋度（拓展卡片）', body: '通量看“穿过的量”，环流看“沿回路累积的量”。梯度、散度、旋度为拓展内容，不作为进入门槛。' }
  ];

  /* -------------------------------------------------------------- 公式库 */
  // 卡片字段按文档要求：表达式、物理意义、符号、单位、标量/矢量、适用条件、常见误用、来源小节
  PHYS.formulas = [
    {
      id: 'f-average-velocity', chapter: 'ch01', section: 'ch01-s02', title: '平均速度',
      tex: '\\bar{\\vec{v}}=\\frac{\\Delta \\vec{r}}{\\Delta t}',
      meaning: '位移与所用时间之比，只反映整段时间内的平均效果。',
      symbols: [['\\Delta\\vec{r}', '位移（矢量）', 'm'], ['Δt', '时间间隔', 's']],
      type: '矢量', condition: '任意运动；Δ$\\vec{r}$ 必须是位移，不是路程。',
      misuse: '用路程除以时间得到的是平均速率，不是平均速度的大小。',
      tags: ['速度', '位移', '平均速度', '平均速率']
    },
    {
      id: 'f-instant-velocity', chapter: 'ch01', section: 'ch01-s02', title: '瞬时速度与瞬时速率',
      tex: '\\vec{v}=\\frac{d\\vec{r}}{dt},\\quad v=\\left|\\vec{v}\\right|=\\frac{ds}{dt}',
      meaning: '瞬时速度是位矢对时间的变化率；瞬时速率是速度的大小，也是路程对时间的变化率。',
      symbols: [['\\vec{r}', '位置矢量', 'm'], ['s', '路程', 'm'], ['t', '时间', 's']],
      type: '速度是矢量，速率是标量', condition: '任意运动。',
      misuse: '把“平均速度的大小”当成“平均速率”。瞬时量之间 v 恒等于 |$\\vec{v}$|，不成立的只是平均值那一对。',
      tags: ['速度', '速率', '导数', '瞬时速度']
    },
    {
      id: 'f-acceleration', chapter: 'ch01', section: 'ch01-s03', title: '加速度',
      tex: '\\vec{a}=\\frac{d\\vec{v}}{dt}=\\frac{d^2\\vec{r}}{dt^2}',
      meaning: '速度矢量的变化率，包含速度大小的变化和方向的变化。',
      symbols: [['\\vec{a}', '加速度', 'm/s²'], ['\\vec{v}', '速度', 'm/s']],
      type: '矢量', condition: '任意运动。',
      misuse: '把加速度的符号直接当成“加速/减速”。减速还是加速取决于 $\\vec{a}$ 与 $\\vec{v}$ 的夹角。',
      tags: ['加速度', '导数', '运动图像']
    },
    {
      id: 'f-constant-accel', chapter: 'ch01', section: 'ch01-s04', title: '匀变速直线运动基本关系',
      tex: 'v=v_0+at,\\quad x=x_0+v_0t+\\tfrac12 at^2,\\quad v^2=v_0^2+2a(x-x_0)',
      meaning: '加速度恒定时，速度、位置与时间之间的三条关系。',
      symbols: [['v₀', '初速度', 'm/s'], ['x₀', '初位置', 'm'], ['a', '加速度（可取负）', 'm/s²']],
      type: '直线运动时按一维分量处理', condition: '加速度恒定，且运动限制在一条直线上。',
      misuse: '加速度随时间变化时仍套用第三式；或忘记 a、v 的正负号来源于坐标轴约定。',
      tags: ['加速度', '匀变速', '运动图像', '直线运动']
    },
    {
      id: 'f-derive-from-graph', chapter: 'ch01', section: 'ch01-s03', title: '图像与运动的对应',
      tex: 'v=\\frac{dx}{dt},\\quad a=\\frac{dv}{dt}=\\text{斜率};\\quad \\Delta x=\\int v\\,dt=\\text{面积}',
      meaning: 'x–t 图斜率是速度，v–t 图斜率是加速度，v–t 图与时间轴围成的有向面积是位移。',
      symbols: [['斜率', '该时刻的变化率', '—'], ['面积', '累积量', '—']],
      type: '标量读图规则', condition: '坐标轴为时间 t 的直角坐标图。',
      misuse: '把 x–t 图上“上升的一段”直接说成加速运动（上升只说明 x 在增大）。',
      tags: ['运动图像', '加速度', '速度', '斜率', '面积']
    },
    {
      id: 'f-tangential-normal', chapter: 'ch01', section: 'ch01-s05', title: '自然坐标系分解',
      tex: 'a_\\tau=\\frac{dv}{dt},\\quad a_n=\\frac{v^2}{\\rho},\\quad a=\\sqrt{a_\\tau^2+a_n^2}',
      meaning: '把加速度分解为沿切向改变速率的部分和沿法向改变方向的部分。',
      symbols: [['a_τ', '切向加速度', 'm/s²'], ['a_n', '法向（向心）加速度', 'm/s²'], ['ρ', '曲率半径', 'm']],
      type: '两个分量均为标量，方向沿切向 $\\hat{\\tau}$ 与法向 $\\hat{n}$', condition: '曲线运动，ρ 为轨迹在该点的曲率半径。',
      misuse: '认为匀速圆周运动加速度为零；实际上 a_τ=0 而 a_n=v²/R≠0。',
      tags: ['切向加速度', '法向加速度', '向心加速度', '圆周运动', '曲线运动']
    },
    {
      id: 'f-circular', chapter: 'ch01', section: 'ch01-s05', title: '圆周运动与角量关系',
      tex: 'v=\\omega R,\\quad a_n=\\omega^2R=\\frac{v^2}{R},\\quad a_\\tau=\\beta R',
      meaning: '线量与角量的换算；角加速度 β 对应切向加速度。',
      symbols: [['ω', '角速度', 'rad/s'], ['β', '角加速度', 'rad/s²'], ['R', '半径（此处曲率半径）', 'm']],
      type: '标量关系（方向另按切向/法向判断）', condition: '圆周运动；v、ω与切向量须采用一致的正方向，速率大小用 |ω|R。',
      misuse: '把 ω 的单位写成 Hz。1 Hz = 2π rad/s。',
      tags: ['圆周运动', '角速度', '向心加速度']
    },
    {
      id: 'f-projectile', chapter: 'ch01', section: 'ch01-s06', title: '抛体运动分解',
      tex: 'x=v_0\\cos\\theta_0\\,t,\\quad y=v_0\\sin\\theta_0\\,t-\\tfrac12 gt^2',
      meaning: '水平方向匀速、竖直方向匀变速，两个方向共用同一时间 t。',
      symbols: [['θ₀', '抛射角（与水平方向夹角）', 'rad 或 °'], ['g', '重力加速度', 'm/s²']],
      type: '分量式', condition: '均匀重力场、忽略空气阻力；取抛出点为原点、y 轴向上。',
      misuse: '两组方程使用不同的时间；或忽略“同一时刻”才允许把 x、y 组合成轨迹。',
      tags: ['抛体运动', '平抛', '斜抛', '运动分解']
    },
    {
      id: 'f-range', chapter: 'ch01', section: 'ch01-s06', title: '斜抛射程与最大高度',
      tex: 'R=\\frac{v_0^2\\sin 2\\theta_0}{g},\\quad H=\\frac{v_0^2\\sin^2\\theta_0}{2g}',
      meaning: '从同一高度抛出并落回该高度时，水平射程与最大高度。',
      symbols: [['R', '射程', 'm'], ['H', '最大高度', 'm']],
      type: '标量', condition: '落点与抛出点等高、无空气阻力。',
      misuse: '在落点高度不同时直接套用 R 的公式。',
      tags: ['抛体运动', '射程', '斜抛']
    },
    {
      id: 'f-relative-velocity', chapter: 'ch01', section: 'ch01-s07', title: '伽利略速度变换',
      tex: '\\vec{v}_{PA}=\\vec{v}_{PB}+\\vec{v}_{BA}',
      meaning: 'P 相对 A 的速度等于 P 相对 B 的速度加上 B 相对 A 的速度。',
      symbols: [['\\vec{v}_{PA}', 'P 相对 A 的速度', 'm/s'], ['\\vec{v}_{BA}', '参考系 B 相对 A 的速度', 'm/s']],
      type: '矢量', condition: '两个参考系之间只做匀速平动（相对速度恒定），且相对速率 v≪c。',
      misuse: '下标顺序写反；或在高速情形下仍使用伽利略变换（应由相对论速度变换代替）。',
      tags: ['相对运动', '速度变换', '伽利略变换']
    }
  ];

  PHYS.formulas.push(...[
  {
    "id": "f-ch02-001",
    "chapter": "ch02",
    "section": "ch02-s02",
    "title": "牛顿第二定律",
    "tex": "\\sum\\vec F=m\\vec a",
    "meaning": "合外力决定加速度。",
    "symbols": [
      [
        "m",
        "质量",
        "kg"
      ],
      [
        "\\vec a",
        "加速度",
        "m/s²"
      ],
      [
        "\\vec F",
        "力",
        "N"
      ]
    ],
    "type": "矢量",
    "condition": "惯性系、质量恒定、非相对论运动。",
    "misuse": "把某一个力直接当合外力。",
    "tags": [
      "牛顿第二定律",
      "\\sum\\vec F=m\\vec a",
      "质量",
      "加速度",
      "力"
    ]
  },
  {
    "id": "f-ch02-002",
    "chapter": "ch02",
    "section": "ch02-s03",
    "title": "牛顿第三定律",
    "tex": "\\vec F_{AB}=-\\vec F_{BA}",
    "meaning": "相互作用力等大反向，分别作用于两个物体。",
    "symbols": [
      [
        "\\vec F_{AB}",
        "A对B的作用力",
        "N"
      ]
    ],
    "type": "矢量",
    "condition": "经典力学中同一对直接相互作用力。",
    "misuse": "把作用反作用力画在同一物体上相消。",
    "tags": [
      "牛顿第三定律",
      "\\vec F_{AB}=-\\vec F_{BA}",
      "A对B的作用力"
    ]
  },
  {
    "id": "f-ch02-003",
    "chapter": "ch02",
    "section": "ch02-s04",
    "title": "胡克定律",
    "tex": "F_x=-kx",
    "meaning": "弹簧回复力与形变量反向。",
    "symbols": [
      [
        "k",
        "劲度系数",
        "N/m"
      ],
      [
        "x",
        "相对原长的形变量",
        "m"
      ],
      [
        "F_x",
        "弹力分量",
        "N"
      ]
    ],
    "type": "分量式",
    "condition": "理想弹簧在弹性限度内，沿弹簧轴取坐标。",
    "misuse": "把相对平衡位置位移与相对原长形变量混用。",
    "tags": [
      "胡克定律",
      "F_x=-kx",
      "劲度系数",
      "相对原长的形变量",
      "弹力分量"
    ]
  },
  {
    "id": "f-ch02-004",
    "chapter": "ch02",
    "section": "ch02-s04",
    "title": "滑动摩擦力",
    "tex": "f_k=\\mu_k N",
    "meaning": "摩擦力阻碍接触面的相对滑动。",
    "symbols": [
      [
        "\\mu_k",
        "动摩擦因数",
        "1"
      ],
      [
        "N",
        "支持力",
        "N"
      ]
    ],
    "type": "大小",
    "condition": "干摩擦近似，接触面正在相对滑动。",
    "misuse": "把支持力一律写成重力。",
    "tags": [
      "滑动摩擦力",
      "f_k=\\mu_k N",
      "动摩擦因数",
      "支持力"
    ]
  },
  {
    "id": "f-ch02-005",
    "chapter": "ch02",
    "section": "ch02-s05",
    "title": "圆周运动径向方程",
    "tex": "\\sum F_n=mv^2/R",
    "meaning": "合力沿指向圆心方向的分量提供向心加速度。",
    "symbols": [
      [
        "v",
        "速率",
        "m/s"
      ],
      [
        "R",
        "半径",
        "m"
      ],
      [
        "m",
        "质量",
        "kg"
      ]
    ],
    "type": "径向分量",
    "condition": "质点做圆周运动，径向向内取正。",
    "misuse": "在受力图上额外添加一个向心力。",
    "tags": [
      "圆周运动径向方程",
      "\\sum F_n=mv^2/R",
      "速率",
      "半径",
      "质量"
    ]
  },
  {
    "id": "f-ch02-006",
    "chapter": "ch02",
    "section": "ch02-s06",
    "title": "平动参考系的惯性力",
    "tex": "\\vec F_{\\mathrm{in}}=-m\\vec a_0",
    "meaning": "引入惯性力后可在加速平动系列相对运动方程。",
    "symbols": [
      [
        "\\vec a_0",
        "参考系相对惯性系的加速度",
        "m/s²"
      ],
      [
        "m",
        "质量",
        "kg"
      ]
    ],
    "type": "矢量",
    "condition": "参考系仅平动、坐标轴不转动。",
    "misuse": "在惯性系方程中也加上惯性力。",
    "tags": [
      "平动参考系的惯性力",
      "\\vec F_{\\mathrm{in}}=-m\\vec a_0",
      "参考系相对惯性系的加速度",
      "质量"
    ]
  },
  {
    "id": "f-ch03-007",
    "chapter": "ch03",
    "section": "ch03-s01",
    "title": "冲量与动量定理",
    "tex": "\\int_{t_1}^{t_2}\\vec F\\,dt=\\Delta\\vec p",
    "meaning": "合外力的冲量等于动量变化。",
    "symbols": [
      [
        "\\vec p",
        "动量",
        "kg·m/s"
      ],
      [
        "\\vec F",
        "合外力",
        "N"
      ],
      [
        "t",
        "时间",
        "s"
      ]
    ],
    "type": "矢量",
    "condition": "惯性系内对同一质点应用。",
    "misuse": "用力的峰值代替平均力计算冲量。",
    "tags": [
      "冲量与动量定理",
      "\\int_{t_1}^{t_2}\\vec F\\,dt=\\Delta\\vec p",
      "动量",
      "合外力",
      "时间"
    ]
  },
  {
    "id": "f-ch03-008",
    "chapter": "ch03",
    "section": "ch03-s02",
    "title": "动量守恒",
    "tex": "\\vec P=\\sum_i m_i\\vec v_i=\\mathrm{const}",
    "meaning": "系统总动量保持不变。",
    "symbols": [
      [
        "\\vec P",
        "总动量",
        "kg·m/s"
      ],
      [
        "m_i",
        "质量",
        "kg"
      ],
      [
        "\\vec v_i",
        "速度",
        "m/s"
      ]
    ],
    "type": "矢量",
    "condition": "合外力为零；短时碰撞可在外力冲量可忽略时近似使用。",
    "misuse": "只因碰撞就宣称所有方向动量守恒。",
    "tags": [
      "动量守恒",
      "\\vec P=\\sum_i m_i\\vec v_i=\\mathrm{const}",
      "总动量",
      "质量",
      "速度"
    ]
  },
  {
    "id": "f-ch03-009",
    "chapter": "ch03",
    "section": "ch03-s03",
    "title": "质心位置与运动",
    "tex": "\\vec r_C=\\frac{\\sum_i m_i\\vec r_i}{M},\\quad M\\vec a_C=\\vec F_{\\mathrm{ext}}",
    "meaning": "外力决定质心的加速度。",
    "symbols": [
      [
        "M",
        "总质量",
        "kg"
      ],
      [
        "\\vec r_C",
        "质心位置",
        "m"
      ],
      [
        "\\vec a_C",
        "质心加速度",
        "m/s²"
      ]
    ],
    "type": "矢量",
    "condition": "惯性系、各质点质量恒定。",
    "misuse": "认为内力能直接改变系统质心运动。",
    "tags": [
      "质心位置与运动",
      "\\vec r_C=\\frac{\\sum_i m_i\\vec r_i}{M},\\quad M\\vec a_C=\\vec F_{\\mathrm{ext}}",
      "总质量",
      "质心位置",
      "质心加速度"
    ]
  },
  {
    "id": "f-ch03-010",
    "chapter": "ch03",
    "section": "ch03-s04",
    "title": "动能定理",
    "tex": "W_{\\mathrm{net}}=\\int\\vec F\\cdot d\\vec r=\\Delta(\\tfrac12mv^2)",
    "meaning": "合力的功转化为质点动能变化。",
    "symbols": [
      [
        "W_{\\mathrm{net}}",
        "合力功",
        "J"
      ],
      [
        "m",
        "质量",
        "kg"
      ],
      [
        "v",
        "速率",
        "m/s"
      ]
    ],
    "type": "标量",
    "condition": "经典质点、质量恒定、惯性系。",
    "misuse": "只算拉力的功而遗漏摩擦力的功。",
    "tags": [
      "动能定理",
      "W_{\\mathrm{net}}=\\int\\vec F\\cdot d\\vec r=\\Delta(\\tfrac12mv^2)",
      "合力功",
      "质量",
      "速率"
    ]
  },
  {
    "id": "f-ch03-011",
    "chapter": "ch03",
    "section": "ch03-s05",
    "title": "机械能守恒",
    "tex": "K+U=\\mathrm{const}",
    "meaning": "动能与势能相互转化。",
    "symbols": [
      [
        "K",
        "动能",
        "J"
      ],
      [
        "U",
        "势能",
        "J"
      ]
    ],
    "type": "标量",
    "condition": "系统内非保守力及外界传能的净功为零；势能零点预先约定。",
    "misuse": "在有耗散的粘连碰撞中使用机械能守恒。",
    "tags": [
      "机械能守恒",
      "K+U=\\mathrm{const}",
      "动能",
      "势能"
    ]
  },
  {
    "id": "f-ch03-012",
    "chapter": "ch03",
    "section": "ch03-s06",
    "title": "一维碰撞恢复系数",
    "tex": "v_2-v_1=e(u_1-u_2)",
    "meaning": "恢复系数比较分离速度与接近速度。",
    "symbols": [
      [
        "u_1",
        "碰前车1速度",
        "m/s"
      ],
      [
        "u_2",
        "碰前车2速度",
        "m/s"
      ],
      [
        "v_1",
        "碰后车1速度",
        "m/s"
      ],
      [
        "v_2",
        "碰后车2速度",
        "m/s"
      ],
      [
        "e",
        "恢复系数",
        "1"
      ]
    ],
    "type": "一维分量",
    "condition": "同轴碰撞、两车碰前正在接近；普通耗散碰撞满足0≤e≤1。",
    "misuse": "把e=0理解为两车碰后都静止。",
    "tags": [
      "一维碰撞恢复系数",
      "v_2-v_1=e(u_1-u_2)",
      "碰前车1速度",
      "碰前车2速度",
      "碰后车1速度",
      "碰后车2速度",
      "恢复系数"
    ]
  },
  {
    "id": "f-ch04-013",
    "chapter": "ch04",
    "section": "ch04-s01",
    "title": "角运动与线运动",
    "tex": "v=\\omega r,\\quad a_\\tau=\\alpha r,\\quad a_n=\\omega^2r",
    "meaning": "同一刚体各点有相同角量，线量随轴距变化。",
    "symbols": [
      [
        "r",
        "到轴的距离",
        "m"
      ],
      [
        "\\omega",
        "角速度",
        "rad/s"
      ],
      [
        "\\alpha",
        "角加速度",
        "rad/s²"
      ]
    ],
    "type": "大小与切向分量",
    "condition": "定轴转动，角量按统一正方向计。",
    "misuse": "把轴距r与物体外半径混用。",
    "tags": [
      "角运动与线运动",
      "v=\\omega r,\\quad a_\\tau=\\alpha r,\\quad a_n=\\omega^2r",
      "到轴的距离",
      "角速度",
      "角加速度"
    ]
  },
  {
    "id": "f-ch04-014",
    "chapter": "ch04",
    "section": "ch04-s02",
    "title": "转动惯量和平行轴定理",
    "tex": "I=\\int r_\\perp^2dm,\\quad I=I_C+Md^2",
    "meaning": "转动惯量取决于质量相对指定轴的分布。",
    "symbols": [
      [
        "I",
        "转动惯量",
        "kg·m²"
      ],
      [
        "M",
        "总质量",
        "kg"
      ],
      [
        "d",
        "两平行轴距离",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "第二式要求其中一轴通过质心，且两轴平行。",
    "misuse": "在两条任意平行轴间直接加Md²。",
    "tags": [
      "转动惯量和平行轴定理",
      "I=\\int r_\\perp^2dm,\\quad I=I_C+Md^2",
      "转动惯量",
      "总质量",
      "两平行轴距离"
    ]
  },
  {
    "id": "f-ch04-015",
    "chapter": "ch04",
    "section": "ch04-s03",
    "title": "定轴转动定律",
    "tex": "\\sum M_z=I_z\\alpha",
    "meaning": "关于固定轴的合外力矩决定角加速度。",
    "symbols": [
      [
        "M_z",
        "轴向力矩",
        "N·m"
      ],
      [
        "I_z",
        "轴转动惯量",
        "kg·m²"
      ],
      [
        "\\alpha",
        "角加速度",
        "rad/s²"
      ]
    ],
    "type": "轴向分量",
    "condition": "惯性系中的固定轴、刚体质量分布不变。",
    "misuse": "把所有力的大小乘半径当力矩。",
    "tags": [
      "定轴转动定律",
      "\\sum M_z=I_z\\alpha",
      "轴向力矩",
      "轴转动惯量",
      "角加速度"
    ]
  },
  {
    "id": "f-ch04-016",
    "chapter": "ch04",
    "section": "ch04-s04",
    "title": "转动功与动能",
    "tex": "W=\\int M_zd\\theta=\\Delta(\\tfrac12I_z\\omega^2)",
    "meaning": "力矩沿角位移积累的功改变定轴转动动能。",
    "symbols": [
      [
        "W",
        "功",
        "J"
      ],
      [
        "M_z",
        "合外力矩",
        "N·m"
      ],
      [
        "I_z",
        "转动惯量",
        "kg·m²"
      ],
      [
        "\\omega",
        "角速度",
        "rad/s"
      ]
    ],
    "type": "标量",
    "condition": "固定轴且转动惯量恒定。",
    "misuse": "把角位移的度数直接代入积分。",
    "tags": [
      "转动功与动能",
      "W=\\int M_zd\\theta=\\Delta(\\tfrac12I_z\\omega^2)",
      "功",
      "合外力矩",
      "转动惯量",
      "角速度"
    ]
  },
  {
    "id": "f-ch04-017",
    "chapter": "ch04",
    "section": "ch04-s05",
    "title": "角动量定理",
    "tex": "\\frac{d\\vec L_O}{dt}=\\vec M_{O,\\mathrm{ext}}",
    "meaning": "合外力矩改变系统关于同一参考点的角动量。",
    "symbols": [
      [
        "\\vec L_O",
        "角动量",
        "kg·m²/s"
      ],
      [
        "\\vec M_O",
        "力矩",
        "N·m"
      ]
    ],
    "type": "矢量",
    "condition": "O为惯性系内固定点；力矩和角动量均取同一参考点。",
    "misuse": "外力矩为零时误认为角速度必恒定。",
    "tags": [
      "角动量定理",
      "\\frac{d\\vec L_O}{dt}=\\vec M_{O,\\mathrm{ext}}",
      "角动量",
      "力矩"
    ]
  },
  {
    "id": "f-ch04-018",
    "chapter": "ch04",
    "section": "ch04-s06",
    "title": "纯滚动与斜面加速度",
    "tex": "v_C=\\omega R,\\quad a_C=\\frac{g\\sin\\theta}{1+I_C/(mR^2)}",
    "meaning": "无滑动约束把质心平动与绕质心转动联系起来。",
    "symbols": [
      [
        "v_C",
        "质心速率",
        "m/s"
      ],
      [
        "I_C",
        "绕质心轴转动惯量",
        "kg·m²"
      ],
      [
        "R",
        "滚动半径",
        "m"
      ]
    ],
    "type": "沿斜面分量",
    "condition": "刚体在固定斜面由重力驱动纯滚动，无滚动阻力，静摩擦足够。",
    "misuse": "把圆环和实心球的转动惯量系数互换。",
    "tags": [
      "纯滚动与斜面加速度",
      "v_C=\\omega R,\\quad a_C=\\frac{g\\sin\\theta}{1+I_C/(mR^2)}",
      "质心速率",
      "绕质心轴转动惯量",
      "滚动半径"
    ]
  },
  {
    "id": "f-ch05-019",
    "chapter": "ch05",
    "section": "ch05-s01",
    "title": "库仑定律",
    "tex": "\\vec F_{12}=\\frac{q_1q_2}{4\\pi\\varepsilon_0r^2}\\hat r_{12}",
    "meaning": "静止点电荷的相互作用沿连线。",
    "symbols": [
      [
        "q_1",
        "源电荷",
        "C"
      ],
      [
        "q_2",
        "受力电荷",
        "C"
      ],
      [
        "r",
        "间距",
        "m"
      ],
      [
        "\\hat r_{12}",
        "从1指向2的单位矢量",
        "1"
      ]
    ],
    "type": "矢量",
    "condition": "真空中静止点电荷，或可等效为点电荷的球对称分布外部。",
    "misuse": "忽略电荷符号而判错方向。",
    "tags": [
      "库仑定律",
      "\\vec F_{12}=\\frac{q_1q_2}{4\\pi\\varepsilon_0r^2}\\hat r_{12}",
      "源电荷",
      "受力电荷",
      "间距",
      "从1指向2的单位矢量"
    ]
  },
  {
    "id": "f-ch05-020",
    "chapter": "ch05",
    "section": "ch05-s02",
    "title": "电场叠加",
    "tex": "\\vec E=\\frac{1}{4\\pi\\varepsilon_0}\\int\\frac{\\hat r}{r^2}dq",
    "meaning": "连续电荷分布的电场按矢量积分。",
    "symbols": [
      [
        "\\vec E",
        "电场强度",
        "N/C"
      ],
      [
        "dq",
        "电荷元",
        "C"
      ],
      [
        "r",
        "源点到场点距离",
        "m"
      ]
    ],
    "type": "矢量",
    "condition": "真空静电场，积分方向从电荷元指向场点。",
    "misuse": "先把各电场大小相加再找方向。",
    "tags": [
      "电场叠加",
      "\\vec E=\\frac{1}{4\\pi\\varepsilon_0}\\int\\frac{\\hat r}{r^2}dq",
      "电场强度",
      "电荷元",
      "源点到场点距离"
    ]
  },
  {
    "id": "f-ch05-021",
    "chapter": "ch05",
    "section": "ch05-s03",
    "title": "静电场高斯定理",
    "tex": "\\oint_S\\vec E\\cdot d\\vec S=Q_{\\mathrm{in}}/\\varepsilon_0",
    "meaning": "闭合面的电通量由内部总电荷决定。",
    "symbols": [
      [
        "Q_{\\mathrm{in}}",
        "面内总电荷",
        "C"
      ],
      [
        "\\vec E",
        "总电场",
        "N/C"
      ],
      [
        "S",
        "面积",
        "m²"
      ]
    ],
    "type": "通量标量",
    "condition": "真空静电场，面积矢量向外；直接求场另需对称性。",
    "misuse": "面外电荷不贡献净通量就认为不贡献场强。",
    "tags": [
      "静电场高斯定理",
      "\\oint_S\\vec E\\cdot d\\vec S=Q_{\\mathrm{in}}/\\varepsilon_0",
      "面内总电荷",
      "总电场",
      "面积"
    ]
  },
  {
    "id": "f-ch05-022",
    "chapter": "ch05",
    "section": "ch05-s05",
    "title": "电势差与功",
    "tex": "V_B-V_A=-\\int_A^B\\vec E\\cdot d\\vec l,\\quad W_{AB}=q(V_A-V_B)",
    "meaning": "电场力作功使电势能降低。",
    "symbols": [
      [
        "V",
        "电势",
        "V"
      ],
      [
        "W_{AB}",
        "电场力功",
        "J"
      ],
      [
        "q",
        "电荷",
        "C"
      ]
    ],
    "type": "标量",
    "condition": "静电场；先指定电势零点，差值不依赖零点。",
    "misuse": "把电势差的积分负号漏掉。",
    "tags": [
      "电势差与功",
      "V_B-V_A=-\\int_A^B\\vec E\\cdot d\\vec l,\\quad W_{AB}=q(V_A-V_B)",
      "电势",
      "电场力功",
      "电荷"
    ]
  },
  {
    "id": "f-ch05-023",
    "chapter": "ch05",
    "section": "ch05-s06",
    "title": "电场与电势梯度",
    "tex": "\\vec E=-\\nabla V",
    "meaning": "电场指向电势下降最快的方向。",
    "symbols": [
      [
        "\\vec E",
        "电场强度",
        "V/m"
      ],
      [
        "V",
        "电势",
        "V"
      ]
    ],
    "type": "矢量",
    "condition": "静电场，电势在所求点可微。",
    "misuse": "认为电势为零的地方电场也为零。",
    "tags": [
      "电场与电势梯度",
      "\\vec E=-\\nabla V",
      "电场强度",
      "电势"
    ]
  },
  {
    "id": "f-ch05-024",
    "chapter": "ch05",
    "section": "ch05-s07",
    "title": "静电场中的动能变化",
    "tex": "\\Delta K=q(V_A-V_B)",
    "meaning": "电势能下降转化为动能。",
    "symbols": [
      [
        "K",
        "动能",
        "J"
      ],
      [
        "q",
        "粒子电荷",
        "C"
      ],
      [
        "V",
        "电势",
        "V"
      ]
    ],
    "type": "标量",
    "condition": "只有静电力作功；经典动能公式另要求低速。",
    "misuse": "负电荷沿电场运动时仍判断其动能增加。",
    "tags": [
      "静电场中的动能变化",
      "\\Delta K=q(V_A-V_B)",
      "动能",
      "粒子电荷",
      "电势"
    ]
  },
  {
    "id": "f-ch06-025",
    "chapter": "ch06",
    "section": "ch06-s01",
    "title": "静电平衡导体表面",
    "tex": "E_{\\mathrm{in}}=0,\\quad E_{\\mathrm{out},n}=\\sigma/\\varepsilon_0",
    "meaning": "平衡导体内部无静电场，表面外场沿法向。",
    "symbols": [
      [
        "\\sigma",
        "表面电荷密度",
        "C/m²"
      ],
      [
        "E",
        "场强",
        "V/m"
      ]
    ],
    "type": "法向分量",
    "condition": "真空中静电平衡导体，外场取紧靠表面处。",
    "misuse": "把表面公式用到导体外任意远处。",
    "tags": [
      "静电平衡导体表面",
      "E_{\\mathrm{in}}=0,\\quad E_{\\mathrm{out},n}=\\sigma/\\varepsilon_0",
      "表面电荷密度",
      "场强"
    ]
  },
  {
    "id": "f-ch06-026",
    "chapter": "ch06",
    "section": "ch06-s03",
    "title": "平行板电容",
    "tex": "C=Q/U=\\varepsilon S/d",
    "meaning": "几何和介质决定电容，Q取单板电荷量的大小。",
    "symbols": [
      [
        "C",
        "电容",
        "F"
      ],
      [
        "U",
        "板间电压",
        "V"
      ],
      [
        "S",
        "极板面积",
        "m²"
      ],
      [
        "d",
        "间距",
        "m"
      ],
      [
        "\\varepsilon",
        "介电常数",
        "F/m"
      ]
    ],
    "type": "标量",
    "condition": "均匀线性介质充满板间，板间距远小于尺寸，忽略边缘效应。",
    "misuse": "认为电容随充入电荷增加而增加。",
    "tags": [
      "平行板电容",
      "C=Q/U=\\varepsilon S/d",
      "电容",
      "板间电压",
      "极板面积",
      "间距",
      "介电常数"
    ]
  },
  {
    "id": "f-ch06-027",
    "chapter": "ch06",
    "section": "ch06-s04",
    "title": "电容串并联",
    "tex": "C_{\\parallel}=\\sum_i C_i,\\quad C_{\\mathrm{series}}^{-1}=\\sum_i C_i^{-1}",
    "meaning": "并联同电压，串联的浮置中间节点电荷守恒。",
    "symbols": [
      [
        "C_i",
        "各电容",
        "F"
      ]
    ],
    "type": "标量",
    "condition": "理想电容；串联公式假定中间节点净电荷为零。",
    "misuse": "把串联与并联公式对调。",
    "tags": [
      "电容串并联",
      "C_{\\parallel}=\\sum_i C_i,\\quad C_{\\mathrm{series}}^{-1}=\\sum_i C_i^{-1}",
      "各电容"
    ]
  },
  {
    "id": "f-ch06-028",
    "chapter": "ch06",
    "section": "ch06-s05",
    "title": "线性电介质本构关系",
    "tex": "\\vec D=\\varepsilon_0\\vec E+\\vec P=\\varepsilon\\vec E",
    "meaning": "极化矢量描述单位体积的电偶极矩。",
    "symbols": [
      [
        "\\vec D",
        "电位移",
        "C/m²"
      ],
      [
        "\\vec P",
        "极化强度",
        "C/m²"
      ],
      [
        "\\vec E",
        "场强",
        "V/m"
      ]
    ],
    "type": "矢量",
    "condition": "第二等号限均匀各向同性线性电介质。",
    "misuse": "把D的单位写成与E相同。",
    "tags": [
      "线性电介质本构关系",
      "\\vec D=\\varepsilon_0\\vec E+\\vec P=\\varepsilon\\vec E",
      "电位移",
      "极化强度",
      "场强"
    ]
  },
  {
    "id": "f-ch06-029",
    "chapter": "ch06",
    "section": "ch06-s06",
    "title": "电位移高斯定理",
    "tex": "\\oint\\vec D\\cdot d\\vec S=Q_{\\mathrm{free,in}}",
    "meaning": "D的闭合面通量只计自由电荷。",
    "symbols": [
      [
        "\\vec D",
        "电位移",
        "C/m²"
      ],
      [
        "Q_{\\mathrm{free,in}}",
        "内包自由电荷",
        "C"
      ]
    ],
    "type": "通量标量",
    "condition": "宏观静电场，闭合面外法向为正。",
    "misuse": "把束缚电荷也加入右侧。",
    "tags": [
      "电位移高斯定理",
      "\\oint\\vec D\\cdot d\\vec S=Q_{\\mathrm{free,in}}",
      "电位移",
      "内包自由电荷"
    ]
  },
  {
    "id": "f-ch06-030",
    "chapter": "ch06",
    "section": "ch06-s07",
    "title": "电容器与电场储能",
    "tex": "W=\\tfrac12CU^2=Q^2/(2C),\\quad w=\\tfrac12\\varepsilon E^2",
    "meaning": "W是储存的电场能量，w是单位体积能量。",
    "symbols": [
      [
        "W",
        "电场能",
        "J"
      ],
      [
        "w",
        "能量密度",
        "J/m³"
      ],
      [
        "C",
        "电容",
        "F"
      ],
      [
        "U",
        "电压",
        "V"
      ]
    ],
    "type": "标量",
    "condition": "理想线性电容器及线性无损介质；局部能量密度用局部E。",
    "misuse": "接电源插入介质时忽略电源能量交换。",
    "tags": [
      "电容器与电场储能",
      "W=\\tfrac12CU^2=Q^2/(2C),\\quad w=\\tfrac12\\varepsilon E^2",
      "电场能",
      "能量密度",
      "电容",
      "电压"
    ]
  },
  {
    "id": "f-ch07-031",
    "chapter": "ch07",
    "section": "ch07-s01",
    "title": "电流密度与欧姆定律",
    "tex": "I=\\int\\vec j\\cdot d\\vec S,\\quad\\vec j=\\sigma\\vec E",
    "meaning": "电流是电流密度的截面通量。",
    "symbols": [
      [
        "I",
        "电流",
        "A"
      ],
      [
        "\\vec j",
        "电流密度",
        "A/m²"
      ],
      [
        "\\sigma",
        "电导率",
        "S/m"
      ]
    ],
    "type": "通量及矢量",
    "condition": "本构式适用于线性各向同性欧姆导体。",
    "misuse": "把电导率与电阻率当同一量。",
    "tags": [
      "电流密度与欧姆定律",
      "I=\\int\\vec j\\cdot d\\vec S,\\quad\\vec j=\\sigma\\vec E",
      "电流",
      "电流密度",
      "电导率"
    ]
  },
  {
    "id": "f-ch07-032",
    "chapter": "ch07",
    "section": "ch07-s03",
    "title": "毕奥—萨伐尔定律",
    "tex": "d\\vec B=\\frac{\\mu_0}{4\\pi}\\frac{I\\,d\\vec l\\times\\hat r}{r^2}",
    "meaning": "电流元对磁场的贡献按矢量叠加。",
    "symbols": [
      [
        "B",
        "磁感应强度",
        "T"
      ],
      [
        "I",
        "电流",
        "A"
      ],
      [
        "r",
        "源到场点距离",
        "m"
      ]
    ],
    "type": "矢量",
    "condition": "真空稳恒电流，电流元方向沿电流。",
    "misuse": "把叉积改成点积或遗漏方向。",
    "tags": [
      "毕奥—萨伐尔定律",
      "d\\vec B=\\frac{\\mu_0}{4\\pi}\\frac{I\\,d\\vec l\\times\\hat r}{r^2}",
      "磁感应强度",
      "电流",
      "源到场点距离"
    ]
  },
  {
    "id": "f-ch07-033",
    "chapter": "ch07",
    "section": "ch07-s04",
    "title": "安培环路定理",
    "tex": "\\oint\\vec B\\cdot d\\vec l=\\mu_0I_{\\mathrm{in}}",
    "meaning": "稳恒场环量由穿过回路曲面的净电流决定。",
    "symbols": [
      [
        "B",
        "磁感应强度",
        "T"
      ],
      [
        "I_{\\mathrm{in}}",
        "穿面电流代数和",
        "A"
      ]
    ],
    "type": "环量标量",
    "condition": "真空稳恒电流；正方向服从右手定则，求B另需对称性。",
    "misuse": "在时变电场中漏掉位移电流。",
    "tags": [
      "安培环路定理",
      "\\oint\\vec B\\cdot d\\vec l=\\mu_0I_{\\mathrm{in}}",
      "磁感应强度",
      "穿面电流代数和"
    ]
  },
  {
    "id": "f-ch07-034",
    "chapter": "ch07",
    "section": "ch07-s05",
    "title": "洛伦兹力",
    "tex": "\\vec F=q(\\vec E+\\vec v\\times\\vec B)",
    "meaning": "电场和磁场共同决定运动电荷的受力。",
    "symbols": [
      [
        "F",
        "力",
        "N"
      ],
      [
        "q",
        "电荷",
        "C"
      ],
      [
        "v",
        "速度",
        "m/s"
      ],
      [
        "B",
        "磁感应强度",
        "T"
      ],
      [
        "E",
        "电场强度",
        "N/C"
      ]
    ],
    "type": "矢量",
    "condition": "经典带电质点；忽略自场及辐射反作用。",
    "misuse": "负电荷仍沿右手叉积方向取磁力。",
    "tags": [
      "洛伦兹力",
      "\\vec F=q(\\vec E+\\vec v\\times\\vec B)",
      "力",
      "电荷",
      "速度",
      "磁感应强度",
      "电场强度"
    ]
  },
  {
    "id": "f-ch07-035",
    "chapter": "ch07",
    "section": "ch07-s05",
    "title": "均匀磁场回旋半径",
    "tex": "r=\\frac{mv_\\perp}{\\lvert q\\rvert B},\\quad T=\\frac{2\\pi m}{\\lvert q\\rvert B}",
    "meaning": "垂直速度分量产生回旋，平行分量产生轴向平移。",
    "symbols": [
      [
        "m",
        "质量",
        "kg"
      ],
      [
        "v_\\perp",
        "垂直磁场的速率",
        "m/s"
      ],
      [
        "r",
        "半径",
        "m"
      ],
      [
        "T",
        "周期",
        "s"
      ]
    ],
    "type": "标量",
    "condition": "均匀静磁场、无电场、非相对论带电粒子。",
    "misuse": "把总速率代替垂直分量算螺旋半径。",
    "tags": [
      "均匀磁场回旋半径",
      "r=\\frac{mv_\\perp}{\\lvert q\\rvert B},\\quad T=\\frac{2\\pi m}{\\lvert q\\rvert B}",
      "质量",
      "垂直磁场的速率",
      "半径",
      "周期"
    ]
  },
  {
    "id": "f-ch07-036",
    "chapter": "ch07",
    "section": "ch07-s06",
    "title": "磁矩与磁力矩",
    "tex": "\\vec m=NI S\\hat n,\\quad\\vec M=\\vec m\\times\\vec B",
    "meaning": "线圈磁矩决定其在外磁场中的转动趋势。",
    "symbols": [
      [
        "m",
        "磁矩",
        "A·m²"
      ],
      [
        "M",
        "力矩",
        "N·m"
      ],
      [
        "S",
        "线圈面积",
        "m²"
      ],
      [
        "N",
        "匝数",
        "1"
      ]
    ],
    "type": "矢量",
    "condition": "平面线圈处于均匀外磁场，法向由电流右手定则确定。",
    "misuse": "磁矩与B平行时误认为力矩最大。",
    "tags": [
      "磁矩与磁力矩",
      "\\vec m=NI S\\hat n,\\quad\\vec M=\\vec m\\times\\vec B",
      "磁矩",
      "力矩",
      "线圈面积",
      "匝数"
    ]
  },
  {
    "id": "f-ch08-037",
    "chapter": "ch08",
    "section": "ch08-s02",
    "title": "法拉第电磁感应定律",
    "tex": "\\mathcal E=-N\\frac{d\\Phi_B}{dt}",
    "meaning": "感应电动势反抗磁通量变化的趋势。",
    "symbols": [
      [
        "\\mathcal E",
        "电动势",
        "V"
      ],
      [
        "\\Phi_B",
        "单匝磁通",
        "Wb"
      ],
      [
        "N",
        "匝数",
        "1"
      ]
    ],
    "type": "有向标量",
    "condition": "每匝磁通相同；绕向与法向遵循右手定则。",
    "misuse": "把阻碍磁通变化理解为总是阻碍原磁场。",
    "tags": [
      "法拉第电磁感应定律",
      "\\mathcal E=-N\\frac{d\\Phi_B}{dt}",
      "电动势",
      "单匝磁通",
      "匝数"
    ]
  },
  {
    "id": "f-ch08-038",
    "chapter": "ch08",
    "section": "ch08-s03",
    "title": "动生电动势",
    "tex": "\\mathcal E=\\int(\\vec v\\times\\vec B)\\cdot d\\vec l",
    "meaning": "运动导体中的磁力推动电荷分离。",
    "symbols": [
      [
        "v",
        "导体元速度",
        "m/s"
      ],
      [
        "B",
        "磁感应强度",
        "T"
      ],
      [
        "\\mathcal E",
        "电动势",
        "V"
      ]
    ],
    "type": "有向标量",
    "condition": "积分沿指定导体方向，v是该导体元速度。",
    "misuse": "任意方向运动都套用BLv。",
    "tags": [
      "动生电动势",
      "\\mathcal E=\\int(\\vec v\\times\\vec B)\\cdot d\\vec l",
      "导体元速度",
      "磁感应强度",
      "电动势"
    ]
  },
  {
    "id": "f-ch08-039",
    "chapter": "ch08",
    "section": "ch08-s04",
    "title": "自感与磁场储能",
    "tex": "\\mathcal E_L=-L\\frac{dI}{dt},\\quad W_B=\\tfrac12LI^2",
    "meaning": "线性电感反抗电流变化并储存磁场能。",
    "symbols": [
      [
        "L",
        "自感系数",
        "H"
      ],
      [
        "I",
        "电流",
        "A"
      ],
      [
        "W_B",
        "磁场能",
        "J"
      ]
    ],
    "type": "标量",
    "condition": "几何和介质不变、L恒定，无磁滞。",
    "misuse": "电流大就认为自感电动势一定大。",
    "tags": [
      "自感与磁场储能",
      "\\mathcal E_L=-L\\frac{dI}{dt},\\quad W_B=\\tfrac12LI^2",
      "自感系数",
      "电流",
      "磁场能"
    ]
  },
  {
    "id": "f-ch08-040",
    "chapter": "ch08",
    "section": "ch08-s06",
    "title": "位移电流与全电流定律",
    "tex": "I_d=\\varepsilon_0\\frac{d\\Phi_E}{dt},\\quad\\oint\\vec B\\cdot d\\vec l=\\mu_0(I+I_d)",
    "meaning": "时变电场与传导电流共同产生磁场环量。",
    "symbols": [
      [
        "I_d",
        "位移电流",
        "A"
      ],
      [
        "\\Phi_E",
        "电通量",
        "V·m"
      ],
      [
        "I",
        "传导电流",
        "A"
      ]
    ],
    "type": "环量标量",
    "condition": "真空，固定回路与固定曲面；符号按右手定则。",
    "misuse": "把位移电流解释成板间有自由电荷穿越。",
    "tags": [
      "位移电流与全电流定律",
      "I_d=\\varepsilon_0\\frac{d\\Phi_E}{dt},\\quad\\oint\\vec B\\cdot d\\vec l=\\mu_0(I+I_d)",
      "位移电流",
      "电通量",
      "传导电流"
    ]
  },
  {
    "id": "f-ch08-041",
    "chapter": "ch08",
    "section": "ch08-s07",
    "title": "真空平面电磁波",
    "tex": "c=\\frac1{\\sqrt{\\varepsilon_0\\mu_0}},\\quad E=cB",
    "meaning": "E与B同相，彼此垂直且都垂直传播方向。",
    "symbols": [
      [
        "E",
        "电场大小",
        "V/m"
      ],
      [
        "B",
        "磁场大小",
        "T"
      ],
      [
        "c",
        "真空光速",
        "m/s"
      ]
    ],
    "type": "大小关系",
    "condition": "真空平面行波。",
    "misuse": "把空间垂直误认为时间相位差90度。",
    "tags": [
      "真空平面电磁波",
      "c=\\frac1{\\sqrt{\\varepsilon_0\\mu_0}},\\quad E=cB",
      "电场大小",
      "磁场大小",
      "真空光速"
    ]
  },
  {
    "id": "f-ch08-042",
    "chapter": "ch08",
    "section": "ch08-s08",
    "title": "坡印廷矢量与平均强度",
    "tex": "\\vec S=\\frac{\\vec E\\times\\vec B}{\\mu_0},\\quad I=\\tfrac12\\varepsilon_0cE_0^2",
    "meaning": "S是瞬时能流密度，I是周期平均值。",
    "symbols": [
      [
        "S",
        "能流密度",
        "W/m²"
      ],
      [
        "I",
        "平均强度",
        "W/m²"
      ],
      [
        "E_0",
        "电场峰值",
        "V/m"
      ]
    ],
    "type": "矢量及标量",
    "condition": "真空；第二式限正弦平面行波。",
    "misuse": "把电场有效值代入峰值公式再乘1/2。",
    "tags": [
      "坡印廷矢量与平均强度",
      "\\vec S=\\frac{\\vec E\\times\\vec B}{\\mu_0},\\quad I=\\tfrac12\\varepsilon_0cE_0^2",
      "能流密度",
      "平均强度",
      "电场峰值"
    ]
  },
  {
    "id": "f-ch09-043",
    "chapter": "ch09",
    "section": "ch09-s01",
    "title": "理想气体状态方程",
    "tex": "pV=nRT=Nk_BT",
    "meaning": "宏观状态量与粒子数相联系。",
    "symbols": [
      [
        "p",
        "压强",
        "Pa"
      ],
      [
        "V",
        "体积",
        "m³"
      ],
      [
        "n",
        "物质的量",
        "mol"
      ],
      [
        "N",
        "分子数",
        "1"
      ],
      [
        "T",
        "绝对温度",
        "K"
      ]
    ],
    "type": "标量",
    "condition": "稀薄、近热平衡的理想气体；n表示物质的量。",
    "misuse": "把摄氏温度代入状态方程。",
    "tags": [
      "理想气体状态方程",
      "pV=nRT=Nk_BT",
      "压强",
      "体积",
      "物质的量",
      "分子数",
      "绝对温度"
    ]
  },
  {
    "id": "f-ch09-044",
    "chapter": "ch09",
    "section": "ch09-s02",
    "title": "压强微观公式",
    "tex": "p=\\tfrac13 n_N m\\overline{v^2}",
    "meaning": "分子碰壁动量通量形成压强。",
    "symbols": [
      [
        "n_N",
        "分子数密度",
        "m⁻³"
      ],
      [
        "m",
        "单分子质量",
        "kg"
      ],
      [
        "\\overline{v^2}",
        "速率平方平均",
        "m²/s²"
      ]
    ],
    "type": "标量",
    "condition": "各向同性平衡理想气体。",
    "misuse": "把平均速率的平方当平均平方速率。",
    "tags": [
      "压强微观公式",
      "p=\\tfrac13 n_N m\\overline{v^2}",
      "分子数密度",
      "单分子质量",
      "速率平方平均"
    ]
  },
  {
    "id": "f-ch09-045",
    "chapter": "ch09",
    "section": "ch09-s03",
    "title": "平均平动动能",
    "tex": "\\overline{\\epsilon_{\\mathrm{tr}}}=\\tfrac32k_BT",
    "meaning": "温度衡量单分子平均平动动能。",
    "symbols": [
      [
        "\\epsilon_{\\mathrm{tr}}",
        "平动动能",
        "J"
      ],
      [
        "T",
        "绝对温度",
        "K"
      ],
      [
        "k_B",
        "玻尔兹曼常数",
        "J/K"
      ]
    ],
    "type": "标量",
    "condition": "三维经典平衡气体，不计整体漂移运动。",
    "misuse": "给双原子分子平动动能写成5kT/2。",
    "tags": [
      "平均平动动能",
      "\\overline{\\epsilon_{\\mathrm{tr}}}=\\tfrac32k_BT",
      "平动动能",
      "绝对温度",
      "玻尔兹曼常数"
    ]
  },
  {
    "id": "f-ch09-046",
    "chapter": "ch09",
    "section": "ch09-s04",
    "title": "能量均分与理想气体内能",
    "tex": "U=\\tfrac f2nRT",
    "meaning": "每个可激发的二次自由度平均分得kT/2。",
    "symbols": [
      [
        "U",
        "内能",
        "J"
      ],
      [
        "f",
        "有效二次自由度数",
        "1"
      ],
      [
        "n",
        "物质的量",
        "mol"
      ],
      [
        "T",
        "温度",
        "K"
      ]
    ],
    "type": "标量",
    "condition": "经典理想气体，f在所用温区恒定，内能零点按模型选定。",
    "misuse": "低温仍把所有转动振动自由度算成已激发。",
    "tags": [
      "能量均分与理想气体内能",
      "U=\\tfrac f2nRT",
      "内能",
      "有效二次自由度数",
      "物质的量",
      "温度"
    ]
  },
  {
    "id": "f-ch09-047",
    "chapter": "ch09",
    "section": "ch09-s05",
    "title": "三种特征速率",
    "tex": "v_p=\\sqrt{2RT/M},\\quad\\bar v=\\sqrt{8RT/(\\pi M)},\\quad v_{\\mathrm{rms}}=\\sqrt{3RT/M}",
    "meaning": "最概然、平均和方均根速率刻画不同统计量。",
    "symbols": [
      [
        "M",
        "摩尔质量",
        "kg/mol"
      ],
      [
        "T",
        "温度",
        "K"
      ],
      [
        "v_p",
        "最概然速率",
        "m/s"
      ]
    ],
    "type": "标量",
    "condition": "麦克斯韦分布、经典平衡理想气体。",
    "misuse": "把摩尔质量的g/mol数值直接代入SI公式。",
    "tags": [
      "三种特征速率",
      "v_p=\\sqrt{2RT/M},\\quad\\bar v=\\sqrt{8RT/(\\pi M)},\\quad v_{\\mathrm{rms}}=\\sqrt{3RT/M}",
      "摩尔质量",
      "温度",
      "最概然速率"
    ]
  },
  {
    "id": "f-ch09-048",
    "chapter": "ch09",
    "section": "ch09-s06",
    "title": "平均自由程",
    "tex": "\\ell=\\frac1{\\sqrt2\\pi d^2 n_N}",
    "meaning": "分子直径和数密度决定平均碰撞间距。",
    "symbols": [
      [
        "\\ell",
        "平均自由程",
        "m"
      ],
      [
        "d",
        "有效碰撞直径",
        "m"
      ],
      [
        "n_N",
        "数密度",
        "m⁻³"
      ]
    ],
    "type": "标量",
    "condition": "稀薄平衡气体的硬球模型。",
    "misuse": "把碰撞截面写成π(d/2)²。",
    "tags": [
      "平均自由程",
      "\\ell=\\frac1{\\sqrt2\\pi d^2 n_N}",
      "平均自由程",
      "有效碰撞直径",
      "数密度"
    ]
  },
  {
    "id": "f-ch10-049",
    "chapter": "ch10",
    "section": "ch10-s02",
    "title": "准静态体积功",
    "tex": "W=\\int_{V_1}^{V_2}p\\,dV",
    "meaning": "W为系统对外做功，膨胀为正。",
    "symbols": [
      [
        "W",
        "系统对外做功",
        "J"
      ],
      [
        "p",
        "边界压强",
        "Pa"
      ],
      [
        "V",
        "体积",
        "m³"
      ]
    ],
    "type": "标量",
    "condition": "准静态、边界力学平衡，仅计算体积功；不可逆过程应使用外压。",
    "misuse": "压强变化时仍用pΔV且不说明p取值。",
    "tags": [
      "准静态体积功",
      "W=\\int_{V_1}^{V_2}p\\,dV",
      "系统对外做功",
      "边界压强",
      "体积"
    ]
  },
  {
    "id": "f-ch10-050",
    "chapter": "ch10",
    "section": "ch10-s03",
    "title": "热力学第一定律",
    "tex": "\\Delta U=Q-W",
    "meaning": "吸热增加内能，对外做功减少内能。",
    "symbols": [
      [
        "U",
        "内能",
        "J"
      ],
      [
        "Q",
        "系统吸热",
        "J"
      ],
      [
        "W",
        "系统对外做功",
        "J"
      ]
    ],
    "type": "标量",
    "condition": "封闭系统，忽略整体动能和势能变化，W包含全部对外功。",
    "misuse": "把外界对系统做功作为正W代入。",
    "tags": [
      "热力学第一定律",
      "\\Delta U=Q-W",
      "内能",
      "系统吸热",
      "系统对外做功"
    ]
  },
  {
    "id": "f-ch10-051",
    "chapter": "ch10",
    "section": "ch10-s04",
    "title": "理想气体等温过程功",
    "tex": "W=nRT\\ln(V_2/V_1),\\quad\\Delta U=0,\\quad Q=W",
    "meaning": "等温膨胀吸热全部转为对外功。",
    "symbols": [
      [
        "n",
        "物质的量",
        "mol"
      ],
      [
        "T",
        "恒温温度",
        "K"
      ],
      [
        "V",
        "体积",
        "m³"
      ],
      [
        "W",
        "对外功",
        "J"
      ]
    ],
    "type": "标量",
    "condition": "理想气体、可逆准静态等温过程。",
    "misuse": "把自由膨胀当可逆过程用对数功公式。",
    "tags": [
      "理想气体等温过程功",
      "W=nRT\\ln(V_2/V_1),\\quad\\Delta U=0,\\quad Q=W",
      "物质的量",
      "恒温温度",
      "体积",
      "对外功"
    ]
  },
  {
    "id": "f-ch10-052",
    "chapter": "ch10",
    "section": "ch10-s04",
    "title": "可逆绝热过程",
    "tex": "pV^\\gamma=\\mathrm{const},\\quad TV^{\\gamma-1}=\\mathrm{const}",
    "meaning": "绝热膨胀以降低内能供给对外功。",
    "symbols": [
      [
        "\\gamma",
        "定压定容热容比",
        "1"
      ],
      [
        "T",
        "温度",
        "K"
      ],
      [
        "p",
        "压强",
        "Pa"
      ],
      [
        "V",
        "体积",
        "m³"
      ]
    ],
    "type": "标量",
    "condition": "理想气体可逆绝热，热容及γ在温区内恒定。",
    "misuse": "任何绝热过程都套pV^γ不变。",
    "tags": [
      "可逆绝热过程",
      "pV^\\gamma=\\mathrm{const},\\quad TV^{\\gamma-1}=\\mathrm{const}",
      "定压定容热容比",
      "温度",
      "压强",
      "体积"
    ]
  },
  {
    "id": "f-ch10-053",
    "chapter": "ch10",
    "section": "ch10-s05",
    "title": "热机效率与制冷系数",
    "tex": "\\eta=\\frac{W_{\\mathrm{net}}}{Q_H}=1-\\frac{Q_C}{Q_H},\\quad\\epsilon=\\frac{Q_C}{W_{\\mathrm{in}}}",
    "meaning": "热机比较净输出功与吸热，制冷机比较取冷量与输入功。",
    "symbols": [
      [
        "Q_H",
        "向高温源交换热量的大小",
        "J"
      ],
      [
        "Q_C",
        "向低温源交换热量的大小",
        "J"
      ],
      [
        "W_{\\mathrm{in}}",
        "输入功的大小",
        "J"
      ]
    ],
    "type": "标量",
    "condition": "完整循环，Q_H和Q_C取正的大小；热机和制冷机分别使用各自功的定义。",
    "misuse": "把制冷系数大于1误判为违反能量守恒。",
    "tags": [
      "热机效率与制冷系数",
      "\\eta=\\frac{W_{\\mathrm{net}}}{Q_H}=1-\\frac{Q_C}{Q_H},\\quad\\epsilon=\\frac{Q_C}{W_{\\mathrm{in}}}",
      "向高温源交换热量的大小",
      "向低温源交换热量的大小",
      "输入功的大小"
    ]
  },
  {
    "id": "f-ch10-054",
    "chapter": "ch10",
    "section": "ch10-s07",
    "title": "熵变与可逆热量",
    "tex": "\\Delta S=\\int_A^B\\frac{\\delta Q_{\\mathrm{rev}}}{T},\\quad\\Delta S_{\\mathrm{isolated}}\\ge0",
    "meaning": "熵变是状态量，可用连接两状态的可逆路径求取。",
    "symbols": [
      [
        "S",
        "熵",
        "J/K"
      ],
      [
        "Q_{\\mathrm{rev}}",
        "可逆路径吸热",
        "J"
      ],
      [
        "T",
        "绝对温度",
        "K"
      ]
    ],
    "type": "标量",
    "condition": "平衡端态间熵变；不等式用于孤立系统。",
    "misuse": "不可逆绝热过程Q=0就断言熵变为零。",
    "tags": [
      "熵变与可逆热量",
      "\\Delta S=\\int_A^B\\frac{\\delta Q_{\\mathrm{rev}}}{T},\\quad\\Delta S_{\\mathrm{isolated}}\\ge0",
      "熵",
      "可逆路径吸热",
      "绝对温度"
    ]
  },
  {
    "id": "f-ch11-055",
    "chapter": "ch11",
    "section": "ch11-s01",
    "title": "简谐运动状态",
    "tex": "x=A\\cos(\\omega t+\\varphi),\\quad v=-A\\omega\\sin(\\omega t+\\varphi),\\quad a=-\\omega^2x",
    "meaning": "位移、速度与加速度由同一相位确定。",
    "symbols": [
      [
        "x",
        "相对平衡点位移",
        "m"
      ],
      [
        "A",
        "振幅",
        "m"
      ],
      [
        "\\omega",
        "角频率",
        "rad/s"
      ],
      [
        "\\varphi",
        "初相",
        "rad"
      ]
    ],
    "type": "一维分量",
    "condition": "线性无阻尼无驱动振动，初始条件确定A和初相。",
    "misuse": "仅由位移符号判断速度方向。",
    "tags": [
      "简谐运动状态",
      "x=A\\cos(\\omega t+\\varphi),\\quad v=-A\\omega\\sin(\\omega t+\\varphi),\\quad a=-\\omega^2x",
      "相对平衡点位移",
      "振幅",
      "角频率",
      "初相"
    ]
  },
  {
    "id": "f-ch11-056",
    "chapter": "ch11",
    "section": "ch11-s02",
    "title": "周期频率与角频率",
    "tex": "\\omega=2\\pi f=2\\pi/T",
    "meaning": "三者描述同一周期运动的不同时间尺度。",
    "symbols": [
      [
        "\\omega",
        "角频率",
        "rad/s"
      ],
      [
        "f",
        "频率",
        "Hz"
      ],
      [
        "T",
        "周期",
        "s"
      ]
    ],
    "type": "标量",
    "condition": "周期运动，f表示每秒周期数。",
    "misuse": "把Hz与rad/s直接等同。",
    "tags": [
      "周期频率与角频率",
      "\\omega=2\\pi f=2\\pi/T",
      "角频率",
      "频率",
      "周期"
    ]
  },
  {
    "id": "f-ch11-057",
    "chapter": "ch11",
    "section": "ch11-s03",
    "title": "弹簧振子周期",
    "tex": "T=2\\pi\\sqrt{m/k}",
    "meaning": "惯性与弹性共同决定周期，与振幅无关。",
    "symbols": [
      [
        "m",
        "振子质量",
        "kg"
      ],
      [
        "k",
        "劲度系数",
        "N/m"
      ],
      [
        "T",
        "周期",
        "s"
      ]
    ],
    "type": "标量",
    "condition": "无质量线性弹簧、无阻尼，振幅不超弹性限度。",
    "misuse": "以为振幅越大周期必越长。",
    "tags": [
      "弹簧振子周期",
      "T=2\\pi\\sqrt{m/k}",
      "振子质量",
      "劲度系数",
      "周期"
    ]
  },
  {
    "id": "f-ch11-058",
    "chapter": "ch11",
    "section": "ch11-s03",
    "title": "小角度单摆周期",
    "tex": "T=2\\pi\\sqrt{l/g}",
    "meaning": "小角度下单摆近似为简谐振动。",
    "symbols": [
      [
        "l",
        "摆长",
        "m"
      ],
      [
        "g",
        "重力加速度",
        "m/s²"
      ],
      [
        "T",
        "周期",
        "s"
      ]
    ],
    "type": "标量",
    "condition": "摆角远小于1 rad，质点摆球、无质量不可伸长摆线，无阻尼。",
    "misuse": "大角度摆动仍忽略周期的振幅依赖。",
    "tags": [
      "小角度单摆周期",
      "T=2\\pi\\sqrt{l/g}",
      "摆长",
      "重力加速度",
      "周期"
    ]
  },
  {
    "id": "f-ch11-059",
    "chapter": "ch11",
    "section": "ch11-s04",
    "title": "简谐振动能量",
    "tex": "E_k=\\tfrac12mv^2,\\quad E_p=\\tfrac12kx^2,\\quad E=\\tfrac12kA^2",
    "meaning": "动能与势能周期交换，总机械能恒定。",
    "symbols": [
      [
        "E_k",
        "动能",
        "J"
      ],
      [
        "E_p",
        "相对平衡位置势能",
        "J"
      ],
      [
        "k",
        "回复系数",
        "N/m"
      ],
      [
        "x",
        "位移",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "线性无阻尼无驱动振子，势能在平衡位置取零。",
    "misuse": "把动能或势能的周期当成位移周期。",
    "tags": [
      "简谐振动能量",
      "E_k=\\tfrac12mv^2,\\quad E_p=\\tfrac12kx^2,\\quad E=\\tfrac12kA^2",
      "动能",
      "相对平衡位置势能",
      "回复系数",
      "位移"
    ]
  },
  {
    "id": "f-ch11-060",
    "chapter": "ch11",
    "section": "ch11-s05",
    "title": "同向同频振动合成",
    "tex": "A^2=A_1^2+A_2^2+2A_1A_2\\cos\\Delta\\varphi",
    "meaning": "相位差决定合振幅。",
    "symbols": [
      [
        "A",
        "合振幅",
        "m"
      ],
      [
        "A_1",
        "第一振幅",
        "m"
      ],
      [
        "A_2",
        "第二振幅",
        "m"
      ],
      [
        "\\Delta\\varphi",
        "相位差",
        "rad"
      ]
    ],
    "type": "标量",
    "condition": "两个同方向、同频率简谐振动。",
    "misuse": "频率不同时仍把合振动视为固定振幅的简谐振动。",
    "tags": [
      "同向同频振动合成",
      "A^2=A_1^2+A_2^2+2A_1A_2\\cos\\Delta\\varphi",
      "合振幅",
      "第一振幅",
      "第二振幅",
      "相位差"
    ]
  },
  {
    "id": "f-ch12-061",
    "chapter": "ch12",
    "section": "ch12-s02",
    "title": "一维简谐行波",
    "tex": "y=A\\cos(\\omega t-kx+\\varphi),\\quad k=2\\pi/\\lambda",
    "meaning": "等相位点向正x传播，质元在原处振动。",
    "symbols": [
      [
        "y",
        "质元位移",
        "m"
      ],
      [
        "x",
        "平衡位置坐标",
        "m"
      ],
      [
        "k",
        "波数",
        "rad/m"
      ],
      [
        "\\omega",
        "角频率",
        "rad/s"
      ]
    ],
    "type": "位移分量",
    "condition": "均匀无耗散线性介质中的正x方向简谐行波。",
    "misuse": "把波形移动速度当成质元振动速度。",
    "tags": [
      "一维简谐行波",
      "y=A\\cos(\\omega t-kx+\\varphi),\\quad k=2\\pi/\\lambda",
      "质元位移",
      "平衡位置坐标",
      "波数",
      "角频率"
    ]
  },
  {
    "id": "f-ch12-062",
    "chapter": "ch12",
    "section": "ch12-s03",
    "title": "波速与波长",
    "tex": "u=\\lambda f=\\omega/k",
    "meaning": "波速由介质决定，频率由波源决定。",
    "symbols": [
      [
        "u",
        "相速度",
        "m/s"
      ],
      [
        "\\lambda",
        "波长",
        "m"
      ],
      [
        "f",
        "频率",
        "Hz"
      ]
    ],
    "type": "标量",
    "condition": "单一频率行波；色散介质中按该频率的相速度使用。",
    "misuse": "跨介质时认为频率跟波速同比改变。",
    "tags": [
      "波速与波长",
      "u=\\lambda f=\\omega/k",
      "相速度",
      "波长",
      "频率"
    ]
  },
  {
    "id": "f-ch12-063",
    "chapter": "ch12",
    "section": "ch12-s03",
    "title": "弦上横波速度",
    "tex": "u=\\sqrt{F/\\mu}",
    "meaning": "张力提供回复作用，线密度提供惯性。",
    "symbols": [
      [
        "F",
        "张力",
        "N"
      ],
      [
        "\\mu",
        "线密度",
        "kg/m"
      ],
      [
        "u",
        "波速",
        "m/s"
      ]
    ],
    "type": "标量",
    "condition": "柔软均匀细弦、小振幅、张力近恒定。",
    "misuse": "把线密度替换成体密度。",
    "tags": [
      "弦上横波速度",
      "u=\\sqrt{F/\\mu}",
      "张力",
      "线密度",
      "波速"
    ]
  },
  {
    "id": "f-ch12-064",
    "chapter": "ch12",
    "section": "ch12-s04",
    "title": "机械平面波平均强度",
    "tex": "I=\\tfrac12\\rho u\\omega^2 A^2",
    "meaning": "平均能流随振幅平方与频率平方增长。",
    "symbols": [
      [
        "I",
        "平均强度",
        "W/m²"
      ],
      [
        "\\rho",
        "介质体密度",
        "kg/m³"
      ],
      [
        "u",
        "波速",
        "m/s"
      ],
      [
        "A",
        "位移振幅",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "均匀线性介质中的简谐平面行波，无吸收。",
    "misuse": "把驻波也当单向输运的行波算净能流。",
    "tags": [
      "机械平面波平均强度",
      "I=\\tfrac12\\rho u\\omega^2 A^2",
      "平均强度",
      "介质体密度",
      "波速",
      "位移振幅"
    ]
  },
  {
    "id": "f-ch12-065",
    "chapter": "ch12",
    "section": "ch12-s06",
    "title": "两端固定弦的正常模式",
    "tex": "\\lambda_n=2L/n,\\quad f_n=nu/(2L)",
    "meaning": "边界条件只允许离散的驻波模式。",
    "symbols": [
      [
        "L",
        "弦长",
        "m"
      ],
      [
        "u",
        "波速",
        "m/s"
      ],
      [
        "n",
        "正整数模式序号",
        "1"
      ],
      [
        "f_n",
        "频率",
        "Hz"
      ]
    ],
    "type": "标量",
    "condition": "两端固定、均匀弦、线性小振幅。",
    "misuse": "把相邻波节距离当成一个波长。",
    "tags": [
      "两端固定弦的正常模式",
      "\\lambda_n=2L/n,\\quad f_n=nu/(2L)",
      "弦长",
      "波速",
      "正整数模式序号",
      "频率"
    ]
  },
  {
    "id": "f-ch12-066",
    "chapter": "ch12",
    "section": "ch12-s07",
    "title": "声波多普勒效应",
    "tex": "f_o=f_s\\frac{u+v_o}{u-v_s}",
    "meaning": "接近时观察频率升高。",
    "symbols": [
      [
        "f_o",
        "接收频率",
        "Hz"
      ],
      [
        "f_s",
        "发射频率",
        "Hz"
      ],
      [
        "u",
        "相对介质声速",
        "m/s"
      ],
      [
        "v_o",
        "观察者朝源速度",
        "m/s"
      ],
      [
        "v_s",
        "声源朝观察者速度",
        "m/s"
      ]
    ],
    "type": "一维分量",
    "condition": "静止均匀介质、同一直线、声源亚声速，速度按朝向对方为正。",
    "misuse": "仅用源与观察者相对速度处理所有声学情形。",
    "tags": [
      "声波多普勒效应",
      "f_o=f_s\\frac{u+v_o}{u-v_s}",
      "接收频率",
      "发射频率",
      "相对介质声速",
      "观察者朝源速度",
      "声源朝观察者速度"
    ]
  },
  {
    "id": "f-ch13-067",
    "chapter": "ch13",
    "section": "ch13-s01",
    "title": "光程与相位差",
    "tex": "\\mathcal L=\\int n\\,ds,\\quad\\Delta\\varphi=2\\pi\\Delta\\mathcal L/\\lambda_0+\\Delta\\varphi_0",
    "meaning": "光程差与额外相位共同决定干涉。",
    "symbols": [
      [
        "\\mathcal L",
        "光程",
        "m"
      ],
      [
        "n",
        "折射率",
        "1"
      ],
      [
        "\\lambda_0",
        "真空波长",
        "m"
      ],
      [
        "\\Delta\\varphi_0",
        "初相及反射附加相位差",
        "rad"
      ]
    ],
    "type": "标量",
    "condition": "同频相干光，明确每段折射率与反射相位。",
    "misuse": "既计半波光程又重复加反射π相位。",
    "tags": [
      "光程与相位差",
      "\\mathcal L=\\int n\\,ds,\\quad\\Delta\\varphi=2\\pi\\Delta\\mathcal L/\\lambda_0+\\Delta\\varphi_0",
      "光程",
      "折射率",
      "真空波长",
      "初相及反射附加相位差"
    ]
  },
  {
    "id": "f-ch13-068",
    "chapter": "ch13",
    "section": "ch13-s02",
    "title": "杨氏双缝条纹间距",
    "tex": "\\Delta x=D\\lambda/d",
    "meaning": "波长、屏距与缝距共同决定相邻亮纹间距。",
    "symbols": [
      [
        "D",
        "屏距",
        "m"
      ],
      [
        "\\lambda",
        "介质中波长",
        "m"
      ],
      [
        "d",
        "缝距",
        "m"
      ],
      [
        "\\Delta x",
        "条纹间距",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "同相、等强窄缝、远场小角度，忽略单缝包络。",
    "misuse": "缝距增大时反而认为条纹变宽。",
    "tags": [
      "杨氏双缝条纹间距",
      "\\Delta x=D\\lambda/d",
      "屏距",
      "介质中波长",
      "缝距",
      "条纹间距"
    ]
  },
  {
    "id": "f-ch13-069",
    "chapter": "ch13",
    "section": "ch13-s03",
    "title": "薄膜反射干涉相位差",
    "tex": "\\Delta\\varphi=\\frac{4\\pi ne\\cos r}{\\lambda_0}+\\Delta\\varphi_{\\mathrm{refl}}",
    "meaning": "往返光程与两次界面反射的相位差共同决定明暗。",
    "symbols": [
      [
        "n",
        "膜折射率",
        "1"
      ],
      [
        "e",
        "膜厚",
        "m"
      ],
      [
        "r",
        "膜内折射角",
        "rad"
      ],
      [
        "\\lambda_0",
        "真空波长",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "平行透明薄膜，两反射光相干；附加反射相位按各界面判断。",
    "misuse": "任何薄膜都机械添加半波损失。",
    "tags": [
      "薄膜反射干涉相位差",
      "\\Delta\\varphi=\\frac{4\\pi ne\\cos r}{\\lambda_0}+\\Delta\\varphi_{\\mathrm{refl}}",
      "膜折射率",
      "膜厚",
      "膜内折射角",
      "真空波长"
    ]
  },
  {
    "id": "f-ch13-070",
    "chapter": "ch13",
    "section": "ch13-s04",
    "title": "单缝衍射暗纹",
    "tex": "a\\sin\\theta=m\\lambda,\\quad m=\\pm1,\\pm2,\\ldots",
    "meaning": "有限缝宽导致衍射包络。",
    "symbols": [
      [
        "a",
        "缝宽",
        "m"
      ],
      [
        "\\theta",
        "衍射角",
        "rad"
      ],
      [
        "\\lambda",
        "介质中波长",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "单色均匀照明单缝、夫琅禾费远场或透镜焦平面。",
    "misuse": "把m=0当暗纹，或把缝宽当双缝间距。",
    "tags": [
      "单缝衍射暗纹",
      "a\\sin\\theta=m\\lambda,\\quad m=\\pm1,\\pm2,\\ldots",
      "缝宽",
      "衍射角",
      "介质中波长"
    ]
  },
  {
    "id": "f-ch13-071",
    "chapter": "ch13",
    "section": "ch13-s05",
    "title": "光栅主极大与分辨本领",
    "tex": "d\\sin\\theta=m\\lambda,\\quad R=\\lambda/\\Delta\\lambda=\\lvert m\\rvert N",
    "meaning": "多缝干涉产生窄主极大，照亮缝数提高分辨率。",
    "symbols": [
      [
        "d",
        "光栅常数",
        "m"
      ],
      [
        "N",
        "照明缝数",
        "1"
      ],
      [
        "m",
        "衍射级次",
        "1"
      ],
      [
        "R",
        "分辨本领",
        "1"
      ]
    ],
    "type": "标量",
    "condition": "正入射、理想均匀光栅，分辨公式采用瑞利判据，级次须实际可见。",
    "misuse": "忽略单缝包络导致的缺级。",
    "tags": [
      "光栅主极大与分辨本领",
      "d\\sin\\theta=m\\lambda,\\quad R=\\lambda/\\Delta\\lambda=\\lvert m\\rvert N",
      "光栅常数",
      "照明缝数",
      "衍射级次",
      "分辨本领"
    ]
  },
  {
    "id": "f-ch13-072",
    "chapter": "ch13",
    "section": "ch13-s06",
    "title": "马吕斯定律",
    "tex": "I=I_0\\cos^2\\alpha",
    "meaning": "检偏器只透过沿其透光轴的电场分量。",
    "symbols": [
      [
        "I_0",
        "入射线偏振光强",
        "W/m²"
      ],
      [
        "I",
        "透射光强",
        "W/m²"
      ],
      [
        "\\alpha",
        "偏振方向与透光轴夹角",
        "rad"
      ]
    ],
    "type": "标量",
    "condition": "理想偏振片、入射为线偏振光。",
    "misuse": "对自然光直接用任意α代入，遗漏第一片减半。",
    "tags": [
      "马吕斯定律",
      "I=I_0\\cos^2\\alpha",
      "入射线偏振光强",
      "透射光强",
      "偏振方向与透光轴夹角"
    ]
  },
  {
    "id": "f-ch14-073",
    "chapter": "ch14",
    "section": "ch14-s02",
    "title": "洛伦兹因子",
    "tex": "\\gamma=1/\\sqrt{1-v^2/c^2}",
    "meaning": "相对速度决定相对论修正尺度。",
    "symbols": [
      [
        "v",
        "惯性系相对速率",
        "m/s"
      ],
      [
        "c",
        "真空光速",
        "m/s"
      ],
      [
        "\\gamma",
        "洛伦兹因子",
        "1"
      ]
    ],
    "type": "标量",
    "condition": "惯性系的相对速度满足速率小于c。",
    "misuse": "把粒子相对某系的速度与两系速度混用。",
    "tags": [
      "洛伦兹因子",
      "\\gamma=1/\\sqrt{1-v^2/c^2}",
      "惯性系相对速率",
      "真空光速",
      "洛伦兹因子"
    ]
  },
  {
    "id": "f-ch14-074",
    "chapter": "ch14",
    "section": "ch14-s02",
    "title": "洛伦兹变换",
    "tex": "x^{\\prime}=\\gamma(x-vt),\\quad t^{\\prime}=\\gamma(t-vx/c^2)",
    "meaning": "同一事件的空间和时间坐标相互关联。",
    "symbols": [
      [
        "x",
        "事件空间坐标",
        "m"
      ],
      [
        "t",
        "事件时间坐标",
        "s"
      ],
      [
        "v",
        "两系相对速度",
        "m/s"
      ]
    ],
    "type": "坐标变换",
    "condition": "标准配置，轴平行，原点在t=t′=0重合，S′沿S的正x运动。",
    "misuse": "直接把一个系的同时测量当成另一个系的同时测量。",
    "tags": [
      "洛伦兹变换",
      "x^{\\prime}=\\gamma(x-vt),\\quad t^{\\prime}=\\gamma(t-vx/c^2)",
      "事件空间坐标",
      "事件时间坐标",
      "两系相对速度"
    ]
  },
  {
    "id": "f-ch14-075",
    "chapter": "ch14",
    "section": "ch14-s03",
    "title": "时间延缓",
    "tex": "\\Delta t=\\gamma\\Delta\\tau",
    "meaning": "运动钟两次滴答在另一惯性系中相隔更久。",
    "symbols": [
      [
        "\\Delta\\tau",
        "同地两事件固有时",
        "s"
      ],
      [
        "\\Delta t",
        "另一惯性系时间间隔",
        "s"
      ]
    ],
    "type": "标量",
    "condition": "两事件在计固有时的钟系同地，钟在两事件间惯性运动。",
    "misuse": "任意两事件都把较短时间称为固有时。",
    "tags": [
      "时间延缓",
      "\\Delta t=\\gamma\\Delta\\tau",
      "同地两事件固有时",
      "另一惯性系时间间隔"
    ]
  },
  {
    "id": "f-ch14-076",
    "chapter": "ch14",
    "section": "ch14-s03",
    "title": "长度收缩",
    "tex": "L=L_0/\\gamma",
    "meaning": "运动方向的长度小于物体静止长度。",
    "symbols": [
      [
        "L_0",
        "固有长度",
        "m"
      ],
      [
        "L",
        "运动系测得的长度",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "物体沿长度方向匀速运动，L须由测量系同一时刻的两端位置求得。",
    "misuse": "用不同时间读到的两端坐标相减当长度。",
    "tags": [
      "长度收缩",
      "L=L_0/\\gamma",
      "固有长度",
      "运动系测得的长度"
    ]
  },
  {
    "id": "f-ch14-077",
    "chapter": "ch14",
    "section": "ch14-s04",
    "title": "相对论速度变换",
    "tex": "u_x^{\\prime}=\\frac{u_x-v}{1-u_xv/c^2}",
    "meaning": "时间变换修正经典速度相减，保持真空光速不变。",
    "symbols": [
      [
        "u_x",
        "粒子在S系速度分量",
        "m/s"
      ],
      [
        "v",
        "S′相对S速度",
        "m/s"
      ]
    ],
    "type": "一维分量",
    "condition": "标准配置的两个惯性系、相对运动沿x轴。",
    "misuse": "把两个接近光速的速度直接相加。",
    "tags": [
      "相对论速度变换",
      "u_x^{\\prime}=\\frac{u_x-v}{1-u_xv/c^2}",
      "粒子在S系速度分量",
      "S′相对S速度"
    ]
  },
  {
    "id": "f-ch14-078",
    "chapter": "ch14",
    "section": "ch14-s05",
    "title": "相对论能量动量",
    "tex": "E=\\gamma mc^2,\\quad\\vec p=\\gamma m\\vec v,\\quad E^2=p^2c^2+m^2c^4",
    "meaning": "静质量、总能量与动量由不变量联系。",
    "symbols": [
      [
        "E",
        "总能量",
        "J"
      ],
      [
        "m",
        "静质量",
        "kg"
      ],
      [
        "p",
        "动量大小",
        "kg·m/s"
      ],
      [
        "v",
        "粒子速度",
        "m/s"
      ]
    ],
    "type": "标量与矢量",
    "condition": "前两式限有静质量粒子，最后一式也适用光子。",
    "misuse": "把总能量γmc²当动能。",
    "tags": [
      "相对论能量动量",
      "E=\\gamma mc^2,\\quad\\vec p=\\gamma m\\vec v,\\quad E^2=p^2c^2+m^2c^4",
      "总能量",
      "静质量",
      "动量大小",
      "粒子速度"
    ]
  },
  {
    "id": "f-ch15-079",
    "chapter": "ch15",
    "section": "ch15-s01",
    "title": "黑体辐射总量与峰值",
    "tex": "M=\\sigma T^4,\\quad\\lambda_{\\max}T=b",
    "meaning": "温度决定总辐出度及按波长分布的峰值位置。",
    "symbols": [
      [
        "M",
        "辐出度",
        "W/m²"
      ],
      [
        "T",
        "绝对温度",
        "K"
      ],
      [
        "\\sigma",
        "斯特藩常数",
        "W/(m²·K⁴)"
      ],
      [
        "b",
        "维恩常数",
        "m·K"
      ]
    ],
    "type": "标量",
    "condition": "热平衡理想黑体；峰值指每单位波长谱，M不是净辐射功率。",
    "misuse": "直接把波长峰值倒数当频率谱峰值。",
    "tags": [
      "黑体辐射总量与峰值",
      "M=\\sigma T^4,\\quad\\lambda_{\\max}T=b",
      "辐出度",
      "绝对温度",
      "斯特藩常数",
      "维恩常数"
    ]
  },
  {
    "id": "f-ch15-080",
    "chapter": "ch15",
    "section": "ch15-s02",
    "title": "爱因斯坦光电方程",
    "tex": "E_{k,\\max}=h\\nu-W=eU_s",
    "meaning": "单个光子能量扣除逸出功后决定最大初动能。",
    "symbols": [
      [
        "h",
        "普朗克常数",
        "J·s"
      ],
      [
        "\\nu",
        "频率",
        "Hz"
      ],
      [
        "W",
        "逸出功",
        "J"
      ],
      [
        "U_s",
        "遏止电压大小",
        "V"
      ]
    ],
    "type": "标量",
    "condition": "单光子光电效应且hν≥W，e为元电荷正值。",
    "misuse": "提高固定频率光的强度来增加最大初动能。",
    "tags": [
      "爱因斯坦光电方程",
      "E_{k,\\max}=h\\nu-W=eU_s",
      "普朗克常数",
      "频率",
      "逸出功",
      "遏止电压大小"
    ]
  },
  {
    "id": "f-ch15-081",
    "chapter": "ch15",
    "section": "ch15-s02",
    "title": "康普顿波长位移",
    "tex": "\\Delta\\lambda=\\frac{h}{m_ec}(1-\\cos\\theta)",
    "meaning": "光子与电子交换能量动量导致散射波长增加。",
    "symbols": [
      [
        "m_e",
        "电子静质量",
        "kg"
      ],
      [
        "\\theta",
        "光子散射角",
        "rad"
      ],
      [
        "\\Delta\\lambda",
        "波长增量",
        "m"
      ]
    ],
    "type": "标量",
    "condition": "初始近似静止自由电子，束缚和集体效应可忽略。",
    "misuse": "把电子反冲角代入光子散射角。",
    "tags": [
      "康普顿波长位移",
      "\\Delta\\lambda=\\frac{h}{m_ec}(1-\\cos\\theta)",
      "电子静质量",
      "光子散射角",
      "波长增量"
    ]
  },
  {
    "id": "f-ch15-082",
    "chapter": "ch15",
    "section": "ch15-s03",
    "title": "德布罗意波长",
    "tex": "\\lambda=h/p",
    "meaning": "物质波的波长由动量决定。",
    "symbols": [
      [
        "\\lambda",
        "波长",
        "m"
      ],
      [
        "h",
        "普朗克常数",
        "J·s"
      ],
      [
        "p",
        "动量大小",
        "kg·m/s"
      ]
    ],
    "type": "标量",
    "condition": "具有确定动量的分量；低速才可进一步用p=mv。",
    "misuse": "高速电子仍用非相对论动量计算精确波长。",
    "tags": [
      "德布罗意波长",
      "\\lambda=h/p",
      "波长",
      "普朗克常数",
      "动量大小"
    ]
  },
  {
    "id": "f-ch15-083",
    "chapter": "ch15",
    "section": "ch15-s04",
    "title": "概率密度与归一化",
    "tex": "\\rho=\\lvert\\psi\\rvert^2,\\quad\\int\\lvert\\psi\\rvert^2dV=1",
    "meaning": "波函数模平方是位置概率密度。",
    "symbols": [
      [
        "\\rho",
        "三维概率密度",
        "m⁻³"
      ],
      [
        "\\psi",
        "三维波函数",
        "m⁻³⁄²"
      ],
      [
        "V",
        "体积",
        "m³"
      ]
    ],
    "type": "标量",
    "condition": "归一化的单粒子非相对论位置表象；一维波函数单位另为m⁻¹⁄²。",
    "misuse": "把ψ直接当概率或把点处概率密度当概率。",
    "tags": [
      "概率密度与归一化",
      "\\rho=\\lvert\\psi\\rvert^2,\\quad\\int\\lvert\\psi\\rvert^2dV=1",
      "三维概率密度",
      "三维波函数",
      "体积"
    ]
  },
  {
    "id": "f-ch15-084",
    "chapter": "ch15",
    "section": "ch15-s05",
    "title": "位置动量不确定关系",
    "tex": "\\Delta x\\,\\Delta p_x\\ge\\hbar/2",
    "meaning": "同一量子态的位置与动量统计散布存在下限。",
    "symbols": [
      [
        "\\Delta x",
        "位置标准差",
        "m"
      ],
      [
        "\\Delta p_x",
        "动量标准差",
        "kg·m/s"
      ],
      [
        "\\hbar",
        "约化普朗克常数",
        "J·s"
      ]
    ],
    "type": "标量",
    "condition": "同一量子态、同一方向，方差存在；Δ是标准差。",
    "misuse": "归因于仪器不够精确。",
    "tags": [
      "位置动量不确定关系",
      "\\Delta x\\,\\Delta p_x\\ge\\hbar/2",
      "位置标准差",
      "动量标准差",
      "约化普朗克常数"
    ]
  },
  {
    "id": "f-ch15-085",
    "chapter": "ch15",
    "section": "ch15-s06",
    "title": "含时薛定谔方程",
    "tex": "i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\left[-\\frac{\\hbar^2}{2m}\\nabla^2+V\\right]\\psi",
    "meaning": "哈密顿算符决定非相对论量子态的时间演化。",
    "symbols": [
      [
        "m",
        "粒子质量",
        "kg"
      ],
      [
        "V",
        "势能",
        "J"
      ],
      [
        "t",
        "时间",
        "s"
      ],
      [
        "\\hbar",
        "约化普朗克常数",
        "J·s"
      ]
    ],
    "type": "复波函数方程",
    "condition": "非相对论、无自旋的单粒子标量势模型，势能零点统一选取。",
    "misuse": "把式中的V当电势而遗漏电荷因子。",
    "tags": [
      "含时薛定谔方程",
      "i\\hbar\\frac{\\partial\\psi}{\\partial t}=\\left[-\\frac{\\hbar^2}{2m}\\nabla^2+V\\right]\\psi",
      "粒子质量",
      "势能",
      "时间",
      "约化普朗克常数"
    ]
  },
  {
    "id": "f-ch15-086",
    "chapter": "ch15",
    "section": "ch15-s07",
    "title": "一维无限深势阱能级",
    "tex": "E_n=\\frac{n^2h^2}{8mL^2},\\quad n=1,2,\\ldots",
    "meaning": "阱壁边界条件筛选离散能量，基态能量不为零。",
    "symbols": [
      [
        "L",
        "阱宽",
        "m"
      ],
      [
        "m",
        "质量",
        "kg"
      ],
      [
        "E_n",
        "阱内零势能下能级",
        "J"
      ],
      [
        "n",
        "正整数",
        "1"
      ]
    ],
    "type": "标量",
    "condition": "阱内势能为零、阱外无穷大，非相对论单粒子。",
    "misuse": "加入n=0态或认为能级等间距。",
    "tags": [
      "一维无限深势阱能级",
      "E_n=\\frac{n^2h^2}{8mL^2},\\quad n=1,2,\\ldots",
      "阱宽",
      "质量",
      "阱内零势能下能级",
      "正整数"
    ]
  }
]);

  /* -------------------------------------------------------------- 题目库 */
  // type: 'single' 单选 | 'numeric' 数值
  // numeric: answer, tol（绝对误差）, unit, unitHint
  PHYS.questions = [
    /* ---- 1.1 ---- */
    {
      id: 'q01-s01-01', chapter: 'ch01', section: 'ch01-s01', type: 'single', difficulty: 1,
      point: '质点模型', tags: ['质点模型', '参考系'],
      stem: '下列哪种情况中，把物体当作质点处理会带来明显误差？',
      options: [
        '研究地球绕太阳公转的轨道周期',
        '研究一列火车从北京到上海的平均速度',
        '研究体操运动员在空中完成转体动作时的姿态',
        '研究月球绕地球运动的轨道半径'
      ],
      answer: 2,
      explain: '质点模型忽略物体自身的形状与大小。体操运动员的转体恰恰由身体各部分的相对位置决定，形状不可忽略。其余三例中物体尺寸远小于轨道尺度或只需整体位移。',
      hints: ['质点模型成立的条件是什么？', '哪一项的结论依赖于“物体内部各部分位置不同”？'],
      commonError: '只看“物体大小”就判断，而忽略了问题是否关心物体内部结构。'
    },
    {
      id: 'q01-s01-02', chapter: 'ch01', section: 'ch01-s01', type: 'single', difficulty: 2,
      point: '参考系', tags: ['参考系', '坐标系'],
      stem: '坐在匀速直线行驶的列车里的人，竖直向上抛出一个小球（相对车厢）。以地面为参考系，小球做什么运动？',
      options: ['竖直上抛运动', '斜抛运动', '匀速直线运动', '自由落体运动'],
      answer: 1,
      explain: '小球离开手后，水平方向已具有与车厢相同的速度并保持匀速；竖直方向只受重力。两个方向的合成是斜抛运动。若取车厢为参考系，则看到的是竖直上抛。',
      hints: ['小球离开手时，水平方向有初速度吗？', '“竖直上抛”这个描述是在哪个参考系中看到的？'],
      commonError: '把车厢参考系中的观察结果直接当作地面参考系中的运动。'
    },

    /* ---- 1.2 ---- */
    {
      id: 'q01-s02-01', chapter: 'ch01', section: 'ch01-s02', type: 'single', difficulty: 1,
      point: '位移与路程', tags: ['位移', '路程'],
      stem: '一个人沿半径 R = 5 m 的圆形跑道从 A 点走到正对面的 B 点（走过半个圆周）。他的位移大小和路程分别是：',
      options: ['10 m，10 m', '10 m，5π m', '5π m，10 m', '5π m，5π m'],
      answer: 1,
      explain: '位移由初末位置决定，A、B 相距直径 2R = 10 m。路程是实际走过的弧长，半圆为 πR = 5π ≈ 15.7 m。',
      hints: ['位移只看起点和终点。', '半圆周长是 πR。'],
      commonError: '把半圆周长当作位移大小。'
    },
    {
      id: 'q01-s02-02', chapter: 'ch01', section: 'ch01-s02', type: 'single', difficulty: 2,
      point: '瞬时速率', tags: ['速率', '速度'],
      stem: '关于平均速度、平均速率与瞬时速率，下列说法正确的是：',
      options: [
        '平均速度的大小总是等于平均速率',
        '平均速度的大小只有在单向直线运动中才等于平均速率；而瞬时速率 v 恒等于速度矢量的大小 |$\\vec{v}$|',
        '瞬时速度的大小等于位移变化率的大小 |Δ$\\vec{r}$|/Δt',
        '位移为零的一段运动，平均速率也一定为零'
      ],
      answer: 1,
      explain: '平均速度用位移算、平均速率用路程算，而 |Δ$\\vec{r}$| ≤ Δs，所以平均速度的大小不超过平均速率，只有单向直线运动时取等号。而瞬时量之间恒有 v = |$\\vec{v}$| = ds/dt，这一点对曲线运动同样成立。',
      hints: ['把一段曲线运动的路程 Δs 与位移大小 |Δ$\\vec{r}$| 比较一下。', '选项 D 想一想绕操场跑一圈回到原点的情况。'],
      commonError: '把平均速度的大小与平均速率混为一谈；也常误以为 |d$\\vec{r}$/dt| 与 ds/dt 在曲线运动中不同。'
    },
    {
      id: 'q01-s02-03', chapter: 'ch01', section: 'ch01-s02', type: 'numeric', difficulty: 2,
      point: '平均速度', tags: ['平均速度', '位移'],
      stem: '一质点沿 x 轴运动，t = 0 时位于 x = 2 m，t = 4 s 时位于 x = 14 m；期间它先向右走到 x = 20 m 再折返。求它在 0～4 s 内的平均速度（x 方向分量），单位 m/s。',
      answer: 3, tol: 0.01, unit: 'm/s',
      explain: '平均速度只由位移决定：Δx = 14 − 2 = 12 m，Δt = 4 s，所以 v̄ₓ = 12/4 = 3 m/s。折返过程对平均速度没有额外影响（但会影响平均速率）。',
      hints: ['先写出位移 Δx = x末 − x初。', '中间走过的路程对平均速度有用吗？'],
      commonError: '把总路程除以时间当作平均速度。'
    },

    /* ---- 1.3 ---- */
    {
      id: 'q01-s03-01', chapter: 'ch01', section: 'ch01-s03', type: 'single', difficulty: 2,
      point: '运动图像', tags: ['运动图像', '加速度', '速度'],
      stem: '某物体的 v–t 图是一条斜率为正的直线，且在 t = 0 时速度为负值。关于该物体的运动，正确的是：',
      options: [
        '物体一直沿负方向加速',
        '物体先沿负方向做减速运动，速度减为零后沿正方向加速',
        '物体一直沿正方向做加速运动',
        '无法判断，需要知道初始位置'
      ],
      answer: 1,
      explain: 'v < 0 表示沿负方向运动，斜率 a > 0 表示加速度沿正方向。两者反向，所以速率在减小；v 越过零之后，速度与加速度同向，开始沿正方向加速。',
      hints: ['v–t 图上的斜率代表什么？', '速度与加速度符号相同时速率增大，相反时减小。'],
      commonError: '把“斜率为正”直接理解为“加速”，忽略了初速度为负。'
    },
    {
      id: 'q01-s03-02', chapter: 'ch01', section: 'ch01-s03', type: 'numeric', difficulty: 2,
      point: 'v–t 图面积', tags: ['运动图像', '位移', '面积'],
      stem: '某质点沿 x 轴运动，其 v–t 图在 0～2 s 内为 v = 3t（m/s），在 2～4 s 内为 v = 6 − 3(t − 2)（m/s）。求 0～4 s 内的位移，单位 m。',
      answer: 12, tol: 0.01, unit: 'm',
      explain: 'v–t 图与时间轴围成的面积即位移。0～2 s 是底 2、高 6 的三角形，面积 6 m；2～4 s 也是三角形，从 6 降到 0，面积 6 m。总位移 12 m。',
      hints: ['v–t 图下的面积代表什么？', '两段都是三角形：面积 = ½ × 底 × 高。'],
      commonError: '把两个三角形面积当成一个矩形来计算，或用末速度乘总时间。'
    },
    {
      id: 'q01-s03-03', chapter: 'ch01', section: 'ch01-s03', type: 'single', difficulty: 2,
      point: 'x–t 图斜率', tags: ['运动图像', '速度', '斜率'],
      stem: '一个物体的 x–t 图像是一条水平直线。下列判断正确的是：',
      options: [
        '物体静止，加速度为零',
        '物体做匀速直线运动，加速度不为零',
        '物体速度为零，但加速度可能不为零',
        '图像信息不足，无法判断'
      ],
      answer: 0,
      explain: 'x–t 图水平意味着位置不随时间变化，v = dx/dt = 0，物体静止。静止状态下速度恒为零，加速度也必为零（加速度是速度的变化率）。',
      hints: ['x–t 图的斜率是什么？', '速度恒定为零时，加速度呢？'],
      commonError: '把“x–t 图是水平线”误读成“v–t 图”。'
    },

    /* ---- 1.4 ---- */
    {
      id: 'q01-s04-01', chapter: 'ch01', section: 'ch01-s04', type: 'numeric', difficulty: 2,
      point: '匀变速直线运动', tags: ['匀变速', '加速度', '直线运动'],
      stem: '一质点沿 x 轴做匀加速直线运动，t = 0 时 x₀ = 0、v₀ = 2 m/s，加速度 a = 1.5 m/s²。求 t = 4 s 时的位置 x，单位 m。',
      answer: 20, tol: 0.01, unit: 'm',
      explain: 'x = v₀t + ½at² = 2×4 + ½×1.5×16 = 8 + 12 = 20 m。此时速度 v = 2 + 1.5×4 = 8 m/s。（这也是实验中使用的验收数据。）',
      hints: ['用 x = x₀ + v₀t + ½at²。', '注意 ½×1.5×4² 中的平方只作用在 t 上。'],
      commonError: '忘记 ½ 系数，或把 4² 写成 4×2。'
    },
    {
      id: 'q01-s04-02', chapter: 'ch01', section: 'ch01-s04', type: 'numeric', difficulty: 3,
      point: '速度积分', tags: ['积分', '速度', '加速度'],
      stem: '一质点沿 x 轴运动，速度随时间变化为 v(t) = 6t − 3t²（m/s），t = 0 时位于 x = 0。求 t = 2 s 时的位置 x，单位 m。',
      answer: 4, tol: 0.02, unit: 'm',
      explain: 'x = ∫₀²(6t − 3t²)dt = [3t² − t³]₀² = 12 − 8 = 4 m。此时 a = dv/dt = 6 − 6t，t = 2 s 时 a = −6 m/s²，物体正在减速。',
      hints: ['位置是速度对时间的定积分。', '∫t dt = t²/2，∫t² dt = t³/3。'],
      commonError: '把 v(2) = 0 当作位移为零。'
    },
    {
      id: 'q01-s04-03', chapter: 'ch01', section: 'ch01-s04', type: 'single', difficulty: 3,
      point: '由加速度积分', tags: ['积分', '加速度', '初速度'],
      stem: '一质点沿 x 轴运动，加速度 a(t) = 4 − 2t（m/s²），t = 0 时 v₀ = 3 m/s。下列哪条 v(t) 表达式正确？',
      options: [
        'v(t) = 3 + 4t − 2t²',
        'v(t) = 3 + 4t − t²',
        'v(t) = 4 − 2t',
        'v(t) = 3 + 2t² − (2/3)t³'
      ],
      answer: 1,
      explain: 'v(t) = v₀ + ∫₀ᵗ a dt′ = 3 + 4t − t²。注意 ∫2t′dt′ = t²，不是 2t²；选项 D 是把 a 又积分了一次。',
      hints: ['v(t) = v₀ + ∫a dt。', '∫t′dt′ = t′²/2，所以 ∫2t′dt′ = t′²。'],
      commonError: '积分时漏掉 1/2 系数，或忘记加初速度。'
    },

    /* ---- 1.5 ---- */
    {
      id: 'q01-s05-01', chapter: 'ch01', section: 'ch01-s05', type: 'numeric', difficulty: 2,
      point: '向心加速度', tags: ['向心加速度', '圆周运动'],
      stem: '一质点以速率 v = 4 m/s 做半径 R = 2 m 的匀速圆周运动。求其加速度大小，单位 m/s²。',
      answer: 8, tol: 0.01, unit: 'm/s²',
      explain: '匀速圆周运动切向加速度为零（速率不变），法向加速度 a_n = v²/R = 16/2 = 8 m/s²，方向指向圆心。',
      hints: ['“匀速”意味着速率不变，a_τ = 0。', 'a_n = v²/R。'],
      commonError: '因为“匀速”就认为加速度为零。'
    },
    {
      id: 'q01-s05-02', chapter: 'ch01', section: 'ch01-s05', type: 'single', difficulty: 3,
      point: '切向与法向', tags: ['切向加速度', '法向加速度', '曲线运动'],
      stem: '一质点沿曲线运动，某时刻速度大小在减小、方向在改变。关于此刻的加速度，正确的是：',
      options: [
        '只有法向分量',
        '只有切向分量',
        '既有切向分量又有法向分量，且切向分量与速度反向',
        '加速度为零'
      ],
      answer: 2,
      explain: '速度方向在改变 → 必有 a_n；速率在减小 → a_τ 与 $\\vec{v}$ 反向。两项同时存在，合加速度指向轨迹凹侧但偏后。',
      hints: ['什么改变速率，什么改变方向？', '速率减小时切向加速度的方向如何？'],
      commonError: '以为“方向改变”就一定有法向加速度、就足以完整描述加速度。'
    },
    {
      id: 'q01-s05-03', chapter: 'ch01', section: 'ch01-s05', type: 'numeric', difficulty: 3,
      point: '角速度', tags: ['角速度', '圆周运动', '周期'],
      stem: '一质点做半径 R = 0.5 m 的圆周运动，周期 T = 2 s。求其速率，单位 m/s。（结果保留到小数点后两位）',
      answer: 1.57, tol: 0.02, unit: 'm/s',
      explain: 'ω = 2π/T = 3.14 rad/s，v = ωR = 3.14 × 0.5 ≈ 1.57 m/s。',
      hints: ['先求角速度 ω = 2π/T。', '再用 v = ωR。'],
      commonError: '把频率与角速度混为一谈，直接用 1/T 当作 ω。'
    },

    /* ---- 1.6 ---- */
    {
      id: 'q01-s06-01', chapter: 'ch01', section: 'ch01-s06', type: 'numeric', difficulty: 3,
      point: '平抛运动', tags: ['平抛', '抛体运动', '运动分解'],
      stem: '一小球从高 h = 20 m 处水平抛出，初速度 v₀ = 10 m/s（g 取 10 m/s²，忽略空气阻力）。求它落地时水平方向飞出的距离，单位 m。',
      answer: 20, tol: 0.05, unit: 'm',
      explain: '竖直方向自由落体：h = ½gt² → 20 = 5t² → t = 2 s。水平方向匀速：x = v₀t = 10×2 = 20 m。',
      hints: ['竖直方向和水平方向共用同一个时间。', '先由高度求时间。'],
      commonError: '用 v₀ 乘以竖直方向的下落时间时忘记竖直方向的初速度为零。'
    },
    {
      id: 'q01-s06-02', chapter: 'ch01', section: 'ch01-s06', type: 'single', difficulty: 3,
      point: '斜抛最大射程', tags: ['斜抛', '射程', '抛体运动'],
      stem: '在同一高度、同一初速率的条件下，斜抛射程最大时的抛射角是（忽略空气阻力）：',
      options: ['30°', '45°', '60°', '90°'],
      answer: 1,
      explain: 'R = v₀²sin2θ₀/g，2θ₀ = 90° 即 θ₀ = 45° 时最大。30° 与 60° 的射程相同但都小于 45°。',
      hints: ['射程公式中与角度有关的因子是 sin2θ₀。', 'sin2θ₀ 的最大值是 1，此时 2θ₀ = 90°。'],
      commonError: '认为抛射角越大射得越远。'
    },
    {
      id: 'q01-s06-03', chapter: 'ch01', section: 'ch01-s06', type: 'numeric', difficulty: 4,
      point: '斜抛最高点', tags: ['斜抛', '射程', '抛体运动'],
      stem: '以 v₀ = 20 m/s、θ₀ = 30° 从地面斜向上抛出一石子（g 取 10 m/s²，忽略空气阻力）。求落回地面时的水平射程，单位 m。（结果保留到小数点后一位）',
      answer: 34.6, tol: 0.5, unit: 'm',
      explain: 'R = v₀²sin2θ₀/g = 400 × sin60° / 10 = 40 × 0.8660 ≈ 34.6 m。也可以分解：v₀ₓ = 17.32 m/s，v₀ᵧ = 10 m/s，飞行时间 2v₀ᵧ/g = 2 s，x = 17.32×2 ≈ 34.6 m。',
      hints: ['R = v₀²sin2θ₀/g。', '或者先求竖直方向飞行时间，再乘水平速度。'],
      commonError: '把 sin60° 误算为 0.5（那是 sin30°）。'
    },

    /* ---- 1.7 ---- */
    {
      id: 'q01-s07-01', chapter: 'ch01', section: 'ch01-s07', type: 'numeric', difficulty: 2,
      point: '伽利略速度变换', tags: ['相对运动', '速度变换'],
      stem: '河水以 1 m/s 的速度沿 x 轴正向流动，船相对水的速度为 3 m/s，方向沿 x 轴反向。求船相对岸的速度（x 分量），单位 m/s。',
      answer: -2, tol: 0.01, unit: 'm/s',
      explain: '$\\vec{v}_{\\text{船岸}}$ = $\\vec{v}_{\\text{船水}}$ + $\\vec{v}_{\\text{水岸}}$ = (−3) + 1 = −2 m/s，即相对岸以 2 m/s 沿 x 轴反向运动。',
      hints: ['写出 $\\vec{v}_{\\text{船岸}}$ = $\\vec{v}_{\\text{船水}}$ + $\\vec{v}_{\\text{水岸}}$。', '注意方向相反要带负号。'],
      commonError: '漏掉河流速度，或把两个方向相加时忽略符号。'
    },
    {
      id: 'q01-s07-02', chapter: 'ch01', section: 'ch01-s07', type: 'single', difficulty: 3,
      point: '相对运动', tags: ['相对运动', '速度变换', '参考系'],
      stem: '雨滴相对地面竖直下落，速度为 5 m/s；人相对地面以 3 m/s 水平向西行走。人感觉雨滴从哪个方向打来？',
      options: [
        '正上方竖直落下',
        '斜向上偏西，即从西边斜打来',
        '斜向下偏西',
        '水平方向'
      ],
      answer: 1,
      explain: '取人参考系，雨相对人的速度 = 雨相对地 − 人相对地 = (0, −5) − (−3, 0) = (3, −5) m/s。雨滴在人看来向“东下”运动，因此迎面打来的是来自西侧上方的斜向雨。',
      hints: ['$\\vec{v}_{\\text{雨人}}$ = $\\vec{v}_{\\text{雨地}}$ − $\\vec{v}_{\\text{人地}}$。', '人向西走，所以人相对地的速度是负方向。'],
      commonError: '把“雨打来的方向”与“雨相对人的运动方向”混为一谈（两者相反）。'
    },
    {
      id: 'q01-s07-03', chapter: 'ch01', section: 'ch01-s07', type: 'numeric', difficulty: 3,
      point: '渡河问题', tags: ['相对运动', '速度变换', '渡河'],
      stem: '河宽 60 m，水流速度 2 m/s（沿下游方向）。某人以相对水的速率 1.5 m/s 始终朝向正对岸游。求他到达对岸所需时间，单位 s。',
      answer: 40, tol: 0.05, unit: 's',
      explain: '横渡时间只由垂直于河岸的分速度决定：t = 河宽 / v⊥ = 60 / 1.5 = 40 s。水流只使他的落点被冲向下游（偏移 2×40 = 80 m），不改变过河时间。',
      hints: ['过河时间由哪个方向的速度决定？', '水流只把他冲向下游，不影响横渡速度。'],
      commonError: '用合速度去算过河时间，或把 60 m 换成沿合速度的路径长度。'
    }
  ];

  /* ------------------------------------------------------------ 实验目录 */
  PHYS.labs = [
  {
    "id": "lab-constant-accel",
    "title": "匀加速直线运动与三种图像联动",
    "chapter": "ch01",
    "sections": [
      "ch01-s03",
      "ch01-s04"
    ],
    "status": "available",
    "question": "已知初位置、初速度和加速度，4 s 后质点在哪里？三种图像是否互相一致？",
    "assumptions": [
      "质点沿一条直线（x 轴）运动",
      "加速度恒定，不随时间变化",
      "忽略空气阻力等外力细节",
      "x、v、a 均为沿 x 轴的分量，可取负值"
    ],
    "params": [
      {
        "key": "x0",
        "label": "初位置 x₀",
        "unit": "m",
        "min": -20,
        "max": 20,
        "step": 0.5,
        "value": 0
      },
      {
        "key": "v0",
        "label": "初速度 v₀",
        "unit": "m/s",
        "min": -10,
        "max": 10,
        "step": 0.5,
        "value": 2
      },
      {
        "key": "a",
        "label": "加速度 a",
        "unit": "m/s²",
        "min": -5,
        "max": 5,
        "step": 0.5,
        "value": 1.5
      }
    ],
    "duration": 5
  },
  {
    "id": "lab-collision",
    "title": "一维双车碰撞：动量与动能对比",
    "chapter": "ch03",
    "sections": [
      "ch03-s02",
      "ch03-s06"
    ],
    "status": "available",
    "question": "改变质量或从弹性切到粘连碰撞后，总动量与总动能各如何变化？",
    "assumptions": [
      "两车构成封闭系统，水平方向外力冲量为零。",
      "点车同轴运动，t=1 s 瞬时碰撞；图示分行只为区分车辆。",
      "弹性碰撞e=1，完全非弹性碰撞e=0；无额外能量释放。"
    ],
    "params": [
      "m1 / kg",
      "m2 / kg",
      "u1 / (m/s)",
      "u2 / (m/s)",
      "恢复系数e：0或1"
    ],
    "duration": 4
  },
  {
    "id": "lab-field-superposition",
    "title": "点电荷叠加：场强箭头与等势线",
    "chapter": "ch05",
    "sections": [
      "ch05-s01",
      "ch05-s02",
      "ch05-s06"
    ],
    "status": "available",
    "question": "调节两个电荷的位置和电量，在同一点比较电场矢量叠加与电势标量叠加。",
    "assumptions": [
      "真空中两个静止点电荷，可通过滑块放置。",
      "无限远电势为零；坐标单位m，电荷单位nC。",
      "电荷奇点周围隐藏小区域；箭头归一化长度只示方向。",
      "动画为探针沿y=0.7 m扫描，电荷本身不运动。"
    ],
    "params": [
      "q1 / nC",
      "q2 / nC",
      "x1 / m",
      "y1 / m",
      "x2 / m",
      "y2 / m"
    ],
    "duration": 8
  },
  {
    "id": "lab-shm",
    "title": "弹簧振子：位移、速度与能量联动",
    "chapter": "ch11",
    "sections": [
      "ch11-s01",
      "ch11-s03",
      "ch11-s04"
    ],
    "status": "available",
    "question": "保持质量和劲度系数不变，只改变振幅，周期是否改变？动能与势能之和是否恒定？",
    "assumptions": [
      "水平无摩擦，理想无质量线性弹簧，无驱动和阻尼。",
      "x相对平衡位置量起，向右为正，势能在x=0取零。",
      "初始位移为振幅A、初速度为零。"
    ],
    "params": [
      "m / kg",
      "k / (N/m)",
      "A / m"
    ],
    "duration": 12
  },
  {
    "id": "lab-double-slit",
    "title": "双缝干涉：波长与条纹间距",
    "chapter": "ch13",
    "sections": [
      "ch13-s01",
      "ch13-s02"
    ],
    "status": "available",
    "question": "将波长、屏距加倍或缝距加倍，相邻亮纹间距各变成原来的多少？",
    "assumptions": [
      "同频同相等强的理想窄缝，忽略单缝衍射包络。",
      "真空波长按nm输入、缝距按mm输入，计算转换为SI。",
      "远场小角度近似，固定显示屏幕中央±12 mm；归一化光强。",
      "动画只是探针扫描，条纹为静态时间平均强度。"
    ],
    "params": [
      "λ / nm",
      "d / mm",
      "D / m"
    ],
    "duration": 8
  }
];

  PHYS.exams = [
  {
    "id": "exam-ch01",
    "chapter": "ch01",
    "title": "第 01 章 章末测验",
    "questions": [
      "q01-s01-01",
      "q01-s02-02",
      "q01-s03-03",
      "q01-s04-01",
      "q01-s05-02",
      "q01-s06-03",
      "q01-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch02",
    "chapter": "ch02",
    "title": "第 02 章 章末测验",
    "questions": [
      "q02-s01-01",
      "q02-s02-02",
      "q02-s03-03",
      "q02-s04-01",
      "q02-s05-02",
      "q02-s06-03"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch03",
    "chapter": "ch03",
    "title": "第 03 章 章末测验",
    "questions": [
      "q03-s01-01",
      "q03-s02-02",
      "q03-s03-03",
      "q03-s04-01",
      "q03-s05-02",
      "q03-s06-03",
      "q03-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch04",
    "chapter": "ch04",
    "title": "第 04 章 章末测验",
    "questions": [
      "q04-s01-01",
      "q04-s02-02",
      "q04-s03-03",
      "q04-s04-01",
      "q04-s05-02",
      "q04-s06-03"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch05",
    "chapter": "ch05",
    "title": "第 05 章 章末测验",
    "questions": [
      "q05-s01-01",
      "q05-s02-02",
      "q05-s03-03",
      "q05-s04-01",
      "q05-s05-02",
      "q05-s06-03",
      "q05-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch06",
    "chapter": "ch06",
    "title": "第 06 章 章末测验",
    "questions": [
      "q06-s01-01",
      "q06-s02-02",
      "q06-s03-03",
      "q06-s04-01",
      "q06-s05-02",
      "q06-s06-03",
      "q06-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch07",
    "chapter": "ch07",
    "title": "第 07 章 章末测验",
    "questions": [
      "q07-s01-01",
      "q07-s02-02",
      "q07-s03-03",
      "q07-s04-01",
      "q07-s05-02",
      "q07-s06-03",
      "q07-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch08",
    "chapter": "ch08",
    "title": "第 08 章 章末测验",
    "questions": [
      "q08-s01-01",
      "q08-s02-02",
      "q08-s03-03",
      "q08-s04-01",
      "q08-s05-02",
      "q08-s06-03",
      "q08-s07-01",
      "q08-s08-02"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch09",
    "chapter": "ch09",
    "title": "第 09 章 章末测验",
    "questions": [
      "q09-s01-01",
      "q09-s02-02",
      "q09-s03-03",
      "q09-s04-01",
      "q09-s05-02",
      "q09-s06-03"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch10",
    "chapter": "ch10",
    "title": "第 10 章 章末测验",
    "questions": [
      "q10-s01-01",
      "q10-s02-02",
      "q10-s03-03",
      "q10-s04-01",
      "q10-s05-02",
      "q10-s06-03",
      "q10-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch11",
    "chapter": "ch11",
    "title": "第 11 章 章末测验",
    "questions": [
      "q11-s01-01",
      "q11-s02-02",
      "q11-s03-03",
      "q11-s04-01",
      "q11-s05-02",
      "q11-s06-03"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch12",
    "chapter": "ch12",
    "title": "第 12 章 章末测验",
    "questions": [
      "q12-s01-01",
      "q12-s02-02",
      "q12-s03-03",
      "q12-s04-01",
      "q12-s05-02",
      "q12-s06-03",
      "q12-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch13",
    "chapter": "ch13",
    "title": "第 13 章 章末测验",
    "questions": [
      "q13-s01-01",
      "q13-s02-02",
      "q13-s03-03",
      "q13-s04-01",
      "q13-s05-02",
      "q13-s06-03",
      "q13-s07-01"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch14",
    "chapter": "ch14",
    "title": "第 14 章 章末测验",
    "questions": [
      "q14-s01-01",
      "q14-s02-02",
      "q14-s03-03",
      "q14-s04-01",
      "q14-s05-02",
      "q14-s06-03"
    ],
    "duration": 0
  },
  {
    "id": "exam-ch15",
    "chapter": "ch15",
    "title": "第 15 章 章末测验",
    "questions": [
      "q15-s01-01",
      "q15-s02-02",
      "q15-s03-03",
      "q15-s04-01",
      "q15-s05-02",
      "q15-s06-03",
      "q15-s07-01",
      "q15-s08-02"
    ],
    "duration": 0
  }
];

  // 实验运行时与这些元数据一一对应。
  const labDetails = {
  "lab-collision": {
    "sections": [
      "ch03-s02",
      "ch03-s06"
    ],
    "duration": 4,
    "question": "改变质量或从弹性切到粘连碰撞后，总动量与总动能各如何变化？",
    "assumptions": [
      "两车构成封闭系统，水平方向外力冲量为零。",
      "点车同轴运动，t=1 s 瞬时碰撞；图示分行只为区分车辆。",
      "弹性碰撞e=1，完全非弹性碰撞e=0；无额外能量释放。"
    ],
    "params": [
      "m1 / kg",
      "m2 / kg",
      "u1 / (m/s)",
      "u2 / (m/s)",
      "恢复系数e：0或1"
    ]
  },
  "lab-shm": {
    "sections": [
      "ch11-s01",
      "ch11-s03",
      "ch11-s04"
    ],
    "duration": 12,
    "question": "保持质量和劲度系数不变，只改变振幅，周期是否改变？动能与势能之和是否恒定？",
    "assumptions": [
      "水平无摩擦，理想无质量线性弹簧，无驱动和阻尼。",
      "x相对平衡位置量起，向右为正，势能在x=0取零。",
      "初始位移为振幅A、初速度为零。"
    ],
    "params": [
      "m / kg",
      "k / (N/m)",
      "A / m"
    ]
  },
  "lab-double-slit": {
    "sections": [
      "ch13-s01",
      "ch13-s02"
    ],
    "duration": 8,
    "question": "将波长、屏距加倍或缝距加倍，相邻亮纹间距各变成原来的多少？",
    "assumptions": [
      "同频同相等强的理想窄缝，忽略单缝衍射包络。",
      "真空波长按nm输入、缝距按mm输入，计算转换为SI。",
      "远场小角度近似，固定显示屏幕中央±12 mm；归一化光强。",
      "动画只是探针扫描，条纹为静态时间平均强度。"
    ],
    "params": [
      "λ / nm",
      "d / mm",
      "D / m"
    ]
  },
  "lab-field-superposition": {
    "sections": [
      "ch05-s01",
      "ch05-s02",
      "ch05-s06"
    ],
    "duration": 8,
    "question": "调节两个电荷的位置和电量，在同一点比较电场矢量叠加与电势标量叠加。",
    "assumptions": [
      "真空中两个静止点电荷，可通过滑块放置。",
      "无限远电势为零；坐标单位m，电荷单位nC。",
      "电荷奇点周围隐藏小区域；箭头归一化长度只示方向。",
      "动画为探针沿y=0.7 m扫描，电荷本身不运动。"
    ],
    "params": [
      "q1 / nC",
      "q2 / nC",
      "x1 / m",
      "y1 / m",
      "x2 / m",
      "y2 / m"
    ]
  }
};
  PHYS.labs.forEach(l => { if (labDetails[l.id]) Object.assign(l, labDetails[l.id], { status: "available" }); });

  /* ------------------------------------------------- 内容注册（按章分文件） */

  // 正文：content/chNN.js 调用 PHYS.registerSection('ch02-s01', {...})
  PHYS.content = PHYS.content || { sections: {} };
  PHYS.registerSection = function (sectionId, data) {
    PHYS.content.sections[sectionId] = data;
  };

  // 题目：content/questions-chNN.js 调用 PHYS.registerQuestions([...])
  PHYS.registerQuestions = function (list) {
    if (!Array.isArray(list)) return;
    list.forEach(function (q) {
      if (!q || !q.id) return;
      const i = PHYS.questions.findIndex(function (x) { return x.id === q.id; });
      if (i >= 0) PHYS.questions[i] = q; else PHYS.questions.push(q);
    });
  };

  // 章节发布：content/chNN.js 末尾调用 PHYS.markChapterPublished('ch02')
  PHYS.markChapterPublished = function (chapterId) {
    const ch = PHYS.getChapter(chapterId);
    if (!ch) return;
    ch.status = 'published';
    ch.sections.forEach(function (s) { s.status = 'published'; });
  };

  /* ---------------------------------------------------------------- 工具 */
  PHYS.getChapter = function (id) {
    return PHYS.chapters.find(function (c) { return c.id === id; }) || null;
  };
  PHYS.getSection = function (id) {
    for (const c of PHYS.chapters) {
      const s = c.sections.find(function (x) { return x.id === id; });
      if (s) return Object.assign({}, s, { chapterId: c.id, chapterTitle: c.title });
    }
    return null;
  };
  PHYS.getModule = function (id) {
    return PHYS.modules.find(function (m) { return m.id === id; }) || null;
  };
  PHYS.getQuestion = function (id) {
    return PHYS.questions.find(function (q) { return q.id === id; }) || null;
  };
  PHYS.getFormula = function (id) {
    return PHYS.formulas.find(function (f) { return f.id === id; }) || null;
  };
  PHYS.publishedChapters = function () {
    return PHYS.chapters.filter(function (c) { return c.status === 'published'; });
  };
  // 已发布章节的完整小节顺序，供上一节/下一节使用
  PHYS.flatSections = function () {
    const out = [];
    PHYS.chapters.forEach(function (c) {
      if (c.status !== 'published') return;
      c.sections.forEach(function (s) { out.push(Object.assign({}, s, { chapterId: c.id, chapterTitle: c.title })); });
    });
    return out;
  };
  PHYS.labForSection = function (sectionId) {
    return PHYS.labs.find(function (l) { return l.status === 'available' && l.sections.indexOf(sectionId) >= 0; }) || null;
  };
})(typeof window !== 'undefined' ? window : globalThis);
