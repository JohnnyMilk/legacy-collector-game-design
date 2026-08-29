export async function loadCombatJson(url,{cacheBust=true}={}){
  const suffix=cacheBust?`${url.includes('?')?'&':'?'}v=${Date.now()}`:'';
  const response=await fetch(`${url}${suffix}`,{cache:cacheBust?'no-store':'default'});
  if(!response.ok)throw new Error(`Failed to load ${url}: ${response.status}`);
  return response.json();
}

export function requireEntry(entries,predicate,message='Required combat data entry not found.'){
  const entry=entries.find(predicate);
  if(!entry)throw new Error(message);
  return entry;
}
