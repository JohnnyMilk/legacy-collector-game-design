# GDD Review

## Purpose

此文件用於整理《遺產收集者》目前 GDD 的一致性基準。

## Design Consistency Check

### Core Rules

- 四名固定主角，無角色等級與自由配點。
- Tier 0「村民」只存在於最初序章／教學。
- 每次正式 Run 預設以戰士、斥候、法師、牧師各一名開場，但玩家可改選任何已解鎖職業，也可多人使用相同職業。
- 每名主角在遠征準備時選擇一件飾品遺產。
- Class Mastery 為四名主角共用、以職業為單位、跨 Run 永久保留的 Checklist 進度。
- 每個一般職業先採 6 項 Mastery：3 項共通 + 3 項依職業玩法、被動技能、主動技能設計的專屬條件；初步目標約兩個 Run 完成。
- 職業特性只是定位說明，不是技能。
- 每個正式職業自身提供 1 主動技能 + 1 被動技能。
- Tier 2 完整繼承正式連線 Tier 1 的技能；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與其祖先技能；同一來源技能不重複。
- Legacy Trait／弱化被動繼承已取消並移入舊版草稿。
- Tier 3 全部為隱藏職業，完成所有 Inspiration Links 對應 Tier 2 Mastery 後解鎖。
- Inspiration Links 不是可逆轉職路徑，UI 必須與一般轉職線區分。
- Relationship／親密度系統已取消。
- 透過遺產直接取得的職業稱為特殊職業，不出現在一般同心圓職業樹。
- 戰鬥後只更新 Mastery 與解鎖，不直接轉職。
- 每個 Region 固定只有 1 個轉職點，原則上位於路程中段。
- 不另設角色轉職次數限制；頻率由每 Region 一個轉職點控制。
- 完成轉職後，新 Build 所有可用主動技能 Charge 補滿。
- Relic 作為長期 Meta Progression 與每次 Run Build 構築核心。
- Party Wipe 作為遠征失敗條件。

## System Dependency

```text
Prologue / Tutorial Village State
    ↓
Expedition Preparation
    ↓
Class + Relic Loadout
    ↓
Combat
    ↓
Shared Class Mastery
    ↓
Tier 3 Inspiration / Unlock
    ↓
Region Midpoint Transition Point
    ↓
Inherited Skill Build
    ↓
Expedition / Report
```

## Source of Truth

正式規格優先以拆分後系統文件為準，尤其是：

- `docs/systems/class-system.md`
- `docs/systems/skill-system.md`
- `docs/systems/mastery-system.md`
- `docs/systems/character-system.md`
- `docs/systems/expedition-system.md`
- `docs/overview/gameplay-loop.md`

索引中標記為「舊版草稿」或「已取消」的文件只保留歷史參考，不可覆蓋現行規格。

## Pending Design TODO

- 四個 Tier 1 的主動／被動技能
- 各職業 6 項 Mastery Checklist 的正式內容與數值
- 完整 Tier 3 職業列表與 Inspiration Links
- 特殊職業清單與取得條件
- 遺產清單
- Region 主題與轉職點實際地圖配置
- Tier 3 多技能操作負擔 Prototype
- 敵人 AI 與數值平衡

## Prototype Candidates

1. Class Tree Viewer
2. Mastery Checklist Viewer
3. Skill Inheritance Viewer
4. Relic Collection Viewer
5. Timeline Simulator
6. Battle Grid Editor
7. Expedition Map / Transition Point Editor

## Review Status

現行核心規格已統一為「序章村民 → 正式 Run 自由起始職業 → 戰鬥累積共享 Mastery → 每 Region 中段固定轉職點 → 高 Tier 完整技能繼承」流程。
