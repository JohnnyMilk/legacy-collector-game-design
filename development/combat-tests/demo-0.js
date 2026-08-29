import {CombatApp} from './combat-app.js?v=20260829-1845';
import {loadCombatJson,requireEntry} from './combat-data.js?v=20260829-1849';

async function buildDemo0Scenario(){
  const [raw,stats]=await Promise.all([
    loadCombatJson('./scenarios/demo-0.json'),
    loadCombatJson('../../data/class-stats.json')
  ]);
  const villager=requireEntry(stats.entries,entry=>entry.name==='村民','Villager stat template not found.');

  return {
    ...raw,
    units:[
      ...raw.players.map(player=>({
        ...player,
        team:'player',
        stats:{...villager},
        attack:{name:'一般攻擊',type:'physical',range:1},
        activeSkills:[]
      })),
      ...raw.enemies.map(enemy=>({
        ...enemy,
        team:'enemy',
        label:enemy.className,
        tierLabel:'Tier 1'
      }))
    ]
  };
}

function demo0Result(model){
  if(model.result==='story-wipe')return {
    title:'Party Wipe',
    lines:['即使突破四名 Tier 1 敵人，遺跡力量仍會失控並吞沒四名主角。','死亡不是終點，而是下一個 Run 的開始。']
  };
  return {
    title:'Party Wipe',
    lines:['四名主角正式全滅。','死亡不是終點，而是下一個 Run 的開始。']
  };
}

try{
  const scenario=await buildDemo0Scenario();
  new CombatApp({
    root:document.querySelector('#game-screen'),
    scenario,
    brandHref:'../combat-test-index.html',
    demoLabel:'Demo 0',
    progressRows:[
      {label:'熟練度任務',value:'序章尚未啟用'},
      {label:'主動技能次數',value:'村民無主動技能'}
    ],
    resultContent:demo0Result
  });
}catch(error){
  console.error(error);
  document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Demo 載入失敗</h2><p>請重新整理後再試。</p></div></div>';
}
