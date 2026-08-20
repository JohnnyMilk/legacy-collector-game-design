const root=document.documentElement;
const docPath=root.dataset.doc;

function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}

function inline(s){
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
}

function md(src){
  let out='',inCode=false,code=[];
  const lines=src.replace(/\r/g,'').split('\n');
  for(const raw of lines){
    if(raw.startsWith('```')){
      if(inCode){out+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;code=[];inCode=false}else inCode=true;
      continue;
    }
    if(inCode){code.push(raw);continue}
    if(!raw.trim())continue;
    if(/^### /.test(raw))out+=`<h3>${inline(raw.slice(4))}</h3>`;
    else if(/^## /.test(raw))out+=`<h2>${inline(raw.slice(3))}</h2>`;
    else if(/^# /.test(raw))out+=`<h1>${inline(raw.slice(2))}</h1>`;
    else if(/^> /.test(raw))out+=`<blockquote>${inline(raw.slice(2))}</blockquote>`;
    else if(/^[-*] /.test(raw))out+=`<ul><li>${inline(raw.slice(2))}</li></ul>`;
    else if(/^\d+\. /.test(raw))out+=`<ol><li>${inline(raw.replace(/^\d+\. /,''))}</li></ol>`;
    else if(/^---+$/.test(raw.trim()))out+='<hr>';
    else out+=`<p>${inline(raw)}</p>`;
  }
  return out.replace(/<\/ul><ul>/g,'').replace(/<\/ol><ol>/g,'');
}

function normalizePrototype(){
  const box=document.querySelector('.prototype');
  if(!box)return;
  const strong=box.querySelector('strong');
  if(strong)strong.textContent='Prototype / Demo';
  if(!box.querySelector('.status')){
    const status=document.createElement('span');
    status.className='status';
    status.textContent='尚未實作';
    box.appendChild(status);
  }
}

function addFooter(){
  const shell=document.querySelector('.shell');
  if(!shell||shell.querySelector('.page-footer')||!docPath)return;
  const footer=document.createElement('footer');
  footer.className='page-footer';
  footer.innerHTML='<span>Legacy Collector · Game Design Document</span><a href="../index.html">← 返回企劃文件索引</a>';
  shell.appendChild(footer);
}

async function load(){
  normalizePrototype();
  addFooter();
  if(!docPath)return;
  const target=document.querySelector('[data-doc-content]');
  if(!target)return;
  try{
    const r=await fetch(docPath);
    if(!r.ok)throw new Error(r.status);
    const text=await r.text();
    target.innerHTML=md(text);
  }catch(e){
    target.innerHTML='<h1>文件載入失敗</h1><p>請確認此頁面與 Markdown 文件的相對路徑。</p>';
  }
}

load();
