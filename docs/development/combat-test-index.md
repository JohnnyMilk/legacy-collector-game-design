# 戰鬥測試索引（Combat Test Index）

## 目的

Combat Demo 不只驗證程式是否能戰鬥，也用來逐階段校準各 Region 的敵方強度。

玩家角色的職業基礎數值、傷害、HIT / EVA、暴擊、Timeline 與 Battlefield 規則已先固定；因此戰鬥測試主要調整與觀察：

- 敵人 Tier。
- 敵人數量。
- 敵方兵種混編比例。
- 敵我初始站位。
- 敵人技能與 AI 行為。
- 玩家在固定職業強度下的實際承壓極限。

測試結果將反向用於決定 Region 1～Final Region 的一般遭遇強度配置。

## 單位命名原則

- 「村民」是職業名稱，不是角色單位名稱。
- 序章四名玩家單位仍使用四名主角的固定姓名：蒼岳、朧月、阿斯特蕾雅、賽洛恩；其目前職業皆為「村民」。
- 一般敵方單位目前不具名，因此敵方直接以職業名稱作為單位顯示名稱，例如劍兵、獵兵、術士、重衛。

## 共用 Combat Runtime 原則

所有戰鬥測試與未來正式遊戲應盡量共用同一套 Combat Runtime，不為個別測試複製戰鬥邏輯或 HUD 控制程式。

目前正式分層：

- `development/combat-tests/combat-model.js`：戰鬥規則與狀態 Model。負責移動、攻擊、HIT / EVA、暴擊、Timeline、死亡、AI 與勝敗判定。
- `development/combat-tests/combat-app.js`：共用 Combat UI / Controller。負責棋盤 Render、HUD、Timeline、UNIT、Progress、Combat Log、Action Bar、主動技能 HUD、肖像載入與文字 fallback，以及玩家輸入事件。
- `development/combat-tests/combat-data.js`：共用 Combat 資料載入 helper，統一處理 JSON 讀取、cache-bust 與必要資料檢查。
- `development/combat-tests/combat-ui.css`：共用戰鬥畫面的 CSS 入口；再組合 Battlefield、Portrait、Tablet Layout、Skill HUD 等樣式模組。
- `development/combat-tests/scenarios/*.json`：每一場測試自己的 Scenario Configuration。
- `development/combat-tests/demo-N.js`：只負責該 Demo 的資料組裝、測試專屬設定與必要的特殊結果文案。
- `development/combat-tests/demo-N.html`：只保留最小啟動頁，不複製整套 Combat HUD HTML。

因此新增 Demo 時，不應複製 Demo 0 的 UI / Event 程式。新的測試原則上只需：

1. 新增 Scenario JSON。
2. 建立很薄的 `demo-N.js`，用 `combat-data.js` 載入正式資料並建立該場 Scenario。
3. 建立最小 HTML，載入 `combat-ui.css` 與該 Demo 啟動檔。
4. 只有真正屬於該場測試的特殊規則，才留在 Demo-specific config。

各測試頁只提供該場戰鬥的 **Scenario Configuration**，例如：

- 玩家職業／Tier。
- 敵人種類／Tier／數量。
- 9×9 地圖配置。
- 初始位置。
- 勝敗條件。
- 特殊劇情旗標。

共用 Runtime 應統一讀取既有正式資料與規則，例如：

- `data/class-stats.json`
- `data/battlefield-rules.json`
- 職業／技能正式資料
- Damage System
- Timeline System
- Action System

因此任何核心公式、UI 操作規則或共用 HUD 修正，只應改共用 Model / App / CSS 或正式資料來源，所有 Combat Demo 與未來正式戰鬥畫面應同步得到相同結果。

Demo 0 的玩家「村民」能力值直接讀取 `data/class-stats.json`，不在場景檔重複定義。敵方 Tier 1 數值目前仍屬 Demo 0 測試用 Scenario 數值，之後需透過階段性測試建立正式 Enemy Tier Framework。

## 單位肖像資產規則

戰場單位顯示採「圖片優先、文字 fallback」。

- 玩家四名主角使用固定角色肖像，不隨職業改變：`assets/units/players/<character-id>.png`。
- 一般敵人依職業使用肖像：`assets/units/enemies/<className>.png`。
- 圖片不存在或載入失敗時，自動顯示單位名稱第一個字。
- 圖片與 fallback 共用同一個正方形 Portrait Slot，不得改變棋盤格尺寸。
- 戰場只顯示 Portrait Slot + HP Bar；完整姓名、職業與狀態由 UNIT HUD 顯示。

## 測試狀態規則

