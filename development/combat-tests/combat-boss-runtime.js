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

export function region2TwinRuntimeDefinition(twinKey,bossStatsData){
  const def=bossStatsData?.region2?.miniBoss?.members?.[twinKey];
  if(!def)throw new Error(`Missing Region 2 twin boss definition: ${twinKey}`);
  return def;
}

export function buildRegion2TwinBossUnit(base,twinKey,bossStatsData){
  const group=bossStatsData?.region2?.miniBoss,def=region2TwinRuntimeDefinition(twinKey,bossStatsData);
  return {
    ...base,
    team:'enemy',
    bossKey:'region2MiniBossTwin',
    twinKey,
    className:def.name,
    label:def.name,
    tierLabel:group?.tierLabel||'Region 2 Mini Boss',
    stats:{...def.stats},
    attack:{...def.attack},
    passiveSkills:(def.passiveSkills||[]).map(x=>({...x})),
    activeSkills:(def.activeSkills||[]).map(x=>({...x}))
  };
}
