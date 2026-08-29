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

## 共用 Combat Model 原則

所有戰鬥測試必須共用同一套 Combat Model／Combat Engine，不為個別測試複製一套戰鬥邏輯。

各測試頁只提供該場戰鬥的 **Scenario Configuration**，例如：

- 玩家職業／Tier。
- 敵人種類／Tier／數量。
- 9×9 地圖配置。
- 初始位置。
- 勝敗條件。
- 特殊劇情旗標。

共用 Model 應統一讀取既有正式資料與規則，例如：

- `data/class-stats.json`
- `data/battlefield-rules.json`
- 職業／技能正式資料
- Damage System
- Timeline System
- Action System

因此任何核心公式或規則修正，只需要改 Combat Model 或正式資料來源，所有測試案例應同步得到相同結果。

## 測試狀態規則

HTML 測試索引沿用主頁狀態表示：

- **未開始**：一般文字，不提供超連結。
- **實作中**：紅色，且開始提供對應戰鬥測試頁連結。
- **完成**：綠色，保留測試頁連結供後續回看與檢討。

未開始的測試不可先建立假的可點連結。

## 階段性戰鬥測試

### Demo 0｜序章劇情殺

- 玩家：4 名 Tier 0 村民。
- 敵人：4 名 Tier 1 敵人。
- 目的：讓玩家實際操作後遭遇必敗的劇情殺，第一次觸發 Party Wipe、重生與下一個 Run 的核心循環。
- 設計方向：應為數值與配置上的必敗，而不是開場腳本直接殺死角色；玩家可以造成有效反抗，但最終應全滅。
- 此戰亦作為「死亡不是單純讀檔，而是 Run 循環的一部分」的首次遊戲內教學。

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