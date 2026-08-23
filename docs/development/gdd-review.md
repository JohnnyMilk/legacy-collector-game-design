# GDD Review

## Purpose

此文件用於整理《遺產收集者》目前 GDD 的一致性基準。

## Design Consistency Check

### Core Rules

- 四名固定主角，無角色等級與自由配點。
- Tier 0「村民」只存在於最初序章／教學。
- 每次正式 Run 預設戰士、斥候、法師、牧師各一名；一般職業可多人重複。
- 每名主角在遠征準備時選擇一件飾品遺產。
- Class Mastery 為四名主角共用、以職業為單位、跨 Run 永久保留的進度；同職業多人行為合併累積，戰鬥中記錄、戰後統一判定。
- Mastered 不增加戰鬥數值；用途為允許轉出、計入解鎖條件、跨 Run 保留。
- Tier 1 / Tier 2 固定 6 項 Mastery：3 項共通 + 3 項職業專屬。
- Tier 3 取消共通 Mastery 模板，完全依各職業特色設計，不固定 6 項。
- 職業特性只是定位說明，不是技能。
- Tier 2 完整繼承正式連線 Tier 1 技能；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與其祖先技能。
- Legacy Trait／弱化被動繼承已取消。
- Tier 3 全部為隱藏職業，完成所有 Inspiration Links 對應 Tier 2 Mastery 後解鎖。
- Relationship／親密度系統已取消。
- 四個最終特殊職業各代表戰士、敏捷、魔法、支援系，獨立位於 Tier 0～3 同心圓之外，**不是 Tier 4**。
- 最終特殊職業的預設解鎖條件為：完成該職業系要求的全部 Tier 3 Mastery **且** 取得對應特殊遺產。
- 同一隊伍不可重複使用同一特殊職業；不同特殊職業可並存。
- 特殊職業技能繼承方式尚未定案。
- 戰鬥後只更新 Mastery 與解鎖，不直接轉職。
- 每個 Region 固定只有 1 個轉職點，原則上位於路程中段。
- 完成轉職後，新 Build 所有可用主動技能 Charge 補滿。

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
Tier 3 Unique Mastery
    ↓
Sector Tier 3 Mastery + Special Relic
    ↓
Final Special Class Unlock
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
- `docs/systems/relic-system.md`
- `docs/systems/character-system.md`
- `docs/systems/expedition-system.md`

## Pending Design TODO

- Tier 2 技能與 Mastery
- 完整 Tier 3 職業列表與 Inspiration Links
- 各 Tier 3 完全職業專屬 Mastery
- 四個最終特殊職業正式名稱、技能與繼承方式
- 四個對應特殊遺產正式內容
- Region 主題與轉職點實際地圖配置
- Tier 3 多技能操作負擔 Prototype
- 敵人 AI 與數值平衡

## Prototype Candidates

1. Class Tree Viewer
2. Mastery Checklist Viewer
3. Skill Inheritance Viewer
4. Final Special Class Unlock Viewer
5. Relic Collection Viewer
6. Timeline Simulator
7. Battle Grid Editor
8. Expedition Map / Transition Point Editor

## Review Status

現行核心規格已統一為「序章村民 → 正式 Run 自由起始職業 → 戰鬥累積共享 Mastery → Tier 3 使用特色 Mastery → 該職業系 Tier 3 Mastery + 特殊遺產解鎖最終特殊職業 → 每 Region 中段固定轉職點」流程。
