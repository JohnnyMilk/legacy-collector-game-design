import {CombatModel} from './combat-model.js?v=20260829-1940';
import {evaluatePartyComposition} from './combat-party.js?v=20260829-1915';

export function mountCombatShell(root,{brandHref='../combat-test-index.html',demoLabel='Combat'}={}){
  root.innerHTML=`
    <div class="battlefield-layer"><div id="battle-grid" class="battle-grid" aria-label="戰場"></div></div>
    <div class="hud-layer">
      <header class="hud-topbar"><a class="hud-brand" href="${brandHref}">LEGACY COLLECTOR <span>${demoLabel}</span></a><div id="turn-info" class="round-pill"></div><button id="reset-btn" class="hud-button" aria-label="重新開始">↻</button></header>
      <section class="timeline-hud collapsible-hud compact" id="timeline-hud"><button class="hud-collapse" data-toggle="timeline-hud"><span>TURN</span><span id="timeline-current">—</span></button><div class="hud-content"><div id="timeline" class="timeline"></div></div></section>
      <section class="context-hud glass-panel compact" id="context-hud"><button class="hud-collapse" data-toggle="context-hud"><span>UNIT</span><strong id="context-title">—</strong></button><div class="hud-content"><div id="unit-detail"></div></div></section>
      <section id="skill-hud" class="skill-hud glass-panel" hidden>
        <div class="skill-hud-head"><span>主動技能</span><span id="skill-owner">—</span></div>
        <div id="skill-list" class="skill-list"></div>
        <div id="skill-pagination" class="skill-pagination" hidden>
          <button id="skill-prev" class="skill-page-button" type="button" aria-label="上一頁">‹</button>
          <span id="skill-page-label" class="skill-page-label">1 / 1</span>
          <button id="skill-next" class="skill-page-button" type="button" aria-label="下一頁">›</button>
        </div>
      </section>
      <section class="progress-hud glass-panel compact" id="progress-hud"><button class="hud-collapse" data-toggle="progress-hud"><span>PROGRESS</span><span>任務／技能</span></button><div class="hud-content"><div id="party-passive-content" class="progress-placeholder"></div><div id="progress-content" class="progress-placeholder"></div></div></section>
      <section class="log-hud glass-panel compact" id="log-hud"><button id="log-toggle" class="hud-collapse"><span>LOG</span><span id="log-count">0</span></button><div id="combat-log" class="combat-log hud-content"></div></section>
      <section class="action-hud"><div class="current-turn-card"><strong id="current-unit-name">—</strong><span id="current-unit-class">—</span></div><div class="actions"><button id="move-btn" class="action-button">移動</button><button id="attack-btn" class="action-button danger">攻擊</button><button id="skill-btn" class="action-button">主動技能</button><button id="end-btn" class="action-button ghost">等待</button></div></section>
      <button id="hud-minimize" class="hud-minimize" aria-pressed="false">HUD</button>
    </div><section id="battle-result" class="result-overlay" hidden></section>`;
}

