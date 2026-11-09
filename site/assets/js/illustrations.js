/* 与正文模型相配的SVG图；几何示意明确标注非比例，数值曲线保留坐标单位。 */
(function (global) {
  'use strict';
  const P=global.PHYS, esc=P.UI.esc;
  const stroke='#287268', amber='#a56b12';
  const line=(x1,y1,x2,y2,color=stroke,arrow=false)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"${arrow?' marker-end="url(#phys-fig-arrow)"':''}/>`;
  const txt=(x,y,s,color='#253b35')=>`<text x="${x}" y="${y}" fill="${color}" font-size="14">${esc(s)}</text>`;
  const circle=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${stroke}" stroke-width="2"/>`;
  const rect=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#e4eee8" stroke="${stroke}"/>`;
  const diagrams={};
  function add(id,title,desc,svg){diagrams[id]={title,desc,svg};}
  function chart(id,title,desc,curves,xmin,xmax,ymin,ymax,xlabel,ylabel){
    const X=x=>65+(x-xmin)/(xmax-xmin)*440,Y=y=>215-(y-ymin)/(ymax-ymin)*170;
    let s=line(65,35,65,215,'#aaa')+line(65,215,515,215,'#aaa')+txt(15,23,ylabel)+txt(400,245,xlabel)+txt(36,46,String(ymax))+txt(36,215,String(ymin))+txt(65,235,String(xmin))+txt(490,235,String(xmax));
    if(ymin<0&&ymax>0)s+=line(65,Y(0),505,Y(0),'#bbb');
    curves.forEach((c,j)=>{let pts=[];for(let i=0;i<=240;i++){let x=xmin+(xmax-xmin)*i/240;pts.push(X(x)+','+Y(c.fn(x)));}s+=`<polyline fill="none" stroke="${j?amber:stroke}" stroke-width="2.5" ${j?'stroke-dasharray="6 4"':''} points="${pts.join(' ')}"/>`+txt(130+190*j,25,c.label,j?amber:stroke);});
    add(id,title,desc,s);
  }
  chart('ch01-s03','速度图的有向面积','示例v=6−2t，3秒处变向。0至5秒位移5米，路程13米。',[{label:'v = 6 − 2t',fn:t=>6-2*t}],0,5,-4,6,'t / s','v / (m/s)');
  add('ch02-s04','斜面受力图','固定斜面向右上方升高，物块正在上滑，摩擦力沿斜面向下；示意图不按比例。',line(80,200,400,70,'#888')+rect(223,105,50,32)+line(245,125,245,199,amber,true)+txt(252,190,'mg')+line(245,125,210,47,stroke,true)+txt(180,45,'N')+line(245,125,163,158,stroke,true)+txt(120,166,'滑动摩擦 f')+line(290,100,360,71,amber,true)+txt(355,60,'v：上滑'));
  add('ch03-s06','碰撞前后分开列账','两车构成系统，碰撞期间合外力冲量忽略；粘连时共速，平动动能减少。示意图不按比例。',rect(75,70,75,42)+rect(330,70,95,42)+txt(89,95,'m₁')+txt(353,95,'m₂')+line(155,90,225,90,stroke,true)+line(326,90,275,90,amber,true)+txt(80,50,'碰前：分别写带方向的动量')+rect(220,165,160,42)+txt(244,191,'m₁ + m₂')+line(390,186,460,186,stroke,true)+txt(75,150,'完全非弹性碰撞：共同速度v')+txt(80,240,'m₁u₁ + m₂u₂ = (m₁ + m₂)v；不能同时令动能守恒'));
  add('ch04-s06','纯滚动的平动与转动','固定地面上的圆盘无滑动向右滚动，质心速度vC=ωR，接触点瞬时速度为零；示意图不按比例。',line(65,205,505,205,'#888')+circle(240,135,70)+line(240,135,240,205,amber)+txt(247,180,'R')+line(240,135,350,135,stroke,true)+txt(354,140,'vC')+`<path d="M200 86 A62 62 0 0 1 292 110" fill="none" stroke="${amber}" stroke-width="2" marker-end="url(#phys-fig-arrow)"/>`+txt(318,88,'ω 顺时针')+txt(160,235,'接触点：平动速度与转动速度相消'));
  add('ch05-s02','电场矢量和电势标量','等量异号点电荷的中点处，两个电场同向叠加，电势取无穷远为零时相消；示意图不按比例。',circle(100,130,25)+circle(450,130,25)+txt(83,135,'+q')+txt(432,135,'−q')+line(130,130,420,130,'#bbb')+line(250,110,330,110,stroke,true)+line(250,145,330,145,amber,true)+txt(235,80,'P 中点')+txt(345,112,'E₊')+txt(345,149,'E₋')+txt(150,215,'P：V = 0，但 E ≠ 0，方向由+q指向−q'));
  add('ch06-s04','串并联的边界条件','左边为两个理想电容串联，中间节点起初中性；右边为并联。示意图不按比例。',line(65,80,200,80)+line(105,60,105,100)+line(120,60,120,100)+line(155,60,155,100)+line(170,60,170,100)+txt(65,40,'串联：等量电荷')+line(340,70,460,70)+line(340,170,460,170)+line(340,70,340,170)+line(460,70,460,170)+line(385,50,385,90)+line(400,50,400,90)+line(385,150,385,190)+line(400,150,400,190)+txt(320,40,'并联：同电压')+txt(65,225,'1/C = 1/C₁ + 1/C₂')+txt(325,225,'C = C₁ + C₂'));
  // 电容板间不应出现贯通导线，遮盖共线导线的板间段。
  diagrams['ch06-s04'].svg=diagrams['ch06-s04'].svg.replace(/<line x1="65" y1="80" x2="200" y2="80"[^>]*\/>/,'')+line(65,80,105,80)+line(120,80,155,80)+line(170,80,200,80);
  diagrams['ch06-s04'].svg=diagrams['ch06-s04'].svg.replace(/<line x1="340" y1="70" x2="460" y2="70"[^>]*\/>|<line x1="340" y1="170" x2="460" y2="170"[^>]*\/>/g,'')+line(340,70,385,70)+line(400,70,460,70)+line(340,170,385,170)+line(400,170,460,170);
  add('ch07-s03','长直导线的磁场方向','电流沿+z朝读者，右手定则给逆时针磁场；右侧场点的B向上。图中圆为磁场线示意，不按比例。',circle(250,135,70)+circle(250,135,14)+`<circle cx="250" cy="135" r="4" fill="${stroke}"/>`+txt(185,245,'I：朝向读者（⊙）')+line(320,150,320,80,amber,true)+txt(335,95,'B')+line(250,135,320,135,'#aaa')+txt(275,157,'r'));
  add('ch08-s02','楞次定律：反抗的是磁通变化','圆环内磁场向纸面内且正在减弱，顺时针感应电流产生向里的磁场以补偿变化；示意图不按比例。',circle(265,140,78)+txt(245,112,'×')+txt(220,150,'×')+txt(290,150,'×')+txt(250,190,'×')+`<path d="M205 90 A78 78 0 0 1 335 110" fill="none" stroke="${amber}" stroke-width="3" marker-end="url(#phys-fig-arrow)"/>`+txt(355,110,'顺时针电流')+txt(155,35,'B向里，大小减小')+txt(112,245,'感应场仍向里，并非总与原磁场相反'));
  const maxwell=(v,T)=>4*Math.PI*(.028/(2*Math.PI*8.31*T))**1.5*v*v*Math.exp(-.028*v*v/(2*8.31*T));
  chart('ch09-s05','温度改变速率分布','氮气经典平衡分布：升温使峰右移、变宽变矮；每条曲线对速率的积分仍为1。纵轴为概率密度，不是概率。',[{label:'300 K（实线）',fn:v=>maxwell(v,300)*1000},{label:'600 K（虚线）',fn:v=>maxwell(v,600)*1000}],0,1500,0,2.2,'v / (m/s)','f(v) / (10⁻³ s/m)');
  add('ch10-s05','p–V循环的净功','矩形顺时针循环，压强从1×10⁵到2×10⁵ Pa，体积从0.01到0.02 m³，净功为1000 J。',line(85,30,85,215,'#888')+line(85,215,495,215,'#888')+rect(180,65,220,115)+line(180,180,180,65,stroke,true)+line(180,65,400,65,stroke,true)+line(400,65,400,180,stroke,true)+line(400,180,180,180,stroke,true)+txt(130,183,'1')+txt(130,68,'2')+txt(172,235,'0.01')+txt(378,235,'0.02')+txt(18,23,'p / 10⁵ Pa')+txt(440,240,'V / m³')+txt(220,130,'W净 = 面积'));
  chart('ch11-s04','同一位置的动能和势能','理想无阻尼弹簧振子，以平衡位置为势能零点。动能与势能之和恒为E；图像是能量随位置，不是随时间。',[{label:'Ep / E（实线）',fn:x=>x*x},{label:'Ek / E（虚线）',fn:x=>1-x*x}],-1,1,0,1.1,'x / A','能量 / E');
  chart('ch12-s02','行波与质元运动分开看','某时刻正向传播的波形y=A sin(2πx/λ)。半波长处斜率为负，因vy=−u∂y/∂x，该处质元向上运动；质元不沿x随波迁移。',[{label:'波沿+x传播',fn:x=>Math.sin(2*Math.PI*x)}],0,1,-1.1,1.1,'x / λ','y / A');
  add('ch13-s02','双缝的光程差','同相双缝，远场小角度下Δ≈dx/D，相邻明纹间距Dλ/d。图只示几何关系，不按比例。',line(110,30,110,215,'#888')+line(465,30,465,215,'#888')+line(110,95,465,77)+line(110,155,465,77,amber)+line(110,125,465,125,'#bbb')+txt(55,100,'S₁')+txt(55,158,'S₂')+txt(478,80,'P')+txt(478,128,'O')+line(465,80,465,125,stroke)+txt(440,108,'x')+txt(85,132,'d')+line(115,228,460,228,'#888')+txt(275,246,'D'));
  add('ch14-s06','固有时沿世界线积累','纵轴ct、横轴x，坐标尺度相同。标准往返模型：地球为直线，飞船两段折线；比较相同出发与重逢事件。',line(150,220,150,20,'#888')+line(150,220,355,220,'#888')+line(150,220,345,25,'#bbb')+line(150,220,150,25,stroke)+line(150,220,228,122.5,amber)+line(228,122.5,150,25,amber)+txt(110,20,'ct / 光年')+txt(330,242,'x / 光年')+txt(165,40,'重逢：ct=15')+txt(238,122,'转向：(x,ct)=(6,7.5)')+txt(165,210,'出发')+txt(310,65,'光线45°'));
  chart('ch15-s04','波函数有正负，概率密度非负','一维无限深势阱n=2定态。实线为√L ψ₂，可为负；虚线为L|ψ₂|²，始终非负，积分还要按相应坐标和单位计算。',[{label:'√L ψ₂（实线）',fn:x=>Math.sqrt(2)*Math.sin(2*Math.PI*x)},{label:'L|ψ₂|²（虚线）',fn:x=>2*Math.sin(2*Math.PI*x)**2}],0,1,-1.6,2.2,'x / L','归一化分量 / 1');
  P.illustrations=diagrams;
  P.renderIllustration=function(id){const f=diagrams[id];if(!f)return '';return '<figure class="physics-figure"><svg viewBox="0 0 560 265" role="img" aria-labelledby="phys-fig-title phys-fig-desc"><title id="phys-fig-title">'+esc(f.title)+'</title><desc id="phys-fig-desc">'+esc(f.desc)+'</desc><defs><marker id="phys-fig-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="none" stroke="context-stroke"/></marker></defs>'+f.svg+'</svg><figcaption><b>'+esc(f.title)+'</b> · '+esc(f.desc)+'</figcaption></figure>';};
})(typeof window !== 'undefined' ? window : globalThis);
