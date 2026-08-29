# LEGACY COLLECTOR｜Prototype 開發路線

## 開發原則

採 MVP 方式先驗證核心系統。

現階段不優先撰寫完整故事，而是先製作一個**可操作的 Combat Vertical Slice Demo**，驗證遊戲是否能以 Browser-first、HTML / CSS / JavaScript / JSON 的框架順利運作。

Demo 的優先目標是：

1. 戰鬥流程可實際操作。
2. 角色可在 9×9 Grid 上移動。
3. 行動、傷害、技能、狀態與回合規則能正確計算。
4. 角色與敵人可使用簡單、可調整的基礎數值。
5. 已完成的 Tier 1～3 與記憶形態技能，可以逐步放入 Demo 做規則驗證。
6. 手機、平板與桌面瀏覽器皆可使用 Click / Tap 操作。

完整 Prologue、Region 劇情與事件內容，在上述核心玩法確認後再進入正式撰寫。

## Phase 0：Combat Vertical Slice

先建立一個真正可玩的單場戰鬥 Demo，而不是只做 Viewer。

最低需求：

- 9×9 HTML / CSS Grid 戰場。
- 四名玩家角色與數名測試敵人。
- 點選角色。
- 顯示合法移動範圍。
- 點選格子移動。
- 一般攻擊。
- 基本技能施放。
- HP / ATK / MATK / DEF / MDEF / AGI 等測試數值。
- 物理／魔法／治療基本結算。
- 單位佔格與不可穿越規則。
- 基本敵方行動。
- 行動順序／Timeline 串接。
- 戰鬥勝負條件。
- 簡單 Combat Log，方便檢查規則計算。

這個 Demo 以**規則正確、容易測試、容易修改**為第一優先；不追求大量美術或完整故事演出。

## Phase 1：職業技能整合

將已確認的職業資料逐步接入 Combat Demo：

- Tier 1 四職業。
- Tier 2 十二職業。
- Tier 3 八職業。
- 技能繼承鏈。
- Charge。
- 特殊移動／召喚／牆體／換位／護盾／控制／復活等例外規則。
- 四個 Memory Form 的專屬一般攻擊。

目的不是一次全部完成，而是每加入一種規則就能在同一個 Demo 中直接測試。

## Phase 2：規則與數值驗證

- Damage Formula。
- Healing Formula。
- DEF / MDEF。
- AGI / Timeline。
- Wait。
- Status。
- Death / Revival / Party Wipe。
- Party Composition 被動。
- Mastery 計數事件。

角色與敵人初期使用簡單測試數值即可；正式平衡數值後置。

## Phase 3：長期進度與 Viewer

- Class Tree Viewer
- Mastery Checklist Viewer
- Skill Inheritance Viewer
- Party Composition Viewer / Demo
- Memory Awakening Viewer / Demo

這些頁面繼續保留，但優先級低於可玩的 Combat Demo。

## Phase 4：流程整合

- Expedition Map Editor
- Region 轉職點流程
- Region 4 記憶神殿分支
- Final Region / Final Boss 流程
- Report Generation

## Phase 5：故事與事件

在戰鬥、移動、核心規則與角色技能都能正常運作後，再正式展開：

- Prologue。
- Region 1～4。
- Final Region。
- Map Events。
- Character Events。
- Memory Shrine Questions。
- Boss Narrative。

## 已取消 Prototype

- Relic Viewer / 遺產收藏館
- 遺產修復階段 Demo
- 特殊遺產解鎖流程
- Relationship Viewer

以上只保留舊版歷史，不再投入現行 Prototype。
