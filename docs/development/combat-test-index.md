# 戰鬥測試索引（Combat Test Index）

## 目的

Combat Demo 從此主要用來測試**兩軍實際交戰的體感、強度與平衡**，並逐階段校準各 Region 的敵方配置。

玩家角色的職業基礎數值、傷害、HIT / EVA、暴擊、Timeline 與 Battlefield 規則已先固定；因此戰鬥測試主要調整與觀察：

- 敵人 Tier。
- 敵人數量。
- 敵方兵種混編比例。
- 敵我初始站位。
- 敵人技能與 AI 行為。
- 玩家在固定職業強度下的實際承壓極限。
- 戰鬥節奏、威脅感、擊殺速度與資源消耗是否合理。

測試結果將反向用於決定 Region 1～Final Region 的一般遭遇強度配置。

## Combat Demo 測試邊界

Combat Demo **不再把地圖美術、地圖投影、UI 版面或一般視覺優化當成主要測試項目**。

- 地圖形狀、45° / Isometric / 2.5D 投影、地表渲染、障礙物視覺、角色超格與 Depth Sorting，統一移至「地圖渲染研究專區」。
- HUD 配置、字體、色彩、血條樣式、肖像尺寸等純 UI / Visual 調整，不在各階段 Combat Demo 中反覆重新設計。
- Combat Demo 可以沿用目前可操作的共用戰鬥畫面作為測試載體。
- 只有當地圖或 UI 出現**實際錯誤**，或已影響操作、目標判定、資訊閱讀與戰鬥結果時，才在 Combat Demo 工作線直接修正。
- 純美術好不好看、地圖是否太單調、未來角色應用半身或全身圖等問題，不影響 Combat Demo 的完成判定。

因此後續 Demo 的核心問題應是：**這兩支隊伍打起來的感覺如何？** 而不是重新驗證畫面樣式。

## 單位命名原則

- 「村民」是職業名稱，不是角色單位名稱。
- 序章四名玩家單位仍使用四名主角的固定姓名：蒼岳、朧月、阿斯特蕾雅、賽洛恩；其目前職業皆為「村民」。
- 一般敵方單位目前不具名，因此敵方直接以職業名稱作為單位顯示名稱，例如劍兵、獵兵、術士、重衛。

## 共用 Combat Runtime 原則

所有戰鬥測試與未來正式遊戲應盡量共用同一套 Combat Runtime，不為個別測試複製戰鬥邏輯或 HUD 控制程式。

目前正式分層：

- `development/combat-tests/combat-model.js`：戰鬥規則與狀態 Model。負責移動、攻擊、HIT / EVA、暴擊、Timeline、死亡、AI、主動技能執行、被動技能狀態與勝敗判定。
- `development/combat-tests/combat-app.js`：共用 Combat UI / Controller。負責棋盤 Render、HUD、Timeline、UNIT、Progress、Combat Log、Action Bar、主動技能 HUD、技能目標選擇、肖像載入與文字 fallback，以及玩家輸入事件。
- `development/combat-tests/combat-data.js`：共用 Combat 資料載入 helper，統一處理 JSON 讀取、cache-bust 與必要資料檢查。
- `development/combat-tests/combat-party.js`：共用 Party Composition 計算與隊伍被動效果。
- `development/combat-tests/combat-class-runtime.js`：正式玩家職業資料轉為 Combat Runtime 可執行格式；避免各 Demo 重複定義職業主被動與 Charge。
- `development/combat-tests/combat-enemy-runtime.js`：正式敵方模板轉為 Combat Runtime 單位；Scenario 只保存敵人種類與站位。
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
- 8×8 地圖配置。
- 初始位置。
- 勝敗條件。
- 特殊劇情旗標。

共用 Runtime 應統一讀取既有正式資料與規則，例如：

- `data/class-stats.json`
- `data/enemy-stats.json`
- `data/battlefield-rules.json`
- `data/classes.json`
- Damage System
- Timeline System
- Action System

Tier 1 一般敵人數值已正式確認，來源固定為 `data/enemy-stats.json`。Demo 0、Demo 1 與後續使用 Tier 1 一般敵人的 Combat Demo 不再於 Scenario 重複定義 HP / ATK / MATK / DEF / MDEF / AGI / MOVE / HIT / EVA 與一般攻擊資料。

因此任何核心公式、UI 操作規則或共用 HUD 修正，只應改共用 Model / App / CSS 或正式資料來源，所有 Combat Demo 與未來正式戰鬥畫面應同步得到相同結果。

## 單位肖像資產規則

目前 Combat Demo 戰場單位顯示採「圖片優先、文字 fallback」。這只是現階段測試載體，不代表最終地圖渲染的角色呈現規格。

