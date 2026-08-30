# 戰鬥測試索引（Combat Test Index）

## 目的

Combat Demo 主要用來測試**兩軍實際交戰的體感、強度與平衡**，並逐 Region 校準一般敵人與 Boss 強度。

玩家角色的職業基礎數值、傷害、HIT / EVA、暴擊、Timeline 與 Battlefield 規則已先固定；因此戰鬥測試主要調整與觀察：

- 敵人 Tier。
- 敵人數量。
- 敵方兵種混編比例。
- 敵我初始站位。
- 敵人技能與 AI 行為。
- 玩家在固定職業強度下的實際承壓極限。
- 戰鬥節奏、威脅感、擊殺速度與資源消耗是否合理。

測試結果將反向用於決定各 Region 的一般遭遇與 Boss 強度配置。

## Combat Demo 測試邊界

Combat Demo **不再把地圖美術、地圖投影、UI 版面或一般視覺優化當成主要測試項目**。

- 地圖投影、地表渲染、障礙物視覺、角色超格與 Depth Sorting，統一移至「地圖渲染研究專區」。
- HUD 配置、字體、色彩、血條樣式、肖像尺寸等純 UI / Visual 調整，不在各階段 Combat Demo 中反覆重新設計。
- 只有當 UI / 地圖出現實際錯誤，或影響操作、目標判定、資訊閱讀與戰鬥結果時，才直接修正。

後續 Demo 的核心問題仍是：**這兩支隊伍打起來的感覺如何？**

## 測試命名與 Region 分類規則

從此 Combat Test 不再使用單純連續的 Demo 0～7 命名，而是直接依故事階段與 Region 分組。

### 序章

- 序章固定使用 `Demo 0`。
- 序章主要驗證劇情殺、首次 Party Wipe 與核心 Combat Runtime。
- 序章不套用每個 Region 的雙 Demo 規則。

### Region 一般敵人 Demo

每個 Region 固定保留 **2 個一般敵人強度測試**：

- `Demo R-1`
- `Demo R-2`

其中 `R` 為 Region 編號。

例如：

- Region 1：`Demo 1-1`、`Demo 1-2`
- Region 2：`Demo 2-1`、`Demo 2-2`
- Region 3：`Demo 3-1`、`Demo 3-2`
- Region 4：`Demo 4-1`、`Demo 4-2`

這兩個 Demo 都只用來校準該 Region 的一般敵人／小怪強度，不與其他 Region 混用。

### Region Boss 測試

每個 Region 固定保留兩個 Boss 測試：

- `Boss A`＝Mini Boss
- `Boss B`＝Region Boss / Region Final Boss

若同一個 Boss 需要不同玩家 Tier 或其他條件做對照測試，使用子測試編號：

- `Boss A-1`
- `Boss B-1`

A-1 / B-1 仍屬於同一個 Mini Boss / Region Boss，不代表第三或第四個 Boss。

### 檔名規則

目前既有 Combat Demo 可執行檔不因這次顯示名稱調整而強制重新命名，避免只為命名造成連結與 Runtime 風險。

- 例如現有 `demo-1.html` 的顯示名稱改為 `Demo 1-1`。
- 後續新建測試時，直接採 Region-based 命名結構。

## 共用 Combat Runtime 原則

所有戰鬥測試與未來正式遊戲應盡量共用同一套 Combat Runtime，不為個別測試複製戰鬥邏輯或 HUD 控制程式。

目前正式分層：

- `development/combat-tests/combat-model.js`：戰鬥規則與狀態 Model。
- `development/combat-tests/combat-app.js`：共用 Combat UI / Controller。
- `development/combat-tests/combat-data.js`：JSON 載入與 cache-bust helper。
- `development/combat-tests/combat-party.js`：Party Composition。
- `development/combat-tests/combat-class-runtime.js`：玩家職業 Runtime。
- `development/combat-tests/combat-enemy-runtime.js`：敵方模板 Runtime。
- `development/combat-tests/combat-ui.css`：共用戰鬥 UI 樣式入口。
- `development/combat-tests/scenarios/*.json`：各場測試 Scenario Configuration。

核心公式、HUD、狀態、戰鬥互動與 Combat Log 修正應優先改共用 Runtime，使所有測試同步受益。

