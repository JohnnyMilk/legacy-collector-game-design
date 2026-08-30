import {BossCombatApp} from './combat-boss-app.js?v=20260830-1550';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260830-1006';
import {buildEnemyUnit} from './combat-enemy-runtime.js?v=20260830-1324';
import {buildBossUnit} from './combat-boss-runtime.js?v=20260830-0748';

async function buildScenario(){
  const [raw,stats,classes,bossStats,enemyStats]=await Promise.all([
    loadCombatJson('./scenarios/boss-r1-final.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/boss-stats.json'),
    loadCombatJson('../../data/enemy-stats.json')
  ]);
  return {...raw,units:[...raw.players.map(p=>buildPlayerClassUnit(p,p.classId,stats,classes)),...(raw.enemies||[]).map(e=>buildEnemyUnit(e,enemyStats)),buildBossUnit(raw.boss,'finalBoss',bossStats)]};
}

function result(model){return model.result==='victory'?{title:'Victory',lines:['Region 1 Boss 與 2 名 Tier 2 巡弋機兵擊破。','請以戰鬥體感判斷 Tier 1 隊伍面對遠程壓制與 Boss 的壓力。']}:{title:'Party Wipe',lines:['四名 Tier 1 主角全滅。','保留此結果作為 Region 1 Boss + Tier 2 巡弋機兵強度測試紀錄。']}}

try{const scenario=await buildScenario();new BossCombatApp({root:document.querySelector('#game-screen'),scenario,brandHref:'../combat-test-index.html',demoLabel:'Boss 1B / R1',resultContent:result})}catch(error){console.error(error);document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Boss 1B 載入失敗</h2><p>請重新整理後再試。</p></div></div>'}
