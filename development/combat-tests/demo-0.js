import {CombatModel} from './combat-model.js';

const villager={HP:40,ATK:20,MATK:20,DEF:15,MDEF:15,AGI:25,MOVE:3,HIT:90,EVA:5};
const enemyStats={
  '劍兵':{HP:40,ATK:25,MATK:10,DEF:20,MDEF:15,AGI:20,MOVE:3,HIT:90,EVA:5},
  '獵兵':{HP:35,ATK:25,MATK:10,DEF:15,MDEF:15,AGI:30,MOVE:4,HIT:95,EVA:10},
  '術士':{HP:35,ATK:10,MATK:30,DEF:15,MDEF:25,AGI:20,MOVE:3,HIT:95,EVA:5},
  '重衛':{HP:50,ATK:25,MATK:10,DEF:30,MDEF:20,AGI:15,MOVE:2,HIT:90,EVA:0}
};
const scenario={
  id:'demo-0-prologue',title:'Demo 0｜序章',forcePartyWipe:true,map:{width:9,height:9,walls:[[4,3],[4,4],[4,5]]},
  units:[
    {id:'cangyue',team:'player',label:'蒼岳',className:'村民',x:1,y:6,stats:{...villager},attack:{name:'一般攻擊',type:'physical',range:1}},
    {id:'longyue',team:'player',label:'朧月',className:'村民',x:2,y:7,stats:{...villager},attack:{name:'一般攻擊',type:'physical',range:1}},
    {id:'astrea',team:'player',label:'阿斯特蕾雅',className:'村民',x:1,y:8,stats:{...villager},attack:{name:'一般攻擊',type:'physical',range:1}},
    {id:'seilorn',team:'player',label:'賽洛恩',className:'村民',x:3,y:8,stats:{...villager},attack:{name:'一般攻擊',type:'physical',range:1}},
    {id:'enemy-hunter',team:'enemy',label:'獵兵',className:'獵兵',x:7,y:1,stats:{...enemyStats['獵兵']},attack:{name:'射擊',type:'physical',range:3}},
    {id:'enemy-sword',team:'enemy',label:'劍兵',className:'劍兵',x:6,y:2,stats:{...enemyStats['劍兵']},attack:{name:'斬擊',type:'physical',range:1}},
    {id:'enemy-mage',team:'enemy',label:'術士',className:'術士',x:8,y:2,stats:{...enemyStats['術士']},attack:{name:'魔彈',type:'magic',range:2}},
    {id:'enemy-guard',team:'enemy',label:'重衛',className:'重衛',x:7,y:3,stats:{...enemyStats['重衛']},attack:{name:'盾擊',type:'physical',range:1}}
  ]
};

