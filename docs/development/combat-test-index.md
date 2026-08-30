# 戰鬥測試索引（Combat Test Index）

## 目的

Combat Demo 主要用來測試**兩軍實際交戰的體感、強度與平衡**，並逐 Region 校準一般敵人與 Boss 強度。

主要觀察敵人 Tier、數量、兵種混編、初始站位、技能與 AI，以及戰鬥節奏、威脅感、擊殺速度與資源消耗。Combat Demo 的核心問題仍是：**這兩支隊伍打起來的感覺如何？**

## 測試命名與 Region 分類規則

### 序章

- 序章固定使用 `Demo 0`。
- 主要驗證劇情殺、首次 Party Wipe 與核心 Combat Runtime。

### Region 一般敵人 Demo

每個 Region 固定保留 2 個一般敵人強度測試：

- `Demo R-1`
- `Demo R-2`

例如 Region 1＝`Demo 1-1`、`Demo 1-2`；Region 2＝`Demo 2-1`、`Demo 2-2`。

### Region Boss 測試

Boss 名稱必須直接帶 Region 編號，避免不同 Region 的 A / B 混淆：

- `Boss RA`＝該 Region Mini Boss。
- `Boss RB`＝該 Region Boss / Region Final Boss。
- 同一 Boss 的額外玩家 Tier 或條件對照使用 `RA-1` / `RB-1`。

例如：

- Region 1：`Boss 1A`、`Boss 1A-1`、`Boss 1B`、`Boss 1B-1`。
- Region 2：`Boss 2A`、`Boss 2B`。
- Region 3：`Boss 3A`、`Boss 3B`。
- Region 4：`Boss 4A`、`Boss 4B`。

既有可執行檔不因顯示名稱變動而強制重新命名；對外顯示與溝通名稱統一使用 Region 編號。

## 共用 Combat Runtime 原則

所有戰鬥測試共用 Combat Model / UI Runtime。核心公式、HUD、狀態、戰鬥互動與 Combat Log 修正應優先改共用 Runtime，使所有測試同步受益。

主要檔案：

- `development/combat-tests/combat-model.js`
- `development/combat-tests/combat-app.js`
- `development/combat-tests/combat-party.js`
- `development/combat-tests/combat-class-runtime.js`
- `development/combat-tests/combat-enemy-runtime.js`
- `development/combat-tests/combat-ui.css`
- `development/combat-tests/scenarios/*.json`

## 測試狀態規則

- **未開始**：一般文字，不提供超連結。
- **實作中**：紅色，提供測試頁連結。
- **完成**：綠色，保留測試頁連結供 Regression Test。

---

# 序章｜Prologue

## Demo 0｜序章劇情殺｜完成

- 玩家：4 名固定主角，職業皆為 Tier 0「村民」。
- 敵人：4 名 Tier 1 一般敵人：獵兵、劍兵、術士、重衛。
- 地圖：8×8。
- 已驗證 Timeline、移動、一般攻擊、HIT / EVA、暴擊、敵方 AI、死亡、Party Wipe、Combat Log、UNIT HUD、技能入口與雙向行動順序。

---

# Region 1｜小怪與 Boss 強度基準

Region 1 一般敵人使用 `Demo 1-1 / Demo 1-2`；Boss 使用 `1A / 1B`。

## 一般敵人 Demo

### Demo 1-1｜Tier 1 極限測試：4 vs 12｜完成

- 玩家：4 名 Tier 1 主角。
- 敵人：12 名 Tier 1 一般敵人；獵兵、劍兵、術士、重衛各 3 名。
- 地圖：8×8；8 個障礙物。
- 結果：4 名 Tier 1 主角仍可相對輕鬆獲勝。
- 結論：Region 1 不適合只靠增加 Tier 1 敵人數量提高壓力，後段應透過更高 Tier 與功能型敵人混編建立威脅。

### Demo 1-2｜Region 1 後段：Tier 1 + Tier 2 混編｜實作中

- 玩家：4 名 Tier 1，四系職業各 1。
- 敵人：每次載入隨機 Tier 1 ×4 + Tier 2 ×4。
- 障礙物：每次載入隨機 4 格。
- 定位：Region 1 後段、Final Boss 前的一般遭遇強度測試。
- Tier 2 敵人使用 `data/enemy-stats.json` 目前的 6 種 Tier 2 一般敵人測試池。

