import {buildPlayerClassUnit} from './combat-class-runtime.js?v=20260830-1006';

const TIER2_CLASSES=[
  {id:'tier2_knight',name:'騎士',sector:'warrior',origin:'tier1_warrior',passiveId:'guard',active:{id:'protect',kind:'protect',targetType:'self'}},
  {id:'tier2_berserker',name:'狂戰士',sector:'warrior',origin:'tier1_warrior',passiveId:'rage',active:{id:'sacrifice-slash',kind:'damage',targetType:'enemy',range:1,damageType:'physical',multiplier:2,alwaysHit:true,hpCostPct:15}},
  {id:'tier2_samurai',name:'武士',sector:'warrior',origin:'tier1_warrior',passiveId:'mikiri',active:{id:'iaijutsu',kind:'damage',targetType:'enemy',range:1,damageType:'physical',multiplier:1.5,alwaysHit:true,ignoreDefPct:30}},
  {id:'tier2_ranger',name:'遊俠',sector:'agile',origin:'tier1_scout',passiveId:'hunting-range',active:{id:'traverse-shot',kind:'damage',targetType:'enemy',range:3,damageType:'physical',multiplier:1.5,alwaysHit:true,postMove:2}},
  {id:'tier2_assassin',name:'刺客',sector:'agile',origin:'tier1_scout',passiveId:'hunt',active:{id:'ambush',kind:'ambush',targetType:'enemy',range:3,damageType:'physical',multiplier:1.5,alwaysHit:true}},
  {id:'tier2_blade_dancer',name:'舞刃者',sector:'agile',origin:'tier1_scout',passiveId:'flow',active:{id:'whirling-chain',kind:'whirling',targetType:'enemy',range:1,damageType:'physical',multiplier:1.2,alwaysHit:true,postMove:2,secondMultiplier:.8}},
  {id:'tier2_spellblade',name:'魔劍士',sector:'magic',origin:'tier1_mage',passiveId:'mana-weave',active:{id:'magic-blade-burst',kind:'dual-damage',targetType:'enemy',range:2,alwaysHit:true,magicMultiplier:.8,physicalMultiplier:.8}},
  {id:'tier2_wizard',name:'巫師',sector:'magic',origin:'tier1_mage',passiveId:'mana-mark',active:{id:'arcane-bombard',kind:'arcane-band',targetType:'enemy',range:3,damageType:'magic',alwaysHit:true,centerMultiplier:1,sideMultiplier:.7}},
  {id:'tier2_occultist',name:'咒術師',sector:'magic',origin:'tier1_mage',passiveId:'weakening-curse',active:{id:'binding-curse',kind:'binding',targetType:'enemy',range:3,damageType:'magic',multiplier:1,alwaysHit:true}},
  {id:'tier2_cleric',name:'神官',sector:'support',origin:'tier1_priest',passiveId:'blessing',active:{id:'holy-heal',kind:'holy-heal',targetType:'ally',range:2,allowSelf:true,healingMultiplier:.5}},
  {id:'tier2_bard',name:'吟遊詩人',sector:'support',origin:'tier1_priest',passiveId:'rest',active:{id:'battle-song',kind:'battle-song',targetType:'self'}},
  {id:'tier2_alchemist',name:'鍊金術師',sector:'support',origin:'tier1_priest',passiveId:'reformulation',active:{id:'potion-throw',kind:'potion',targetType:'enemy',range:3,alwaysHit:true}}
];

function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function randomTier2ClassIds(count=4){return shuffle(TIER2_CLASSES).slice(0,count).map(x=>x.id)}

export function buildTier2BenchmarkUnit(base,classId,statsData,classesData){
  const info=TIER2_CLASSES.find(x=>x.id===classId);if(!info)throw new Error(`Unsupported Tier 2 benchmark class: ${classId}`);
  const inherited=buildPlayerClassUnit(base,info.origin,statsData,classesData);
  const stats=statsData?.entries?.find(entry=>entry.name===info.name),formal=classesData?.classDesigns?.[classId],originFormal=classesData?.classDesigns?.[info.origin];
  if(!stats||!formal||!originFormal)throw new Error(`Missing Tier 2 data: ${classId}`);
  const ownPassive={id:info.passiveId,name:formal.passiveSkill.name,effect:formal.passiveSkill.effect,sourceTier:2};
  const ownActive={...info.active,name:formal.activeSkill.name,maxCharges:formal.activeSkill.maxCharges??6,charges:formal.activeSkill.maxCharges??6,effect:formal.activeSkill.effect,sourceTier:2};
  const inheritedPassives=(inherited.passiveSkills||[]).map(s=>({...s,inheritedFrom:info.origin,inheritedFromName:originFormal?.name||inherited.className,sourceTier:1}));
  const inheritedActives=(inherited.activeSkills||[]).map(s=>({...s,inheritedFrom:info.origin,inheritedFromName:originFormal?.name||inherited.className,sourceTier:1}));
  return {...inherited,classId,className:info.name,tierLabel:'Tier 2',stats:{...stats},attack:{name:formal.basicAttack.name,type:formal.basicAttack.damageType,range:formal.basicAttack.range,style:formal.basicAttack.attackStyle,effect:formal.basicAttack.effect},compositionRoles:[info.sector],passiveSkills:[ownPassive,...inheritedPassives],activeSkills:[ownActive,...inheritedActives]};
}

export function tier2MasteryRows(classIds,classesData){return classIds.flatMap(classId=>{const info=TIER2_CLASSES.find(x=>x.id===classId),formal=classesData?.classDesigns?.[classId];return (formal?.masteryChecklist||[]).map(item=>({group:info?.name||classId,label:item.description,value:`0 / ${item.target}`}))})}

export const tier2BenchmarkNote='A-1 / B-1 使用完整 Tier 2 測試 Runtime：Tier 2 自身主動／被動、正式基礎能力值與一般攻擊，並完整保留來源 Tier 1 主動／被動。';
