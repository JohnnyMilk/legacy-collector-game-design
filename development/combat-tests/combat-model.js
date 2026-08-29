export class CombatModel {
  constructor(scenario){
    this.scenario=scenario;
    this.width=scenario.map.width;
    this.height=scenario.map.height;
    this.walls=new Set((scenario.map.walls||[]).map(([x,y])=>this.key(x,y)));
    this.units=scenario.units.map((u,i)=>({...u,spawnOrder:i,currentHP:u.stats.HP,alive:true,moved:false,acted:false}));
    this.round=0;this.queue=[];this.turnIndex=0;this.log=[];this.finished=false;this.result=null;
  }
  key(x,y){return `${x},${y}`}
  unitAt(x,y){return this.units.find(u=>u.alive&&u.x===x&&u.y===y)||null}
  living(team){return this.units.filter(u=>u.alive&&(!team||u.team===team))}
  distance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)}
  start(){this.nextRound();return this.currentUnit()}
  nextRound(){
    this.round++;
    this.units.forEach(u=>{u.moved=false;u.acted=false});
    this.queue=this.living().slice().sort((a,b)=>b.stats.AGI-a.stats.AGI||(a.team===b.team?a.spawnOrder-b.spawnOrder:(a.team==='player'?-1:1))).map(u=>u.id);
    this.turnIndex=0;
    this.addLog(`Round ${this.round} 開始。`);
  }
  currentUnit(){return this.units.find(u=>u.id===this.queue[this.turnIndex]&&u.alive)||null}
  normalizeTurn(){
    while(this.turnIndex<this.queue.length&&!this.currentUnit())this.turnIndex++;
    if(this.turnIndex>=this.queue.length&&!this.finished)this.nextRound();
    return this.currentUnit();
  }
  endTurn(){
    const u=this.currentUnit();if(u){u.moved=true;u.acted=true}
    this.turnIndex++;
    return this.normalizeTurn();
  }
  inBounds(x,y){return x>=0&&y>=0&&x<this.width&&y<this.height}
  canStop(unit,x,y){return this.inBounds(x,y)&&!this.walls.has(this.key(x,y))&&!this.unitAt(x,y)}
  reachable(unit){
    if(unit.moved||!unit.alive)return new Map();
    const start=this.key(unit.x,unit.y),seen=new Map([[start,0]]),q=[[unit.x,unit.y]];
    while(q.length){const [x,y]=q.shift(),cost=seen.get(this.key(x,y));if(cost>=unit.stats.MOVE)continue;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=this.key(nx,ny);if(!this.inBounds(nx,ny)||this.walls.has(k)||seen.has(k))continue;
        const occ=this.unitAt(nx,ny);if(occ&&occ.team!==unit.team)continue;
        seen.set(k,cost+1);q.push([nx,ny]);
      }
    }
    seen.delete(start);
    for(const k of [...seen.keys()]){const [x,y]=k.split(',').map(Number);if(this.unitAt(x,y))seen.delete(k)}
    return seen;
  }
  move(unit,x,y){
    const r=this.reachable(unit);if(!r.has(this.key(x,y)))return false;
    const from=`${unit.x+1},${unit.y+1}`;unit.x=x;unit.y=y;unit.moved=true;this.addLog(`${unit.label} 移動 ${from} → ${x+1},${y+1}。`);return true;
  }
  hitChance(attacker,target){return Math.max(80,Math.min(100,attacker.stats.HIT-target.stats.EVA/2))}
  surroundingAllies(attacker,target){let n=0;for(const u of this.living(attacker.team)){if(u.id===attacker.id)continue;if(Math.max(Math.abs(u.x-target.x),Math.abs(u.y-target.y))===1)n++}return n}
  critChance(attacker,target){return 5+5*this.surroundingAllies(attacker,target)}
  normalDamage(attacker,target){const magic=attacker.attack.type==='magic';const raw=(magic?attacker.stats.MATK:attacker.stats.ATK)-(magic?target.stats.MDEF:target.stats.DEF);return Math.max(1,raw)}
  validTargets(attacker){
    if(attacker.acted||!attacker.alive)return [];
    return this.living(attacker.team==='player'?'enemy':'player').filter(t=>this.distance(attacker,t)<=attacker.attack.range&&this.hasLOS(attacker,t));
  }
  hasLOS(a,b){
    if(a.attack.range<=1)return true;
    if(a.x!==b.x&&a.y!==b.y)return true;
    const dx=Math.sign(b.x-a.x),dy=Math.sign(b.y-a.y);let x=a.x+dx,y=a.y+dy;
    while(x!==b.x||y!==b.y){if(this.walls.has(this.key(x,y)))return false;x+=dx;y+=dy}
    return true;
  }
  attack(attacker,target,roll=Math.random){
    if(attacker.acted||!this.validTargets(attacker).some(t=>t.id===target.id))return {ok:false};
    attacker.acted=true;
    const hit=this.hitChance(attacker,target),hitRoll=roll()*100;
    if(hitRoll>=hit){this.addLog(`${attacker.label} → ${target.label}：MISS（${Math.round(hit)}%）`);return {ok:true,hit:false}}
    let damage=this.normalDamage(attacker,target);const crit=this.critChance(attacker,target),critRoll=roll()*100,isCrit=critRoll<crit;if(isCrit)damage=Math.round(damage*1.5);
    target.currentHP=Math.max(0,target.currentHP-damage);
    this.addLog(`${attacker.label} → ${target.label}：${damage} 傷害${isCrit?'／CRIT':''}（命中 ${Math.round(hit)}%・暴擊 ${crit}%）`);
    if(target.currentHP<=0){target.alive=false;this.addLog(`${target.label} 戰鬥不能。`)}
    this.checkEnd();return {ok:true,hit:true,crit:isCrit,damage};
  }
  checkEnd(){
    if(this.living('player').length===0){this.finished=true;this.result='party-wipe';this.addLog('四名主角全滅。序章重生條件成立。');return}
    if(this.living('enemy').length===0){
      if(this.scenario.forcePartyWipe){this.finished=true;this.result='story-wipe';this.units.filter(u=>u.team==='player').forEach(u=>{u.alive=false;u.currentHP=0});this.addLog('遺跡力量失控：即使突破守衛，四名主角仍被吞沒。序章重生條件成立。')}
      else{this.finished=true;this.result='victory';this.addLog('戰鬥勝利。')}
    }
  }
  addLog(text){this.log.push({round:this.round,text});if(this.log.length>150)this.log.shift()}
  aiTurn(unit){
    if(!unit||unit.team!=='enemy'||this.finished)return;
    const chooseTarget=()=>this.validTargets(unit).sort((a,b)=>{
      const da=this.normalDamage(unit,a),db=this.normalDamage(unit,b);const ka=da>=a.currentHP,kb=db>=b.currentHP;
      return Number(kb)-Number(ka)||db-da||a.currentHP-b.currentHP||this.distance(unit,a)-this.distance(unit,b)||a.spawnOrder-b.spawnOrder;
    })[0];
    let target=chooseTarget();
    if(!target&&!unit.moved){
      const original={x:unit.x,y:unit.y};let best=null;
      for(const k of this.reachable(unit).keys()){
        const [x,y]=k.split(',').map(Number);unit.x=x;unit.y=y;const t=chooseTarget();
        if(t){const score=[this.normalDamage(unit,t)>=t.currentHP?1:0,this.normalDamage(unit,t),-t.currentHP];if(!best||score.join(',')>best.score.join(','))best={x,y,t,score}}
      }
      unit.x=original.x;unit.y=original.y;
      if(best){this.move(unit,best.x,best.y);target=chooseTarget()}
      else{
        const players=this.living('player');const nearest=players.sort((a,b)=>this.distance(unit,a)-this.distance(unit,b)||a.spawnOrder-b.spawnOrder)[0];
        let pick=null;for(const k of this.reachable(unit).keys()){const [x,y]=k.split(',').map(Number),d=Math.abs(x-nearest.x)+Math.abs(y-nearest.y);if(!pick||d<pick.d)pick={x,y,d}}
        if(pick)this.move(unit,pick.x,pick.y);
      }
    }
    target=chooseTarget();if(target)this.attack(unit,target);
    this.endTurn();
  }
}