## 測試狀態規則

HTML 測試索引沿用主頁狀態表示：

- **未開始**：一般文字，不提供超連結。
- **實作中**：紅色，且開始提供對應戰鬥測試頁連結。
- **完成**：綠色，保留測試頁連結供後續回看與 Regression Test。

---

# 序章｜Prologue

## Demo 0｜序章劇情殺｜完成

- 狀態：已完成並通過實機操作驗證。
- 玩家：4 名固定主角，職業皆為 Tier 0「村民」。
- 敵人：4 名 Tier 1 一般敵人：獵兵、劍兵、術士、重衛。
- 地圖：8×8。
- 目的：讓玩家實際操作後遭遇必敗的劇情殺，第一次觸發 Party Wipe、重生與下一個 Run 的核心循環。
- 已驗證：Timeline、移動、普通攻擊、HIT / EVA、暴擊、敵方 AI、死亡、Party Wipe、Combat Log、UNIT HUD、技能入口與雙向行動順序。

---

# Region 1｜小怪與 Boss 強度基準

Region 1 固定使用 **Demo 1-1 / Demo 1-2** 作為一般敵人強度測試；Boss 固定使用 **Boss A / Boss B**。

## 一般敵人 Demo

### Demo 1-1｜Tier 1 極限測試：4 vs 12｜完成

> 舊顯示名稱：Demo 1

- 狀態：已完成實機測試。
- 玩家：4 名 Tier 1 主角。
- 敵人：12 名 Tier 1 一般敵人；獵兵、劍兵、術士、重衛各 3 名。
- 地圖：8×8；8 個障礙物。
- 測試結果：4 名 Tier 1 主角對 12 名 Tier 1 敵人仍可相對輕鬆獲勝。
- Region 1 結論：繼續單純增加 Tier 1 敵人數量的測試價值有限，Region 1 後段壓力應改由更高 Tier 或功能型敵人混編建立。

### Demo 1-2｜Tier 1 玩家 vs Tier 1 + Tier 2 混編

> 舊顯示名稱：Demo 2

- 狀態：未開始。
- 玩家：4 名 Tier 1。
- 敵人：Tier 1 + Tier 2。
- 目的：測試 Region 1 後段／高壓一般遭遇的合理上限，以及少量 Tier 2 敵人帶來的威脅增幅。
- 前置：先建立 Tier 2 一般敵人的正式能力值、兵種與技能資料。

## Boss Test

### Boss A｜Region 1 Mini Boss：遺跡追獵者｜完成

- 玩家：4 名 Tier 1 主角。
- 敵方：Mini Boss「遺跡追獵者」+ 2 名 Tier 1 獵兵。
- 場地：8×8 固定障礙配置。
- 結果：Tier 1 隊伍可以通過；需要正常操作，但不構成過高門檻。

### Boss A-1｜Tier 2 Benchmark vs 遺跡追獵者｜完成

- 玩家：每次載入隨機抽取 4 個不同 Tier 2 職業。
- 結果：Tier 2 隊伍可輕鬆通過 Region 1 Mini Boss。

### Boss B｜Region 1 Boss：遺跡守門者｜完成

- 玩家：4 名 Tier 1 主角。
- 敵方：Region 1 Boss「遺跡守門者」+ 2 名 Tier 1「遺跡侍者」。
- 場地：8×8；中央 4 格 T 字障礙配置。
- 結果：Tier 1 隊伍實戰上幾乎不可能通過。
- 意義：Region 1 Boss 是未轉職 Tier 1 隊伍的明確強度牆。

### Boss B-1｜Tier 2 Benchmark vs 遺跡守門者｜完成

- 玩家：每次載入隨機抽取 4 個不同 Tier 2 職業。
- 敵方與場地：與 Boss B 相同。
- 結果：Tier 2 隊伍可以通過，但仍需處理敵方治療、Boss 技能、站位與 Charge / 行動資源，保留一定難度與失誤成本。

## Region 1 已驗證強度基準

- **Tier 1 → Mini Boss：可以通過。**
- **Tier 1 → Region Boss：幾乎不可能通過。**
- **Tier 2 → Mini Boss：輕鬆通過。**
- **Tier 2 → Region Boss：可以通過，但仍有適度難度。**

