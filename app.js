const documentIndex = [
  { group: "總覽", id: "game-concept", label: "遊戲概念", path: "overview/game-concept.md", demo: "概念總覽" },
  { group: "總覽", id: "gameplay-loop", label: "遊戲循環", path: "overview/gameplay-loop.md", demo: "遠征流程" },
  { group: "系統", id: "character-class", label: "角色、職業與熟練度", path: "systems/character-class-mastery.md", demo: "職業路徑" },
  { group: "系統", id: "combat-battlefield", label: "戰鬥與戰場", path: "systems/combat-battlefield.md", demo: "戰場格線" },
  { group: "系統", id: "timeline-status", label: "時間軸、技能與狀態", path: "systems/timeline-status.md", demo: "時間軸模擬" },
  { group: "系統", id: "relic-reliquary", label: "遺產與收藏館", path: "systems/relic-reliquary.md", demo: "遺產修復" },
  { group: "系統", id: "relationship-enemy-report", label: "關係、敵人與遠征報告", path: "systems/relationship-enemy-report.md", demo: "關係與 AI" },
  { group: "世界", id: "expedition-world", label: "遠征與世界", path: "world/expedition-and-world.md", demo: "遠征地圖" },
  { group: "開發", id: "prototype-roadmap", label: "原型實作路線圖", path: "development/prototype-roadmap.md", demo: "原型清單" }
];

