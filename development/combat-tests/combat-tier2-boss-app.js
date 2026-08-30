import {CombatApp} from './combat-app.js?v=20260830-0924';
import {Tier2BossCombatModel} from './combat-tier2-boss-model.js?v=20260830-0951';
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
    if(u.rootedNextTurn)debuff('束縛');
    const marks=Object.values(u.manaMarks||{}).reduce((sum,n)=>sum+(Number(n)||0),0);if(marks)debuff(`刻印 ×${marks}`);
    if(u.blessingShield)buff('祝福 -30%');
    if(u.battleSongBuff)buff('戰歌 +20%');
    if(u.protectActive)buff('守護');
    if(u.postSkillMoveRemaining>0)buff(`追加移動 ${u.postSkillMoveRemaining}`);
    if(u.guerrillaActive)buff('EVA +20%');
    if(u.tempEvaBonus)buff(`EVA +${u.tempEvaBonus}%`);
    if(u.manaWeaveNext)buff(`交織→${u.manaWeaveNext==='magic'?'魔法':'物理'}`);
    if(u.mikiriTargetId)buff('見切');
    if(this.model.hasPassive(u,'rage')&&u.currentHP/u.stats.HP<.5)buff('狂怒 +30%');
    if(this.model.hasPassive(u,'hold-fast')&&u.directDamageHitsSinceOwnTurn>=1)buff('堅守 -30%');
    if(this.model.hasPassive(u,'ancient-ward')&&u.directDamageHitsSinceOwnTurn>=1)buff('護壁 -20%');
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
