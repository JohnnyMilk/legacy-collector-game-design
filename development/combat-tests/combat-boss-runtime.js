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

export function region2FinalBossRuntimeDefinition(bossStatsData){
  const def=bossStatsData?.region2?.finalBoss;
  if(!def)throw new Error('Missing Region 2 final boss definition');
  return def;
}

export function buildRegion2FinalBossUnit(base,bossStatsData){
  const def=region2FinalBossRuntimeDefinition(bossStatsData);
  return {
    ...base,
    team:'enemy',
    bossKey:'region2FinalBoss',
    className:def.name,
    label:def.name,
    tierLabel:def.tierLabel||'Region 2 Boss',
    stats:{...def.stats},
    attack:{...def.attack},
    passiveSkills:(def.passiveSkills||[]).map(x=>({...x})),
    activeSkills:(def.activeSkills||[]).map(x=>({...x}))
  };
}

export function buildRegion2TotemUnit(base,totemKey,bossStatsData){
  const group=region2FinalBossRuntimeDefinition(bossStatsData),def=group.totems?.[totemKey];
  if(!def)throw new Error(`Missing Region 2 totem definition: ${totemKey}`);
  return {
    ...base,
    id:base.id||`boss-r2-totem-${totemKey}`,
    team:'enemy',
    isTotem:true,
    totemKey,
    className:def.name,
    label:def.name,
    tierLabel:'Boss Totem',
    buffStat:def.stat,
    buffPct:def.bonusPct,
    stats:{...def.stats},
    passiveSkills:[{id:`totem-aura-${totemKey}`,name:'圖騰加護',effect:`存活時使四印祭主 ${def.stat} +${def.bonusPct}%。`}],
    activeSkills:[]
  };
}
