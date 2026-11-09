const assert = require('assert/strict'), P = require('./harness').load();
const near = (a,b) => assert(Math.abs(a-b) < 1e-8*Math.max(1,Math.abs(a),Math.abs(b)), `${a} != ${b}`);
assert.equal(P.formulas.length, 96); assert.equal(new Set(P.formulas.map(f=>f.id)).size, 96);
for (const ch of P.chapters) {
  assert(ch.summary && ch.points.length >= 6);
  const exam = P.exams.find(e=>e.chapter===ch.id);
  assert(exam); assert.equal(exam.questions.length,ch.sections.length);
  assert.equal(new Set(exam.questions).size,exam.questions.length);
  exam.questions.forEach(id=>assert.equal(P.getQuestion(id).chapter,ch.id));
  const answers=Object.fromEntries(exam.questions.map(id=>[id,P.getQuestion(id).answer]));
  const full=P.gradeExam(exam,answers); assert.equal(full.correct,full.total);
  assert.equal(P.gradeExam(exam,{}).correct,0);
  const num=exam.questions.find(id=>P.getQuestion(id).type==='numeric');
  if(num) { answers[num]=''; assert.equal(P.gradeExam(exam,answers).correct,full.total-1); }
}
for(const m1 of [.5,1,5])for(const m2 of [.5,2,5])for(const u1 of [.5,4])for(const u2 of [-3,0])for(const e of [0,1]){
  const p={m1,m2,u1,u2,e},r=P.labModels.collision(p,1.5);near(r.beforeP,r.afterP);
  if(e)near(r.beforeK,r.afterK);else{near(r.v1,r.v2);assert(r.afterK<=r.beforeK+1e-9);}
  near(P.labModels.collision(p,1).x1,0);near(P.labModels.collision(p,1).x2,0);
}
for(const A of [.05,.3,.5])for(const m of [.2,1,3])for(const k of [1,10,40])for(const t of [0,.2,1,12]){
  const r=P.labModels.harmonic({A,m,k},t);near(r.E,r.Ek+r.Ep);near(r.T,2*Math.PI*Math.sqrt(m/k));near(r.a,-k/m*r.x);
}
const slit={lambda:550,D:2,d:.5},a=P.labModels.doubleSlit(slit,0);near(a.spacing,.0022);near(a.intensity,1);near(P.labModels.doubleSlit(slit,a.spacing/2).intensity,0);
const field={q1:2,q2:-2,x1:-.7,x2:.7,y1:0,y2:0},f=P.labModels.field(field,0,0);near(f.V,0);near(f.Ey,0);assert(f.Ex>0);
const x=.3,y=.6,h=1e-5,r=P.labModels.field(field,x,y);near(r.Ex,-(P.labModels.field(field,x+h,y).V-P.labModels.field(field,x-h,y).V)/(2*h));
P.Store.reset();const exam=P.exams[0],first=P.gradeExam(exam,{});P.Store.recordExam(exam.id,first);
const full=P.gradeExam(exam,Object.fromEntries(exam.questions.map(id=>[id,P.getQuestion(id).answer])));P.Store.recordExam(exam.id,full);
assert.equal(P.Store.examOf(exam.id).first.correct,0);assert.equal(P.Store.examOf(exam.id).last.correct,full.total);
const dump=P.Store.exportJSON();P.Store.reset();assert(P.Store.importJSON(dump).ok);P.Store.init();assert.equal(P.Store.examOf(exam.id).first.correct,0);assert.equal(P.Store.examOf(exam.id).last.correct,full.total);
const legacy=JSON.parse(dump);delete legacy.data.exams;assert(P.Store.importJSON(JSON.stringify(legacy)).ok);assert.equal(Object.keys(P.Store.get().exams).length,0);
console.log('工程数值、全章测验、首次成绩、旧记录迁移和导入导出检查通过');
