const sections = [
  { group: "開始", items: [
    { id: "overview", label: "總覽", title: "遺產收集者", eyebrow: "GAME DESIGN DATABASE", lead: "一個以隊伍成長、遺物修復與不可回頭遠征為核心的策略角色扮演遊戲企劃資料庫。這裡先保存每項設計決策，日後再讓它們逐一成為可互動的原型。", cards: [
      ["目前階段", "Phase 0：建立企劃資料與網站框架。"],
      ["核心旅程", "穿越四個 Region，抵達最終遺產之源。"],
      ["完成目標", "完成兩次完整遠征，讓遺產回到 100%。"]
    ], note: "這不是一般的介紹網站，而是遊戲設計百科、開發筆記與未來 Prototype Lab 的共同入口。" },
    { id: "game-loop", label: "遊戲循環", title: "核心遊戲循環", eyebrow: "CORE CONCEPT", lead: "組成四人隊伍，踏上一次無法回頭的遠征；在節點選擇、戰鬥與事件中累積力量，修復遺產並帶著新的可能性開始下一次旅程。", cards: [["1. 組隊", "選擇角色、職業與遺物。"], ["2. 遠征", "向前選擇節點，已走過的路徑會封鎖。"], ["3. 成長", "戰鬥與事件帶來 Mastery、關係與遺產進度。"], ["4. 修復", "擊敗最終 Boss，完成一次遺產修復。"]] }
  ]},
  { group: "系統", items: [
    { id: "characters", label: "角色系統", title: "角色系統", eyebrow: "SYSTEMS", lead: "定義角色的基本資料、能力、職業成長與隊伍定位。所有角色從相同的起點出發，但會在旅途中走向不同的遺產。", cards: [["資料範本", "名稱、背景、能力值、Mastery、職業與關係。"], ["狀態", "設計草案：待補完角色資料結構。"]], status: "Designing" },
    { id: "classes", label: "職業系統", title: "職業成長系統", eyebrow: "SYSTEMS", lead: "角色由 Villager 開始，依 Mastery 與條件轉職；Tier 3 則是值得探索的隱藏職業。", cards: [["Tier 0", "Villager：所有角色的起點。"], ["Tier 1–2", "可見的職業分支與隊伍定位。"], ["Tier 3", "隱藏職業：由關係、遺物或旅程條件解鎖。"]], status: "Designing" },
    { id: "relics", label: "遺物系統", title: "遺物系統", eyebrow: "SYSTEMS", lead: "遺物是隊伍的歷史，也是本作主線的修復對象。每一次完整遠征都會推進它的回復。", cards: [["修復進度", "完成第一次旅程後推進至 66%；第二次達成 100%。"], ["未來延伸", "完整覺醒的遺物，可解鎖特殊最終 Boss 或真結局。"]], status: "Designing" },
    { id: "combat", label: "戰鬥系統", title: "戰鬥系統", eyebrow: "SYSTEMS", lead: "以隊伍決策為主的策略戰鬥系統。此頁先收納規則與公式，之後會加入獨立的戰鬥原型。", cards: [["設計焦點", "位置、技能、敵人意圖與隊伍協作。"], ["Prototype", "Battle Demo — 規劃中。"]], status: "Planned" },
    { id: "timeline", label: "時間軸系統", title: "時間軸系統", eyebrow: "SYSTEMS", lead: "以敏捷、技能修正與狀態效果決定行動順序，讓玩家能預測、打斷或重排局勢。", cards: [["Prototype", "Timeline Simulator — 規劃中。"], ["關聯系統", "角色能力、戰鬥技能、敵人 AI。"]], status: "Planned" },
    { id: "expedition", label: "遠征系統", title: "遠征系統", eyebrow: "SYSTEMS", lead: "遠征採單向前進的節點地圖。每個決定都有代價；玩家選定下一個節點後，不能再回到已走過的道路。", cards: [["旅程結構", "Region 1 → 2 → 3 → 4 → Final Region → Final Boss。"], ["MVP 最終目標", "固定地點、固定 Boss、固定修復目的。"], ["Prototype", "Map Demo — 規劃中。"]], note: "已完成的節點會鎖定，不能重複刷取 Mastery、遺產或事件。", status: "Design Complete" },
    { id: "reports", label: "報告系統", title: "遠征報告系統", eyebrow: "SYSTEMS", lead: "記錄每次旅程的選擇、事件、隊伍狀態與遺產修復，讓一次遠征成為可回顧的故事。", cards: [["狀態", "概念建立中。"], ["未來用途", "稱號、成就與隱藏路線條件。"]], status: "Planned" }
  ]},
  { group: "世界", items: [
    { id: "regions", label: "區域", title: "五大區域", eyebrow: "WORLD", lead: "每個 Region 不只是美術主題，而是敵人、地形、事件、遺產故事與 Boss 設計的共同語言。", cards: [["Region 1", "失落森林：初入未知之地的基礎教學區域。"], ["Region 2", "古代遺跡：開始接觸遺產的真相。"], ["Region 3", "墮落王國：高階職業敵人與 Elite Enemy。"], ["Region 4", "遺產核心：高風險事件與隱藏職業線索。"], ["Final Region", "失落之源：完成遺產修復的目的地。"]], status: "Designing" },
    { id: "events", label: "事件", title: "事件系統", eyebrow: "WORLD", lead: "遠征中的節點事件提供戰鬥以外的選擇，並用具體後果塑造角色與隊伍故事。", cards: [["狀態", "事件類型與資料範本待建立。"]], status: "Planned" }
  ]},
  { group: "原型實驗室", items: [
    { id: "prototypes", label: "Prototype Lab", title: "Prototype Lab", eyebrow: "PROTOTYPE LIBRARY", lead: "原型會各自獨立、可快速測試。先有清楚規則，再實作最小可驗證版本，而不是一次打造完整遊戲。", cards: [["戰鬥 Demo", "驗證格位、技能與敵人意圖。"], ["時間軸 Demo", "驗證行動順序的可讀性與操作感。"], ["職業樹 Demo", "探索職業分支與解鎖條件。"], ["地圖 Demo", "驗證單向節點選擇與 Region 節奏。"]], status: "Backlog" }
  ]}
];

