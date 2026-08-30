import {BossCombatApp} from './combat-boss-app.js?v=20260830-0748';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260830-1646';
import {buildEnemyUnit} from './combat-enemy-runtime.js?v=20260830-1135';
import {buildBossUnit} from './combat-boss-runtime.js?v=20260830-0748';

async function buildScenario(){
  const [raw,stats,classes,bossStats,enemyStats]=await Promise.all([
    loadCombatJson('./scenarios/boss-r1-mini.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/boss-stats.json?v=20260830-2102'),
    loadCombatJson('../../data/enemy-stats.json?v=20260830-2102')
  ]);
  return {...raw,units:[...raw.players.map(p=>buildPlayerClassUnit(p,p.classId,stats,classes)),...(raw.enemies||[]).map(e=>buildEnemyUnit(e,enemyStats)),buildBossUnit(raw.boss,'miniBoss',bossStats)]};
}

function result(model){return model.result==='victory'?{title:'Victory',lines:['Region 1 Mini Boss 與 2 名 Tier 1 獵兵擊破。','請以戰鬥體感判斷 Mini Boss + 遠距護衛的壓力是否合適。']}:{title:'Party Wipe',lines:['四名 Tier 1 主角全滅。','保留此結果作為 Mini Boss + 2 名獵兵強度測試紀錄。']}}

try{const scenario=await buildScenario();new BossCombatApp({root:document.querySelector('#game-screen'),scenario,brandHref:'../combat-test-index.html',demoLabel:'Boss 1A / R1',resultContent:result})}catch(error){console.error(error);document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Boss 1A 載入失敗</h2><p>請重新整理後再試。</p></div></div>'}