- 玩家四名主角使用固定角色肖像，不隨職業改變：`assets/units/players/<character-id>.webp`。
- 一般敵人目前可使用文字 fallback。
- 圖片不存在或載入失敗時，自動顯示單位名稱第一個字。
- 最終戰場角色是否改用半身、3/4 身、全身或可超格圖像，由「地圖渲染研究專區」決定。

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
- 敵人：4 名已確認 Tier 1 一般敵人：獵兵、劍兵、術士、重衛。
- 地圖：8×8。
- 目的：讓玩家實際操作後遭遇必敗的劇情殺，第一次觸發 Party Wipe、重生與下一個 Run 的核心循環。
- 已驗證：AGI Timeline、四方向移動、普通攻擊、固定傷害、HIT / EVA、暴擊、敵方自動 AI、死亡、Party Wipe、Combat Log、UNIT 檢視、主動技能選單入口、移動→攻擊與攻擊→移動的雙向行動順序，以及完成移動＋行動後自動結束回合。

### Demo 1｜Tier 1 極限測試：4 vs 12｜完成

- 狀態：已完成實機測試。
- 玩家：4 名固定主角，Tier 1 四系各一：蒼岳＝戰士、朧月＝斥候、阿斯特蕾雅＝法師、賽洛恩＝牧師。
- 隊伍被動：四系恰為 1/1/1/1，自動觸發「四系均衡」；物理傷害、魔法傷害、AGI、DEF、MDEF 各 +5%。
- 敵人：12 名已確認 Tier 1 一般敵人；獵兵、劍兵、術士、重衛各 3 名。
- 敵方數值：正式來源為 `data/enemy-stats.json`，不因本次極限測試調高或調低。
- 隨機排列：12 個敵方出生位置固定於敵方半場；每次重新載入 Demo 時，四種敵人會在這 12 個位置重新隨機打散，但始終維持每種 3 名。
- 地圖：8×8；8 個障礙物，維持兩軍正面對陣與對稱障礙配置。
- 勝利：敵方全滅。
- 敗北：四名玩家全滅。
- 無 `forcePartyWipe`。
- 測試結果：4 名 Tier 1 主角對 12 名 Tier 1 敵人仍可相對輕鬆獲勝。
- 結論：繼續單純增加 Tier 1 敵人數量的測試價值有限，因此純 Tier 1 數量壓力測試到此收束；下一階段改測 Tier 1 + Tier 2 敵方混編。

### Demo 2｜Tier 1 玩家 vs Tier 1 + Tier 2 混編

- 玩家：4 名 Tier 1。
- 敵人：Tier 1 + Tier 2。
- 目的：測試 Region 1 後段／高壓遭遇的合理上限，以及少量 Tier 2 敵人帶來的實際威脅增幅。
- 前置：先建立 Tier 2 一般敵人的正式能力值、兵種與技能資料，再開始 Demo 2。

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

## Region 1 Boss 測試｜完成

### Boss Test A｜Tier 1 vs Region 1 Mini Boss

- 狀態：已完成並通過實機測試。
- 玩家：4 名 Tier 1 主角。
- 敵方：Mini Boss「遺跡追獵者」+ 2 名 Tier 1 獵兵。
- 場地：8×8 固定障礙配置。
- 結果：Tier 1 隊伍可以通過 Mini Boss，戰鬥需要正常操作，但不構成過高門檻。

### Boss Test A-1｜Tier 2 vs Region 1 Mini Boss

- 狀態：已完成並通過實機測試。
- 玩家：每次載入隨機抽取 4 個不同 Tier 2 職業。
- 結果：Tier 2 隊伍可輕鬆通過 Region 1 Mini Boss。

### Boss Test B｜Tier 1 vs Region 1 Boss

- 狀態：已完成並通過實機測試。
- 玩家：4 名 Tier 1 主角。
- 敵方：Region 1 Boss「遺跡守門者」+ 2 名 Tier 1「遺跡侍者」。
- 場地：8×8；中央使用 4 格 T 字障礙配置。
- 結果：Tier 1 隊伍實戰上幾乎不可能通過 Region 1 Boss。
- 意義：Region 1 最終 Boss 成為未轉職 Tier 1 隊伍的明確強度牆。

### Boss Test B-1｜Tier 2 vs Region 1 Boss

- 狀態：已完成並通過實機測試。
- 玩家：每次載入隨機抽取 4 個不同 Tier 2 職業。
- 敵方與場地：與 Boss Test B 相同。
- 結果：Tier 2 隊伍可以通過，但仍需處理敵方治療、Boss 技能、站位與 Charge / 行動資源，保留一定難度與失誤成本。

### Region 1 已驗證強度基準

- **Tier 1 → Mini Boss：可以通過。**
- **Tier 1 → Region Boss：幾乎不可能通過。**
- **Tier 2 → Mini Boss：輕鬆通過。**
- **Tier 2 → Region Boss：可以通過，但仍有適度難度。**

此結果作為 Region 1 目前的正式戰鬥強度基準；後續若調整 Region 1 Boss、Mini Boss、Tier 1 / Tier 2 玩家能力值或相關核心公式，應以此基準重新檢查是否產生明顯偏移。

## Boss 排除原則

上述階段性 Combat Tests 僅用於一般敵人 Tier 1～3 與混編強度校準。

以下不套用一般敵人模板，採獨立設計與測試：

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