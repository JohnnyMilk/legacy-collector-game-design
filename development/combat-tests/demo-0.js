import {CombatModel} from './combat-model.js?v=20260829-1545';

let scenario,model,mode='idle',selectedUnitId=null,previewTargetId=null;
const $=s=>document.querySelector(s),grid=$('#battle-grid'),log=$('#combat-log'),turn=$('#turn-info'),detail=$('#unit-detail'),result=$('#battle-result'),timeline=$('#timeline'),previewHud=$('#preview-hud'),previewBox=$('#attack-preview'),screen=$('#game-screen'),hud=$('.hud-layer');

async function loadScenario(){
  const cacheBust=`v=${Date.now()}`;
  const [scenarioRes,statsRes]=await Promise.all([
    fetch(`./scenarios/demo-0.json?${cacheBust}`,{cache:'no-store'}),
    fetch(`../../data/class-stats.json?${cacheBust}`,{cache:'no-store'})
  ]);
  const raw=await scenarioRes.json(),stats=await statsRes.json();
  const villager=stats.entries.find(e=>e.name==='村民');
  scenario={...raw,units:[
    ...raw.players.map(p=>({...p,team:'player',stats:{...villager},attack:{name:'一般攻擊',type:'physical',range:1}})),
    ...raw.enemies.map(e=>({...e,team:'enemy',label:e.className}))
  ]};
}
function reset(){model=new CombatModel(scenario);mode='idle';selectedUnitId=null;previewTargetId=null;model.start();result.hidden=true;hud.classList.remove('minimal');document.querySelectorAll('.compact').forEach(p=>p.classList.remove('open'));render();driveAI()}
function render(){renderGrid();renderTurn();renderTimeline();renderDetail();renderPreview();renderLog();renderButtons();positionContextHud();if(model.finished)renderResult()}
function hpPct(u){return Math.max(0,Math.min(100,(u.currentHP/u.stats.HP)*100))}
function focusUnit(){return (previewTargetId&&model.units.find(u=>u.id===previewTargetId&&u.alive))||(selectedUnitId&&model.units.find(u=>u.id===selectedUnitId&&u.alive))||model.currentUnit()}
function positionContextHud(){const u=focusUnit();screen.classList.remove('focus-left','focus-right');if(!u)return;screen.classList.add(u.x<=4?'focus-left':'focus-right')}
function renderGrid(){
  grid.innerHTML='';const current=model.currentUnit();const reachable=mode==='move'&&current?.team==='player'?model.reachable(current):new Map();const targets=mode==='attack'&&current?.team==='player'?new Set(model.validTargets(current).map(u=>u.id)):new Set();
  for(let y=0;y<model.height;y++)for(let x=0;x<model.width;x++){
    const cell=document.createElement('button');cell.className='cell';cell.setAttribute('aria-label',`格 ${x+1},${y+1}`);
    if(model.walls.has(model.key(x,y)))cell.classList.add('wall');if(reachable.has(model.key(x,y)))cell.classList.add('reachable');
    const u=model.unitAt(x,y);if(u){cell.classList.add('occupied',u.team);if(current?.id===u.id)cell.classList.add('current');if(targets.has(u.id))cell.classList.add('target');if(previewTargetId===u.id)cell.classList.add('preview-target');cell.innerHTML=`<span class="token-name">${u.label}</span><span class="token-class">${u.team==='player'?'職業 '+u.className:'T1 '+u.className}</span><span class="mini-hp"><span class="mini-hp-fill" style="width:${hpPct(u)}%"></span></span>`}
    cell.addEventListener('click',()=>onCell(x,y,u));grid.appendChild(cell);
  }
}
function onCell(x,y,u){
  if(model.finished)return;const current=model.currentUnit();
  if(u){selectedUnitId=u.id;
    if(mode==='attack'&&current?.team==='player'&&u.team==='enemy'&&model.validTargets(current).some(t=>t.id===u.id)){
      if(previewTargetId===u.id){const r=model.attack(current,u);previewTargetId=null;if(r.ok){mode='idle';afterPlayerAction();return}}
      else{previewTargetId=u.id;render();return}
    }
    previewTargetId=null;render();return;
  }
  if(!current||current.team!=='player')return;
  if(mode==='move'&&model.move(current,x,y)){mode='idle';selectedUnitId=current.id;previewTargetId=null;render();return}
}
function afterPlayerAction(){const u=model.currentUnit();if(model.finished){render();return}if(u&&u.moved&&u.acted){model.endTurn();mode='idle';selectedUnitId=null;previewTargetId=null;render();driveAI()}else render()}
function renderTurn(){const u=model.currentUnit();turn.innerHTML=model.finished?'戰鬥結束':`Round <strong>${model.round}</strong>`;$('#current-unit-name').textContent=u?.label||'—';$('#current-unit-class').textContent=u?(u.team==='player'?`職業 ${u.className}`:`敵方／T1 ${u.className}`):'—';$('#timeline-current').textContent=u?.label||'—'}
function renderTimeline(){timeline.innerHTML='';model.queue.forEach((id,i)=>{const u=model.units.find(x=>x.id===id);if(!u||!u.alive)return;const item=document.createElement('div');item.className=`timeline-unit ${u.team}${i===model.turnIndex?' current':''}${i<model.turnIndex?' done':''}`;item.innerHTML=`<strong>${u.label}</strong><span>${u.team==='player'?u.className:'T1 '+u.className}</span>`;timeline.appendChild(item)})}
function renderDetail(){const selected=selectedUnitId?model.units.find(u=>u.id===selectedUnitId&&u.alive):null;const u=selected||model.currentUnit();if(u)showUnit(u);else detail.innerHTML='<span class="unit-note">點選場上單位查看基本狀態。</span>'}
function showUnit(u){$('#context-title').textContent=u.label;detail.innerHTML=`<div class="detail-head"><strong>${u.label}</strong><span>${u.team==='player'?'職業 '+u.className:'Tier 1 '+u.className}</span></div><div class="inspect-hp"><div class="inspect-hp-row"><span>生命狀態</span><span>${hpPct(u)>66?'穩定':hpPct(u)>33?'受傷':'危急'}</span></div><div class="inspect-hp-bar"><div class="inspect-hp-fill" style="width:${hpPct(u)}%"></div></div></div><div class="unit-note">戰鬥參數不公開；依實際交戰與戰況判斷威脅。</div>`}
function renderPreview(){const attacker=model.currentUnit(),target=previewTargetId?model.units.find(u=>u.id===previewTargetId&&u.alive):null;if(!attacker||attacker.team!=='player'||!target||mode!=='attack'){previewHud.hidden=true;previewBox.innerHTML='';return}previewHud.hidden=false;previewBox.innerHTML=`<div class="preview-title">目標：${target.label}</div><div class="preview-after">已鎖定攻擊目標。再次點選 ${target.label} 執行攻擊。</div>`}
function renderLog(){log.innerHTML=model.log.slice().reverse().map(e=>`<div><span>R${e.round}</span>${e.text}</div>`).join('');$('#log-count').textContent=model.log.length}
function renderButtons(){const u=model.currentUnit(),player=u?.team==='player'&&!model.finished;$('#move-btn').disabled=!player||u.moved;$('#attack-btn').disabled=!player||u.acted||model.validTargets(u).length===0;$('#end-btn').disabled=!player;$('#move-btn').classList.toggle('active',mode==='move');$('#attack-btn').classList.toggle('active',mode==='attack')}
function renderResult(){result.hidden=false;result.innerHTML=`<div class="result-card"><h2>Party Wipe</h2><p>${model.result==='story-wipe'?'即使突破四名 Tier 1 敵人，遺跡力量仍會失控並吞沒四名主角。':'四名主角正式全滅。'}</p><p>死亡不是終點，而是下一個 Run 的開始。</p><button id="again-btn" class="action-button">重新測試</button></div>`;$('#again-btn').onclick=reset}
function driveAI(){if(model.finished){render();return}const u=model.currentUnit();if(u?.team==='enemy')setTimeout(()=>{selectedUnitId=u.id;model.aiTurn(u);selectedUnitId=null;previewTargetId=null;render();driveAI()},420)}
function togglePanel(panel){const willOpen=!panel.classList.contains('open');document.querySelectorAll('.compact.open').forEach(p=>p.classList.remove('open'));if(willOpen)panel.classList.add('open')}
$('#move-btn').onclick=()=>{mode=mode==='move'?'idle':'move';previewTargetId=null;selectedUnitId=null;render()};
$('#attack-btn').onclick=()=>{mode=mode==='attack'?'idle':'attack';previewTargetId=null;selectedUnitId=null;render()};
$('#end-btn').onclick=()=>{const u=model.currentUnit();if(u?.team==='player'){model.endTurn();mode='idle';selectedUnitId=null;previewTargetId=null;render();driveAI()}};
$('#reset-btn').onclick=reset;
document.querySelectorAll('[data-toggle]').forEach(btn=>btn.onclick=()=>togglePanel(document.getElementById(btn.dataset.toggle)));
$('#log-toggle').onclick=()=>togglePanel($('#log-hud'));
$('#hud-minimize').onclick=()=>{hud.classList.toggle('minimal');$('#hud-minimize').setAttribute('aria-pressed',hud.classList.contains('minimal'))};
try{await loadScenario();reset()}catch(e){turn.textContent='Demo 載入失敗';console.error(e)}