import {CombatModel} from './combat-model.js?v=20260829-1429';

let scenario,model,mode='idle',selectedUnitId=null;
const $=s=>document.querySelector(s),grid=$('#battle-grid'),log=$('#combat-log'),turn=$('#turn-info'),detail=$('#unit-detail'),result=$('#battle-result');

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
function reset(){model=new CombatModel(scenario);mode='idle';selectedUnitId=null;model.start();result.hidden=true;render();driveAI()}
function render(){renderGrid();renderTurn();renderDetail();renderLog();renderButtons();if(model.finished)renderResult()}
function renderGrid(){
  grid.innerHTML='';const current=model.currentUnit();const reachable=mode==='move'&&current?.team==='player'?model.reachable(current):new Map();const targets=mode==='attack'&&current?.team==='player'?new Set(model.validTargets(current).map(u=>u.id)):new Set();
  for(let y=0;y<model.height;y++)for(let x=0;x<model.width;x++){
    const cell=document.createElement('button');cell.className='cell';cell.setAttribute('aria-label',`格 ${x+1},${y+1}`);
    if(model.walls.has(model.key(x,y)))cell.classList.add('wall');if(reachable.has(model.key(x,y)))cell.classList.add('reachable');
    const u=model.unitAt(x,y);if(u){cell.classList.add('occupied',u.team);if(current?.id===u.id)cell.classList.add('current');if(targets.has(u.id))cell.classList.add('target');cell.innerHTML=`<span class="token-name">${u.label}</span><span class="token-class">${u.team==='player'?'職業 '+u.className:'T1 '+u.className}</span><span class="token-hp">${u.currentHP}/${u.stats.HP}</span>`}
    cell.addEventListener('click',()=>onCell(x,y,u));grid.appendChild(cell);
  }
}
function onCell(x,y,u){if(model.finished)return;const current=model.currentUnit();if(u){selectedUnitId=u.id;showUnit(u)}if(!current||current.team!=='player')return;if(mode==='move'&&model.move(current,x,y)){mode='idle';selectedUnitId=current.id;render();return}if(mode==='attack'&&u&&u.team==='enemy'){selectedUnitId=u.id;const r=model.attack(current,u);if(r.ok){mode='idle';afterPlayerAction();return}}}
function afterPlayerAction(){const u=model.currentUnit();if(model.finished){render();return}if(u&&u.moved&&u.acted){model.endTurn();mode='idle';render();driveAI()}else render()}
function renderTurn(){const u=model.currentUnit();turn.innerHTML=model.finished?'戰鬥結束':`Round <strong>${model.round}</strong>　目前行動：<strong>${u?.label||'—'}</strong>${u?.team==='player'?`／職業 ${u.className}`:`／Tier 1 ${u?.className}`}`}
function renderDetail(){const selected=selectedUnitId?model.units.find(u=>u.id===selectedUnitId&&u.alive):null;const u=selected||model.currentUnit();if(u)showUnit(u);else detail.innerHTML='<span class="hint">點選戰場上的任一存活單位查看完整數值。</span>'}
function showUnit(u){detail.innerHTML=`<div class="detail-head"><strong>${u.label}</strong><span>${u.team==='player'?'主角／職業：'+u.className:'敵方單位／Tier 1 '+u.className}</span></div><div class="stats"><span>HP ${u.currentHP}/${u.stats.HP}</span><span>ATK ${u.stats.ATK}</span><span>MATK ${u.stats.MATK}</span><span>DEF ${u.stats.DEF}</span><span>MDEF ${u.stats.MDEF}</span><span>AGI ${u.stats.AGI}</span><span>MOVE ${u.stats.MOVE}</span><span>HIT ${u.stats.HIT}</span><span>EVA ${u.stats.EVA}</span></div>`}
function renderLog(){log.innerHTML=model.log.slice().reverse().map(e=>`<div><span>R${e.round}</span>${e.text}</div>`).join('')}
function renderButtons(){const u=model.currentUnit(),player=u?.team==='player'&&!model.finished;$('#move-btn').disabled=!player||u.moved;$('#attack-btn').disabled=!player||u.acted||model.validTargets(u).length===0;$('#end-btn').disabled=!player;$('#move-btn').classList.toggle('active',mode==='move');$('#attack-btn').classList.toggle('active',mode==='attack')}
function renderResult(){result.hidden=false;result.innerHTML=`<h2>Party Wipe</h2><p>${model.result==='story-wipe'?'即使成功擊倒四名 Tier 1 敵人，序章劇情仍會讓遺跡失控並導向全滅。':'四名主角正式全滅。'}</p><p><strong>這不是一般 Game Over：</strong>此處建立「死亡 → 重生 → 下一個 Run」的核心循環；跨 Run 的 Mastery／解鎖由後續 Meta Progression 模組承接。</p><button id="again-btn" class="action primary">重新測試</button>`;$('#again-btn').onclick=reset}
function driveAI(){if(model.finished){render();return}const u=model.currentUnit();if(u?.team==='enemy')setTimeout(()=>{model.aiTurn(u);render();driveAI()},350)}
$('#move-btn').onclick=()=>{mode=mode==='move'?'idle':'move';render()};$('#attack-btn').onclick=()=>{mode=mode==='attack'?'idle':'attack';render()};$('#end-btn').onclick=()=>{const u=model.currentUnit();if(u?.team==='player'){model.endTurn();mode='idle';render();driveAI()}};$('#reset-btn').onclick=reset;
try{await loadScenario();reset()}catch(e){turn.textContent='Demo 載入失敗：請確認 Scenario 與 class-stats.json。';console.error(e)}