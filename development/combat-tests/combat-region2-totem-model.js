import {Tier2BossCombatModel} from './combat-tier2-boss-model.js?v=20260906-1234';

export class Region2TotemCombatModel extends Tier2BossCombatModel{
  constructor(scenario){
    super(scenario);
    const boss=this.boss();if(boss){boss.totemRebuildDelayTurns=0;boss.pursuitTargetId=null}
  }
  nextRound(){
    this.round++;
    this.units.forEach(u=>{u.moved=false;u.acted=false;u.waited=false});
    this.queue=this.living().filter(u=>!u.isTotem).slice().sort((a,b)=>this.effectiveStat(b,'AGI')-this.effectiveStat(a,'AGI')||(a.team===b.team?a.spawnOrder-b.spawnOrder:(a.team==='player'?-1:1))).map(u=>u.id);
    this.turnIndex=0;this.beginOwnTurn(this.currentUnit());this.addLog(`Round ${this.round} 開始。`);
  }
  boss(){return this.units.find(u=>u.bossKey==='region2FinalBoss')||null}
  livingTotems(){return this.living('enemy').filter(u=>u.isTotem)}
  missingTotems(){return this.units.filter(u=>u.isTotem&&!u.alive)}
  totemBonusPct(unit,stat){
    if(unit?.bossKey!=='region2FinalBoss')return 0;
    return this.livingTotems().filter(t=>t.buffStat===stat).reduce((sum,t)=>sum+(t.buffPct||0),0);
  }
  effectiveStat(unit,stat){
    const value=super.effectiveStat(unit,stat),pct=this.totemBonusPct(unit,stat);
    return value*(1+pct/100);
  }
  baseDamage(attacker,target,type='physical',multiplier=1){
    const attackStat=type==='magic'?'MATK':'ATK',defenseStat=type==='magic'?'MDEF':'DEF';
    return Math.max(1,this.effectiveStat(attacker,attackStat)*multiplier-this.effectiveStat(target,defenseStat));
  }
  checkEnd(){
    if(this.living('player').length===0){super.checkEnd();return}
    const boss=this.boss();
    if(boss&&!boss.alive&&!this.finished){
      this.units.filter(u=>u.isTotem&&u.alive).forEach(u=>{u.alive=false;u.currentHP=0});
      this.finished=true;this.result='victory';this.addLog('四印祭主被擊破，剩餘圖騰失去力量。戰鬥勝利。');
    }
  }
  dealDamage(attacker,target,options={}){
    const wasAlive=!!target?.alive,result=super.dealDamage(attacker,target,options);
    if(wasAlive&&target?.isTotem&&!target.alive){
      const boss=this.boss();if(boss?.alive)boss.totemRebuildDelayTurns=Math.max(boss.totemRebuildDelayTurns||0,1);
      this.addLog(`${target.label} 被破壞：四印祭主的 ${target.buffStat} +${target.buffPct}% 立即解除；下一次行動不能使用「圖騰再塑」。`);
    }
    return result;
  }
  endTurn(){
    const unit=this.currentUnit();
    if(unit?.bossKey==='region2FinalBoss'&&unit.totemRebuildDelayTurns>0&&this.missingTotems().length){
      unit.totemRebuildDelayTurns--;
      if(unit.totemRebuildDelayTurns===0)this.addLog('四印祭主的圖騰重建延遲解除；下一次行動可使用「圖騰再塑」。');
    }
    return super.endTurn();
  }
  crossTargets(center){
    return this.living('player').filter(u=>Math.abs(u.x-center.x)+Math.abs(u.y-center.y)<=1);
  }
  legalTotemCells(){
    const open=[];
    for(let y=0;y<this.height;y++)for(let x=0;x<this.width;x++){
      if(this.walls.has(this.key(x,y))||this.unitAt(x,y))continue;
      open.push({x,y});
    }
    const spaced=open.filter(cell=>this.living().every(u=>Math.max(Math.abs(u.x-cell.x),Math.abs(u.y-cell.y))>1));
    return spaced.length?spaced:open;
  }
  rebuildTotem(roll=Math.random){
    const missing=this.missingTotems(),cells=this.legalTotemCells();
    if(!missing.length||!cells.length)return null;
    const totem=missing[Math.min(missing.length-1,Math.floor(roll()*missing.length))];
    const cell=cells[Math.min(cells.length-1,Math.floor(roll()*cells.length))];
    Object.assign(totem,{x:cell.x,y:cell.y,currentHP:totem.stats.HP,alive:true,moved:false,acted:false,waited:false});
    this.addLog(`四印祭主「圖騰再塑」：${totem.label}於 (${cell.x+1},${cell.y+1}) 重新出現，${totem.buffStat} +${totem.buffPct}% 恢復。`);
    return totem;
  }
  useSkill(unit,skillId,target=unit,roll=Math.random){
    const skill=this.skillById(unit,skillId);
    if(!skill)return {ok:false};
    if(skill.kind==='totem-rebuild'){
      if(skill.charges<=0||unit.acted||unit.usedActiveSkill||!unit.alive||unit.totemRebuildDelayTurns>0||!this.missingTotems().length)return {ok:false};
      const totem=this.rebuildTotem(roll);if(!totem)return {ok:false};
      skill.charges--;unit.usedActiveSkill=true;unit.acted=true;
      return {ok:true,kind:'totem-rebuild',totem};
    }
    if(skill.kind==='cross-aoe'){
      const legal=skill.charges>0&&!unit.acted&&!unit.usedActiveSkill&&unit.alive&&target?.alive&&target.team!==unit.team&&this.distance(unit,target)<=skill.range&&this.hasLOSForRange(unit,target,skill.range);
      if(!legal)return {ok:false};
      skill.charges--;unit.usedActiveSkill=true;unit.acted=true;
      const targets=this.crossTargets(target);this.addLog(`${unit.label} 使用「${skill.name}」。`);
      const results=targets.map(t=>this.dealDamage(unit,t,{type:skill.damageType,multiplier:skill.multiplier??1,alwaysHit:skill.alwaysHit!==false,name:skill.name,roll}));
      return {ok:true,kind:'cross-aoe',targets,results};
    }
    return super.useSkill(unit,skillId,target,roll);
  }
  crossSkillTarget(unit,skill){
    return this.living('player').filter(t=>this.distance(unit,t)<=skill.range&&this.hasLOSForRange(unit,t,skill.range)).map(t=>({target:t,count:this.crossTargets(t).length})).sort((a,b)=>b.count-a.count||a.target.currentHP-b.target.currentHP||a.target.spawnOrder-b.target.spawnOrder)[0]||null;
  }
  rootSkillTarget(unit,skill){
    const targets=this.living('player').filter(t=>this.distance(unit,t)<=skill.range&&this.hasLOSForRange(unit,t,skill.range));
    return targets.sort((a,b)=>{
      const ap=this.baseDamage(unit,a,'physical',skill.multiplier??1),am=this.baseDamage(unit,a,'magic',1),bp=this.baseDamage(unit,b,'physical',skill.multiplier??1),bm=this.baseDamage(unit,b,'magic',1);
      const as=(ap>=a.currentHP?1000:0)+(ap-am),bs=(bp>=b.currentHP?1000:0)+(bp-bm);
      return bs-as||a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder;
    })[0]||null;
  }
  tryBossSkill(unit){
    if(unit?.bossKey!=='region2FinalBoss')return super.tryBossSkill(unit);
    const rebuild=(unit.activeSkills||[]).find(s=>s.id==='totem-reconstruction'&&s.charges>0);
    if(rebuild&&this.missingTotems().length&&unit.totemRebuildDelayTurns<=0)return !!this.useSkill(unit,rebuild.id,unit).ok;
    const cross=(unit.activeSkills||[]).find(s=>s.id==='sigil-current'&&s.charges>0),crossPick=cross&&this.crossSkillTarget(unit,cross);
    if(crossPick?.count>=2)return !!this.useSkill(unit,cross.id,crossPick.target).ok;
    const root=(unit.activeSkills||[]).find(s=>s.id==='root-lance'&&s.charges>0),rootTarget=root&&this.rootSkillTarget(unit,root);
    if(rootTarget){
      const physical=this.baseDamage(unit,rootTarget,'physical',root.multiplier??1),magic=this.baseDamage(unit,rootTarget,'magic',1);
      if(physical>=rootTarget.currentHP||physical>=magic+5)return !!this.useSkill(unit,root.id,rootTarget).ok;
    }
    return false;
  }
  pursuitTarget(unit){
    const current=this.living('player').find(u=>u.id===unit.pursuitTargetId);
    if(current)return current;
    const target=this.living('player').slice().sort((a,b)=>this.distance(unit,a)-this.distance(unit,b)||a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder)[0]||null;
    if(target){unit.pursuitTargetId=target.id;this.addLog(`${unit.label} 鎖定 ${target.label}，開始追擊。`)}
    return target;
  }
  moveTowardPursuit(unit,target){
    if(!target||unit.moved||this.distance(unit,target)<=2)return false;
    const currentDistance=this.distance(unit,target),cells=[...this.reachable(unit).keys()].map(key=>{const [x,y]=key.split(',').map(Number);return{x,y,d:Math.abs(x-target.x)+Math.abs(y-target.y)}}).filter(cell=>cell.d<currentDistance).sort((a,b)=>a.d-b.d||Math.abs(a.x-unit.x)+Math.abs(a.y-unit.y)-Math.abs(b.x-unit.x)-Math.abs(b.y-unit.y)||a.y-b.y||a.x-b.x);
    return !!(cells[0]&&this.move(unit,cells[0].x,cells[0].y));
  }
  aiTurn(unit){
    if(unit?.bossKey!=='region2FinalBoss')return super.aiTurn(unit);
    if(this.finished||!unit?.alive)return;
    const rebuild=(unit.activeSkills||[]).find(s=>s.id==='totem-reconstruction'&&s.charges>0);
    if(rebuild&&this.missingTotems().length&&unit.totemRebuildDelayTurns<=0){
      this.useSkill(unit,rebuild.id,unit);this.endTurn();return;
    }
    const target=this.pursuitTarget(unit);
    this.moveTowardPursuit(unit,target);
    if(!unit.acted)this.tryBossSkill(unit);
    if(!unit.acted){
      const valid=this.validTargets(unit),attackTarget=valid.find(t=>t.id===unit.pursuitTargetId)||valid.sort((a,b)=>a.currentHP-b.currentHP||a.spawnOrder-b.spawnOrder)[0];
      if(attackTarget)this.attack(unit,attackTarget);
    }
    this.endTurn();
  }
}
