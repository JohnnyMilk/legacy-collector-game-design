import {Tier2BossCombatModel} from './combat-tier2-boss-model.js?v=20260906-1234';

export class Region2TwinCombatModel extends Tier2BossCombatModel{
  constructor(scenario){
    super(scenario);
    this.units.forEach(u=>Object.assign(u,{twinDefDownSource:null,twinMdefDownSource:null}));
  }
  twin(unit,key){return !!unit&&unit.bossKey==='region2MiniBossTwin'&&(!key||unit.twinKey===key)}
  livingTwin(key){return this.living('enemy').find(u=>this.twin(u,key))||null}
  twinSynergyReady(unit,target,type){
    if(this.twin(unit,'thorn-fang')&&type==='physical')return !!this.livingTwin('moss-heart')&&target.twinDefDownSource==='moss-heart'&&target.tempDefDownPct>0;
    if(this.twin(unit,'moss-heart')&&type==='magic')return !!this.livingTwin('thorn-fang')&&target.twinMdefDownSource==='thorn-fang'&&target.tempMdefDownPct>0;
    return false;
  }
  dealDamage(attacker,target,options={}){
    const type=options.type||attacker?.attack?.type||'physical',synergy=this.twinSynergyReady(attacker,target,type);
    if(synergy)this.addLog(`${attacker.label}「${this.twin(attacker,'thorn-fang')?'逐腐':'循咒'}」觸發：同根呼應傷害 +15%。`);
    return super.dealDamage(attacker,target,{...options,extraPct:(options.extraPct||0)+(synergy?15:0)});
  }
  useSkill(unit,skillId,target=unit,roll=Math.random){
    const skill=this.skillById(unit,skillId),result=super.useSkill(unit,skillId,target,roll);
    if(!result?.hit||!target?.alive||!this.twin(unit))return result;
    if(skill?.mdefDownPct){
      target.tempMdefDownPct=Math.max(target.tempMdefDownPct||0,skill.mdefDownPct);
      target.twinMdefDownSource=unit.twinKey;
      this.addLog(`${target.label} MDEF -${skill.mdefDownPct}%（至其行動結束）。`);
    }
    if(skill?.defDownPct)target.twinDefDownSource=unit.twinKey;
    return result;
  }
  endTurn(){
    const unit=this.currentUnit(),clearTwinDef=!!unit?.twinDefDownSource,clearTwinMdef=!!unit?.twinMdefDownSource;
    const result=super.endTurn();
    if(unit&&clearTwinDef)unit.twinDefDownSource=null;
    if(unit&&clearTwinMdef){
      const pct=unit.tempMdefDownPct;
      unit.tempMdefDownPct=0;unit.twinMdefDownSource=null;
      if(pct)this.addLog(`${unit.label} MDEF -${pct}% 減益效果解除。`);
    }
    return result;
  }
  synergyPriority(unit,target){
    if(this.twin(unit,'thorn-fang'))return target.twinDefDownSource==='moss-heart'&&target.tempDefDownPct>0?1:0;
    if(this.twin(unit,'moss-heart'))return target.twinMdefDownSource==='thorn-fang'&&target.tempMdefDownPct>0?1:0;
    return 0;
  }
  bossSkillTarget(unit,skill){
    const targets=super.bossSkillTarget(unit,skill);
    if(!this.twin(unit))return targets;
    return targets.sort((a,b)=>this.synergyPriority(unit,b)-this.synergyPriority(unit,a)||a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder);
  }
  tryBossSkill(unit){
    if(!this.twin(unit))return super.tryBossSkill(unit);
    const skill=(unit.activeSkills||[]).find(s=>s.charges>0);
    if(!skill)return false;
    const target=this.bossSkillTarget(unit,skill)[0];
    return !!(target&&this.useSkill(unit,skill.id,target).ok);
  }
}
