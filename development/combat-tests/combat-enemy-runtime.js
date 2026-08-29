export function enemyRuntimeDefinition(enemyType,enemyStatsData){
  const entry=enemyStatsData?.tiers?.tier1?.entries?.[enemyType];
  if(!entry)throw new Error(`Missing confirmed enemy template: ${enemyType}`);
  return entry;
}

export function buildEnemyUnit(base,enemyStatsData){
  const def=enemyRuntimeDefinition(base.enemyType,enemyStatsData);
  return {
    ...base,
    team:'enemy',
    className:def.name,
    label:def.name,
    tierLabel:'Tier 1',
    stats:{...def.stats},
    attack:{...def.attack}
  };
}
