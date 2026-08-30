import {Tier2BossCombatApp} from './combat-tier2-boss-app.js?v=20260830-1504';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildEnemyUnit} from './combat-enemy-runtime.js?v=20260830-1530';
import {buildTier2BenchmarkUnit,randomTier2ClassIds,tier2MasteryRows} from './combat-tier2-benchmark-runtime.js?v=20260830-1148';

function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function randomPick(list){return list[Math.floor(Math.random()*list.length)]}
function randomEnemyTypes(enemyStats,tierKey,count){const types=Object.keys(enemyStats?.tiers?.[tierKey]?.entries||{});if(!types.length)throw new Error(`NO_${tierKey.toUpperCase()}_ENEMIES`);return Array.from({length:count},()=>randomPick(types))}
function randomWalls(raw,count=5){const occupied=new Set([...raw.players.map(u=>`${u.x},${u.y}`),...raw.enemies.map(u=>`${u.x},${u.y}`)]),candidates=[];for(let y=2;y<=5;y++)for(let x=0;x<raw.map.width;x++){const key=`${x},${y}`;if(!occupied.has(key))candidates.push([x,y])}return shuffle(candidates).slice(0,count)}

async function buildScenario(){
  const [raw,stats,classes,enemyStats]=await Promise.all([
    loadCombatJson('./scenarios/demo-2-1.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/enemy-stats.json?v=20260830-2102')
  ]);
  const tier2Ids=randomTier2ClassIds(4);
  const players=raw.players.map((base,i)=>buildTier2BenchmarkUnit(base,tier2Ids[i],stats,classes));
  const tier1Types=randomEnemyTypes(enemyStats,'tier1',4),tier2Types=randomEnemyTypes(enemyStats,'tier2',4);let i1=0,i2=0;
  const enemies=raw.enemies.map(enemy=>buildEnemyUnit({...enemy,enemyType:enemy.enemyTier==='tier2'?tier2Types[i2++]:tier1Types[i1++]},enemyStats));
  return {scenario:{...raw,map:{...raw.map,walls:randomWalls(raw,5)},units:[...players,...enemies]},progressRows:tier2MasteryRows(tier2Ids,classes)};
}

function result(model){
  const party=model.units.filter(u=>u.team==='player').map(u=>`${u.label}＝${u.className}`).join('／');
  return model.result==='victory'
    ?{title:'Victory',lines:['Region 2 Demo 2-1 混編敵軍全滅。',party,'本場用於驗證 4 名 Tier 2 玩家面對 Tier 1 ×4 + Tier 2 ×4 的標準 Region 2 壓力。']}
    :{title:'Party Wipe',lines:['四名 Tier 2 主角全滅。',party,'保留此結果作為 Region 2 前段混編敵軍強度紀錄。']};
}

try{
  const {scenario,progressRows}=await buildScenario();
  new Tier2BossCombatApp({root:document.querySelector('#game-screen'),scenario,progressRows,brandHref:'../combat-test-index.html',demoLabel:'Demo 2-1 / Region 2',resultContent:result,skillPageSize:1,passivePageSize:1});
}catch(error){console.error(error);document.querySelector('#game-screen').innerHTML='<div class="result-overlay"><div class="result-card"><h2>Demo 2-1 載入失敗</h2><p>請重新整理後再試。</p></div></div>'}
