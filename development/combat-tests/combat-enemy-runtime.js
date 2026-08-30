export function enemyRuntimeDefinition(enemyType,enemyStatsData,tierKey='tier1'){
  const entry=enemyStatsData?.tiers?.[tierKey]?.entries?.[enemyType];
  if(!entry)throw new Error(`Missing confirmed enemy template: ${tierKey}/${enemyType}`);
  return entry;
}

export function buildEnemyUnit(base,enemyStatsData){
  const tierKey=base.enemyTier||'tier1';
  const def=enemyRuntimeDefinition(base.enemyType,enemyStatsData,tierKey);
  const tierNumber=String(tierKey).replace('tier','')||'1';
  return {
    ...base,
    team:'enemy',
    className:def.name,
    label:base.label||def.name,
    tierLabel:`Tier ${tierNumber}`,
    stats:{...def.stats},
    attack:{...def.attack},
    passiveSkills:(def.passiveSkills||[]).map(x=>({...x})),
    activeSkills:(def.activeSkills||[]).map(x=>({...x}))
  };
}