## Boss Test

### Boss 1A｜Region 1 Mini Boss：遺跡追獵者｜完成

- 玩家：4 名 Tier 1 主角。
- 敵方：Mini Boss「遺跡追獵者」+ 2 名 Tier 1 獵兵。
- 場地：8×8 固定障礙配置。
- 結果：Tier 1 隊伍可以通過，需要正常操作但不構成過高門檻。

### Boss 1A-1｜Tier 2 Benchmark vs 遺跡追獵者｜完成

- 玩家：每次載入隨機抽取 4 個不同 Tier 2 職業。
- 結果：Tier 2 隊伍可輕鬆通過 Region 1 Mini Boss。

### Boss 1B｜Region 1 Boss：遺跡守門者 + 2 巡弋機兵｜重新測試中

- 玩家：4 名 Tier 1 主角。
- 敵方：Region 1 Boss「遺跡守門者」+ 2 名 Tier 2「巡弋機兵」。
- 場地：8×8；中央 4 格 T 字障礙配置。
- 原本兩名 Tier 1「遺跡侍者」已移除，因此此戰**不再有敵方補血機制**。
- 新壓力來源：巡弋機兵的遠程物理射擊、被動「鎖定程序」與主動「連射壓制」，搭配 Boss 的近中距離壓力。
- 因敵方配置已改變，舊版「Tier 1 幾乎不可能通過」結果不能直接當成新版完成結論，需重新 Regression Test。

### Boss 1B-1｜Tier 2 Benchmark vs 遺跡守門者 + 2 巡弋機兵｜重新測試中

- 玩家：每次載入隨機抽取 4 個不同 Tier 2 職業。
- 敵方與場地與 1B 相同。
- 測試目標：確認 Tier 2 隊伍可以通過，但面對 Boss + 2 名 Tier 2 遠程機兵仍保留適度戰術壓力與失誤成本。
- 不再把「處理敵方治療」列為本場測試項目。

## Region 1 強度基準

目前已確認：

- **Tier 1 → Mini Boss：可以通過。**
- **Tier 2 → Mini Boss：輕鬆通過。**

原本 Final Boss 的 Tier 1 / Tier 2 基準是以「遺跡守門者 + 2 遺跡侍者」驗證；現已改成「遺跡守門者 + 2 巡弋機兵」，因此 1B / 1B-1 需重新測試後再更新正式基準。

---

# Region 2

Region 2 固定保留 `Demo 2-1 / Demo 2-2` 與 `Boss 2A / Boss 2B`。

## 一般敵人 Demo

### Demo 2-1｜Tier 2 玩家 vs Tier 1 + Tier 2 混編

- 狀態：未開始。

### Demo 2-2｜Tier 2 玩家 vs Tier 2 混編

- 狀態：未開始。

## Boss Test

### Boss 2A｜Region 2 Mini Boss

- 狀態：未開始。

### Boss 2B｜Region 2 Boss

- 狀態：未開始。

---

# Region 3

Region 3 固定保留 `Demo 3-1 / Demo 3-2` 與 `Boss 3A / Boss 3B`。

### Demo 3-1｜Tier 2 玩家 vs Tier 2 + Tier 3 混編

- 狀態：未開始。

### Demo 3-2｜Tier 3 玩家 vs Tier 2 + Tier 3 混編

- 狀態：未開始。

### Boss 3A｜Region 3 Mini Boss

- 狀態：未開始。

### Boss 3B｜Region 3 Boss

- 狀態：未開始。

---

# Region 4

Region 4 固定保留 `Demo 4-1 / Demo 4-2` 與 `Boss 4A / Boss 4B`。

### Demo 4-1｜Tier 3 玩家 vs Tier 3 混編

- 狀態：未開始。

### Demo 4-2｜Region 4 第二階段小怪測試

- 狀態：未開始；具體配置待確認。

### Boss 4A｜Region 4 Mini Boss

- 狀態：未開始。

### Boss 4B｜Region 4 Boss

- 狀態：未開始。

## 測試紀錄方向

每個 Combat Test 後續應能保留或顯示戰鬥結果、總輪數、死亡人數、剩餘 HP、Charge、治療、傷害、Hit / Miss、Crit、敵方配置與關鍵 Combat Log，方便回看與 Region 強度調整。
