import {BossCombatModel} from './combat-boss-model.js?v=20260830-1324';

export class Tier2BossCombatModel extends BossCombatModel{
  constructor(scenario){
    super(scenario);
    this.units.forEach(u=>Object.assign(u,{mikiriTargetId:null,manaWeaveNext:null,manaMarks:{},rootedNextTurn:false,blessingShield:false,battleSongBuff:false,lastActiveSkillId:null,postSkillMoveRemaining:0,protectActive:false,tempDamageDownPct:0,tempMdefDownPct:0,tempAgiDownPct:0,tempDebuffCasterId:null,whirlingFollowup:null}));
  }
  beginOwnTurn(unit){
    super.beginOwnTurn(unit);
    if(!unit)return;
    for(const u of this.units){
      if(u.tempDebuffCasterId===unit.id){
        const removed=[];
        if(u.tempDamageDownPct)removed.push(`傷害 -${u.tempDamageDownPct}%`);
        if(u.tempDefDownPct)removed.push(`DEF -${u.tempDefDownPct}%`);
        if(u.tempMdefDownPct)removed.push(`MDEF -${u.tempMdefDownPct}%`);
        if(u.tempAgiDownPct)removed.push(`AGI -${u.tempAgiDownPct}%`);
        u.tempDamageDownPct=0;u.tempDefDownPct=0;u.tempMdefDownPct=0;u.tempAgiDownPct=0;u.tempDebuffCasterId=null;
        if(removed.length)this.addLog(`${u.label} 的 ${removed.join('／')} 減益效果解除。`);
      }
    }
  }
  endTurn(){
    const u=this.currentUnit();
    if(u&&u.team==='player'&&!u.moved&&!u.acted&&this.hasPassive(u,'rest')){const amount=Math.round(u.stats.HP*.2),before=u.currentHP;u.currentHP=Math.min(u.stats.HP,u.currentHP+amount);this.addLog(`${u.label}「休止」恢復 ${u.currentHP-before} HP。`)}
    if(u?.whirlingFollowup)this.finishWhirling(u,true);
    const hadRoot=!!u?.rootedNextTurn,hadSong=!!u?.battleSongBuff;
    const result=super.endTurn();
    if(u?.rootedNextTurn)u.rootedNextTurn=false;
    if(u?.battleSongBuff)u.battleSongBuff=false;
    if(hadRoot)this.addLog(`${u.label}「束縛」移動限制解除。`);
    if(hadSong)this.addLog(`${u.label}「戰歌」傷害加成效果解除。`);
    return result;
  }
  effectiveStat(unit,stat){let value=super.effectiveStat(unit,stat);if(stat==='MDEF'&&unit.tempMdefDownPct)value*=1-unit.tempMdefDownPct/100;if(stat==='AGI'&&unit.tempAgiDownPct)value*=1-unit.tempAgiDownPct/100;return value}
  reachable(unit){if(unit.rootedNextTurn)return new Map();const map=super.reachable(unit);if(unit.postSkillMoveRemaining>0){for(const [k,d] of [...map.entries()])if(d>unit.postSkillMoveRemaining)map.delete(k)}return map}
  move(unit,x,y){const wasProtect=unit.protectActive,hadExtraMove=unit.postSkillMoveRemaining>0,ok=super.move(unit,x,y);if(ok){if(wasProtect){unit.protectActive=false;this.addLog(`${unit.label}「守護」因位置改變而解除。`)}if(hadExtraMove){unit.postSkillMoveRemaining=0;this.addLog(`${unit.label} 的追加移動效果已使用並解除。`)}}return ok}
  incomingDirectDamage(target,damage,source){let final=damage;if(source?.team==='enemy'&&target.team==='player'){
      const guard=this.living('player').find(u=>u.id!==target.id&&this.hasPassive(u,'guard')&&Math.max(Math.abs(u.x-target.x),Math.abs(u.y-target.y))===1);if(guard)final*=.75;
      if(target.blessingShield){final*=.7;target.blessingShield=false;this.addLog(`${target.label}「祝福」觸發：本次受到傷害 -30%，效果解除。`)}
    }return super.incomingDirectDamage(target,final,source)}
  dealDamage(attacker,target,options={}){
    if(attacker?.team==='enemy'&&target?.team==='player'&&!options.redirected){
      const protector=this.living('player').find(u=>u.id!==target.id&&u.protectActive&&Math.max(Math.abs(u.x-target.x),Math.abs(u.y-target.y))===1);
      if(protector){this.addLog(`${protector.label}「守護」替 ${target.label} 承受傷害。`);return this.dealDamage(attacker,protector,{...options,redirected:true,extraPct:(options.extraPct||0)-25})}
    }
    let extra=options.extraPct||0;const type=options.type||'physical';
    if(attacker?.tempDamageDownPct)extra-=attacker.tempDamageDownPct;
    let consumedManaWeave=false,consumedMikiri=false;
    if(attacker?.team==='player'){
      if(this.hasPassive(attacker,'rage')&&attacker.currentHP/attacker.stats.HP<.5)extra+=30;
      if(this.hasPassive(attacker,'hunting-range')&&type==='physical'&&this.distance(attacker,target)>=2)extra+=20;
      if(this.hasPassive(attacker,'hunt')&&target.currentHP/target.stats.HP<.5)extra+=25;
      if(this.hasPassive(attacker,'flow')&&attacker.moved)extra+=20;
      if(this.hasPassive(attacker,'mikiri')&&attacker.mikiriTargetId===target.id){extra+=30;consumedMikiri=true}
      if(this.hasPassive(attacker,'mana-weave')&&attacker.manaWeaveNext===type){extra+=25;attacker.manaWeaveNext=null;consumedManaWeave=true}
      if(this.hasPassive(attacker,'mana-mark')&&type==='magic')extra+=(target.manaMarks?.[attacker.id]||0)*25;
      if(attacker.battleSongBuff)extra+=20;
    }
    const result=super.dealDamage(attacker,target,{...options,extraPct:extra});
    if(result?.hit&&attacker?.team==='player'){
      if(consumedMikiri&&attacker.mikiriTargetId===target.id){attacker.mikiriTargetId=null;this.addLog(`${attacker.label}「見切」傷害加成已觸發並解除。`)}
      if(consumedManaWeave)this.addLog(`${attacker.label}「魔力交織」${type==='magic'?'魔法':'物理'}傷害加成已觸發並解除。`);
      if(this.hasPassive(attacker,'mana-weave'))attacker.manaWeaveNext=type==='magic'?'physical':'magic';
      if(this.hasPassive(attacker,'mana-mark')&&type==='magic'){target.manaMarks=target.manaMarks||{};target.manaMarks[attacker.id]=Math.min(2,(target.manaMarks[attacker.id]||0)+1)}
      if(this.hasPassive(attacker,'weakening-curse')&&target.alive){target.tempDamageDownPct=Math.max(target.tempDamageDownPct||0,30);target.tempDebuffCasterId=attacker.id;this.addLog(`${target.label} 受到「衰咒」：造成傷害 -30%。`)}
    }
    if(result?.hit&&target?.alive&&sourceIsMelee(attacker,target)&&this.hasPassive(target,'mikiri')){target.mikiriTargetId=attacker.id;this.addLog(`${target.label}「見切」鎖定 ${attacker.label}。`)}
    return result;
  }
  validSkillTargets(unit,skillId){const s=this.skillById(unit,skillId);if(!s)return[];if(['potion','holy-heal'].includes(s.kind))return s.charges>0&&!unit.acted&&!unit.usedActiveSkill?[unit]:[];if(['protect','battle-song'].includes(s.kind))return s.charges>0&&!unit.acted&&!unit.usedActiveSkill?[unit]:[];return super.validSkillTargets(unit,skillId)}
  healOne(unit,target,multiplier=.5){
    const low=target.currentHP/target.stats.HP<.5,grace=low&&this.hasPassive(unit,'grace');
    let amount=unit.stats.MATK*multiplier;if(grace)amount*=1.3;amount=Math.round(amount);
    const before=target.currentHP;target.currentHP=Math.min(target.stats.HP,target.currentHP+amount);const healed=target.currentHP-before;
    const blessing=low&&target.currentHP/target.stats.HP>=.5&&this.hasPassive(unit,'blessing');if(blessing)target.blessingShield=true;
    this.addLog(`${unit.label} → ${target.label}：恢復 ${healed} HP${grace?'／恩典 +30%':''}${blessing?'／祝福：下次受傷 -30%':''}`);
    return{healed,grace,blessing};
  }
  holyHealCenters(unit,skillId){
    const s=this.skillById(unit,skillId);if(!s||s.kind!=='holy-heal'||s.charges<=0||unit.acted||unit.usedActiveSkill)return[];
    const cells=[];for(let y=0;y<this.height;y++)for(let x=0;x<this.width;x++){const d=Math.abs(x-unit.x)+Math.abs(y-unit.y);if(d<1||d>s.range||this.walls.has(this.key(x,y)))continue;const point={x,y};if(this.hasLOSForRange(unit,point,s.range))cells.push(point)}return cells;
  }
  holyHealBandCells(unit,x,y){
    const dx=Math.sign(x-unit.x),dy=Math.sign(y-unit.y);if(!dx&&!dy)return[];const px=-dy,py=dx;
    return[[x,y],[x+px,y+py],[x-px,y-py]].filter(([cx,cy])=>this.inBounds(cx,cy));
  }
  useHolyHealAt(unit,skillId,x,y){
    const s=this.skillById(unit,skillId);if(!s||s.kind!=='holy-heal'||!this.holyHealCenters(unit,skillId).some(c=>c.x===x&&c.y===y))return{ok:false};
    const repeated=this.hasPassive(unit,'reformulation')&&unit.lastActiveSkillId===skillId,boost=repeated?1.3:1,cells=this.holyHealBandCells(unit,x,y);
    s.charges--;unit.usedActiveSkill=true;unit.acted=true;unit.lastActiveSkillId=skillId;
    const targets=this.living('player').filter(a=>cells.some(([cx,cy])=>a.x===cx&&a.y===cy));
    const results=targets.map(a=>({target:a,...this.healOne(unit,a,(s.healingMultiplier??.5)*boost)}));
    this.addLog(`${unit.label} 使用「${s.name}」：中心 (${x+1},${y+1})，3 格治療帶命中 ${targets.length} 名友方。`);
    return{ok:true,kind:'heal',targets,results,cells};
  }
  startWhirlingFollowup(unit,firstTarget,s,boost){unit.whirlingFollowup={firstTargetId:firstTarget.id,secondMultiplier:(s.secondMultiplier??.8)*boost};unit.postSkillMoveRemaining=2;unit.moved=false;return unit.whirlingFollowup}
  whirlingSecondTargets(unit){const pending=unit?.whirlingFollowup;if(!pending)return[];return this.living('enemy').filter(e=>e.id!==pending.firstTargetId&&this.distance(unit,e)===1)}
  resolveWhirlingSecond(unit,target,roll=Math.random){const pending=unit?.whirlingFollowup;if(!pending||!target?.alive||target.id===pending.firstTargetId||this.distance(unit,target)!==1)return{ok:false};const r=this.dealDamage(unit,target,{type:'physical',multiplier:pending.secondMultiplier,alwaysHit:true,name:'旋舞連斬・第二擊',roll});this.finishWhirling(unit,false);return{...r,ok:true}}
  finishWhirling(unit,logRemoval=false){if(!unit)return;const hadExtra=unit.postSkillMoveRemaining>0;unit.whirlingFollowup=null;unit.postSkillMoveRemaining=0;if(logRemoval&&hadExtra)this.addLog(`${unit.label}「旋舞連斬」追加移動／第二擊機會解除。`)}
  potionDirectionAvailable(unit,dx,dy){if(!unit||(!dx&&!dy)||Math.abs(dx)>1||Math.abs(dy)>1)return false;for(let d=1;d<=3;d++){const x=unit.x+dx*d,y=unit.y+dy*d;if(x<0||y<0||x>=this.width||y>=this.height)return false;if(this.walls.has(this.key(x,y)))return false;return true}return false}
  potionStartDistances(unit,dx,dy){const result=[];for(let d=1;d<=3;d++){const x=unit.x+dx*d,y=unit.y+dy*d;if(x<0||y<0||x>=this.width||y>=this.height)break;if(this.walls.has(this.key(x,y)))break;result.push(d)}return result}
  potionLineCells(unit,dx,dy,startDistance){if(!this.potionStartDistances(unit,dx,dy).includes(startDistance))return[];const cells=[];for(let i=0;i<3;i++){const d=startDistance+i,x=unit.x+dx*d,y=unit.y+dy*d;if(x<0||y<0||x>=this.width||y>=this.height)break;if(this.walls.has(this.key(x,y)))break;cells.push({x,y})}return cells}
  usePotionLine(unit,skillId,dx,dy,startDistance,roll=Math.random){const s=this.skillById(unit,skillId);if(!s||s.kind!=='potion'||s.charges<=0||unit.acted||unit.usedActiveSkill)return{ok:false};const cells=this.potionLineCells(unit,dx,dy,startDistance);if(!cells.length)return{ok:false};const repeated=this.hasPassive(unit,'reformulation')&&unit.lastActiveSkillId===skillId,boost=repeated?1.3:1,pct=Math.round(20*boost),effects=['weak','corrode','slow'],pick=effects[Math.floor(roll()*effects.length)];s.charges--;unit.usedActiveSkill=true;unit.acted=true;unit.lastActiveSkillId=skillId;const targets=this.living('enemy').filter(e=>cells.some(c=>c.x===e.x&&c.y===e.y));for(const target of targets){target.tempDebuffCasterId=unit.id;if(pick==='weak')target.tempDamageDownPct=Math.max(target.tempDamageDownPct||0,pct);if(pick==='corrode'){target.tempDefDownPct=Math.max(target.tempDefDownPct||0,pct);target.tempMdefDownPct=Math.max(target.tempMdefDownPct||0,pct)}if(pick==='slow')target.tempAgiDownPct=Math.max(target.tempAgiDownPct||0,pct)}const effectText=pick==='weak'?'傷害':pick==='corrode'?'DEF/MDEF':'AGI';this.addLog(`${unit.label} 使用「${s.name}」：3 格直線／${targets.length} 名敵人 ${effectText} -${pct}%。`);return{ok:true,targets,cells,effect:pick,pct}}
  useSkill(unit,skillId,target=unit,roll=Math.random){
    const s=this.skillById(unit,skillId);if(!s)return{ok:false};
    if(['potion','holy-heal'].includes(s.kind))return{ok:false,requiresGridAim:true};
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
      if(s.kind==='whirling'){const r=this.dealDamage(unit,target,{type:'physical',multiplier:1.2*boost,alwaysHit:true,name:s.name,roll});if(r.hit&&!this.finished){this.startWhirlingFollowup(unit,target,s,boost);return{...r,ok:true,followup:'whirling'}}return r}
      if(s.kind==='dual-damage'){const r1=this.dealDamage(unit,target,{type:'magic',multiplier:.8*boost,alwaysHit:true,name:`${s.name}・魔`,roll});const r2=target.alive?this.dealDamage(unit,target,{type:'physical',multiplier:.8*boost,alwaysHit:true,name:`${s.name}・刃`,roll}):null;return{ok:true,hit:r1.hit||r2?.hit,results:[r1,r2]}}
      if(s.kind==='arcane-band'){const dx=Math.sign(target.x-unit.x),dy=Math.sign(target.y-unit.y),px=-dy,py=dx,targets=this.living('enemy').filter(e=>[[target.x,target.y],[target.x+px,target.y+py],[target.x-px,target.y-py]].some(([x,y])=>e.x===x&&e.y===y));return{ok:true,results:targets.map(e=>this.dealDamage(unit,e,{type:'magic',multiplier:(e.id===target.id?1:.7)*boost,alwaysHit:true,name:s.name,roll}))}}
      if(s.kind==='binding'){const r=this.dealDamage(unit,target,{type:'magic',multiplier:1*boost,alwaysHit:true,name:s.name,roll});if(r.hit&&target.alive){target.rootedNextTurn=true;this.addLog(`${target.label} 受到「束縛」：下一次自身行動不能移動。`)}return r}
    }
    unit.lastActiveSkillId=skillId;
    if(repeated){const oldM=s.multiplier,oldH=s.healingMultiplier,oldB=s.moveBonus;if(oldM!=null)s.multiplier*=1.3;if(oldH!=null)s.healingMultiplier*=1.3;if(oldB!=null)s.moveBonus=Math.max(1,Math.round(oldB*1.3));const r=super.useSkill(unit,skillId,target,roll);s.multiplier=oldM;s.healingMultiplier=oldH;s.moveBonus=oldB;return r}
    return super.useSkill(unit,skillId,target,roll);
  }
}

function sourceIsMelee(attacker,target){return !!attacker&&attacker.team==='enemy'&&Math.abs(attacker.x-target.x)+Math.abs(attacker.y-target.y)<=1}
