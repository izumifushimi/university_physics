/* content/questions-ch11.js —— 第 11 章 振动（练习）
   每节 3 题：2 道单选 + 1 道数值。 */
(function (global) {
  'use strict';
  const PHYS = global.PHYS;
  if (!PHYS || !PHYS.registerQuestions) return;

  PHYS.registerQuestions([

    /* ------------------------------------------------------------- 11.1 */
    {
      id: 'q11-s01-01', chapter: 'ch11', section: 'ch11-s01', type: 'single', difficulty: 2,
      point: '简谐振动的判据', tags: ['简谐振动', '回复力'],
      stem: '关于简谐振动的判据，下列说法正确的是：',
      options: [
        '只要物体受到的合力大小与位移成正比，物体就做简谐振动',
        '物体所受合力可写成 $F = -kx$（$k>0$，$x$ 相对平衡位置量起）时，物体做简谐振动',
        '物体运动轨迹是正弦曲线时，它一定做简谐振动',
        '只要振幅足够小，任何振动都可以看作简谐振动'
      ],
      answer: 1,
      explain: '判据要求“与位移成正比”同时“方向相反”，前半句缺少负号（A 错）。轨迹是正弦曲线只是运动学的现象，不能保证合力满足 $F=-kx$（C 错）。并非“小振幅即简谐”：单摆要小振幅，是因为小角近似把 $\\sin\\theta$ 化为 $\\theta$；而回复力本来就不正比于位移的系统，振幅再小也不会变成简谐（D 错）。',
      hints: ['判据里两个要素：正比、反向，缺一不可。', '$x$ 必须相对平衡位置量起——这一点比公式本身更容易出错。'],
      commonError: '只记住“正比于位移”而漏掉负号；或把“小振幅”当作简谐的普遍条件。'
    },
    {
      id: 'q11-s01-02', chapter: 'ch11', section: 'ch11-s01', type: 'single', difficulty: 3,
      point: '由初始条件定初相', tags: ['初相', '初始条件', '相位'],
      stem: '一简谐振动的振幅为 $A$。$t = 0$ 时物体位于 $x_0 = -A/2$，且正沿 $+x$ 方向运动。采用余弦形式 $x=A\\cos(\\omega t+\\varphi)$，它的初相为：',
      options: [
        '$\\varphi = \\pi/3$',
        '$\\varphi = 2\\pi/3$',
        '$\\varphi = 4\\pi/3$',
        '$\\varphi = 5\\pi/3$'
      ],
      answer: 2,
      explain: '由 $x_0 = A\\cos\\varphi = -A/2$ 得 $\\cos\\varphi = -1/2$，故 $\\varphi = 2\\pi/3$ 或 $4\\pi/3$。再由 $v_0 = -A\\omega\\sin\\varphi > 0$ 得 $\\sin\\varphi < 0$，排除 $2\\pi/3$，故 $\\varphi = 4\\pi/3$。',
      hints: ['先用位置定 $\\cos\\varphi$，再用速度方向定 $\\sin\\varphi$ 的符号。', '$v_0 = -A\\omega\\sin\\varphi$，别忘了那个负号。'],
      commonError: '只解 $\\cos\\varphi = -1/2$ 就得 $2\\pi/3$（这是向负方向运动的那一支），漏掉象限判断。'
    },
    {
      id: 'q11-s01-03', chapter: 'ch11', section: 'ch11-s01', type: 'numeric', difficulty: 2,
      point: '由初始条件求振幅', tags: ['振幅', '初始条件'],
      stem: '一简谐振动的角频率为 $\\omega = 10\\ \\text{rad/s}$，平衡位置在原点。$t = 0$ 时物体位于 $x_0 = 0.030\\ \\text{m}$ 处，速度 $v_0 = 0.40\\ \\text{m/s}$。求振幅，单位 m。',
      answer: 0.05, tol: 0.001, unit: 'm',
      explain: '$A = \\sqrt{x_0^2 + (v_0/\\omega)^2} = \\sqrt{0.030^2 + 0.040^2} = \\sqrt{9\\times10^{-4} + 16\\times10^{-4}} = \\sqrt{2.5\\times10^{-3}} = 0.050\\ \\text{m}$。',
      hints: ['$t=0$ 时 $x_0 = A\\cos\\varphi$，$v_0 = -A\\omega\\sin\\varphi$。', '把两式平方相加消去 $\\varphi$。'],
      commonError: '直接把 $x_0$ 当作振幅；或漏除 $\\omega$，把 $v_0$ 与 $x_0$ 直接相加。'
    },

    /* ------------------------------------------------------------- 11.2 */
    {
      id: 'q11-s02-01', chapter: 'ch11', section: 'ch11-s02', type: 'single', difficulty: 2,
      point: '位移、速度、加速度的相位关系', tags: ['相位', '相位差'],
      stem: '一物体做简谐振动，位移为 $x = A\\cos(\\omega t + \\varphi)$。关于它的速度与加速度的相位，正确的是：',
      options: [
        '速度与位移同相，加速度与位移反相',
        '速度相位比位移超前 $\\pi/2$，加速度相位比位移超前 $\\pi$',
        '速度相位比位移落后 $\\pi/2$，加速度相位比位移落后 $\\pi$',
        '速度相位比位移超前 $\\pi$，加速度比位移超前 $\\pi/2$'
      ],
      answer: 1,
      explain: '由 $v = -A\\omega\\sin(\\omega t+\\varphi) = A\\omega\\cos(\\omega t+\\varphi+\\pi/2)$，速度相位比位移超前 $\\pi/2$；由 $a = -A\\omega^2\\cos(\\omega t+\\varphi) = A\\omega^2\\cos(\\omega t+\\varphi+\\pi)$，加速度相位超前 $\\pi$，即与位移反相。',
      hints: ['把 $-\\sin\\theta$ 写成 $\\cos(\\theta+\\pi/2)$，把 $-\\cos\\theta$ 写成 $\\cos(\\theta+\\pi)$。', '也可以用一个具体时刻验证：位移取正最大时速度为零、加速度取负最大。'],
      commonError: '把“超前”与“落后”的方向弄反，或误以为速度与位移同时达到最大。'
    },
    {
      id: 'q11-s02-02', chapter: 'ch11', section: 'ch11-s02', type: 'single', difficulty: 3,
      point: '相位与状态', tags: ['相位', '状态判断'],
      stem: '某简谐振动的周期为 $T$。下列说法正确的是：',
      options: [
        '经过 $T/4$，物体的位移一定变为零',
        '经过 $T/2$，物体的位移与速度都变为原来的相反数',
        '相位每增加 $\\pi/4$，物体所走的路程一定是 $A/2$',
        '经过 $T/2$，物体的位移不变而速度反向'
      ],
      answer: 1,
      explain: '相位增加 $\\pi$ 时，$\\cos(\\theta+\\pi) = -\\cos\\theta$、$\\sin(\\theta+\\pi) = -\\sin\\theta$，故位移与速度都取相反数，B 正确、D 错误。$T/4$ 只对应相位增加 $\\pi/2$，位移变为零仅当出发点在最大位移处（A 错）。相位等间隔增加并不对应等间隔的路程（C 错）。',
      hints: ['把“经过 $T/2$”翻译成“相位增加 $\\pi$”，再套三角函数的诱导公式。', '相位均匀变化时，位移按余弦变化，路程并不均匀。'],
      commonError: '把“四分之一周期”机械地等同于“从最大位移到平衡位置”，忽略了初相的影响。'
    },
    {
      id: 'q11-s02-03', chapter: 'ch11', section: 'ch11-s02', type: 'numeric', difficulty: 3,
      point: '由相位求时间', tags: ['相位', '时间换算'],
      stem: '一简谐振动的方程为 $x = 0.10\\cos(4\\pi t + \\pi/3)$（SI 单位）。求从 $t = 0$ 起在 $t>0$ 后第一次再次到达 $x = +0.050\\ \\text{m}$ 的时刻，单位 s。',
      answer: 0.333, tol: 0.005, unit: 's',
      explain: '令 $\\cos\\Phi = 0.050/0.10 = 0.50$，得 $\\Phi = \\pi/3$ 或 $5\\pi/3$。$t=0$ 时 $\\Phi = \\pi/3$，物体正沿 $-x$ 方向运动，要到下一次同一位移必须取 $\\Phi = 5\\pi/3$。于是 $4\\pi t = 5\\pi/3 - \\pi/3 = 4\\pi/3$，$t = 1/3\\ \\text{s} \\approx 0.333\\ \\text{s}$。',
      hints: ['先算 $t = 0$ 时的相位：$\\Phi_0 = \\pi/3$。', '$x = +A/2$ 对应两个相位，取大于 $\\Phi_0$ 的那个。'],
      commonError: '直接令 $4\\pi t + \\pi/3 = \\pi/3$ 得 $t = 0$，把出发时刻当成了答案。'
    },

    /* ------------------------------------------------------------- 11.3 */
    {
      id: 'q11-s03-01', chapter: 'ch11', section: 'ch11-s03', type: 'single', difficulty: 2,
      point: '竖直弹簧振子', tags: ['弹簧振子', '周期'],
      stem: '一弹簧振子水平放置时周期为 $T_0$（不计摩擦）。若把同一根弹簧竖直悬挂，挂上同一物块让它上下振动，周期变为 $T$。则：',
      options: [
        '$T > T_0$，因为物块还受重力',
        '$T < T_0$，因为重力帮助它回到平衡位置',
        '$T = T_0$，重力只改变平衡位置，不改变回复系数',
        '条件不足，取决于振幅大小'
      ],
      answer: 2,
      explain: '竖直悬挂时，以弹簧原长位置为原点合力为 $F = -k(x+x_0)+mg$，而平衡条件 $kx_0 = mg$ 使常数项抵消，得 $F = -kx$。回复系数仍是 $k$，故 $\\omega = \\sqrt{k/m}$ 不变，$T = 2\\pi\\sqrt{m/k} = T_0$。',
      hints: ['先写出悬挂后的平衡条件 $kx_0 = mg$。', '把合力中的常数项与重力对照，看看是否抵消。'],
      commonError: '认为“多了重力，周期一定会变”；或者误以为振幅会改变周期。'
    },
    {
      id: 'q11-s03-02', chapter: 'ch11', section: 'ch11-s03', type: 'single', difficulty: 2,
      point: '单摆的小振幅条件', tags: ['单摆', '小角近似'],
      stem: '关于单摆，下列说法正确的是：',
      options: [
        '单摆在任何摆角下都做简谐振动，周期都是 $2\\pi\\sqrt{l/g}$',
        '单摆的周期与摆球质量有关，质量越大周期越长',
        '只有在摆角远小于 $1\\ \\text{rad}$ 时单摆才近似做简谐振动；摆角增大时周期会变长',
        '单摆的周期与摆长的平方成正比'
      ],
      answer: 2,
      explain: '单摆的切向方程含 $\\sin\\theta$，只有在 $\\theta\\ll1\\ \\text{rad}$ 时用 $\\sin\\theta\\approx\\theta$ 才能化为简谐形式。摆角越大，周期按 $T = T_0(1+\\theta_0^2/16+\\cdots)$ 变长（$30^\\circ$ 时约长 $1.7\\%$）。周期与质量无关，与 $\\sqrt l$ 成正比而非 $l^2$。',
      hints: ['从 $ml\\,d^2\\theta/dt^2 = -mg\\sin\\theta$ 出发，看看哪一步用了近似。', '小角近似的误差随 $\\theta_0^2$ 增长，所以摆角越大周期越长。'],
      commonError: '把 $\\sin\\theta\\approx\\theta$ 当作恒等式，忽略了它的适用条件。'
    },
    {
      id: 'q11-s03-03', chapter: 'ch11', section: 'ch11-s03', type: 'numeric', difficulty: 2,
      point: '单摆周期反求摆长', tags: ['单摆', '周期', '摆长'],
      stem: '要使单摆的周期恰好为 $2.00\\ \\text{s}$（取 $g = 9.80\\ \\text{m/s}^2$，摆角很小），摆长应为多少？单位 m。',
      answer: 0.993, tol: 0.005, unit: 'm',
      explain: '由 $T = 2\\pi\\sqrt{l/g}$ 得 $l = gT^2/(4\\pi^2) = 9.80\\times4.00/39.48 = 0.993\\ \\text{m}$。',
      hints: ['先平方去掉根号：$T^2 = 4\\pi^2l/g$。', '$4\\pi^2 \\approx 39.5$，代入即可。'],
      commonError: '忘记把 $T$ 平方；或把 $2\\pi$ 与 $\\pi$ 混淆导致差 4 倍。'
    },

    /* ------------------------------------------------------------- 11.4 */
    {
      id: 'q11-s04-01', chapter: 'ch11', section: 'ch11-s04', type: 'single', difficulty: 2,
      point: '简谐振动的总能量', tags: ['能量', '振幅'],
      stem: '一弹簧振子的振幅为 $A$，总机械能为 $E$。若把振幅改为 $2A$，其他条件不变，则总能量与最大动能分别为：',
      options: [
        '$2E$，$2E$',
        '$4E$，$4E$',
        '$4E$，$2E$',
        '$2E$，$4E$'
      ],
      answer: 1,
      explain: '$E = \\tfrac12kA^2 \\propto A^2$，振幅加倍则能量变 4 倍，为 $4E$。最大动能出现在平衡位置，此时势能为零，故 $E_{k,\\max} = E_{\\text{总}} = 4E$。',
      hints: ['总能量与振幅的几次方成正比？', '在平衡位置，势能是多少？'],
      commonError: '认为能量与振幅成正比；或忘记最大动能等于总能量。'
    },
    {
      id: 'q11-s04-02', chapter: 'ch11', section: 'ch11-s04', type: 'single', difficulty: 3,
      point: '动能与势能的分配', tags: ['能量分配', '势能'],
      stem: '一简谐振子位于 $x = A/2$ 处。此时它的动能与总能量之比、以及动能与势能之比分别是：',
      options: [
        '$1/2$ 与 $1:1$',
        '$3/4$ 与 $3:1$',
        '$3/4$ 与 $1:3$',
        '$1/4$ 与 $1:3$'
      ],
      answer: 1,
      explain: '$E_p = \\tfrac12kx^2 = \\tfrac12k(A/2)^2 = \\tfrac14\\cdot\\tfrac12kA^2 = E/4$，故 $E_k = 3E/4$，$E_k/E = 3/4$，$E_k:E_p = 3:1$。',
      hints: ['先算 $E_p = \\tfrac12kx^2$ 占总能量 $\\tfrac12kA^2$ 的比例。', '比例是 $(x/A)^2$，与 $k$、$A$ 的具体数值无关。'],
      commonError: '把 $x = A/2$ 时势能占总能量的 $1/2$——那是 $x = A/\\sqrt2$ 的情形。'
    },
    {
      id: 'q11-s04-03', chapter: 'ch11', section: 'ch11-s04', type: 'numeric', difficulty: 2,
      point: '由能量求速率', tags: ['能量守恒', '速率'],
      stem: '一弹簧振子的质量 $m = 0.20\\ \\text{kg}$，劲度系数 $k = 20\\ \\text{N/m}$，振幅 $A = 0.050\\ \\text{m}$，无阻尼。求振子经过 $x = 0.030\\ \\text{m}$ 处时的速率，单位 m/s。',
      answer: 0.4, tol: 0.01, unit: 'm/s',
      explain: '$\\omega = \\sqrt{k/m} = \\sqrt{20/0.20} = 10\\ \\text{rad/s}$，$v = \\omega\\sqrt{A^2-x^2} = 10\\sqrt{0.050^2-0.030^2} = 10\\times0.040 = 0.40\\ \\text{m/s}$。也可用能量法：$E = \\tfrac12\\times20\\times0.050^2 = 0.025\\ \\text{J}$，$E_p = \\tfrac12\\times20\\times0.030^2 = 0.009\\ \\text{J}$，$v = \\sqrt{2\\times0.016/0.20} = 0.40\\ \\text{m/s}$。',
      hints: ['$v = \\pm\\omega\\sqrt{A^2-x^2}$。', '也可以先用 $E = \\tfrac12kA^2$ 求总能量，再减去势能。'],
      commonError: '漏开方，算出 $v = \\omega(A^2-x^2)$ 而量纲出错；或把 $x$ 与 $A$ 的平方差算成 $(A-x)^2$。'
    },

    /* ------------------------------------------------------------- 11.5 */
    {
      id: 'q11-s05-01', chapter: 'ch11', section: 'ch11-s05', type: 'single', difficulty: 2,
      point: '同频同向合成的振幅', tags: ['振动合成', '振幅'],
      stem: '两个同方向、同频率的简谐振动，振幅分别为 $3.0\\ \\text{cm}$ 与 $5.0\\ \\text{cm}$。它们合成后的振幅不可能是：',
      options: ['$2.0\\ \\text{cm}$', '$4.0\\ \\text{cm}$', '$6.0\\ \\text{cm}$', '$9.0\\ \\text{cm}$'],
      answer: 3,
      explain: '合振幅的取值范围是 $|A_1-A_2| \\le A \\le A_1+A_2$，即 $2.0\\ \\text{cm} \\le A \\le 8.0\\ \\text{cm}$。两个端点都能取到：反相时得 $2.0\\ \\text{cm}$，同相时得 $8.0\\ \\text{cm}$；$4.0$ 与 $6.0\\ \\text{cm}$ 也都落在区间内，分别由某个中间相位差实现。只有 $9.0\\ \\text{cm}$ 超出上限，不可能出现。',
      hints: ['由 $A = \\sqrt{A_1^2+A_2^2+2A_1A_2\\cos\\Delta\\varphi}$ 看 $\\cos\\Delta\\varphi = \\pm1$ 时的两个极端。', '这就是三角形的“两边之和大于第三边”。'],
      commonError: '误以为合振幅一定等于两者之和（同相加强）或两者之差（反相）。'
    },
    {
      id: 'q11-s05-02', chapter: 'ch11', section: 'ch11-s05', type: 'single', difficulty: 2,
      point: '拍频', tags: ['拍', '拍频'],
      stem: '两支频率分别为 $256\\ \\text{Hz}$ 与 $260\\ \\text{Hz}$ 的音叉同时发声，听到的拍频与相邻两次声音最强之间的时间间隔为：',
      options: [
        '$4\\ \\text{Hz}$，$0.25\\ \\text{s}$',
        '$2\\ \\text{Hz}$，$0.50\\ \\text{s}$',
        '$4\\ \\text{Hz}$，$0.50\\ \\text{s}$',
        '$516\\ \\text{Hz}$，$1.9\\times10^{-3}\\ \\text{s}$'
      ],
      answer: 0,
      explain: '$\\nu_{\\text{拍}} = |260-256| = 4\\ \\text{Hz}$，拍周期 $T_{\\text{拍}} = 1/4 = 0.25\\ \\text{s}$。注意 $516\\ \\text{Hz}$ 是两频率之和，$258\\ \\text{Hz}$ 才是载波频率 $\\bar\\nu = (256+260)/2$，两者都不是拍频。',
      hints: ['拍频等于两频率之差的绝对值。', '包络余弦的角频率是 $\\pi\\Delta\\nu$，取绝对值后强弱周期才是 $1/\\Delta\\nu$。'],
      commonError: '把频差取一半当拍频（误用 $\\cos\\frac{\\alpha-\\beta}{2}$ 里的 $1/2$）。'
    },
    {
      id: 'q11-s05-03', chapter: 'ch11', section: 'ch11-s05', type: 'numeric', difficulty: 2,
      point: '同频同向合成', tags: ['振动合成', '振幅'],
      stem: '两个同方向、同频率的简谐振动振幅分别为 $A_1 = 3.0\\ \\text{cm}$、$A_2 = 5.0\\ \\text{cm}$，相位差为 $\\pi/3$。求合振幅，单位 cm。',
      answer: 7, tol: 0.05, unit: 'cm',
      explain: '$A = \\sqrt{A_1^2+A_2^2+2A_1A_2\\cos\\Delta\\varphi} = \\sqrt{9+25+2\\times15\\times0.5} = \\sqrt{49} = 7.0\\ \\text{cm}$。',
      hints: ['$\\cos(\\pi/3) = 0.5$。', '交叉项 $2A_1A_2\\cos\\Delta\\varphi$ 不能漏。'],
      commonError: '漏掉交叉项，直接算 $\\sqrt{3^2+5^2}\\approx5.83$（那是正交的结果）。'
    },

    /* ------------------------------------------------------------- 11.6 */
    {
      id: 'q11-s06-01', chapter: 'ch11', section: 'ch11-s06', type: 'single', difficulty: 3,
      point: '受迫振动的稳态频率', tags: ['受迫振动', '共振'],
      stem: '一固有频率为 $\\nu_0$ 的振子，在频率为 $\\nu_d$（$\\nu_d \\ne \\nu_0$）的周期性外力作用下振动。经过足够长时间达到稳态后，振动的频率是：',
      options: [
        '$\\nu_0$，因为固有频率不会改变',
        '$\\nu_d$，等于驱动力的频率',
        '$(\\nu_0+\\nu_d)/2$',
        '$|\\nu_0-\\nu_d|$'
      ],
      answer: 1,
      explain: '受迫振动的解由暂态（按 $e^{-\\beta t}$ 衰减，频率接近固有频率）与稳态（频率为 $\\nu_d$）叠加。足够长时间后暂态消失，只剩下频率为驱动频率的稳态振动。固有频率只决定稳态振幅与相位差的大小，以及共振峰的位置。',
      hints: ['暂态与稳态各自的频率是多少？哪一项会随时间消失？', '$\\nu_0$ 影响的是振幅 $A(\\nu_d)$ 的曲线形状。'],
      commonError: '把自由振动的“按固有频率振动”套用到受迫振动的稳态上。'
    },
    {
      id: 'q11-s06-02', chapter: 'ch11', section: 'ch11-s06', type: 'single', difficulty: 2,
      point: '三种阻尼', tags: ['阻尼振动', '临界阻尼'],
      stem: '关于阻尼振动，下列说法正确的是：',
      options: [
        '只要存在阻尼，物体就一定会来回振动，只是振幅逐渐减小',
        '$\\beta > \\omega_0$ 时物体不再振动，且 $\\beta$ 越大回到平衡位置越快',
        '从静止偏移释放时，在不往复振荡的要求下，临界阻尼 $\\beta = \\omega_0$ 使系统最快接近平衡',
        '欠阻尼时振幅按 $e^{-\\beta t}$ 衰减，振动的周期比无阻尼时短'
      ],
      answer: 2,
      explain: '临界阻尼 $\\beta=\\omega_0$ 是“不振荡”与“最快回到平衡”的临界状态，C 正确。过阻尼 $\\beta>\\omega_0$ 也不振荡，但阻尼越大回去越慢，故 B 错。A 忽略了临界与过阻尼两种不振动的情形。欠阻尼的准周期 $T^{\\prime} = 2\\pi/\\sqrt{\\omega_0^2-\\beta^2}$ 比 $T_0$ 长而非短，D 错。',
      hints: ['把 $\\beta$ 与 $\\omega_0$ 三种大小关系逐一列出来。', '临界阻尼的名字就来自“刚好不振荡”这条界线。'],
      commonError: '认为“阻尼越大回到平衡越快”，忽略了过阻尼反而更慢。'
    },
    {
      id: 'q11-s06-03', chapter: 'ch11', section: 'ch11-s06', type: 'numeric', difficulty: 3,
      point: '欠阻尼的准周期', tags: ['阻尼振动', '准周期'],
      stem: '一无阻尼固有角频率 $\\omega_0 = 10\\ \\text{rad/s}$ 的振子，加入与速度成正比的阻尼，阻尼系数 $\\beta = 2.0\\ \\text{s}^{-1}$。求它的准周期，单位 s。',
      answer: 0.641, tol: 0.01, unit: 's',
      explain: '$\\beta < \\omega_0$，属欠阻尼。$\\omega^{\\prime} = \\sqrt{\\omega_0^2-\\beta^2} = \\sqrt{100-4} = \\sqrt{96} = 9.798\\ \\text{rad/s}$，$T^{\\prime} = 2\\pi/\\omega^{\\prime} = 6.283/9.798 = 0.641\\ \\text{s}$。',
      hints: ['先判断 $\\beta$ 与 $\\omega_0$ 的大小关系。', '准角频率 $\\omega^{\\prime} = \\sqrt{\\omega_0^2-\\beta^2}$，不是 $\\omega_0-\\beta$。'],
      commonError: '直接把 $\\omega_0 - \\beta = 8$ 当作准角频率（线性相减没有依据）。'
    }

  ]);
})(typeof window !== 'undefined' ? window : globalThis);
