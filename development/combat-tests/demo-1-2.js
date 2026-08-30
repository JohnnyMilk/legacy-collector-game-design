import {CombatApp} from './combat-app.js?v=20260830-1311';
import {loadCombatJson} from './combat-data.js?v=20260829-1849';
import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260830-1646';
import {buildEnemyUnit} from './combat-enemy-runtime.js?v=20260830-1530';

function randomPick(list){return list[Math.floor(Math.random()*list.length)]}

function randomEnemyTypes(enemyStats,tierKey,count){
  const entries=enemyStats?.tiers?.[tierKey]?.entries||{};
  const types=Object.keys(entries);
  if(!types.length)throw new Error(`NO_${tierKey.toUpperCase()}_ENEMIES`);
  return Array.from({length:count},()=>randomPick(types));
}

function randomWalls(raw,count=4){
  const occupied=new Set([
    ...raw.players.map(u=>`${u.x},${u.y}`),
    ...raw.enemies.map(u=>`${u.x},${u.y}`)
  ]);
  const candidates=[];
  for(let y=2;y<=5;y++)for(let x=0;x<raw.map.width;x++){
    const key=`${x},${y}`;
    if(!occupied.has(key))candidates.push([x,y]);
  }
  for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}
  return candidates.slice(0,count);
}

async function buildScenario(){
  const [raw,stats,classes,enemyStats]=await Promise.all([
    loadCombatJson('./scenarios/demo-1-2.json'),
    loadCombatJson('../../data/class-stats.json'),
    loadCombatJson('../../data/classes.json'),
    loadCombatJson('../../data/enemy-stats.json')
  ]);
  const tier1Types=randomEnemyTypes(enemyStats,'tier1',4);
  const tier2Types=randomEnemyTypes(enemyStats,'tier2',4);
  let i1=0,i2=0;
  const enemies=raw.enemies.map(enemy=>{
    const enemyType=enemy.enemyTier==='tier2'?tier2Types[i2++]:tier1Types[i1++];
    return buildEnemyUnit({...enemy,enemyType},enemyStats);
  });
  return {
    ...raw,
    map:{...raw.map,walls:randomWalls(raw,4)},
    units:[
      ...raw.players.map(player=>buildPlayerClassUnit(player,player.classId,stats,classes)),
      ...enemies
    ]
  };
}

function result(model){
  return model.result==='victory'
    ?{title:'Victory',lines:['Region 1 後段混編敵軍全滅。','本場用於驗證 Final Boss 前的 Tier 1 + Tier 2 小怪壓力。']}
    :{title:'Party Wipe',lines:['四名 Tier 1 主角全滅。','實測確認：純 Tier 1 主角群無法合理應付 Tier 1 ×4 + Tier 2 ×4 的 Region 1 後段混編。']};
}

try{
  const scenario=await buildScenario();
  new CombatApp({root:document.querySelector('#game-screen'),scenario,brandHref:'../combat-test-index.html',demoLabel:'Demo 1-2 / R1 Late',resultContent:result});
}catch(error){
  console.error(error);
  const missingTier2=String(error?.message||'').includes('NO_TIER2_ENEMIES');
  document.querySelector('#game-screen').innerHTML=missingTier2
    ?'<div class="result-overlay"><div class="result-card"><h2>Demo 1-2 等待 Tier 2 敵人資料</h2><p>場景、隨機 4 名 Tier 1、隨機 4 格障礙與四系 Tier 1 主角已就緒；目前 data/enemy-stats.json 的 Tier 2 一般敵人仍為 TBD，因此不建立虛構數值。</p></div></div>'
    :'<div class="result-overlay"><div class="result-card"><h2>Demo 1-2 載入失敗</h2><p>請重新整理後再試。</p></div></div>';
}
