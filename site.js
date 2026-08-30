const root=document.documentElement;
const docPath=root.dataset.doc;

function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}

function inline(s){
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
}

function tableCells(line){
  return line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(cell=>cell.trim());
}

function isTableDivider(line){
  const cells=tableCells(line);
  return cells.length>0&&cells.every(cell=>/^:?-{3,}:?$/.test(cell));
}

function renderTable(lines,start){
  const header=tableCells(lines[start]);
  const divider=tableCells(lines[start+1]);
  const align=divider.map(cell=>cell.startsWith(':')&&cell.endsWith(':')?'center':cell.endsWith(':')?'right':cell.startsWith(':')?'left':null);
  let i=start+2;
  const rows=[];
  while(i<lines.length&&/^\s*\|/.test(lines[i])){rows.push(tableCells(lines[i]));i++}
  const head=`<thead><tr>${header.map((cell,index)=>`<th${align[index]?` style="text-align:${align[index]}"`:''}>${inline(cell)}</th>`).join('')}</tr></thead>`;
  const body=rows.length?`<tbody>${rows.map(row=>`<tr>${header.map((_,index)=>`<td${align[index]?` style="text-align:${align[index]}"`:''}>${inline(row[index]||'')}</td>`).join('')}</tr>`).join('')}</tbody>`:'';
  return {html:`<div class="table-scroll"><table>${head}${body}</table></div>`,next:i};
}

function md(src){
  let out='',inCode=false,code=[];
  const lines=src.replace(/\r/g,'').split('\n');
  for(let i=0;i<lines.length;i++){
    const raw=lines[i];
    if(raw.startsWith('```')){
      if(inCode){out+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;code=[];inCode=false}else inCode=true;
      continue;
    }
    if(inCode){code.push(raw);continue}
    if(!raw.trim())continue;
    if(/^\s*\|/.test(raw)&&i+1<lines.length&&isTableDivider(lines[i+1])){
      const table=renderTable(lines,i);out+=table.html;i=table.next-1;continue;
    }
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
  if(!box.querySelector('.status')&&!box.querySelector('.prototype-status')){
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
