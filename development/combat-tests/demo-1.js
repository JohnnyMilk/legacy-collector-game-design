import {CombatApp} from './combat-app.js?v=20260829-1920';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260829-1920';
import {buildEnemyUnit} from './combat-enemy-runtime.js?v=20260829-1925';

async function buildDemo1Scenario(){
  const [raw,stats,classes,enemyStats]=await Promise.all([
    loadCombatJson('./scenarios/demo-1.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/enemy-stats.json')
  ]);
  return {
    ...raw,
    units:[
      ...raw.players.map(player=>buildPlayerClassUnit(player,player.classId,stats,classes)),
      ...raw.enemies.map(enemy=>buildEnemyUnit(enemy,enemyStats))
    ]
  };
}

function demo1Result(model){
  return model.result==='victory'
    ?{title:'Victory',lines:['Tier 1 敵方全滅。','本場用於驗證 Tier 1 職業、主被動技能、Charge 與四系均衡隊伍被動。']}
    :{title:'Party Wipe',lines:['四名主角全滅。','此結果保留作為 Tier 1 對 8 名 Tier 1 敵人的實際強度紀錄。']};
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
