export const PARTY_SECTORS=['warrior','agile','magic','support'];

const SECTOR_LABELS={warrior:'戰士系',agile:'敏捷系',magic:'魔法系',support:'支援系'};
const LEVEL_BONUS={2:10,3:20,4:30};

function sectorEffect(sector,count,bonus){
  if(sector==='warrior')return `${SECTOR_LABELS[sector]} ×${count}：物理傷害 +${bonus}%`;
  if(sector==='agile')return `${SECTOR_LABELS[sector]} ×${count}：AGI +${bonus}%`;
  if(sector==='magic')return `${SECTOR_LABELS[sector]} ×${count}：魔法傷害 +${bonus}%`;
  if(sector==='support')return `${SECTOR_LABELS[sector]} ×${count}：DEF／MDEF +${bonus}%`;
  return `${SECTOR_LABELS[sector]||sector} ×${count}：+${bonus}%`;
}

export function evaluatePartyComposition(units=[]){
  const counts={warrior:0,agile:0,magic:0,support:0};
  for(const unit of units.filter(u=>u.team==='player')){
    const roles=Array.isArray(unit.compositionRoles)?unit.compositionRoles:[];
    for(const role of new Set(roles))if(role in counts)counts[role]++;
  }

  const active=[];
  const modifiers={physicalDamagePct:0,magicDamagePct:0,agiPct:0,defPct:0,mdefPct:0};
  for(const sector of PARTY_SECTORS){
    const n=counts[sector];
    const bonus=LEVEL_BONUS[n]||0;
    if(!bonus)continue;
    if(sector==='warrior')modifiers.physicalDamagePct+=bonus;
    if(sector==='agile')modifiers.agiPct+=bonus;
    if(sector==='magic')modifiers.magicDamagePct+=bonus;
    if(sector==='support'){modifiers.defPct+=bonus;modifiers.mdefPct+=bonus}
    active.push({id:sector,label:SECTOR_LABELS[sector],count:n,effect:sectorEffect(sector,n,bonus)});
  }

  const balanced=PARTY_SECTORS.every(sector=>counts[sector]===1);
  if(balanced){
    modifiers.physicalDamagePct+=5;modifiers.magicDamagePct+=5;modifiers.agiPct+=5;modifiers.defPct+=5;modifiers.mdefPct+=5;
    active.push({id:'balanced',label:'四系均衡',count:4,effect:'物理傷害／魔法傷害／AGI／DEF／MDEF +5%'});
  }

  return {
    counts,
    modifiers,
    active,
    title:balanced?'四系均衡':active.length?active.map(x=>x.label).join('＋'):'未啟用',
    summary:balanced?'物理傷害／魔法傷害／AGI／DEF／MDEF +5%':active.length?active.map(x=>x.effect).join('；'):'目前隊伍未形成職業系被動'
  };
}