let model,mode='idle';
const $=s=>document.querySelector(s), grid=$('#battle-grid'), log=$('#combat-log'), turn=$('#turn-info'), detail=$('#unit-detail'), result=$('#battle-result');
function reset(){model=new CombatModel(scenario);mode='idle';model.start();result.hidden=true;render();driveAI()}
function render(){renderGrid();renderTurn();renderDetail();renderLog();renderButtons();if(model.finished)renderResult()}
function renderGrid(){
  grid.innerHTML='';const current=model.currentUnit();const reachable=mode==='move'&&current?.team==='player'?model.reachable(current):new Map();const targets=mode==='attack'&&current?.team==='player'?new Set(model.validTargets(current).map(u=>u.id)):new Set();
  for(let y=0;y<model.height;y++)for(let x=0;x<model.width;x++){
    const cell=document.createElement('button');cell.className='cell';cell.dataset.x=x;cell.dataset.y=y;cell.setAttribute('aria-label',`格 ${x+1},${y+1}`);
    if(model.walls.has(model.key(x,y)))cell.classList.add('wall');
    if(reachable.has(model.key(x,y)))cell.classList.add('reachable');
    const u=model.unitAt(x,y);if(u){cell.classList.add('occupied',u.team);if(current?.id===u.id)cell.classList.add('current');if(targets.has(u.id))cell.classList.add('target');cell.innerHTML=`<span class="token-name">${u.label}</span><span class="token-class">${u.team==='player'?u.className:'T1'}</span><span class="token-hp">${u.currentHP}/${u.stats.HP}</span>`}
    cell.addEventListener('click',()=>onCell(x,y,u));grid.appendChild(cell);
  }
}
function onCell(x,y,u){if(model.finished)return;const current=model.currentUnit();if(!current||current.team!=='player')return;
  if(mode==='move'&&model.move(current,x,y)){mode='idle';render();return}
  if(mode==='attack'&&u&&u.team==='enemy'){const r=model.attack(current,u);if(r.ok){mode='idle';afterPlayerAction();return}}
  if(u)showUnit(u);
}
function afterPlayerAction(){const u=model.currentUnit();if(model.finished){render();return}if(u&&u.moved&&u.acted){model.endTurn();mode='idle';render();driveAI()}else render()}
function renderTurn(){const u=model.currentUnit();turn.innerHTML=model.finished?'戰鬥結束':`Round <strong>${model.round}</strong>　目前行動：<strong>${u?.label||'—'}</strong>${u?.team==='player'?`／${u.className}`:'／敵方 '+u?.className}`}
function renderDetail(){const u=model.currentUnit();if(u)showUnit(u)}
function showUnit(u){detail.innerHTML=`<div class="detail-head"><strong>${u.label}</strong><span>${u.team==='player'?'職業：'+u.className:'Tier 1 敵人／'+u.className}</span></div><div class="stats"><span>HP ${u.currentHP}/${u.stats.HP}</span><span>ATK ${u.stats.ATK}</span><span>MATK ${u.stats.MATK}</span><span>DEF ${u.stats.DEF}</span><span>MDEF ${u.stats.MDEF}</span><span>AGI ${u.stats.AGI}</span><span>MOVE ${u.stats.MOVE}</span><span>HIT ${u.stats.HIT}</span><span>EVA ${u.stats.EVA}</span></div>`}
function renderLog(){log.innerHTML=model.log.slice().reverse().map(e=>`<div><span>R${e.round}</span>${e.text}</div>`).join('')}
function renderButtons(){const u=model.currentUnit(),player=u?.team==='player'&&!model.finished;$('#move-btn').disabled=!player||u.moved;$('#attack-btn').disabled=!player||u.acted||model.validTargets(u).length===0;$('#end-btn').disabled=!player;$('#move-btn').classList.toggle('active',mode==='move');$('#attack-btn').classList.toggle('active',mode==='attack')}
function renderResult(){result.hidden=false;result.innerHTML=`<h2>${model.result==='victory'?'勝利':'Party Wipe'}</h2><p>${model.result==='story-wipe'?'即使成功擊倒四名守衛，序章劇情仍會讓遺跡失控並導向全滅。':'四名主角正式全滅。'}</p><p><strong>這不是一般 Game Over：</strong>序章在此建立「死亡 → 重生 → 下一個 Run」的世界規則。跨 Run 的 Mastery／解鎖資料由後續 Meta Progression 模組承接。</p><button id="again-btn" class="action primary">重新測試</button>`;$('#again-btn').onclick=reset}
function driveAI(){if(model.finished){render();return}const u=model.currentUnit();if(!u)return;if(u.team==='enemy'){setTimeout(()=>{model.aiTurn(u);render();driveAI()},350)}}
$('#move-btn').onclick=()=>{mode=mode==='move'?'idle':'move';render()};
$('#attack-btn').onclick=()=>{mode=mode==='attack'?'idle':'attack';render()};
$('#end-btn').onclick=()=>{const u=model.currentUnit();if(u?.team==='player'){model.endTurn();mode='idle';render();driveAI()}};
$('#reset-btn').onclick=reset;
reset();