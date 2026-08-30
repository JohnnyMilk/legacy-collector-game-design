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
    attack:{
      name:formal.basicAttack.name,
      type:formal.basicAttack.damageType,
      range:formal.basicAttack.range,
      style:formal.basicAttack.attackStyle,
      effect:formal.basicAttack.effect
    },
    compositionRoles:[info.sector]
  };
}

export const tier2BenchmarkNote='A-1 / B-1 目前使用 Tier 2 正式基礎能力值與一般攻擊，並保留其來源 Tier 1 的已實作繼承技能；Tier 2 自身專屬主被動尚未加入 Runtime，因此這是一個偏保守的 Tier 2 強度基準。';
