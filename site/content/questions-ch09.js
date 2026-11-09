/* content/questions-ch09.js —— 第 09 章 气体动理论 题目 */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  if (!PHYS || !PHYS.registerQuestions) return;

  PHYS.registerQuestions([
    /* ---------------------------------------------- 9.1 微观模型与状态方程 */
    {
      id: 'q09-s01-01', chapter: 'ch09', section: 'ch09-s01', type: 'single', difficulty: 1,
      point: '理想气体模型', tags: ['理想气体模型', '状态方程'],
      stem: '理想气体的微观模型不包含下列哪一条假设？',
      options: [
        '分子本身的线度远小于分子间的平均距离',
        '除碰撞瞬间外，分子之间没有相互作用力',
        '分子之间的碰撞是完全弹性碰撞',
        '所有分子的速率都相同'
      ],
      answer: 3,
      explain: '理想气体模型假设分子做无规则热运动，速率服从麦克斯韦分布，速率有大有小（从零到很大的都有可能），只是**分布**由温度决定。如果所有分子速率相同，气体就不会有压强与温度的统计规律。',
      hints: ['想想“热运动”这个词意味着所有分子整齐划一吗？', '麦克斯韦速率分布是一个分布还是一条竖线？'],
      commonError: '把“分子间无作用力”与“分子速率相同”混为一谈。'
    },
    {
      id: 'q09-s01-02', chapter: 'ch09', section: 'ch09-s01', type: 'single', difficulty: 2,
      point: '状态方程', tags: ['状态方程', '气体常量'],
      stem: '关于理想气体状态方程 $pV=nRT$，下列说法正确的是：',
      options: [
        '同温同压下，体积相同的任何气体所含的分子数相同',
        '同温同压下，体积相同的任何气体质量相同',
        '气体的压强只由温度决定，与体积无关',
        '式中的 $n$ 表示气体的质量'
      ],
      answer: 0,
      explain: '由 $pV=nRT$ 可知，同温同压下 $V$ 相同则 $n$ 相同，即物质的量相同，因而分子数 $N=nN_A$ 相同（阿伏伽德罗定律）。质量还要乘摩尔质量，不同气体质量不同。$n$ 是物质的量，不是质量。',
      hints: ['把 $n$ 解出来：$n = pV/(RT)$，右边与气体种类有关吗？', '$n$ 与 $m$ 差一个摩尔质量。'],
      commonError: '把“分子数相同”说成“质量相同”，忽略了不同气体摩尔质量不同。'
    },
    {
      id: 'q09-s01-03', chapter: 'ch09', section: 'ch09-s01', type: 'numeric', difficulty: 2,
      point: '分子数密度', tags: ['分子数密度', '状态方程'],
      stem: '某容器内理想气体压强 $p = 1.0\\times10^5\\ \\text{Pa}$，温度 $T = 300\\ \\text{K}$。求分子数密度 $n$，单位 $\\text{m}^{-3}$。（$k_B = 1.38\\times10^{-23}\\ \\text{J/K}$，结果用科学计数法，保留两位有效数字，可写作如 2.4e25）',
      answer: 2.4e25, tol: 0.1e25, unit: 'm^-3',
      explain: '由 $p=nk_BT$ 得 $n=p/(k_BT)=1.0\\times10^{5}/(1.38\\times10^{-23}\\times300)=1.0\\times10^{5}/(4.14\\times10^{-21})\\approx2.4\\times10^{25}\\ \\text{m}^{-3}$。',
      hints: ['用 $p=nk_BT$，注意这里的 $n$ 是分子数密度，不是物质的量。', '分子数密度与物质的量密度的区别是乘以 $N_A$。'],
      commonError: '把 $p=nk_BT$ 里的 $n$ 当成物质的量 $\\text{mol/m}^3$。'
    },

    /* ------------------------------------------------ 9.2 压强的微观解释 */
    {
      id: 'q09-s02-01', chapter: 'ch09', section: 'ch09-s02', type: 'single', difficulty: 2,
      point: '压强微观本质', tags: ['压强', '微观解释'],
      stem: '从微观上看，气体压强来源于：',
      options: [
        '分子之间的相互排斥力',
        '大量分子对器壁的频繁碰撞，每次碰撞都给器壁传递冲量',
        '分子受到的重力',
        '分子在器壁附近的聚集'
      ],
      answer: 1,
      explain: '压强是大量分子持续碰撞器壁、在单位时间内向单位面积传递的冲量。单个分子的碰撞是随机的，但大量分子的统计平均效果表现为稳定压强。分子之间的排斥力在理想气体模型中已被忽略。',
      hints: ['一次碰撞传递的冲量是 $\\Delta p=2mv_x$，那么单位时间单位面积上呢？', '压强是“宏观稳定”的量，还是单次事件？'],
      commonError: '以为压强来自分子间的排斥力；实际上理想气体中分子间无作用力。'
    },
    {
      id: 'q09-s02-02', chapter: 'ch09', section: 'ch09-s02', type: 'single', difficulty: 3,
      point: '压强与速率', tags: ['压强', '方均根速率'],
      stem: '若容器中气体的温度保持不变、分子数密度加倍，则气体的压强：',
      options: ['减半', '不变', '加倍', '变为原来的四倍'],
      answer: 2,
      explain: '由 $p=nk_BT$（或 $p=\\frac13 nm\\overline{v^2}$），温度不变则平均平动动能不变、每个分子贡献的冲量不变；数密度加倍意味着单位面积上的碰撞次数加倍，故压强加倍。',
      hints: ['压强与分子数密度成正比还是平方成正比？', '温度不变说明什么量不变？'],
      commonError: '把 $p\\propto n\\overline{v^2}$ 中的 $\\overline{v^2}$ 也随 $n$ 变化，导致误判为四倍。'
    },
    {
      id: 'q09-s02-03', chapter: 'ch09', section: 'ch09-s02', type: 'numeric', difficulty: 3,
      point: '单分子碰撞', tags: ['冲量', '碰撞频率'],
      stem: '一个质量为 $5.0\\times10^{-26}\\ \\text{kg}$ 的分子以 $v_x = 400\\ \\text{m/s}$ 垂直撞击器壁并弹性反弹（速率不变）。求这一对器壁的冲量大小，单位 $\\text{N}\\cdot\\text{s}$。（结果用科学计数法，如 4.0e-23）',
      answer: 4.0e-23, tol: 0.05e-23, unit: 'N·s',
      explain: '碰撞前动量分量 $p_x=mv_x$，弹性反弹后变为 $-mv_x$，动量变化 $-2mv_x$，故对器壁的冲量大小为 $2mv_x=2\\times5.0\\times10^{-26}\\times400=4.0\\times10^{-23}\\ \\text{N}\\cdot\\text{s}$。',
      hints: ['弹性反弹意味着速度从 $+v_x$ 变为 $-v_x$。', '冲量大小等于动量的变化量大小，别忘了因子 2。'],
      commonError: '只算 $mv_x$ 而漏掉因子 2，把反弹当成“停住”。'
    },

    /* ------------------------------------------- 9.3 温度与平均平动动能 */
    {
      id: 'q09-s03-01', chapter: 'ch09', section: 'ch09-s03', type: 'single', difficulty: 2,
      point: '温度的微观意义', tags: ['温度', '平均平动动能'],
      stem: '关于 $\\bar\\varepsilon_k = \\frac32 k_BT$，下列说法正确的是：',
      options: [
        '它表示气体中每个分子的动能都等于 $\\frac32k_BT$',
        '它表示气体分子的平均平动动能，且只对平动成立',
        '它表示气体分子的平均总动能，已包含转动动能',
        '温度越高，每个分子的速率都越大'
      ],
      answer: 1,
      explain: '该式给出的是**平均平动**动能，只包含三个平动自由度。转动、振动自由度另有贡献，见 9.4 节的能量均分定理。温度升高只使**分布**整体向高速移动，并不保证每个分子都变快。',
      hints: ['“平动”两个字限定了什么？', '温度是统计量，能对单个分子下断言吗？'],
      commonError: '把平均量当成每个分子的确定值；或把平动动能当成总动能。'
    },
    {
      id: 'q09-s03-02', chapter: 'ch09', section: 'ch09-s03', type: 'single', difficulty: 3,
      point: '不同气体的比较', tags: ['方均根速率', '摩尔质量'],
      stem: '同温同压下，氢气（$M=2\\ \\text{g/mol}$）与氧气（$M=32\\ \\text{g/mol}$）的比较，正确的是：',
      options: [
        '两者的分子平均平动动能相同，氢气的方均根速率更大',
        '两者的方均根速率相同',
        '氢气的分子平均平动动能更大',
        '氧气的方均根速率更大'
      ],
      answer: 0,
      explain: '平均平动动能只由温度决定，同温下两者相同。方均根速率 $v_{\\text{rms}}=\\sqrt{3RT/M}$，与 $\\sqrt{M}$ 成反比，氢气摩尔质量小，故其方均根速率约为氧气的 $\\sqrt{16}=4$ 倍。',
      hints: ['$\\bar\\varepsilon_k=\\frac32k_BT$ 里有没有气体的种类？', '$v_{\\text{rms}}\\propto 1/\\sqrt{M}$。'],
      commonError: '认为“重的分子动能大”，忽略了同温下平均平动动能相等。'
    },
    {
      id: 'q09-s03-03', chapter: 'ch09', section: 'ch09-s03', type: 'numeric', difficulty: 2,
      point: '方均根速率', tags: ['方均根速率', '温度'],
      stem: '求 $T = 300\\ \\text{K}$ 时氮气（$M = 28\\ \\text{g/mol}$）的方均根速率，单位 $\\text{m/s}$。（$R = 8.31\\ \\text{J/(mol}\\cdot\\text{K)}$，保留到整数）',
      answer: 517, tol: 3, unit: 'm/s',
      explain: '$v_{\\text{rms}}=\\sqrt{3RT/M}=\\sqrt{3\\times8.31\\times300/0.028}=\\sqrt{7479/0.028}=\\sqrt{2.671\\times10^{5}}\\approx517\\ \\text{m/s}$。',
      hints: ['公式 $v_{\\text{rms}}=\\sqrt{3RT/M}$。', '摩尔质量要换算成 kg/mol：28 g/mol = 0.028 kg/mol。'],
      commonError: '忘记把 g/mol 换成 kg/mol，导致结果大了约 5.3 倍。'
    },

    /* --------------------------------------------- 9.4 自由度与内能 */
    {
      id: 'q09-s04-01', chapter: 'ch09', section: 'ch09-s04', type: 'single', difficulty: 2,
      point: '自由度', tags: ['自由度', '能量均分'],
      stem: '刚性双原子分子的自由度数目是：',
      options: ['3', '5', '6', '7'],
      answer: 1,
      explain: '刚性双原子分子有 3 个平动自由度（质心在三个方向）和 2 个转动自由度（绕两个垂直于分子轴的方向转动），共 $i=5$。沿分子轴方向的转动惯量极小，可忽略，所以不是 6。',
      hints: ['先数质心的平动，再数绕轴的转动。', '“刚性”意味着不考虑振动自由度。'],
      commonError: '把刚性双原子当成 6 个自由度，多算了绕分子轴的自转。'
    },
    {
      id: 'q09-s04-02', chapter: 'ch09', section: 'ch09-s04', type: 'single', difficulty: 3,
      point: '内能', tags: ['内能', '理想气体'],
      stem: '一定量的理想气体，温度保持不变而体积增大，则其内能：',
      options: ['增大', '减小', '不变', '无法判断'],
      answer: 2,
      explain: '理想气体内能 $U=\\frac{i}{2}\\nu RT$，只与温度和物质的量有关，与体积、压强无关。等温过程中 $T$ 不变，故 $U$ 不变。体积增大时压强相应减小，但内能不随之变化。',
      hints: ['写出 $U$ 的表达式，看它含有哪些量。', '理想气体分子间无势能，所以内能只是动能之和。'],
      commonError: '把“体积变大”与“内能变多”联系起来，这是把气体当成有分子间势能的真实气体了。'
    },
    {
      id: 'q09-s04-03', chapter: 'ch09', section: 'ch09-s04', type: 'numeric', difficulty: 3,
      point: '气体内能', tags: ['内能', '自由度'],
      stem: '刚性双原子理想气体 $\\nu = 2.0\\ \\text{mol}$，温度 $T = 300\\ \\text{K}$。求其内能，单位 $\\text{J}$。（$R=8.31\\ \\text{J/(mol}\\cdot\\text{K)}$，保留到整数）',
      answer: 12465, tol: 20, unit: 'J',
      explain: '$i=5$，故 $U=\\frac{i}{2}\\nu RT=\\frac52\\times2.0\\times8.31\\times300=5\\times2493=12465\\ \\text{J}$。',
      hints: ['刚性双原子 $i=5$。', '$U=\\frac{i}{2}\\nu RT$。'],
      commonError: '用 $i=3$（单原子）代入，得到的结果偏小。'
    },

    /* ------------------------------------------- 9.5 麦克斯韦速率分布 */
    {
      id: 'q09-s05-01', chapter: 'ch09', section: 'ch09-s05', type: 'single', difficulty: 2,
      point: '分布函数', tags: ['速率分布', '概率密度'],
      stem: '关于麦克斯韦速率分布函数 $f(v)$，下列说法正确的是：',
      options: [
        '$f(v)$ 表示速率为 $v$ 的分子数',
        '$f(v)\\Delta v$ 表示速率在 $v$ 附近、区间宽度为 $\\Delta v$ 内的分子数占总数的比例',
        '$f(v)$ 的最大值对应的速率是平均速率',
        '$f(v)$ 与气体种类无关，只与温度有关'
      ],
      answer: 1,
      explain: '$f(v)$ 是概率密度，本身不是分子数，$f(v)\\,dv$ 才是落在该速率区间的概率（所占比例）。$f(v)$ 的极大值对应**最概然速率**，不是平均速率。$f(v)$ 中同时含 $T$ 与 $m$，与气体种类有关。',
      hints: ['概率密度函数的含义：曲线下的面积才有意义。', '极大值点叫最概然速率。'],
      commonError: '把 $f(v)$ 当作“速率为 $v$ 的分子数”，忽略了它是密度函数。'
    },
    {
      id: 'q09-s05-02', chapter: 'ch09', section: 'ch09-s05', type: 'single', difficulty: 3,
      point: '三种速率', tags: ['最概然速率', '平均速率', '方均根速率'],
      stem: '同一种气体中，最概然速率 $v_p$、平均速率 $\\bar v$ 与方均根速率 $v_{\\text{rms}}$ 的大小关系是：',
      options: [
        '$v_p < \\bar v < v_{\\text{rms}}$',
        '$v_p > \\bar v > v_{\\text{rms}}$',
        '$v_p = \\bar v = v_{\\text{rms}}$',
        '$\\bar v < v_p < v_{\\text{rms}}$'
      ],
      answer: 0,
      explain: '三者的比例约为 $1:1.128:1.225$。直观原因是分布向右拖出长尾：少数高速分子把平均值和方均根值都拉大，而方均根对高速分子按平方加权，拉得更多，因此 $v_p<\\bar v<v_{\\text{rms}}$。',
      hints: ['分布曲线右侧的“长尾”会怎样影响平均值与平方平均值？', '记住比例 $1:1.128:1.225$。'],
      commonError: '凭“最概然”的语感以为它最大；实际上“最可能出现的速率”不等于“平均下来最大的速率”。'
    },
    {
      id: 'q09-s05-03', chapter: 'ch09', section: 'ch09-s05', type: 'numeric', difficulty: 3,
      point: '最概然速率', tags: ['最概然速率', '温度'],
      stem: '某气体在 $T = 300\\ \\text{K}$ 时的最概然速率为 $395\\ \\text{m/s}$。求 $T = 600\\ \\text{K}$ 时的最概然速率，单位 $\\text{m/s}$。（保留到整数）',
      answer: 559, tol: 4, unit: 'm/s',
      explain: '$v_p=\\sqrt{2RT/M}\\propto\\sqrt{T}$。温度加倍，$v_p$ 变为原来的 $\\sqrt2$ 倍：$395\\times\\sqrt2\\approx395\\times1.414\\approx559\\ \\text{m/s}$。',
      hints: ['$v_p\\propto\\sqrt{T}$，与 $T$ 成正比还是与 $\\sqrt T$ 成正比？', '不需要知道气体种类，用比例即可。'],
      commonError: '把温度加倍当成速率也加倍，忽略了平方根关系。'
    },

    /* ------------------------------------- 9.6 碰撞、自由程与输运现象 */
    {
      id: 'q09-s06-01', chapter: 'ch09', section: 'ch09-s06', type: 'single', difficulty: 2,
      point: '平均自由程', tags: ['平均自由程', '碰撞'],
      stem: '温度不变而压强减半（仍为理想气体），则分子的平均自由程：',
      options: ['减半', '不变', '加倍', '变为四倍'],
      answer: 2,
      explain: '$\\bar\\lambda=k_BT/(\\sqrt2\\pi d^2p)$，与压强成反比。温度不变时压强减半意味着分子数密度减半，分子间距变大，平均自由程加倍。碰撞频率则减半。',
      hints: ['写出 $\\bar\\lambda$ 与 $p$ 的关系。', '压强减半时分子是变稀还是变密？'],
      commonError: '把压强降低误认为碰撞更频繁，方向搞反。'
    },
    {
      id: 'q09-s06-02', chapter: 'ch09', section: 'ch09-s06', type: 'single', difficulty: 3,
      point: '碰撞频率', tags: ['碰撞频率', '自由程'],
      stem: '关于平均自由程 $\\bar\\lambda$ 与平均碰撞频率 $\\bar Z$，下列关系正确的是：',
      options: [
        '$\\bar Z = \\bar v\\,\\bar\\lambda$',
        '$\\bar\\lambda = \\bar v\\,\\bar Z$',
        '$\\bar Z = \\bar v/\\bar\\lambda$',
        '$\\bar Z$ 与 $\\bar v$ 无关'
      ],
      answer: 2,
      explain: '分子在单位时间内平均走过 $\\bar v$ 的路程，其间发生 $\\bar Z$ 次碰撞，平均每两次碰撞之间走 $\\bar\\lambda$，所以 $\\bar\\lambda=\\bar v/\\bar Z$，即 $\\bar Z=\\bar v/\\bar\\lambda$。速率越大、自由程越短，碰撞越频繁。',
      hints: ['想清楚“单位时间内走过多少段自由程”。', '量纲检查可以把选项排除掉。'],
      commonError: '把 $\\bar\\lambda$ 与 $\\bar Z$ 相乘，量纲上得到 $\\text{m}^2/\\text{s}$，不是频率。'
    },
    {
      id: 'q09-s06-03', chapter: 'ch09', section: 'ch09-s06', type: 'numeric', difficulty: 3,
      point: '平均自由程计算', tags: ['平均自由程', '标准状态'],
      stem: '标准状态下（$p=1.01\\times10^5\\ \\text{Pa}$，$T=273\\ \\text{K}$）某气体分子的有效直径为 $d=3.0\\times10^{-10}\\ \\text{m}$。求平均自由程，单位 $\\text{m}$。（$k_B=1.38\\times10^{-23}\\ \\text{J/K}$，结果用科学计数法，如 7.0e-8）',
      answer: 9.33e-8, tol: 0.15e-8, unit: 'm',
      explain: '$\\bar\\lambda=\\dfrac{k_BT}{\\sqrt2\\pi d^2p}=\\dfrac{1.38\\times10^{-23}\\times273}{1.414\\times3.1416\\times(3.0\\times10^{-10})^2\\times1.01\\times10^{5}}$。分子 $=3.77\\times10^{-21}$；分母 $=1.414\\times3.1416\\times9.0\\times10^{-20}\\times1.01\\times10^{5}\\approx4.04\\times10^{-14}$ 逐项算：$\\sqrt2\\pi d^2=1.414\\times3.1416\\times9.0\\times10^{-20}\\approx4.00\\times10^{-19}\\ \\text{m}^2$，乘 $p$ 得 $4.04\\times10^{-14}$，故 $\\bar\\lambda\\approx3.77\\times10^{-21}/(4.04\\times10^{-14})\\approx9.3\\times10^{-8}\\ \\text{m}$。',
      hints: ['公式 $\\bar\\lambda=k_BT/(\\sqrt2\\pi d^2p)$。', '别忘了分母里的 $\\sqrt2$。'],
      commonError: '漏掉 $\\sqrt2$ 因子，结果偏大约 41%。',
      note: '按 $d=3.0\\times10^{-10}\\ \\text{m}$ 计算，结果约 $9\\times10^{-8}\\ \\text{m}$，与空气在标准状态下的实测值同量级（约 $7\\times10^{-8}\\ \\text{m}$）。'
    }
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
