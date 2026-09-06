import {Tier2BossCombatApp} from './combat-tier2-boss-app.js?v=20260906-2200';
import {Region2TotemCombatModel} from './combat-region2-totem-model.js?v=20260906-2200';
import {evaluatePartyComposition} from './combat-party.js?v=20260830-0851';

export class Region2TotemCombatApp extends Tier2BossCombatApp{
  unitGlyph(unit){
    if(unit?.isTotem)return {'strength':'力','defense':'防','magic-defense':'抗','magic-attack':'魔'}[unit.totemKey]||'印';
    return super.unitGlyph(unit);
  }
  reset(){
    this.model=new Region2TotemCombatModel(this.scenario);
    this.partyComposition=evaluatePartyComposition(this.model.units);
    this.model.partyComposition=this.partyComposition;
    this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;this.passivePage=0;this.passivePageOwnerId=null;this.enemyActivePage=0;this.enemyActivePageOwnerId=null;this.progressPage=0;this.potionDirection=null;
    this.model.start();this.result.hidden=true;this.skillHud.hidden=true;this.hud.classList.remove('minimal');
    this.root.querySelectorAll('.compact').forEach(p=>p.classList.remove('open'));
    this.renderProgress();this.render();this.driveAI();
  }
  statusTags(unit){
    const tags=super.statusTags(unit);
    if(unit?.bossKey==='region2FinalBoss')for(const totem of this.model.livingTotems())tags.push({type:'buff',text:`${totem.buffStat} +${totem.buffPct}%`});
    return tags;
  }
}