export class CombatApp{
  constructor({root,scenario,brandHref,demoLabel='Combat',aiDelay=420,progressRows=[],resultContent,portraitBase='../../assets/units',skillPageSize=3}){
    this.root=root;this.scenario=scenario;this.aiDelay=aiDelay;this.progressRows=progressRows;this.resultContent=resultContent;this.portraitBase=portraitBase;this.skillPageSize=Math.max(1,skillPageSize);this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;mountCombatShell(root,{brandHref,demoLabel});this.cacheElements();this.bindEvents();this.reset();
  }
  q(selector){return this.root.querySelector(selector)}
  cacheElements(){this.grid=this.q('#battle-grid');this.log=this.q('#combat-log');this.turn=this.q('#turn-info');this.detail=this.q('#unit-detail');this.result=this.q('#battle-result');this.timeline=this.q('#timeline');this.hud=this.q('.hud-layer');this.skillHud=this.q('#skill-hud');this.skillList=this.q('#skill-list');this.skillOwner=this.q('#skill-owner');this.skillPagination=this.q('#skill-pagination');this.skillPageLabel=this.q('#skill-page-label');this.partyPassiveContent=this.q('#party-passive-content')}
  reset(){this.model=new CombatModel(this.scenario);this.partyComposition=evaluatePartyComposition(this.model.units);this.model.partyComposition=this.partyComposition;this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillPage=0;this.skillPageOwnerId=null;this.model.start();this.result.hidden=true;this.skillHud.hidden=true;this.hud.classList.remove('minimal');this.root.querySelectorAll('.compact').forEach(p=>p.classList.remove('open'));this.renderProgress();this.render();this.driveAI()}
  hpPct(u){return Math.max(0,Math.min(100,(u.currentHP/u.stats.HP)*100))}
  focusUnit(){return (this.selectedUnitId&&this.model.units.find(u=>u.id===this.selectedUnitId&&u.alive))||this.model.currentUnit()}
  positionContextHud(){const u=this.focusUnit();this.root.classList.remove('focus-left','focus-right');if(u)this.root.classList.add(u.x<=Math.floor(this.model.width/2)?'focus-left':'focus-right')}
  unitGlyph(u){return Array.from(u.label||u.className||'?')[0]||'?'}
  portraitPath(u){return u.team==='player'?`${this.portraitBase}/players/${encodeURIComponent(u.id)}.webp`:`${this.portraitBase}/enemies/${encodeURIComponent(u.className)}.png`}
  wirePortraitFallback(cell){const img=cell.querySelector('.unit-portrait-image'),glyph=cell.querySelector('.unit-glyph');if(!img||!glyph)return;img.addEventListener('load',()=>{img.classList.add('loaded');glyph.hidden=true},{once:true});img.addEventListener('error',()=>{img.remove();glyph.hidden=false},{once:true})}
  render(){this.renderGrid();this.renderTurn();this.renderTimeline();this.renderDetail();this.renderLog();this.renderButtons();this.renderSkillHud();this.renderProgress();this.positionContextHud();if(this.model.finished)this.renderResult()}
  renderGrid(){
    this.grid.innerHTML='';const current=this.model.currentUnit(),reachable=this.mode==='move'&&current?.team==='player'?this.model.reachable(current):new Map(),targets=this.mode==='attack'&&current?.team==='player'?new Set(this.model.validTargets(current).map(u=>u.id)):new Set(),skillTargets=this.mode==='skill'&&current?.team==='player'&&this.selectedSkillId?new Set(this.model.validSkillTargets(current,this.selectedSkillId).map(u=>u.id)):new Set();
    for(let y=0;y<this.model.height;y++)for(let x=0;x<this.model.width;x++){
      const cell=document.createElement('button');cell.className='cell';cell.setAttribute('aria-label',`格 ${x+1},${y+1}`);if(this.model.walls.has(this.model.key(x,y)))cell.classList.add('wall');if(reachable.has(this.model.key(x,y)))cell.classList.add('reachable');
      const u=this.model.unitAt(x,y);if(u){cell.classList.add('occupied',u.team);if(current?.id===u.id)cell.classList.add('current');if(targets.has(u.id)||skillTargets.has(u.id))cell.classList.add('target');cell.setAttribute('aria-label',`${u.label}，${u.team==='player'?'我方':'敵方'}單位`);cell.innerHTML=`<span class="unit-portrait" aria-hidden="true"><img class="unit-portrait-image" src="${this.portraitPath(u)}" alt=""><span class="unit-glyph">${this.unitGlyph(u)}</span></span><span class="mini-hp" aria-hidden="true"><span class="mini-hp-fill" style="width:${this.hpPct(u)}%"></span></span>`;this.wirePortraitFallback(cell)}
      cell.addEventListener('click',()=>this.onCell(x,y,u));this.grid.appendChild(cell);
    }
  }
  onCell(x,y,u){
    if(this.model.finished)return;const current=this.model.currentUnit();
    if(current?.team==='player'&&this.mode==='skill'){
      const legal=u&&this.model.validSkillTargets(current,this.selectedSkillId).some(t=>t.id===u.id);if(!legal)return;const r=this.model.useSkill(current,this.selectedSkillId,u);if(r.ok){this.mode='idle';this.selectedSkillId=null;this.skillHud.hidden=true;this.afterPlayerAction()}return;
    }
    if(current?.team==='player'&&this.mode==='attack'){const legal=u&&u.team==='enemy'&&this.model.validTargets(current).some(t=>t.id===u.id);if(!legal)return;this.selectedUnitId=null;this.skillHud.hidden=true;const r=this.model.attack(current,u);if(r.ok){this.mode='idle';this.afterPlayerAction()}return}
    if(current?.team==='player'&&this.mode==='move'){if(!u&&this.model.move(current,x,y)){this.mode='idle';this.selectedUnitId=current.id;this.skillHud.hidden=true;this.afterPlayerAction()}return}
    if(u){this.selectedUnitId=u.id;this.render()}
  }
  chooseSkill(skillId){
    const u=this.model.currentUnit(),skill=this.model.skillById(u,skillId);if(!u||u.team!=='player'||!skill||u.acted||skill.charges<=0)return;
    if(skill.targetType==='self'){const r=this.model.useSkill(u,skillId,u);if(r.ok){this.skillHud.hidden=true;this.mode='idle';this.selectedSkillId=null;this.afterPlayerAction()}return}
    this.selectedSkillId=skillId;this.mode='skill';this.skillHud.hidden=true;this.selectedUnitId=null;this.render();
  }
  changeSkillPage(delta){
    const u=this.model.currentUnit();if(!u||u.team!=='player')return;const skills=Array.isArray(u.activeSkills)?u.activeSkills:[],pages=Math.max(1,Math.ceil(skills.length/this.skillPageSize));this.skillPage=Math.max(0,Math.min(pages-1,this.skillPage+delta));this.renderSkillHud();
  }
  afterPlayerAction(){const u=this.model.currentUnit();if(this.model.finished){this.skillHud.hidden=true;this.render();return}if(u&&u.moved&&u.acted){this.model.endTurn();this.mode='idle';this.selectedUnitId=null;this.selectedSkillId=null;this.skillHud.hidden=true;this.render();this.driveAI()}else this.render()}
  renderTurn(){const u=this.model.currentUnit();this.turn.innerHTML=this.model.finished?'戰鬥結束':`Round <strong>${this.model.round}</strong>`;this.q('#current-unit-name').textContent=u?.label||'—';this.q('#current-unit-class').textContent=u?(u.team==='player'?`職業 ${u.className}`:`敵方／${u.tierLabel||'T1'} ${u.className}`):'—';this.q('#timeline-current').textContent=u?.label||'—'}
  renderTimeline(){this.timeline.innerHTML='';this.model.queue.forEach((id,i)=>{const u=this.model.units.find(x=>x.id===id);if(!u||!u.alive)return;const item=document.createElement('div');item.className=`timeline-unit ${u.team}${i===this.model.turnIndex?' current':''}${i<this.model.turnIndex?' done':''}`;item.innerHTML=`<strong>${u.label}</strong>`;this.timeline.appendChild(item)})}
  renderDetail(){
    const selected=this.selectedUnitId?this.model.units.find(u=>u.id===this.selectedUnitId&&u.alive):null,u=selected||this.model.currentUnit();
    if(!u){this.detail.innerHTML='<span class="unit-note">點選場上單位查看基本狀態。</span>';return}
    this.q('#context-title').textContent=u.label;
    const passive=(u.passiveSkills||[])[0],attack=u.attack||null;
    const damageType=attack?.type==='magic'?'魔法':'物理';
    const attackBlock=attack?`<div class="unit-note"><strong>一般攻擊｜${attack.name||'普通攻擊'}</strong><br><span>射程 ${attack.range??1}／${damageType}</span>${attack.effect?`<br>${attack.effect}`:''}</div>`:'';
    const passiveBlock=passive?`<div class="unit-note"><strong>被動｜${passive.name}</strong><br>${passive.effect}</div>`:'';
    const fallback=!attackBlock&&!passiveBlock?'<div class="unit-note">戰鬥參數不公開；依實際交戰與戰況判斷威脅。</div>':'';
    this.detail.innerHTML=`<div class="detail-head"><strong>${u.label}</strong><span>${u.team==='player'?'職業 '+u.className:`${u.tierLabel||'Tier 1'} ${u.className}`}</span></div><div class="inspect-hp"><div class="inspect-hp-row"><span>生命狀態</span><span>${this.hpPct(u)>66?'穩定':this.hpPct(u)>33?'受傷':'危急'}</span></div><div class="inspect-hp-bar"><div class="inspect-hp-fill" style="width:${this.hpPct(u)}%"></div></div></div>${attackBlock}${passiveBlock}${fallback}`;
  }
  renderLog(){this.log.innerHTML=this.model.log.slice().reverse().map(e=>`<div><span>R${e.round}</span>${e.text}</div>`).join('');this.q('#log-count').textContent=this.model.log.length}
  renderProgress(){const party=this.partyComposition||evaluatePartyComposition(this.model?.units||[]);this.partyPassiveContent.innerHTML=`<p><strong>隊伍被動</strong><span>${party.title}</span></p><p><strong>效果</strong><span>${party.summary}</span></p>`;const u=this.model?.currentUnit(),skills=u?.team==='player'?(u.activeSkills||[]):[],dynamic=skills.length?`<p><strong>主動技能次數</strong><span>${skills.map(s=>`${s.name} ${s.charges}`).join('／')}</span></p>`:'';this.q('#progress-content').innerHTML=this.progressRows.map(row=>`<p><strong>${row.label}</strong><span>${row.value}</span></p>`).join('')+dynamic}
  renderButtons(){const u=this.model.currentUnit(),player=u?.team==='player'&&!this.model.finished;this.q('#move-btn').disabled=!player||u.moved;this.q('#attack-btn').disabled=!player||u.acted||this.model.validTargets(u).length===0;this.q('#skill-btn').disabled=!player||u.acted;this.q('#end-btn').disabled=!player;this.q('#end-btn').textContent=player&&!u.moved&&!u.acted?'等待':'結束';this.q('#move-btn').classList.toggle('active',this.mode==='move');this.q('#attack-btn').classList.toggle('active',this.mode==='attack');this.q('#skill-btn').classList.toggle('active',!this.skillHud.hidden||this.mode==='skill')}
  renderSkillHud(){
    const u=this.model.currentUnit();if(!u||u.team!=='player'||this.model.finished){this.skillHud.hidden=true;this.skillPagination.hidden=true;return}
    if(this.skillPageOwnerId!==u.id){this.skillPageOwnerId=u.id;this.skillPage=0}
    this.skillOwner.textContent=u.label;const skills=Array.isArray(u.activeSkills)?u.activeSkills:[];
    if(!skills.length){this.skillList.innerHTML='<div class="skill-empty">無主動技能</div>';this.skillPagination.hidden=true;return}
    const pages=Math.max(1,Math.ceil(skills.length/this.skillPageSize));this.skillPage=Math.min(this.skillPage,pages-1);const start=this.skillPage*this.skillPageSize,pageSkills=skills.slice(start,start+this.skillPageSize);
    this.skillList.innerHTML=pageSkills.map(s=>`<button class="skill-entry" data-skill-id="${s.id||s.name}" ${s.charges===0?'disabled':''}><span class="skill-entry-top"><strong>${s.name}</strong><span class="skill-charges">${s.charges??0} 次</span></span><span class="skill-effect">${s.effect||'尚無技能說明。'}</span></button>`).join('');
    this.skillPagination.hidden=pages<=1;this.skillPageLabel.textContent=`${this.skillPage+1} / ${pages}`;this.q('#skill-prev').disabled=this.skillPage===0;this.q('#skill-next').disabled=this.skillPage>=pages-1;
  }
  renderResult(){this.result.hidden=false;this.skillHud.hidden=true;const content=this.resultContent?this.resultContent(this.model):{title:this.model.result==='victory'?'Victory':'Party Wipe',lines:[]};this.result.innerHTML=`<div class="result-card"><h2>${content.title}</h2>${(content.lines||[]).map(x=>`<p>${x}</p>`).join('')}<button id="again-btn" class="action-button">重新測試</button></div>`;this.q('#again-btn').onclick=()=>this.reset()}
  driveAI(){if(this.model.finished){this.render();return}const u=this.model.currentUnit();if(u?.team==='enemy')setTimeout(()=>{this.selectedUnitId=u.id;this.skillHud.hidden=true;this.model.aiTurn(u);this.selectedUnitId=null;this.render();this.driveAI()},this.aiDelay)}
  togglePanel(panel){panel.classList.toggle('open')}
  bindEvents(){
    this.q('#move-btn').onclick=()=>{this.mode=this.mode==='move'?'idle':'move';this.selectedSkillId=null;this.skillHud.hidden=true;this.selectedUnitId=null;this.render()};
    this.q('#attack-btn').onclick=()=>{this.mode=this.mode==='attack'?'idle':'attack';this.selectedSkillId=null;this.skillHud.hidden=true;this.selectedUnitId=null;this.render()};
    this.q('#skill-btn').onclick=()=>{const u=this.model.currentUnit();if(u?.team==='player'&&!u.acted&&!this.model.finished){this.mode='idle';this.selectedSkillId=null;this.selectedUnitId=null;this.skillHud.hidden=!this.skillHud.hidden;this.render()}};
    this.skillList.onclick=e=>{const btn=e.target.closest('[data-skill-id]');if(btn)this.chooseSkill(btn.dataset.skillId)};
    this.q('#skill-prev').onclick=()=>this.changeSkillPage(-1);this.q('#skill-next').onclick=()=>this.changeSkillPage(1);
    this.q('#end-btn').onclick=()=>{const u=this.model.currentUnit();if(u?.team==='player'){this.skillHud.hidden=true;this.selectedSkillId=null;this.model.endTurn();this.mode='idle';this.selectedUnitId=null;this.render();this.driveAI()}};
    this.q('#reset-btn').onclick=()=>this.reset();this.root.querySelectorAll('[data-toggle]').forEach(btn=>btn.onclick=()=>this.togglePanel(this.q(`#${btn.dataset.toggle}`)));this.q('#log-toggle').onclick=()=>this.togglePanel(this.q('#log-hud'));this.q('#hud-minimize').onclick=()=>{this.hud.classList.toggle('minimal');this.q('#hud-minimize').setAttribute('aria-pressed',this.hud.classList.contains('minimal'))};
  }
}
