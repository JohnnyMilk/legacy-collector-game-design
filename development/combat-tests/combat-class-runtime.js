const TIER1_RUNTIME={
  tier1_warrior:{name:'戰士',roles:['warrior'],passiveId:'hold-fast',active:{id:'slam',name:'猛擊',maxCharges:9,targetType:'enemy',range:1,kind:'damage',damageType:'physical',multiplier:1.5,alwaysHit:true}},
  tier1_scout:{name:'斥候',roles:['agile'],passiveId:'guerrilla',active:{id:'dash',name:'疾行',maxCharges:9,targetType:'self',kind:'dash',moveBonus:3,consumesAction:false}},
  tier1_mage:{name:'法師',roles:['magic'],passiveId:'focus',active:{id:'magic-bolt',name:'魔力彈',maxCharges:9,targetType:'enemy',range:3,kind:'damage',damageType:'magic',multiplier:1.5,alwaysHit:true}},
  tier1_priest:{name:'牧師',roles:['support'],passiveId:'grace',active:{id:'heal',name:'治癒',maxCharges:9,targetType:'ally',range:2,kind:'heal',healingMultiplier:1,allowSelf:true}}
};

export function classRuntimeDefinition(classId,classesData){
  const runtime=TIER1_RUNTIME[classId];
  const formal=classesData?.classDesigns?.[classId];
  if(!runtime||!formal)throw new Error(`Unsupported or missing class runtime: ${classId}`);
  return {
    ...runtime,
    attack:{
      name:formal.basicAttack.name,
      type:formal.basicAttack.damageType,
      range:formal.basicAttack.range
    },
    active:{
      ...runtime.active,
      name:formal.activeSkill.name,
      maxCharges:formal.activeSkill.maxCharges??runtime.active.maxCharges,
      effect:formal.activeSkill.effect
    },
    passiveName:formal.passiveSkill.name,
    passiveEffect:formal.passiveSkill.effect
  };
}

export function buildPlayerClassUnit(base,classId,statsData,classesData){
  const def=classRuntimeDefinition(classId,classesData);
  const stats=statsData?.entries?.find(entry=>entry.name===def.name);
  if(!stats)throw new Error(`Missing stat template: ${def.name}`);
  return {
    ...base,
    team:'player',
    classId,
    className:def.name,
    stats:{...stats},
    attack:{...def.attack},
    compositionRoles:[...def.roles],
    passiveSkills:[{id:def.passiveId,name:def.passiveName,effect:def.passiveEffect}],
    activeSkills:[{...def.active,charges:def.active.maxCharges}]
  };
}