const documents = [
  ["game-concept", "遊戲概念", "overview/game-concept.md", "定位、設計支柱與已定案限制。"],
  ["gameplay-loop", "遊戲循環", "overview/gameplay-loop.md", "單次遠征、跨 Run 與 Meta Progression。"],
  ["character-class", "角色、職業與 Mastery", "systems/character-class-mastery.md", "四人隊伍、職業金字塔與 Hidden Class。"],
  ["combat-battlefield", "戰鬥與戰場", "systems/combat-battlefield.md", "Grid、地形、資源與死亡。"],
  ["timeline-status", "時間軸、技能與狀態", "systems/timeline-status.md", "Hidden Agility 與技能定義的狀態規則。"],
  ["relic-reliquary", "遺產與收藏館", "systems/relic-reliquary.md", "單一欄位、修復流程與掉落規則。"],
  ["relationship-enemy-report", "關係、敵人與 Report", "systems/relationship-enemy-report.md", "六組關係、AI 框架與遠征歷史。"],
  ["expedition-world", "遠征與世界", "world/expedition-and-world.md", "單向地圖、五大區域與世界衝突。"],
  ["prototype-roadmap", "Prototype Lab 路線圖", "development/prototype-roadmap.md", "未來各個獨立 Demo 的驗證範圍。"]
];

function renderNavigation() {
  const groups = [...sections, { group: "企劃文件", items: documents.map(([id, label, path, description]) => ({ id, label, path, description, document: true })) }];
  document.querySelector("#navigation").innerHTML = groups.map(group => `
    <section class="nav-group"><h2>${group.group}</h2>${group.items.map(item =>
      `<button class="nav-link" data-id="${item.id}">${item.label}</button>`).join("")}</section>`).join("");
  document.querySelectorAll(".nav-link").forEach(button => button.addEventListener("click", () => show(button.dataset.id)));
}

function show(id) {
  const documentItem = documents.map(([id, label, path, description]) => ({ id, label, path, description, document: true })).find(item => item.id === id);
  const item = documentItem || sections.flatMap(group => group.items).find(item => item.id === id) || sections[0].items[0];
  if (item.document) {
    document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.id === item.id));
    document.querySelector("#content").innerHTML = `<div class="eyebrow">GAME DESIGN DOCUMENT</div><h1>${item.label}</h1><p class="lead">${item.description}</p><hr class="rule"><div class="note">此頁的內容以 Markdown 保存，作為日後討論與原型實作的單一資料來源。</div><p><a class="document-link" href="docs/${item.path}" target="_blank" rel="noreferrer">開啟完整企劃文件 →</a></p>`;
    history.replaceState(null, "", `#${item.id}`);
    document.querySelector("#content").focus({ preventScroll: true });
    return;
  }
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.id === item.id));
  document.querySelector("#content").innerHTML = `
    <div class="eyebrow">${item.eyebrow}</div><h1>${item.title}</h1><p class="lead">${item.lead}</p>
    ${item.status ? `<span class="status">${item.status}</span>` : ""}
    <hr class="rule"><h2 class="section-title">設計重點</h2>
    <div class="cards">${item.cards.map(([title, body]) => `<article class="card"><h3>${title}</h3><p>${body}</p></article>`).join("")}</div>
    ${item.note ? `<hr class="rule"><div class="note">${item.note}</div>` : ""}`;
  history.replaceState(null, "", `#${item.id}`);
  document.querySelector("#content").focus({ preventScroll: true });
}

renderNavigation();
show(location.hash.slice(1) || "overview");
