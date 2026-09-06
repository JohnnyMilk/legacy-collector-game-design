import {Region2TwinCombatApp} from './combat-region2-twin-app.js?v=20260906-2000';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildRegion2TwinBossUnit} from './combat-boss-runtime.js?v=20260906-2000';
import {buildTier2BenchmarkUnit,randomTier2ClassIdsBySector,tier2MasteryRows} from './combat-tier2-benchmark-runtime.js?v=20260906-2000';

async function buildScenario(){
  const [raw,stats,classes,bossStats]=await Promise.all([
    loadCombatJson('./scenarios/boss-r2-mini.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/boss-stats.json?v=20260906-2000')
  ]);
  const classIds=randomTier2ClassIdsBySector();
  const players=raw.players.map((base,i)=>buildTier2BenchmarkUnit(base,classIds[i],stats,classes));
  const bosses=raw.bosses.map(base=>buildRegion2TwinBossUnit(base,base.twinKey,bossStats));
  return {scenario:{...raw,units:[...players,...bosses]},progressRows:tier2MasteryRows(classIds,classes)};
}

function result(model){
  const party=model.units.filter(u=>u.team==='player').map(u=>`${u.label}＝${u.className}`).join('／');
  return model.result==='victory'
    ?{title:'Victory',lines:['Region 2 Mini Boss「森脈雙子」棘牙與苔心已擊破。',party,'請觀察交叉破防、雙行動順位與優先擊殺選擇是否形成合理壓力。']}
    :{title:'Party Wipe',lines:['四名 Tier 2 主角遭森脈雙子擊破。',party,'保留此結果作為 Boss 2A 初版強度測試紀錄。']};
}

try{
  const {scenario,progressRows}=await buildScenario();
  new Region2TwinCombatApp({root:document.querySelector('#game-screen'),scenario,progressRows,brandHref:'../combat-test-index.html',demoLabel:'Boss 2A / R2 / Twins',resultContent:result,skillPageSize:1,passivePageSize:1});
}catch(error){console.error(error);document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Boss 2A 載入失敗</h2><p>請重新整理後再試。</p></div></div>'}