HTML 測試索引沿用主頁狀態表示：

- **未開始**：一般文字，不提供超連結。
- **實作中**：紅色，且開始提供對應戰鬥測試頁連結。
- **完成**：綠色，保留測試頁連結供後續回看與檢討。

未開始的測試不可先建立假的可點連結。

## 階段性戰鬥測試

### Demo 0｜序章劇情殺｜完成

- 狀態：已完成並通過實機操作驗證。
- 玩家：4 名固定主角，職業皆為 Tier 0「村民」。
- 敵人：4 名 Tier 1 敵人，目前測試兵種為獵兵、劍兵、術士、重衛。
- 目的：讓玩家實際操作後遭遇必敗的劇情殺，第一次觸發 Party Wipe、重生與下一個 Run 的核心循環。
- 設計方向：主要應由數值與配置形成壓倒性劣勢；若玩家在測試中極端情況仍擊倒全部敵人，序章 `forcePartyWipe` 劇情旗標仍會讓遺跡失控並導向 Party Wipe，確保敘事必要結果。
- 此戰亦作為「死亡不是單純讀檔，而是 Run 循環的一部分」的首次遊戲內教學。
- 已驗證：AGI Timeline、四方向移動、普通攻擊、固定傷害、HIT / EVA、暴擊、敵方自動 AI、死亡、Party Wipe、Combat Log、可收合／可隱藏 HUD、UNIT 檢視、肖像圖片 fallback、主動技能選單入口、移動→攻擊與攻擊→移動的雙向行動順序，以及完成移動＋行動後自動結束回合。
- 主動技能 HUD 已建立共用入口；村民目前顯示「無主動技能」，實際技能選取／Charge 消耗將在有主動技能的 Combat Demo 接入。
- 尚未加入但不影響 Demo 0 完成判定：正式序章對話、完整重生／Meta Progression 畫面。這些屬後續敘事／Run 流程實作，不屬 Demo 0 戰鬥核心驗證範圍。

### Demo 1｜Tier 1 玩家 vs Tier 1 敵人

- 玩家：4 名 Tier 1。
- 敵人：Tier 1。
- 目的：建立 Region 1 最基礎的正常遭遇強度。
- 逐步調整敵人數量與兵種配置，觀察從輕鬆、標準、困難到極限的轉折。

### Demo 2｜Tier 1 玩家 vs Tier 1 + Tier 2 混編

- 玩家：4 名 Tier 1。
- 敵人：Tier 1 + Tier 2。
- 目的：測試 Region 1 後段／高壓遭遇的合理上限，以及少量 Tier 2 敵人帶來的實際威脅增幅。

### Demo 3｜Tier 2 玩家 vs Tier 1 + Tier 2 混編

- 玩家：4 名 Tier 2。
- 敵人：Tier 1 + Tier 2。
- 目的：驗證玩家完成 Tier 2 轉職後的實際強度提升，並確認低 Tier 敵人在後續 Region 中仍可藉由數量與功能混編保有價值。

### Demo 4｜Tier 2 玩家 vs Tier 2 混編

- 玩家：4 名 Tier 2。
- 敵人：Tier 2 混編。
- 目的：建立中期 Region 的標準遭遇強度。

### Demo 5｜Tier 2 玩家 vs Tier 2 + Tier 3 混編

- 玩家：4 名 Tier 2。
- 敵人：Tier 2 + Tier 3。
- 目的：測試中後期高壓遭遇與玩家尚未進入 Tier 3 前的承壓極限。

### Demo 6｜Tier 3 玩家 vs Tier 2 + Tier 3 混編

- 玩家：4 名 Tier 3。
- 敵人：Tier 2 + Tier 3。
- 目的：建立後期 Region 的正常戰鬥強度。

### Demo 7｜Tier 3 玩家 vs Tier 3 混編

- 玩家：4 名 Tier 3。
- 敵人：Tier 3 混編。
- 目的：測試 Region 4／Final Region 一般敵人的高壓與極限遭遇。

## Boss 排除原則

上述階段性 Combat Tests 僅用於一般敵人 Tier 1～3 與混編強度校準。

以下不套用一般敵人模板，之後另外設計與測試：

- Mini Boss。
- 各 Region 最終 Boss。
- Final Boss。

Boss 的數值、技能、行動模式、場地機制與特殊規則皆採獨立定義。

## 測試紀錄方向

每個 Combat Test 後續應能保留或顯示至少以下資訊，供平衡檢討：

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

上述資料未來可用來逐步建立 Region Encounter 的實際強度基準，而不是先主觀指定固定 Threat 倍率。