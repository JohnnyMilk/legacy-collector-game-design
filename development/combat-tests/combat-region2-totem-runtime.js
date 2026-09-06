function shuffle(items,roll=Math.random){const list=[...items];for(let i=list.length-1;i>0;i--){const j=Math.floor(roll()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list}

export function randomTotemPlacements(raw,count,roll=Math.random){
  const fixed=[...raw.players,raw.boss],walls=new Set((raw.map.walls||[]).map(([x,y])=>`${x},${y}`)),candidates=[];
  for(let y=0;y<raw.map.height;y++)for(let x=0;x<raw.map.width;x++){
    if(walls.has(`${x},${y}`)||fixed.some(u=>u.x===x&&u.y===y))continue;
    if(fixed.some(u=>Math.max(Math.abs(u.x-x),Math.abs(u.y-y))<=1))continue;
    candidates.push({x,y});
  }
  for(let attempt=0;attempt<200;attempt++){
    const picked=[];
    for(const cell of shuffle(candidates,roll)){
      if(picked.every(p=>Math.max(Math.abs(p.x-cell.x),Math.abs(p.y-cell.y))>1))picked.push(cell);
      if(picked.length===count)return picked;
    }
  }
  throw new Error('Unable to place Region 2 Boss totems');
}
