# LEGACY COLLECTOR｜Demo 模組規劃

## 目的

現階段的 Demo 不再只以獨立 Viewer 為中心，而是先建立一個**可玩的 Combat Vertical Slice**，讓已確認的戰鬥規則、角色移動、角色數值與職業技能能在同一個環境中實際測試。

## 第一優先：Combat Demo

Combat Demo 採**階段性戰鬥測試**方式進行。正式測試順序、狀態與後續測試頁入口統一由：

- `development/combat-test-index.html`
- `docs/development/combat-test-index.md`

管理。

所有戰鬥測試共用同一套 Combat Model／Combat Engine；各案例只提供不同 Scenario Configuration，不為每一場測試複製一套戰鬥邏輯。

### 1. 戰鬥

驗證：

- 玩家回合與敵方回合。
- Timeline／AGI 行動順序。
- 一般攻擊。
- 主動技能。
- Charge。
- 傷害、治療、狀態與死亡。
- 戰鬥勝利／Party Wipe。

### 2. 角色移動

驗證：

- 9×9 Grid。
- 單位佔格。
- 合法移動範圍。
- 阻擋地形。
- 不可穿越單位。
- 技能造成的特殊移動、傳送與換位。

### 3. 規則計算與人物數值

Combat Demo 直接使用已確認的正式玩家職業數值與戰鬥規則資料，不再使用臨時玩家數值。

核心包含：

- HP
- ATK
- MATK
- DEF
- MDEF
- AGI
- MOVE
- HIT
- EVA

敵人數值則依各階段 Combat Test 逐步建立與校準，用於反推出各 Region 合理的敵方 Tier、數量與混編強度。

Combat Log 必須能顯示重要計算，例如：攻擊者、技能、基礎值、防禦、加成／減益、最終傷害、狀態變化與 HP 結果，方便除錯與平衡檢討。

## 技能測試策略

已確認的 Tier 1～3 與 Memory Form 技能不需要一次全部完成。

採用「規則類型優先」方式逐步加入：

1. 單體物理／魔法傷害。
2. 治療。
3. 範圍攻擊。
4. Buff / Debuff。
5. 移動後攻擊／攻擊後移動。
6. 傳送／換位。
7. 牆體／召喚物。
8. 多段傷害。
9. 控制與無法移動。
10. 護盾、死亡觸發與復活。
11. 連鎖傷害。
12. Memory Form 特殊一般攻擊。

每完成一種規則，就應能在 Combat Demo 中直接選擇對應角色／職業測試。

## 後續 Viewer

以下仍保留，但不是現階段第一優先：

### Class Tree Viewer
驗證 Tier 分支、Inspiration Links、Tier 3 隱藏／揭露與角色記憶外部節點。

### Mastery Viewer
驗證 Tier 1～3 不同 Mastery 框架、即時進度與戰後 MASTERED。

### Party Composition Demo
驗證四名角色當前職業系 Count 與正式被動效果、轉職後即時重算。

### Memory Awakening Demo
驗證四個角色專屬記憶、Tier 3 Mastery 資格、Region 4 記憶神殿問答、永久解鎖與新 Run 起始使用。

### Expedition Editor
驗證 Region、Node、Boss、固定轉職點、Region 4 神殿分支與 Final Region。

### Report Viewer
驗證本次遠征紀錄、職業戰績檔案、Mastery、記憶覺醒與隊伍組合歷程。

## 故事開發順序

Prologue、Region 劇情、角色事件與正式對話目前暫停展開。

原因不是取消故事，而是先確定：

**遊戲本身的戰鬥、移動、數值與規則足以成立。**

待 Combat Demo 與主要非故事系統確認後，再集中進入完整故事設計，避免故事撰寫與底層玩法反覆互相改動。

## 已取消 Demo

Relic Viewer、遺產收藏／修復、特殊遺產解鎖與 Relationship Viewer 已退出現行開發；相關舊資料只作 Archive。
