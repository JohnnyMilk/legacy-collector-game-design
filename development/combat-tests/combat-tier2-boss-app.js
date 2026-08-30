import {CombatApp} from './combat-app.js?v=20260830-0924';
import {Tier2BossCombatModel} from './combat-tier2-boss-model.js?v=20260830-1006';
import {evaluatePartyComposition} from './combat-party.js?v=20260830-0851';

export class Tier2BossCombatApp extends CombatApp{
  reset(){
    this.model=new Tier2BossCombatModel(this.scenario);
    this.partyComposition=evaluatePartyComposition(this.model.units);
    this.model.partyComposition=this.partyComposition;
    this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;this.passivePage=0;this.passivePageOwnerId=null;this.progressPage=0;
    this.model.start();this.result.hidden=true;this.skillHud.hidden=true;this.hud.classList.remove('minimal');
    this.root.querySelectorAll('.compact').forEach(p=>p.classList.remove('open'));
    this.renderProgress();this.render();this.driveAI();
  }
  statusTags(u){
    const tags=[];
    const buff=(text)=>tags.push({type:'buff',text}),debuff=(text)=>tags.push({type:'debuff',text});
    if(u.tempDamageDownPct)debuff(`傷害 -${u.tempDamageDownPct}%`);
    if(u.tempDefDownPct)debuff(`DEF -${u.tempDefDownPct}%`);
    if(u.tempMdefDownPct)debuff(`MDEF -${u.tempMdefDownPct}%`);
    if(u.tempAgiDownPct)debuff(`AGI -${u.tempAgiDownPct}%`);
    if(u.rootedNextTurn)debuff('MOVE = 0');
    const marks=Object.values(u.manaMarks||{}).reduce((sum,n)=>sum+(Number(n)||0),0);if(marks)debuff(`刻印 ×${marks}`);
    if(u.blessingShield)buff('下次受傷 -30%');
    if(u.battleSongBuff)buff('本次行動傷害 +20%');
    if(u.protectActive)buff('友方傷害轉移');
    if(u.postSkillMoveRemaining>0)buff(`追加 MOVE +${u.postSkillMoveRemaining}`);
    if(u.guerrillaActive)buff('EVA +20%');
    if(u.tempEvaBonus)buff(`EVA +${u.tempEvaBonus}%`);
    if(u.manaWeaveNext)buff(`下次${u.manaWeaveNext==='magic'?'魔法':'物理'}傷害 +25%`);
    if(u.mikiriTargetId)buff('對鎖定目標傷害 +30%');
    if(this.model.hasPassive(u,'rage')&&u.currentHP/u.stats.HP<.5)buff('傷害 +30%');
    if(this.model.hasPassive(u,'flow')&&u.moved&&!u.acted)buff('本回合傷害 +20%');
    if(this.model.hasPassive(u,'focus')&&!u.moved&&!u.acted)buff('未移動技能傷害 +30%');
    if(this.model.hasPassive(u,'guard'))buff('鄰近友方受傷 -25%');
    if(this.model.hasPassive(u,'hold-fast')&&u.directDamageHitsSinceOwnTurn>=1)buff('後續直傷 -30%');
    if(this.model.hasPassive(u,'ancient-ward')&&u.directDamageHitsSinceOwnTurn>=1)buff('後續直傷 -20%');
    return tags;
  }
  renderTimeline(){
    this.timeline.innerHTML='';
    this.model.queue.forEach((id,i)=>{
      const u=this.model.units.find(x=>x.id===id);if(!u||!u.alive)return;
      const item=document.createElement('div');item.className=`timeline-unit ${u.team}${i===this.model.turnIndex?' current':''}${i<this.model.turnIndex?' done':''}`;
      const tags=this.statusTags(u),status=tags.length?`<div class="turn-status-list">${tags.map(t=>`<span class="turn-status ${t.type}">${t.text}</span>`).join('')}</div>`:'';
      item.innerHTML=`<strong>${u.label}</strong>${status}`;
      this.timeline.appendChild(item);
    });
  }
}
