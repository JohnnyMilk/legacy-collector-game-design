import {BossCombatModel} from './combat-boss-model.js?v=20260830-0748';

export class Tier2BossCombatModel extends BossCombatModel{
  constructor(scenario){
    super(scenario);
    this.units.forEach(u=>Object.assign(u,{mikiriTargetId:null,manaWeaveNext:null,manaMarks:{},rootedNextTurn:false,blessingShield:false,battleSongBuff:false,lastActiveSkillId:null,postSkillMoveRemaining:0,protectActive:false,tempDamageDownPct:0,tempMdefDownPct:0,tempAgiDownPct:0,tempDebuffCasterId:null}));
  }
  beginOwnTurn(unit){
    super.beginOwnTurn(unit);
    if(!unit)return;
    for(const u of this.units){if(u.tempDebuffCasterId===unit.id){u.tempDamageDownPct=0;u.tempDefDownPct=0;u.tempMdefDownPct=0;u.tempAgiDownPct=0;u.tempDebuffCasterId=null}}
  }
  endTurn(){
    const u=this.currentUnit();
    if(u&&u.team==='player'&&!u.moved&&!u.acted&&this.hasPassive(u,'rest')){const amount=Math.round(u.stats.HP*.2),before=u.currentHP;u.currentHP=Math.min(u.stats.HP,u.currentHP+amount);this.addLog(`${u.label}「休止」恢復 ${u.currentHP-before} HP。`)}
    const result=super.endTurn();
    if(u?.rootedNextTurn)u.rootedNextTurn=false;
    if(u?.battleSongBuff)u.battleSongBuff=false;
    return result;
  }
  effectiveStat(unit,stat){let value=super.effectiveStat(unit,stat);if(stat==='MDEF'&&unit.tempMdefDownPct)value*=1-unit.tempMdefDownPct/100;if(stat==='AGI'&&unit.tempAgiDownPct)value*=1-unit.tempAgiDownPct/100;return value}
  reachable(unit){if(unit.rootedNextTurn)return new Map();const map=super.reachable(unit);if(unit.postSkillMoveRemaining>0){for(const [k,d] of [...map.entries()])if(d>unit.postSkillMoveRemaining)map.delete(k)}return map}
  move(unit,x,y){const wasProtect=unit.protectActive,ok=super.move(unit,x,y);if(ok){if(wasProtect){unit.protectActive=false;this.addLog(`${unit.label}「守護」因位置改變而解除。`)}if(unit.postSkillMoveRemaining>0)unit.postSkillMoveRemaining=0}return ok}
  incomingDirectDamage(target,damage,source){let final=damage;if(source?.team==='enemy'&&target.team==='player'){
      const guard=this.living('player').find(u=>u.id!==target.id&&this.hasPassive(u,'guard')&&Math.max(Math.abs(u.x-target.x),Math.abs(u.y-target.y))===1);if(guard)final*=.75;
      if(target.blessingShield){final*=.7;target.blessingShield=false;this.addLog(`${target.label}「祝福」減傷後解除。`)}
    }return super.incomingDirectDamage(target,final,source)}
  dealDamage(attacker,target,options={}){
    if(attacker?.team==='enemy'&&target?.team==='player'&&!options.redirected){
      const protector=this.living('player').find(u=>u.id!==target.id&&u.protectActive&&Math.max(Math.abs(u.x-target.x),Math.abs(u.y-target.y))===1);
      if(protector){this.addLog(`${protector.label}「守護」替 ${target.label} 承受傷害。`);return this.dealDamage(attacker,protector,{...options,redirected:true,extraPct:(options.extraPct||0)-25})}
    }
    let extra=options.extraPct||0;const type=options.type||'physical';
    if(attacker?.team==='player'){
      if(this.hasPassive(attacker,'rage')&&attacker.currentHP/attacker.stats.HP<.5)extra+=30;
      if(this.hasPassive(attacker,'hunting-range')&&type==='physical'&&this.distance(attacker,target)>=2)extra+=20;
      if(this.hasPassive(attacker,'hunt')&&target.currentHP/target.stats.HP<.5)extra+=25;
      if(this.hasPassive(attacker,'flow')&&attacker.moved)extra+=20;
      if(this.hasPassive(attacker,'mikiri')&&attacker.mikiriTargetId===target.id)extra+=30;
      if(this.hasPassive(attacker,'mana-weave')&&attacker.manaWeaveNext===type){extra+=25;attacker.manaWeaveNext=null}
      if(this.hasPassive(attacker,'mana-mark')&&type==='magic')extra+=(target.manaMarks?.[attacker.id]||0)*25;
      if(attacker.battleSongBuff)extra+=20;
      if(attacker.tempDamageDownPct)extra-=attacker.tempDamageDownPct;
    }
    const result=super.dealDamage(attacker,target,{...options,extraPct:extra});
    if(result?.hit&&attacker?.team==='player'){
      if(this.hasPassive(attacker,'mikiri')&&attacker.mikiriTargetId===target.id)attacker.mikiriTargetId=null;
      if(this.hasPassive(attacker,'mana-weave'))attacker.manaWeaveNext=type==='magic'?'physical':'magic';
      if(this.hasPassive(attacker,'mana-mark')&&type==='magic'){target.manaMarks=target.manaMarks||{};target.manaMarks[attacker.id]=Math.min(2,(target.manaMarks[attacker.id]||0)+1)}
      if(this.hasPassive(attacker,'weakening-curse')&&target.alive){target.tempDamageDownPct=30;target.tempDebuffCasterId=attacker.id;this.addLog(`${target.label} 受到「衰咒」：造成傷害 -30%。`)}
    }
    if(result?.hit&&target?.alive&&sourceIsMelee(attacker,target)&&this.hasPassive(target,'mikiri')){target.mikiriTargetId=attacker.id;this.addLog(`${target.label}「見切」鎖定 ${attacker.label}。`)}
    return result;
  }
  validSkillTargets(unit,skillId){const s=this.skillById(unit,skillId);if(!s)return[];if(['protect','battle-song'].includes(s.kind))return s.charges>0&&!unit.acted&&!unit.usedActiveSkill?[unit]:[];return super.validSkillTargets(unit,skillId)}
  healOne(unit,target,multiplier=1){const low=target.currentHP/target.stats.HP<.5;let amount=unit.stats.MATK*multiplier;if(low&&this.hasPassive(unit,'grace'))amount*=1.3;amount=Math.round(amount);const before=target.currentHP;target.currentHP=Math.min(target.stats.HP,target.currentHP+amount);const healed=target.currentHP-before;if(low&&target.currentHP/target.stats.HP>=.5&&this.hasPassive(unit,'blessing'))target.blessingShield=true;this.addLog(`${unit.label} → ${target.label}：恢復 ${healed} HP${target.blessingShield?'／祝福':''}`);return healed}
  useSkill(unit,skillId,target=unit,roll=Math.random){
    const s=this.skillById(unit,skillId);if(!s)return{ok:false};
    const repeated=this.hasPassive(unit,'reformulation')&&unit.lastActiveSkillId===skillId,boost=repeated?1.3:1;
    const can=this.validSkillTargets(unit,skillId).some(t=>t.id===target.id);if(!can)return{ok:false};
    if(s.sourceTier===2){
      s.charges--;unit.usedActiveSkill=true;unit.acted=true;unit.lastActiveSkillId=skillId;
      if(s.kind==='protect'){unit.protectActive=true;this.addLog(`${unit.label} 使用「${s.name}」：守護周圍友方直到位置改變。`);return{ok:true}}
      if(s.kind==='battle-song'){const allies=this.living('player').filter(a=>a.id!==unit.id&&Math.max(Math.abs(a.x-unit.x),Math.abs(a.y-unit.y))===1);allies.forEach(a=>a.battleSongBuff=true);this.addLog(`${unit.label} 使用「${s.name}」：${allies.length} 名友方下一次行動傷害 +20%。`);return{ok:true}}
      if(s.kind==='damage'){
        if(s.hpCostPct){unit.currentHP=Math.max(1,unit.currentHP-Math.round(unit.currentHP*s.hpCostPct/100));this.addLog(`${unit.label} 支付 ${s.hpCostPct}% 目前 HP 使用「${s.name}」。`)}
        const old=target.tempDefDownPct||0;if(s.ignoreDefPct)target.tempDefDownPct=Math.max(old,s.ignoreDefPct);const r=this.dealDamage(unit,target,{type:s.damageType,multiplier:(s.multiplier??1)*boost,alwaysHit:s.alwaysHit!==false,name:s.name,roll});target.tempDefDownPct=old;if(r.hit&&s.postMove&&!this.finished){unit.postSkillMoveRemaining=s.postMove;unit.moved=false}return r;
      }
      if(s.kind==='ambush'){const cells=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:target.x+dx,y:target.y+dy})).filter(p=>this.canStop(unit,p.x,p.y)).sort((a,b)=>Math.abs(a.x-unit.x)+Math.abs(a.y-unit.y)-Math.abs(b.x-unit.x)-Math.abs(b.y-unit.y));if(cells[0]){unit.x=cells[0].x;unit.y=cells[0].y;unit.moved=true}return this.dealDamage(unit,target,{type:'physical',multiplier:1.5*boost,alwaysHit:true,name:s.name,roll})}
      if(s.kind==='whirling'){const r=this.dealDamage(unit,target,{type:'physical',multiplier:1.2*boost,alwaysHit:true,name:s.name,roll});if(r.hit&&!this.finished){unit.postSkillMoveRemaining=2;unit.moved=false}return r}
      if(s.kind==='dual-damage'){const r1=this.dealDamage(unit,target,{type:'magic',multiplier:.8*boost,alwaysHit:true,name:`${s.name}・魔`,roll});const r2=target.alive?this.dealDamage(unit,target,{type:'physical',multiplier:.8*boost,alwaysHit:true,name:`${s.name}・刃`,roll}):null;return{ok:true,hit:r1.hit||r2?.hit,results:[r1,r2]}}
      if(s.kind==='arcane-band'){const dx=Math.sign(target.x-unit.x),dy=Math.sign(target.y-unit.y),px=-dy,py=dx,targets=this.living('enemy').filter(e=>[[target.x,target.y],[target.x+px,target.y+py],[target.x-px,target.y-py]].some(([x,y])=>e.x===x&&e.y===y));return{ok:true,results:targets.map(e=>this.dealDamage(unit,e,{type:'magic',multiplier:(e.id===target.id?1:.7)*boost,alwaysHit:true,name:s.name,roll}))}}
      if(s.kind==='binding'){const r=this.dealDamage(unit,target,{type:'magic',multiplier:1*boost,alwaysHit:true,name:s.name,roll});if(r.hit&&target.alive){target.rootedNextTurn=true;this.addLog(`${target.label} 受到「束縛」：下一次自身行動不能移動。`)}return r}
      if(s.kind==='holy-heal'){const dx=Math.sign(target.x-unit.x),dy=Math.sign(target.y-unit.y),px=-dy,py=dx,cells=[[target.x,target.y],[target.x+px,target.y+py],[target.x-px,target.y-py]],targets=this.living('player').filter(a=>cells.some(([x,y])=>a.x===x&&a.y===y));targets.forEach(a=>this.healOne(unit,a,boost));return{ok:true,kind:'heal',targets}}
      if(s.kind==='potion'){const effects=['weak','corrode','slow'],pick=effects[Math.floor(roll()*effects.length)],pct=Math.round(20*boost);target.tempDebuffCasterId=unit.id;if(pick==='weak')target.tempDamageDownPct=pct;if(pick==='corrode'){target.tempDefDownPct=pct;target.tempMdefDownPct=pct}if(pick==='slow')target.tempAgiDownPct=pct;this.addLog(`${unit.label} 使用「${s.name}」：${target.label} ${pick==='weak'?'傷害':pick==='corrode'?'DEF/MDEF':'AGI'} -${pct}%。`);return{ok:true}}
    }
    unit.lastActiveSkillId=skillId;
    if(repeated){const oldM=s.multiplier,oldH=s.healingMultiplier,oldB=s.moveBonus;if(oldM!=null)s.multiplier*=1.3;if(oldH!=null)s.healingMultiplier*=1.3;if(oldB!=null)s.moveBonus=Math.max(1,Math.round(oldB*1.3));const r=super.useSkill(unit,skillId,target,roll);s.multiplier=oldM;s.healingMultiplier=oldH;s.moveBonus=oldB;return r}
    return super.useSkill(unit,skillId,target,roll);
  }
}

function sourceIsMelee(attacker,target){return !!attacker&&attacker.team==='enemy'&&Math.abs(attacker.x-target.x)+Math.abs(attacker.y-target.y)<=1}
