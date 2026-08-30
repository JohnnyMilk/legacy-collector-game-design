import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260829-1920';

const TIER2_CLASSES=[
  {id:'tier2_knight',name:'騎士',sector:'warrior',origin:'tier1_warrior'},
  {id:'tier2_berserker',name:'狂戰士',sector:'warrior',origin:'tier1_warrior'},
  {id:'tier2_samurai',name:'武士',sector:'warrior',origin:'tier1_warrior'},
  {id:'tier2_ranger',name:'遊俠',sector:'agile',origin:'tier1_scout'},
  {id:'tier2_assassin',name:'刺客',sector:'agile',origin:'tier1_scout'},
  {id:'tier2_blade_dancer',name:'舞刃者',sector:'agile',origin:'tier1_scout'},
  {id:'tier2_spellblade',name:'魔劍士',sector:'magic',origin:'tier1_mage'},
  {id:'tier2_wizard',name:'巫師',sector:'magic',origin:'tier1_mage'},
  {id:'tier2_occultist',name:'咒術師',sector:'magic',origin:'tier1_mage'},
  {id:'tier2_cleric',name:'神官',sector:'support',origin:'tier1_priest'},
  {id:'tier2_bard',name:'吟遊詩人',sector:'support',origin:'tier1_priest'},
  {id:'tier2_alchemist',name:'鍊金術師',sector:'support',origin:'tier1_priest'}
];

function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

export function randomTier2ClassIds(count=4){return shuffle(TIER2_CLASSES).slice(0,count).map(x=>x.id)}

export function buildTier2BenchmarkUnit(base,classId,statsData,classesData){
  const info=TIER2_CLASSES.find(x=>x.id===classId);if(!info)throw new Error(`Unsupported Tier 2 benchmark class: ${classId}`);
  const inherited=buildPlayerClassUnit(base,info.origin,statsData,classesData);
  const stats=statsData?.entries?.find(entry=>entry.name===info.name);
  const formal=classesData?.classDesigns?.[classId];
  if(!stats||!formal)throw new Error(`Missing Tier 2 data: ${classId}`);
  return {
    ...inherited,
    classId,
    className:info.name,
    tierLabel:'Tier 2',
    stats:{...stats},
    attack:{name:formal.basicAttack.name,type:formal.basicAttack.damageType,range:formal.basicAttack.range,style:formal.basicAttack.attackStyle,effect:formal.basicAttack.effect},
    compositionRoles:[info.sector],
    passiveSkills:(inherited.passiveSkills||[]).map(s=>({...s,inheritedFrom:info.origin})),
    activeSkills:(inherited.activeSkills||[]).map(s=>({...s,inheritedFrom:info.origin}))
  };
}

export function tier2MasteryRows(classIds,classesData){
  return classIds.flatMap(classId=>{
    const info=TIER2_CLASSES.find(x=>x.id===classId),formal=classesData?.classDesigns?.[classId];
    return (formal?.masteryChecklist||[]).map(item=>({label:`${info?.name||classId}｜${item.description}`,value:`0 / ${item.target}`}));
  });
}

export const tier2BenchmarkNote='A-1 / B-1 使用 Tier 2 正式基礎能力值與一般攻擊；Tier 1 來源職業的主動與被動技能必須完整保留。Tier 2 自身專屬主被動尚未加入 Runtime，因此仍是偏保守的 Tier 2 強度基準。';
