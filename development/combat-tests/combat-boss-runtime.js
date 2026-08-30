export function bossRuntimeDefinition(bossKey,bossStatsData){
  const region=bossStatsData?.region1;
  const def=bossKey==='miniBoss'?region?.miniBoss:bossKey==='finalBoss'?region?.finalBoss:null;
  if(!def)throw new Error(`Missing boss definition: ${bossKey}`);
  return def;
}

export function buildBossUnit(base,bossKey,bossStatsData){
  const def=bossRuntimeDefinition(bossKey,bossStatsData);
  return {
    ...base,
    team:'enemy',
    bossKey,
    className:def.name,
    label:def.name,
    tierLabel:def.tierLabel,
    stats:{...def.stats},
    attack:{...def.attack},
    passiveSkills:(def.passiveSkills||[]).map(x=>({...x})),
    activeSkills:(def.activeSkills||[]).map(x=>({...x}))
  };
}
