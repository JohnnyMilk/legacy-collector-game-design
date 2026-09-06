function ensureLayer(app){
  const battlefield=app.root?.querySelector('.battlefield-layer');
  if(!battlefield)return null;
  let layer=battlefield.querySelector('.floating-combat-layer');
  if(!layer){
    layer=document.createElement('div');
    layer.className='floating-combat-layer';
    layer.setAttribute('aria-hidden','true');
    battlefield.appendChild(layer);
  }
  return layer;
}

function floatAtUnit(app,target,type,text){
  if(!target||!text)return;
  const layer=ensureLayer(app),grid=app.grid||app.root?.querySelector('#battle-grid');
  if(!layer||!grid)return;
  const index=target.y*app.model.width+target.x,cell=grid.children[index];
  if(!cell)return;
  const layerRect=layer.getBoundingClientRect(),rect=cell.getBoundingClientRect();
  const active=[...layer.querySelectorAll('.floating-combat-text')].filter(el=>el.dataset.targetId===target.id).length;
  const el=document.createElement('span');
  el.className=`floating-combat-text ${type}`;
  el.dataset.targetId=target.id;
  el.textContent=text;
  el.style.left=`${rect.left-layerRect.left+rect.width/2}px`;
  el.style.top=`${rect.top-layerRect.top+rect.height*.34-active*15}px`;
  layer.appendChild(el);
  setTimeout(()=>el.remove(),2100);
}

function percentText(label,value){return value?`${label} -${value}%`:null}

function wrapModel(app){
  const model=app.model;
  if(!model||model.__floatingCombatTextInstalled)return;
  model.__floatingCombatTextInstalled=true;

  if(typeof model.dealDamage==='function'){
    const original=model.dealDamage.bind(model);
    model.dealDamage=(attacker,target,options={})=>{
      const before={
        tempDamageDownPct:target?.tempDamageDownPct||0,
        tempDefDownPct:target?.tempDefDownPct||0,
        tempMdefDownPct:target?.tempMdefDownPct||0,
        tempAgiDownPct:target?.tempAgiDownPct||0,
        manaMarks:Object.values(target?.manaMarks||{}).reduce((sum,n)=>sum+(Number(n)||0),0),
        mikiriTargetId:target?.mikiriTargetId||null,
        attackerManaWeave:attacker?.manaWeaveNext||null
      };
      const result=original(attacker,target,options);
      if(result?.hit)floatAtUnit(app,target,'damage',`${result.crit?'CRIT ':''}-${result.damage}`);
      else if(result?.ok)floatAtUnit(app,target,'miss','MISS');
      if(result?.hit&&target?.isTotem&&!target.alive){
        const boss=model.boss?.();
        if(boss?.alive)floatAtUnit(app,boss,'debuff','圖騰再塑延遲');
      }
      if(target){
        if((target.tempDamageDownPct||0)>before.tempDamageDownPct)floatAtUnit(app,target,'debuff',percentText('傷害',target.tempDamageDownPct));
        if((target.tempDefDownPct||0)>before.tempDefDownPct)floatAtUnit(app,target,'debuff',percentText('DEF',target.tempDefDownPct));
        if((target.tempMdefDownPct||0)>before.tempMdefDownPct)floatAtUnit(app,target,'debuff',percentText('MDEF',target.tempMdefDownPct));
        if((target.tempAgiDownPct||0)>before.tempAgiDownPct)floatAtUnit(app,target,'debuff',percentText('AGI',target.tempAgiDownPct));
        const marks=Object.values(target.manaMarks||{}).reduce((sum,n)=>sum+(Number(n)||0),0);
        if(marks>before.manaMarks)floatAtUnit(app,target,'debuff',`刻印 ×${marks}`);
        if(target.mikiriTargetId&&target.mikiriTargetId!==before.mikiriTargetId)floatAtUnit(app,target,'buff','見切');
      }
      if(attacker?.manaWeaveNext&&attacker.manaWeaveNext!==before.attackerManaWeave){
        floatAtUnit(app,attacker,'buff',`魔力交織：${attacker.manaWeaveNext==='magic'?'魔法':'物理'}`);
      }
      return result;
    };
  }

  if(typeof model.healOne==='function'){
    const original=model.healOne.bind(model);
    model.healOne=(unit,target,multiplier)=>{
      const result=original(unit,target,multiplier);
      if(result?.healed!=null)floatAtUnit(app,target,'heal',`+${result.healed} HP`);
      if(result?.grace)floatAtUnit(app,target,'buff','恩典');
      if(result?.blessing)floatAtUnit(app,target,'buff','祝福');
      return result;
    };
  }

  if(typeof model.usePotionLine==='function'){
    const original=model.usePotionLine.bind(model);
    model.usePotionLine=(unit,skillId,dx,dy,startDistance,roll)=>{
      const result=original(unit,skillId,dx,dy,startDistance,roll);
      if(result?.ok){
        const label=result.effect==='weak'?'傷害':result.effect==='corrode'?'DEF/MDEF':'AGI';
        for(const target of result.targets||[])floatAtUnit(app,target,'debuff',`${label} -${result.pct}%`);
      }
      return result;
    };
  }

  if(typeof model.useSkill==='function'){
    const original=model.useSkill.bind(model);
    model.useSkill=(unit,skillId,target=unit,roll)=>{
      const skill=model.skillById?.(unit,skillId),kind=skill?.kind;
      const beforeDef=target?.tempDefDownPct||0,beforeMdef=target?.tempMdefDownPct||0;
      const result=original(unit,skillId,target,roll);
      if(!result?.ok)return result;
      if((target?.tempDefDownPct||0)>beforeDef)floatAtUnit(app,target,'debuff',percentText('DEF',target.tempDefDownPct));
      if((target?.tempMdefDownPct||0)>beforeMdef)floatAtUnit(app,target,'debuff',percentText('MDEF',target.tempMdefDownPct));
      if(kind==='heal'&&result.healed!=null){
        floatAtUnit(app,target,'heal',`+${result.healed} HP`);
        if(model.hasPassive?.(unit,'grace')&&target.currentHP/target.stats.HP>=.5)floatAtUnit(app,target,'buff','恩典');
      }
      if(kind==='dash')floatAtUnit(app,unit,'buff',`MOVE +${skill.moveBonus||0}`);
      if(kind==='protect')floatAtUnit(app,unit,'buff','守護');
      if(kind==='battle-song'){
        const allies=model.living('player').filter(a=>a.id!==unit.id&&a.battleSongBuff&&Math.max(Math.abs(a.x-unit.x),Math.abs(a.y-unit.y))===1);
        for(const ally of allies)floatAtUnit(app,ally,'buff','戰歌 +20%');
      }
      if(kind==='binding'&&target?.rootedNextTurn)floatAtUnit(app,target,'debuff','束縛');
      if(kind==='totem-rebuild'&&result.totem){
        floatAtUnit(app,result.totem,'buff','圖騰重建');
        const boss=model.boss?.();
        if(boss)floatAtUnit(app,boss,'buff',`${result.totem.buffStat} +${result.totem.buffPct}%`);
      }
      return result;
    };
  }
}

export function installFloatingCombatText(app){
  if(!app||app.__floatingCombatTextInstalled)return app;
  app.__floatingCombatTextInstalled=true;
  ensureLayer(app);
  wrapModel(app);
  const originalReset=app.reset.bind(app);
  app.reset=()=>{const result=originalReset();ensureLayer(app);wrapModel(app);return result};
  return app;
}
