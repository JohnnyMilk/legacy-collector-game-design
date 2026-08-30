import {Tier2BossCombatApp} from './combat-tier2-boss-app.js?v=20260830-1027';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildBossUnit} from './combat-boss-runtime.js?v=20260830-0748';
import {buildTier2BenchmarkUnit,randomTier2ClassIds,tier2MasteryRows,tier2BenchmarkNote} from './combat-tier2-benchmark-runtime.js?v=20260830-1006';

async function buildScenario(){
  const [raw,stats,classes,bossStats]=await Promise.all([
    loadCombatJson('./scenarios/boss-r1-mini.json'),loadCombatJson('../../data/class-stats.json'),loadCombatJson('../../data/classes.json'),loadCombatJson('../../data/boss-stats.json')
  ]);
  const classIds=randomTier2ClassIds(4);
  return {scenario:{...raw,id:'boss-r1-mini-t2',title:'Boss Test A-1｜Region 1 Mini Boss vs Tier 2',units:[...raw.players.map((p,i)=>buildTier2BenchmarkUnit(p,classIds[i],stats,classes)),buildBossUnit(raw.boss,'miniBoss',bossStats)]},progressRows:tier2MasteryRows(classIds,classes)};
}
function result(model){const party=model.units.filter(u=>u.team==='player').map(u=>`${u.label}＝${u.className}`).join('／');return model.result==='victory'?{title:'Victory',lines:['Tier 2 隊伍擊破 Region 1 Mini Boss。',party,tier2BenchmarkNote]}:{title:'Party Wipe',lines:['Tier 2 隊伍遭到 Region 1 Mini Boss 擊破。',party,tier2BenchmarkNote]}}
try{const {scenario,progressRows}=await buildScenario();new Tier2BossCombatApp({root:document.querySelector('#game-screen'),scenario,progressRows,brandHref:'../combat-test-index.html',demoLabel:'Boss A-1 / T2',resultContent:result,skillPageSize:1,passivePageSize:1})}catch(error){console.error(error);document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Boss A-1 載入失敗</h2><p>請重新整理後再試。</p></div></div>'}
