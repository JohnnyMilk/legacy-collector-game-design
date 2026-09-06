import {Tier2BossCombatApp} from './combat-tier2-boss-app.js?v=20260906-2000';
import {Region2TwinCombatModel} from './combat-region2-twin-model.js?v=20260906-2000';
import {evaluatePartyComposition} from './combat-party.js?v=20260830-0851';

export class Region2TwinCombatApp extends Tier2BossCombatApp{
  reset(){
    this.model=new Region2TwinCombatModel(this.scenario);
    this.partyComposition=evaluatePartyComposition(this.model.units);
    this.model.partyComposition=this.partyComposition;
    this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;this.passivePage=0;this.passivePageOwnerId=null;this.enemyActivePage=0;this.enemyActivePageOwnerId=null;this.progressPage=0;this.potionDirection=null;
    this.model.start();this.result.hidden=true;this.skillHud.hidden=true;this.hud.classList.remove('minimal');
    this.root.querySelectorAll('.compact').forEach(p=>p.classList.remove('open'));
    this.renderProgress();this.render();this.driveAI();
  }
}