const state = { relicStage: 0, timelineMode: 0, selectedMapNode: 0, selectedPair: 0 };

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function markdownToHtml(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  let html = "", inCode = false, listOpen = false;
  const closeList = () => { if (listOpen) { html += "</ul>"; listOpen = false; } };
  for (const line of lines) {
    if (line.startsWith("```")) { closeList(); html += inCode ? "</code></pre>" : "<pre><code>"; inCode = !inCode; continue; }
    if (inCode) { html += `${escapeHtml(line)}\n`; continue; }
    if (/^### /.test(line)) { closeList(); html += `<h3>${escapeHtml(line.slice(4))}</h3>`; continue; }
    if (/^## /.test(line)) { closeList(); html += `<h2>${escapeHtml(line.slice(3))}</h2>`; continue; }
    if (/^# /.test(line)) { closeList(); html += `<h1>${escapeHtml(line.slice(2))}</h1>`; continue; }
    if (/^- /.test(line)) { if (!listOpen) { html += "<ul>"; listOpen = true; } html += `<li>${escapeHtml(line.slice(2))}</li>`; continue; }
    closeList();
    if (line.trim()) html += `<p>${escapeHtml(line).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}</p>`;
  }
  closeList();
  return html;
}

function renderNavigation() {
  const groups = [...new Set(documentIndex.map(item => item.group))];
  document.querySelector("#navigation").innerHTML = groups.map(group => {
    const items = documentIndex.filter(item => item.group === group);
    return `<section class="nav-group"><h2>${group}</h2>${items.map(item => `<button class="nav-link" data-id="${item.id}">${item.label}</button>`).join("")}</section>`;
  }).join("");
  document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click", () => showPage(button.dataset.id)));
}

function demoHtml(type) {
  if (type === "職業路徑") return `<div class="demo-card"><p class="demo-kicker">互動示意</p><div class="tree"><span>村民</span><i>↓</i><span>戰士</span><i>↓</i><span class="accent-node">守護者</span><i>↓</i><span>隱藏職業</span></div><p>職業分支、啟發條件與實際資料會在此頁持續擴充。</p></div>`;
  if (type === "戰場格線") return `<div class="demo-card"><p class="demo-kicker">戰場格線示意</p><div class="grid-demo">${Array.from({ length: 25 }, (_, index) => `<span class="${[7, 12, 17].includes(index) ? "terrain" : ""}">${index === 12 ? "我" : index === 7 ? "敵" : ""}</span>`).join("")}</div><p>深色格為特殊地形：移動範圍與戰鬥結果會受影響，精確數值保持隱藏。</p></div>`;
  if (type === "時間軸模擬") return `<div class="demo-card"><p class="demo-kicker">時間軸示意</p><div id="timeline-demo" class="timeline-demo"></div><button class="demo-button" onclick="advanceTimeline()">推進一次行動</button><p>敏捷數值隱藏；玩家能看見近期行動順序。</p></div>`;
  if (type === "遺產修復") return `<div class="demo-card"><p class="demo-kicker">遺產修復示意</p><div id="relic-demo" class="relic-demo"></div><button class="demo-button" onclick="advanceRelic()">查看下一修復階段</button></div>`;
  if (type === "關係與 AI") return `<div class="demo-card"><p class="demo-kicker">關係與敵人判斷示意</p><div id="pair-demo" class="pair-demo"></div><button class="demo-button" onclick="advancePair()">切換角色組合</button><p>關係值不公開；敵人會優先評估脆弱、孤立與高戰術價值的目標。</p></div>`;
  if (type === "遠征地圖") return `<div class="demo-card"><p class="demo-kicker">單向遠征地圖示意</p><div id="map-demo" class="map-demo"></div><button class="demo-button" onclick="advanceMap()">前往下一節點</button><p>走過的節點會鎖定，無法回頭重複取得報酬。</p></div>`;
  if (type === "遠征流程") return `<div class="demo-card"><p class="demo-kicker">一次遠征</p><div class="flow-demo">選擇遺產 <b>→</b> 遠征 <b>→</b> 成長 <b>→</b> 報告</div><p>成功與失敗都會留下歷史，並回到下一次遠征。</p></div>`;
  if (type === "原型清單") return `<div class="demo-card"><p class="demo-kicker">原型實作狀態</p><div class="prototype-list"><span>職業樹檢視器</span><span>時間軸模擬器</span><span>戰場格線編輯器</span><span>遺產收藏館</span><span>遠征地圖編輯器</span></div></div>`;
  return `<div class="demo-card"><p class="demo-kicker">企劃資料庫</p><p>此頁將規則、設計原則與未來可實作的原型集中在一起。</p></div>`;
}

async function showPage(id) {
  const item = documentIndex.find(entry => entry.id === id) || documentIndex[0];
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.id === item.id));
  const content = document.querySelector("#content");
  content.innerHTML = `<p class="eyebrow">遊戲設定與原型</p><p class="loading">正在載入「${item.label}」…</p>`;
  history.replaceState(null, "", `#${item.id}`);
  try {
    const response = await fetch(`docs/${item.path}`);
    if (!response.ok) throw new Error("找不到企劃文件");
    const markdown = await response.text();
    content.innerHTML = `<article class="document-content">${markdownToHtml(markdown)}</article><section class="inline-demo"><div><p class="eyebrow">本頁原型</p><h2>${item.demo}</h2></div>${demoHtml(item.demo)}</section>`;
    renderDynamicDemos();
  } catch (error) {
    content.innerHTML = `<h1>${item.label}</h1><p class="lead">此頁資料無法載入。請以網站服務方式開啟專案，讓瀏覽器可以讀取企劃文件。</p>`;
  }
  content.focus({ preventScroll: true });
}

function renderDynamicDemos() {
  const timeline = document.querySelector("#timeline-demo");
  if (timeline) timeline.innerHTML = ["守護者", "敵人", "法師", "敵人", "遊俠"].map((unit, index) => `<span class="${index === state.timelineMode ? "now" : ""}">${unit}</span>`).join("<b>→</b>");
  const stages = [["發現", "約三分之一力量", "遺產剛被找到，可攜入下一次遠征。"], ["修復", "約三分之二力量", "完成第一次完整遠征後恢復。"], ["完全喚醒", "完整力量", "完成第二次完整遠征後解鎖。"]];
  const relic = document.querySelector("#relic-demo");
  if (relic) { const [title, power, text] = stages[state.relicStage]; relic.innerHTML = `<strong>${title}</strong><span>${power}</span><p>${text}</p>`; }
  const pairs = [["角色甲 ↔ 角色乙", "友好", "共同攻擊與支援行為讓關係逐步累積。"], ["角色甲 ↔ 角色丙", "親密", "可成為隱藏職業啟發的條件之一。"], ["敵方刺客", "鎖定孤立目標", "目標評估優先考慮脆弱度與戰術價值。"]];
  const pair = document.querySelector("#pair-demo");
  if (pair) { const [name, status, text] = pairs[state.selectedPair]; pair.innerHTML = `<strong>${name}</strong><span>${status}</span><p>${text}</p>`; }
  const map = document.querySelector("#map-demo");
  if (map) map.innerHTML = ["起點", "戰鬥", "精英戰", "區域頭目", "下一區域"].map((node, index) => `<span class="${index < state.selectedMapNode ? "visited" : index === state.selectedMapNode ? "current" : ""}">${node}</span>`).join("<b>→</b>");
}

window.advanceTimeline = () => { state.timelineMode = (state.timelineMode + 1) % 5; renderDynamicDemos(); };
window.advanceRelic = () => { state.relicStage = (state.relicStage + 1) % 3; renderDynamicDemos(); };
window.advancePair = () => { state.selectedPair = (state.selectedPair + 1) % 3; renderDynamicDemos(); };
window.advanceMap = () => { state.selectedMapNode = Math.min(state.selectedMapNode + 1, 4); renderDynamicDemos(); };

renderNavigation();
showPage(location.hash.slice(1) || "game-concept");
