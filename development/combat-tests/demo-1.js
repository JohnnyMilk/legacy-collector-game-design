import {CombatApp} from './combat-app.js?v=20260829-2138';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260829-1920';
import {buildEnemyUnit} from './combat-enemy-runtime.js?v=20260829-1925';

function shuffledEnemyTypes(){
  const pool=['hunter','hunter','hunter','swordsman','swordsman','swordsman','warlock','warlock','warlock','heavy_guard','heavy_guard','heavy_guard'];
  for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
  return pool;
}

async function buildDemo1Scenario(){
  const [raw,stats,classes,enemyStats]=await Promise.all([
    loadCombatJson('./scenarios/demo-1.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/enemy-stats.json')
  ]);
  const enemyTypes=shuffledEnemyTypes();
  return {
    ...raw,
    units:[
      ...raw.players.map(player=>buildPlayerClassUnit(player,player.classId,stats,classes)),
      ...raw.enemies.map((enemy,index)=>buildEnemyUnit({...enemy,enemyType:enemyTypes[index]},enemyStats))
    ]
  };
}

function demo1Result(model){
  return model.result==='victory'
    ?{title:'Victory',lines:['12 名 Tier 1 敵方全滅。','本場用於測試四名 Tier 1 主角面對三倍敵軍時的實際承壓極限。']}
    :{title:'Party Wipe',lines:['四名主角全滅。','此結果保留作為 Tier 1 對 12 名 Tier 1 敵人的極限強度紀錄。']};
}

try{
  const scenario=await buildDemo1Scenario();
  new CombatApp({
    root:document.querySelector('#game-screen'),
    scenario,
    brandHref:'../combat-test-index.html',
    demoLabel:'Demo 1',
    resultContent:demo1Result
  });
}catch(error){
  console.error(error);
  document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Demo 載入失敗</h2><p>請重新整理後再試。</p></div></div>';
}
