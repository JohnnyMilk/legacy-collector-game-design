import {CombatApp} from './combat-app.js?v=20260830-0905';
import {Tier2BossCombatModel} from './combat-tier2-boss-model.js?v=20260830-0905';
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
}
