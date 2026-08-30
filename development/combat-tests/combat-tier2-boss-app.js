import {CombatApp} from './combat-app.js?v=20260830-1311';
import {Tier2BossCombatModel} from './combat-tier2-boss-model.js?v=20260830-1324';
import {evaluatePartyComposition} from './combat-party.js?v=20260830-0851';

export class Tier2BossCombatApp extends CombatApp{
  reset(){
    this.model=new Tier2BossCombatModel(this.scenario);
    this.partyComposition=evaluatePartyComposition(this.model.units);
    this.model.partyComposition=this.partyComposition;
    this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;this.passivePage=0;this.passivePageOwnerId=null;this.enemyActivePage=0;this.enemyActivePageOwnerId=null;this.progressPage=0;this.potionDirection=null;
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
    if(this.model.hasPassive(u,'flow')&&(u.moved||u.whirlingFollowup?.movedBeforeFirst))buff('本回合傷害 +20%');
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
  chooseSkill(skillId){
    const u=this.model.currentUnit(),s=this.model.skillById(u,skillId);
    if(s?.kind==='potion'&&u?.team==='player'&&!u.acted&&s.charges>0){this.selectedSkillId=skillId;this.potionDirection=null;this.mode='potion-direction';this.skillHud.hidden=true;this.selectedUnitId=null;this.render();return}
    if(s?.kind==='holy-heal'&&u?.team==='player'&&!u.acted&&s.charges>0){this.selectedSkillId=skillId;this.mode='holy-heal-aim';this.skillHud.hidden=true;this.selectedUnitId=null;this.render();return}
    super.chooseSkill(skillId);
  }
  renderGrid(){
    super.renderGrid();
    const u=this.model.currentUnit();if(!u?.alive||u.team!=='player')return;
    const cells=[...this.grid.children];
    const at=(x,y)=>cells[y*this.model.width+x];
    if(this.mode==='whirl-followup'&&u.whirlingFollowup){
      const range=new Set();for(const [k] of this.model.reachable(u))range.add(k);range.add(this.model.key(u.x,u.y));for(const k of range){const [x,y]=k.split(',').map(Number);if(!this.model.walls.has(k))at(x,y)?.classList.add('range-hostile')}
      for(const t of this.model.whirlingSecondTargets(u))at(t.x,t.y)?.classList.add('target','range-hostile');
    }
    if(this.mode==='potion-direction'){
      for(const [dx,dy] of [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]])if(this.model.potionDirectionAvailable(u,dx,dy)){const x=u.x+dx,y=u.y+dy;at(x,y)?.classList.add('range-hostile')}
    }
    if(this.mode==='potion-start'&&this.potionDirection){
      const {dx,dy}=this.potionDirection;for(const d of this.model.potionStartDistances(u,dx,dy)){const x=u.x+dx*d,y=u.y+dy*d;at(x,y)?.classList.add('range-hostile')}
    }
    if(this.mode==='holy-heal-aim')for(const c of this.model.holyHealCenters(u,this.selectedSkillId))at(c.x,c.y)?.classList.add('range-friendly');
  }
  onCell(x,y,target){
    const u=this.model.currentUnit();if(!u||u.team!=='player'||this.model.finished)return super.onCell(x,y,target);
    if(this.mode==='holy-heal-aim'){
      const r=this.model.useHolyHealAt(u,this.selectedSkillId,x,y);if(r.ok){this.mode='idle';this.selectedSkillId=null;this.afterPlayerAction()}return;
    }
    if(this.mode==='potion-direction'){
      const dx=Math.sign(x-u.x),dy=Math.sign(y-u.y);if(Math.max(Math.abs(x-u.x),Math.abs(y-u.y))!==1||!this.model.potionDirectionAvailable(u,dx,dy))return;this.potionDirection={dx,dy};this.mode='potion-start';this.render();return;
    }
    if(this.mode==='potion-start'&&this.potionDirection){
      const {dx,dy}=this.potionDirection;let d=null;for(let n=1;n<=3;n++)if(u.x+dx*n===x&&u.y+dy*n===y)d=n;if(!d||!this.model.potionStartDistances(u,dx,dy).includes(d))return;const r=this.model.usePotionLine(u,this.selectedSkillId,dx,dy,d);if(r.ok){this.mode='idle';this.selectedSkillId=null;this.potionDirection=null;this.afterPlayerAction()}return;
    }
    if(this.mode==='whirl-followup'&&u.whirlingFollowup){
      if(target?.team==='enemy'){
        if(target.id===u.whirlingFollowup.firstTargetId)return;
        const movedBeforeFirst=!!u.whirlingFollowup.movedBeforeFirst,savedMoved=u.moved;if(movedBeforeFirst)u.moved=true;
        const r=this.model.resolveWhirlingSecond(u,target);if(!r.ok){u.moved=savedMoved;return}this.mode='idle';this.selectedSkillId=null;this.model.endTurn();this.render();this.driveAI();return;
      }
      if(!target&&!u.moved&&this.model.reachable(u).has(this.model.key(x,y))){if(this.model.move(u,x,y)){this.mode='whirl-followup';this.render()}return}
      return;
    }
    if(this.mode==='skill'&&this.selectedSkillId){
      const s=this.model.skillById(u,this.selectedSkillId);if(s?.kind==='whirling'){
        const legal=target&&this.model.validSkillTargets(u,this.selectedSkillId).some(t=>t.id===target.id);if(!legal)return;const movedBeforeFirst=u.moved,r=this.model.useSkill(u,this.selectedSkillId,target);if(r.ok&&r.followup==='whirling'){if(u.whirlingFollowup)u.whirlingFollowup.movedBeforeFirst=movedBeforeFirst;this.mode='whirl-followup';this.selectedSkillId=null;this.skillHud.hidden=true;this.selectedUnitId=null;this.render();return}if(r.ok){this.mode='idle';this.selectedSkillId=null;this.skillHud.hidden=true;this.afterPlayerAction()}return;
      }
    }
    super.onCell(x,y,target);
  }
  renderButtons(){
    super.renderButtons();
    const u=this.model.currentUnit();
    if(this.mode==='whirl-followup'&&u?.whirlingFollowup){this.q('#move-btn').disabled=true;this.q('#attack-btn').disabled=true;this.q('#skill-btn').disabled=true;this.q('#end-btn').disabled=false;this.q('#end-btn').textContent='結束連段'}
    if(this.mode==='potion-direction'||this.mode==='potion-start'||this.mode==='holy-heal-aim'){this.q('#move-btn').disabled=true;this.q('#attack-btn').disabled=true;this.q('#skill-btn').disabled=false;this.q('#skill-btn').textContent='取消瞄準';this.q('#end-btn').disabled=true}else this.q('#skill-btn').textContent='主動技能';
  }
  bindEvents(){
    super.bindEvents();
    const baseSkill=this.q('#skill-btn').onclick,baseEnd=this.q('#end-btn').onclick;
    this.q('#skill-btn').onclick=()=>{if(this.mode==='potion-direction'||this.mode==='potion-start'||this.mode==='holy-heal-aim'){this.mode='idle';this.selectedSkillId=null;this.potionDirection=null;this.render();return}baseSkill()};
    this.q('#end-btn').onclick=()=>{const u=this.model.currentUnit();if(this.mode==='whirl-followup'&&u?.whirlingFollowup){this.model.finishWhirling(u,true);this.mode='idle';this.selectedSkillId=null;this.model.endTurn();this.render();this.driveAI();return}baseEnd()};
  }
}
