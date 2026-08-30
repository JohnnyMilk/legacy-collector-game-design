import {CombatModel} from './combat-model.js?v=20260829-1940';

export class BossCombatModel extends CombatModel{
  constructor(scenario){super(scenario);this.units.forEach(u=>{u.tempDefDownPct=0;u.tempEvaBonus=0;u.coreRegenerationUsed=false})}
  beginOwnTurn(unit){
    const hadEva=!!unit?.tempEvaBonus,hadWard=!!(unit&&this.hasPassive(unit,'ancient-ward')&&unit.directDamageHitsSinceOwnTurn>=1);
    super.beginOwnTurn(unit);
    if(unit){
      unit.tempEvaBonus=0;
      if(hadEva)this.addLog(`${unit.label}「獵殺本能」EVA +15 效果解除。`);
      if(hadWard)this.addLog(`${unit.label}「古代護壁」減傷狀態重置。`);
    }
  }
  endTurn(){const u=this.currentUnit(),clearDef=!!(u?.tempDefDownPct&&!u?.tempDebuffCasterId);const result=super.endTurn();if(u&&clearDef){u.tempDefDownPct=0;this.addLog(`${u.label} DEF 減益效果解除。`)}return result}
  effectiveStat(unit,stat){let value=super.effectiveStat(unit,stat);if(stat==='DEF'&&unit.tempDefDownPct)value*=1-unit.tempDefDownPct/100;return value}
  hitChance(attacker,target){let base=super.hitChance(attacker,target);if(attacker&&!attacker.moved&&this.hasPassive(attacker,'targeting-program'))base+=5;return Math.max(80,Math.min(100,base-(target.tempEvaBonus||0)/2))}
  incomingDirectDamage(target,damage,source){let final=super.incomingDirectDamage(target,damage,source);if(source?.team==='player'&&target.team==='enemy'&&this.hasPassive(target,'ancient-ward')){if(target.directDamageHitsSinceOwnTurn>=1)final*=.8;target.directDamageHitsSinceOwnTurn++}return Math.max(1,Math.round(final))}
  maybeCoreRegenerate(target){if(!target.alive||target.coreRegenerationUsed||!this.hasPassive(target,'core-regeneration'))return;if(target.currentHP>0&&target.currentHP/target.stats.HP<=.5){target.coreRegenerationUsed=true;const amount=Math.round(target.stats.HP*.15);target.currentHP=Math.min(target.stats.HP,target.currentHP+amount);this.addLog(`${target.label}「核心再生」恢復 ${amount} HP。`)}}
  dealDamage(attacker,target,options={}){const before=target.currentHP;let extra=options.extraPct||0;if(attacker?.team==='enemy'&&!attacker.moved&&this.hasPassive(attacker,'targeting-program')&&(options.type||attacker.attack?.type)==='physical')extra+=10;const boosted=attacker?.team==='enemy'&&attacker.moved&&this.hasPassive(attacker,'hunting-instinct')?{...options,extraPct:extra+20}:{...options,extraPct:extra};const result=super.dealDamage(attacker,target,boosted);if(result?.hit&&target.alive&&target.currentHP<before)this.maybeCoreRegenerate(target);return result}
  applyHuntingInstinct(unit,movedBefore,result){if(result?.hit&&movedBefore&&this.hasPassive(unit,'hunting-instinct')){unit.tempEvaBonus=15;this.addLog(`${unit.label}「獵殺本能」啟動：傷害 +20%／EVA +15。`)}}
  attack(attacker,target,roll=Math.random){const movedBefore=attacker.moved;const result=super.attack(attacker,target,roll);if(result?.ok&&attacker.team==='enemy')this.applyHuntingInstinct(attacker,movedBefore,result);return result}
  useSkill(unit,skillId,target=unit,roll=Math.random){const s=this.skillById(unit,skillId);if(!s)return {ok:false};
    if(s.kind==='multi-damage'){
      if(s.charges<=0||unit.acted||unit.usedActiveSkill||!unit.alive||!target?.alive||target.team===unit.team||this.distance(unit,target)>s.range||!this.hasLOSForRange(unit,target,s.range))return {ok:false};
      s.charges--;unit.usedActiveSkill=true;unit.acted=true;this.addLog(`${unit.label} 使用「${s.name}」。`);
      const results=[];for(let i=0;i<(s.hits||2)&&target.alive;i++)results.push(this.dealDamage(unit,target,{type:s.damageType,multiplier:s.multiplier??1,alwaysHit:s.alwaysHit===true,name:`${s.name}・${i+1}`,roll}));
      return {ok:true,kind:'multi-damage',results};
    }
    if(s.kind==='aoe-damage'){
      if(s.charges<=0||unit.acted||unit.usedActiveSkill||!unit.alive)return {ok:false};
      s.charges--;unit.usedActiveSkill=true;unit.acted=true;
      const targets=this.living(unit.team==='player'?'enemy':'player').filter(t=>Math.max(Math.abs(unit.x-t.x),Math.abs(unit.y-t.y))<=1);
      this.addLog(`${unit.label} 使用「${s.name}」。`);
      const results=targets.map(t=>this.dealDamage(unit,t,{type:s.damageType,multiplier:s.multiplier??1,alwaysHit:s.alwaysHit!==false,name:s.name,roll}));
      return {ok:true,kind:'aoe-damage',results};
    }
    const movedBefore=unit.moved;const result=super.useSkill(unit,skillId,target,roll);
    if(result?.hit&&s.defDownPct){target.tempDefDownPct=Math.max(target.tempDefDownPct||0,s.defDownPct);this.addLog(`${target.label} DEF -${s.defDownPct}%（至其行動結束）。`)}
    if(result?.ok&&unit.team==='enemy')this.applyHuntingInstinct(unit,movedBefore,result);
    return result;
  }
  bossSkillTarget(unit,skill){if(skill.kind==='aoe-damage')return this.living('player').filter(t=>Math.max(Math.abs(unit.x-t.x),Math.abs(unit.y-t.y))<=1);return this.living('player').filter(t=>this.distance(unit,t)<=skill.range&&this.hasLOSForRange(unit,t,skill.range)).sort((a,b)=>a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder)}
  tryBossSkill(unit){const skills=unit.activeSkills||[];const aoe=skills.find(s=>s.id==='ground-cleave'&&s.charges>0);if(aoe&&this.bossSkillTarget(unit,aoe).length>=2){this.useSkill(unit,aoe.id,unit);return true}const armor=skills.find(s=>s.id==='armor-break'&&s.charges>0);if(armor){const targets=this.bossSkillTarget(unit,armor);if(targets.length){this.useSkill(unit,armor.id,targets[0]);return true}}const pulse=skills.find(s=>s.id==='ruin-pulse'&&s.charges>0);if(pulse){const targets=this.bossSkillTarget(unit,pulse);if(targets.length){this.useSkill(unit,pulse.id,targets[0]);return true}}return false}
  supportHealTarget(unit,skill){return this.living(unit.team).filter(t=>t.currentHP<t.stats.HP&&(skill.allowSelf||t.id!==unit.id)&&this.distance(unit,t)<=skill.range&&this.hasLOSForRange(unit,t,skill.range)).sort((a,b)=>a.currentHP/a.stats.HP-b.currentHP/b.stats.HP||a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder)[0]||null}
  trySupportHeal(unit){const skill=(unit.activeSkills||[]).find(s=>s.kind==='heal'&&s.charges>0);if(!skill||unit.acted)return false;const target=this.supportHealTarget(unit,skill);if(!target)return false;return !!this.useSkill(unit,skill.id,target).ok}
  moveTowardInjuredAlly(unit){const skill=(unit.activeSkills||[]).find(s=>s.kind==='heal'&&s.charges>0);if(!skill||unit.moved)return false;const injured=this.living(unit.team).filter(t=>t.currentHP<t.stats.HP&&(skill.allowSelf||t.id!==unit.id)).sort((a,b)=>a.currentHP/a.stats.HP-b.currentHP/b.stats.HP||a.spawnOrder-b.spawnOrder)[0];if(!injured)return false;let pick=null;for(const k of this.reachable(unit).keys()){const [x,y]=k.split(',').map(Number),d=Math.abs(x-injured.x)+Math.abs(y-injured.y);if(!pick||d<pick.d)pick={x,y,d}}return !!(pick&&this.move(unit,pick.x,pick.y))}
  tryEnemyCombatSkill(unit){const skill=(unit.activeSkills||[]).find(s=>['multi-damage','damage'].includes(s.kind)&&s.charges>0);if(!skill||unit.acted)return false;const targets=this.living('player').filter(t=>this.distance(unit,t)<=skill.range&&this.hasLOSForRange(unit,t,skill.range)).sort((a,b)=>a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder);return !!(targets[0]&&this.useSkill(unit,skill.id,targets[0]).ok)}
  aiTurn(unit){
    if(!unit||unit.team!=='enemy'||this.finished)return;
    if(unit.bossKey){if(!this.tryBossSkill(unit)&&!unit.moved){const players=this.living('player');const nearest=players.slice().sort((a,b)=>this.distance(unit,a)-this.distance(unit,b)||a.spawnOrder-b.spawnOrder)[0];let pick=null;for(const k of this.reachable(unit).keys()){const [x,y]=k.split(',').map(Number),d=Math.abs(x-nearest.x)+Math.abs(y-nearest.y);if(!pick||d<pick.d)pick={x,y,d}}if(pick)this.move(unit,pick.x,pick.y)}if(!unit.acted&&!this.tryBossSkill(unit)){const target=this.validTargets(unit).sort((a,b)=>a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder)[0];if(target)this.attack(unit,target)}this.endTurn();return}
    if(this.trySupportHeal(unit)){this.endTurn();return}
    if((unit.activeSkills||[]).some(s=>s.kind==='heal'&&s.charges>0)&&this.moveTowardInjuredAlly(unit)&&this.trySupportHeal(unit)){this.endTurn();return}
    if(this.tryEnemyCombatSkill(unit)){this.endTurn();return}
    super.aiTurn(unit)
  }
}