此結果作為 Region 1 目前的正式戰鬥強度基準；後續若調整 Boss、Tier 1 / Tier 2 能力值或核心公式，應重新做 Regression Test。

---

# Region 2

Region 2 固定保留 **Demo 2-1 / Demo 2-2** 與 **Boss A / Boss B**。

## 一般敵人 Demo

### Demo 2-1｜Tier 2 玩家 vs Tier 1 + Tier 2 混編

> 舊顯示名稱：Demo 3

- 狀態：未開始。
- 玩家：4 名 Tier 2。
- 敵人：Tier 1 + Tier 2。
- 目的：驗證玩家進入 Tier 2 後的強度提升，以及低 Tier 敵人的混編價值。

### Demo 2-2｜Tier 2 玩家 vs Tier 2 混編

> 舊顯示名稱：Demo 4

- 狀態：未開始。
- 玩家：4 名 Tier 2。
- 敵人：Tier 2 混編。
- 目的：建立 Region 2 的標準一般遭遇強度。

## Boss Test

### Boss A｜Region 2 Mini Boss

- 狀態：未開始。
- 能力值、技能、場地與敵方配置待設計。

### Boss B｜Region 2 Boss

- 狀態：未開始。
- 能力值、技能、場地與敵方配置待設計。

---

# Region 3

Region 3 固定保留 **Demo 3-1 / Demo 3-2** 與 **Boss A / Boss B**。

## 一般敵人 Demo

### Demo 3-1｜Tier 2 玩家 vs Tier 2 + Tier 3 混編

> 舊顯示名稱：Demo 5

- 狀態：未開始。
- 玩家：4 名 Tier 2。
- 敵人：Tier 2 + Tier 3。
- 目的：測試中後期高壓遭遇與玩家尚未進入 Tier 3 前的承壓極限。

### Demo 3-2｜Tier 3 玩家 vs Tier 2 + Tier 3 混編

> 舊顯示名稱：Demo 6

- 狀態：未開始。
- 玩家：4 名 Tier 3。
- 敵人：Tier 2 + Tier 3。
- 目的：驗證玩家進入 Tier 3 後，Region 3 一般敵方混編仍保有合理壓力。

## Boss Test

### Boss A｜Region 3 Mini Boss

- 狀態：未開始。

### Boss B｜Region 3 Boss

- 狀態：未開始。

---

# Region 4

Region 4 固定保留 **Demo 4-1 / Demo 4-2** 與 **Boss A / Boss B**。

## 一般敵人 Demo

### Demo 4-1｜Tier 3 玩家 vs Tier 3 混編

> 舊顯示名稱：Demo 7

- 狀態：未開始。
- 玩家：4 名 Tier 3。
- 敵人：Tier 3 混編。
- 目的：測試 Region 4 一般敵人的高壓與極限遭遇。

### Demo 4-2｜Region 4 第二階段小怪測試

- 狀態：未開始。
- 此位置固定保留。
- 玩家 Tier、敵方組成與具體測試目的，待 Region 4 設計時正式確認，不先猜測。

## Boss Test

### Boss A｜Region 4 Mini Boss

- 狀態：未開始。

### Boss B｜Region 4 Boss

- 狀態：未開始。

---

## Boss 排除原則

一般敵人 Demo 與 Boss 測試分開校準。

以下不套用一般敵人模板：

- Mini Boss。
- 各 Region Boss。
- Final Boss。

Boss 的數值、技能、行動模式、場地機制與特殊規則皆採獨立定義。

## 測試紀錄方向

每個 Combat Test 後續應能保留或顯示至少以下資訊：

- 戰鬥結果。
- 總輪數。
- 玩家死亡人數。
- 玩家剩餘 HP。
- Charge 使用情況。
- 治療次數／治療量。
- 各單位造成與承受傷害。
- Hit / Miss。
- Crit 次數與包圍 Crit 情況。
- 敵人 Tier／數量／兵種配置。
- 關鍵 Combat Log。

上述資料用來逐步建立各 Region Encounter 的實際強度基準，而不是先主觀指定固定 Threat 倍率。