import {Region2TotemCombatApp} from './combat-region2-totem-app.js?v=20260906-2200';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildRegion2FinalBossUnit,buildRegion2TotemUnit} from './combat-boss-runtime.js?v=20260906-2200';
import {randomTotemPlacements} from './combat-region2-totem-runtime.js?v=20260906-2200';
import {buildTier2BenchmarkUnit,randomTier2ClassIdsBySector,tier2MasteryRows} from './combat-tier2-benchmark-runtime.js?v=20260906-2000';

async function buildScenario(){
  const [raw,stats,classes,bossStats]=await Promise.all([
    loadCombatJson('./scenarios/boss-r2-final.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/boss-stats.json?v=20260906-2200')
  ]);
  const classIds=randomTier2ClassIdsBySector(),players=raw.players.map((base,i)=>buildTier2BenchmarkUnit(base,classIds[i],stats,classes));
  const boss=buildRegion2FinalBossUnit(raw.boss,bossStats),placements=randomTotemPlacements(raw,raw.totemKeys.length);
  const totems=raw.totemKeys.map((key,i)=>buildRegion2TotemUnit({...placements[i],id:`boss-r2-totem-${key}`},key,bossStats));
  return {scenario:{...raw,units:[...players,boss,...totems]},progressRows:tier2MasteryRows(classIds,classes)};
}

function result(model){
  const party=model.units.filter(u=>u.team==='player').map(u=>`${u.label}＝${u.className}`).join('／');
  return model.result==='victory'
    ?{title:'Victory',lines:['Region 2 Boss「四印祭主」已擊破。',party,'請觀察拆除圖騰與直接集火 Boss 的取捨，以及「圖騰再塑」是否造成合理壓力。']}
    :{title:'Party Wipe',lines:['四名 Tier 2 主角遭四印祭主擊破。',party,'保留此結果作為 Boss 2B 初版強度測試紀錄。']};
}

try{
  const {scenario,progressRows}=await buildScenario();
  new Region2TotemCombatApp({root:document.querySelector('#game-screen'),scenario,progressRows,brandHref:'../combat-test-index.html',demoLabel:'Boss 2B / R2 / Totems',resultContent:result,skillPageSize:1,passivePageSize:1});
}catch(error){console.error(error);document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Boss 2B 載入失敗</h2><p>請重新整理後再試。</p></div></div>'}
