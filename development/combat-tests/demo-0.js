import {CombatModel} from './combat-model.js?v=20260829-1505';

let scenario,model,mode='idle',selectedUnitId=null,previewTargetId=null;
const $=s=>document.querySelector(s),grid=$('#battle-grid'),log=$('#combat-log'),turn=$('#turn-info'),detail=$('#unit-detail'),result=$('#battle-result'),timeline=$('#timeline'),previewHud=$('#preview-hud'),previewBox=$('#attack-preview');

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
function reset(){model=new CombatModel(scenario);mode='idle';selectedUnitId=null;previewTargetId=null;model.start();result.hidden=true;$('#log-toggle').closest('.log-hud').classList.remove('open');render();driveAI()}
function render(){renderGrid();renderTurn();renderTimeline();renderDetail();renderPreview();renderLog();renderButtons();if(model.finished)renderResult()}
function hpPct(u){return Math.max(0,Math.min(100,(u.currentHP/u.stats.HP)*100))}
function renderGrid(){
  grid.innerHTML='';const current=model.currentUnit();const reachable=mode==='move'&&current?.team==='player'?model.reachable(current):new Map();const targets=mode==='attack'&&current?.team==='player'?new Set(model.validTargets(current).map(u=>u.id)):new Set();
  for(let y=0;y<model.height;y++)for(let x=0;x<model.width;x++){
    const cell=document.createElement('button');cell.className='cell';cell.setAttribute('aria-label',`格 ${x+1},${y+1}`);
    if(model.walls.has(model.key(x,y)))cell.classList.add('wall');if(reachable.has(model.key(x,y)))cell.classList.add('reachable');
    const u=model.unitAt(x,y);if(u){cell.classList.add('occupied',u.team);if(current?.id===u.id)cell.classList.add('current');if(targets.has(u.id))cell.classList.add('target');if(previewTargetId===u.id)cell.classList.add('preview-target');cell.innerHTML=`<span class="token-name">${u.label}</span><span class="token-class">${u.team==='player'?'職業 '+u.className:'T1 '+u.className}</span><span class="token-hp-text">${u.currentHP}/${u.stats.HP}</span><span class="mini-hp"><span class="mini-hp-fill" style="width:${hpPct(u)}%"></span></span>`}
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
function renderTurn(){const u=model.currentUnit();turn.innerHTML=model.finished?'戰鬥結束':`Round <strong>${model.round}</strong>`;$('#current-unit-name').textContent=u?.label||'—';$('#current-unit-class').textContent=u?(u.team==='player'?`職業 ${u.className}`:`敵方／T1 ${u.className}`):'—'}
function renderTimeline(){timeline.innerHTML='';model.queue.forEach((id,i)=>{const u=model.units.find(x=>x.id===id);if(!u||!u.alive)return;const item=document.createElement('div');item.className=`timeline-unit ${u.team}${i===model.turnIndex?' current':''}${i<model.turnIndex?' done':''}`;item.innerHTML=`<strong>${u.label}</strong><span>${u.team==='player'?u.className:'T1 '+u.className} · AGI ${u.stats.AGI}</span>`;timeline.appendChild(item)})}
function renderDetail(){const selected=selectedUnitId?model.units.find(u=>u.id===selectedUnitId&&u.alive):null;const u=selected||model.currentUnit();if(u)showUnit(u);else detail.innerHTML='<span class="hint">點選任一存活單位查看完整數值。</span>'}
function showUnit(u){detail.innerHTML=`<div class="detail-head"><strong>${u.label}</strong><span>${u.team==='player'?'主角／職業：'+u.className:'敵方／Tier 1 '+u.className}</span></div><div class="inspect-hp"><div class="inspect-hp-row"><span>HP</span><strong>${u.currentHP} / ${u.stats.HP}</strong></div><div class="inspect-hp-bar"><div class="inspect-hp-fill" style="width:${hpPct(u)}%"></div></div></div><div class="stats"><span>ATK ${u.stats.ATK}</span><span>MATK ${u.stats.MATK}</span><span>DEF ${u.stats.DEF}</span><span>MDEF ${u.stats.MDEF}</span><span>AGI ${u.stats.AGI}</span><span>MOVE ${u.stats.MOVE}</span><span>HIT ${u.stats.HIT}</span><span>EVA ${u.stats.EVA}</span><span>Range ${u.attack.range}</span></div>`}
function renderPreview(){const attacker=model.currentUnit(),target=previewTargetId?model.units.find(u=>u.id===previewTargetId&&u.alive):null;if(!attacker||attacker.team!=='player'||!target||mode!=='attack'){previewHud.hidden=true;previewBox.innerHTML='';return}const damage=model.normalDamage(attacker,target),hit=model.hitChance(attacker,target),crit=model.critChance(attacker,target),after=Math.max(0,target.currentHP-damage);previewHud.hidden=false;previewBox.innerHTML=`<div class="preview-title"><strong>${attacker.label} → ${target.label}</strong><span>${attacker.attack.name}</span></div><div class="preview-grid"><div class="preview-stat"><b>${damage}</b><span>固定傷害</span></div><div class="preview-stat"><b>${Math.round(hit)}%</b><span>命中</span></div><div class="preview-stat"><b>${crit}%</b><span>暴擊</span></div></div><div class="preview-after">命中且未暴擊：${target.currentHP} → <strong>${after}</strong> HP<br>再次點選目標執行攻擊。</div>`}
function renderLog(){log.innerHTML=model.log.slice().reverse().map(e=>`<div><span>R${e.round}</span>${e.text}</div>`).join('');$('#log-count').textContent=model.log.length}
function renderButtons(){const u=model.currentUnit(),player=u?.team==='player'&&!model.finished;$('#move-btn').disabled=!player||u.moved;$('#attack-btn').disabled=!player||u.acted||model.validTargets(u).length===0;$('#end-btn').disabled=!player;$('#move-btn').classList.toggle('active',mode==='move');$('#attack-btn').classList.toggle('active',mode==='attack')}
function renderResult(){result.hidden=false;result.innerHTML=`<div class="result-card"><div class="hud-label">PROLOGUE RESULT</div><h2>Party Wipe</h2><p>${model.result==='story-wipe'?'即使成功擊倒四名 Tier 1 敵人，遺跡力量仍會失控並吞沒四名主角。':'四名主角正式全滅。'}</p><p>此處建立「死亡 → 重生 → 下一個 Run」的核心循環。</p><button id="again-btn" class="action-button">重新測試</button></div>`;$('#again-btn').onclick=reset}
function driveAI(){if(model.finished){render();return}const u=model.currentUnit();if(u?.team==='enemy')setTimeout(()=>{selectedUnitId=u.id;model.aiTurn(u);selectedUnitId=null;previewTargetId=null;render();driveAI()},420)}
$('#move-btn').onclick=()=>{mode=mode==='move'?'idle':'move';previewTargetId=null;selectedUnitId=null;render()};
$('#attack-btn').onclick=()=>{mode=mode==='attack'?'idle':'attack';previewTargetId=null;selectedUnitId=null;render()};
$('#end-btn').onclick=()=>{const u=model.currentUnit();if(u?.team==='player'){model.endTurn();mode='idle';selectedUnitId=null;previewTargetId=null;render();driveAI()}};
$('#reset-btn').onclick=reset;
$('#log-toggle').onclick=()=>{const panel=$('#log-toggle').closest('.log-hud');panel.classList.toggle('open');$('#log-toggle').setAttribute('aria-expanded',panel.classList.contains('open'))};
try{await loadScenario();reset()}catch(e){turn.textContent='Demo 載入失敗';console.error(e)}