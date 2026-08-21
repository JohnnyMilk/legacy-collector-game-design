# GDD Review

## Purpose

此文件用於整理《遺產收集者》目前 GDD 的一致性基準。

## Design Consistency Check

### Core Rules

- 四名固定主角
- 無角色等級系統
- Tier 0「村民」只存在於最初序章／教學，不屬於一般 Run 起始職業
- 每次正式 Run 預設以四個 Tier 1 各一名開場，但玩家可改選任何已解鎖職業，也可讓多人使用相同職業
- 每名主角在遠征準備時選擇一件飾品遺產
- Class Mastery 為四名主角共用、以職業為單位、跨 Run 永久保留的 Checklist 進度
- Tier 3 全部為隱藏職業
- Tier 3 由其所有 Inspiration Links 對應 Tier 2 Mastery 完成後解鎖
- Inspiration Links 數量可不同，部分 Tier 3 可以要求 4 個或更多 Tier 2 Mastery
- Relationship／親密度系統已取消
- 透過遺產直接取得的職業稱為特殊職業，不出現在一般同心圓職業樹
- 戰鬥後只更新 Mastery 與解鎖，不直接轉職
- Run 中正式轉職只在 Region 之間的固定休整點進行
- Relic 作為長期 Meta Progression 與每次 Run Build 構築核心
- Party Wipe 作為遠征失敗條件

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
Region Rest Point / Job Change
    ↓
Expedition
    ↓
Report
```

Legacy Trait 與特殊職業作為旁支系統連接職業與遺產，不依賴 Relationship。

## Source of Truth

目前正式規格應優先以拆分後的系統文件為準：

- `docs/systems/class-system.md`
- `docs/systems/mastery-system.md`
- `docs/systems/character-system.md`
- `docs/systems/relic-system.md`
- `docs/systems/expedition-system.md`
- `docs/overview/gameplay-loop.md`

索引中標記為「舊版草稿」的合併文件只保留歷史參考，不可用來覆蓋現行規格。

## Pending Design TODO

### Content

- 完整 Tier 3 職業列表與 Inspiration Links
- 特殊職業清單與取得條件
- 各職業 Mastery Checklist
- 遺產清單
- Region 主題
- Boss 設計

### System Detail

- 休整點除轉職外的完整功能
- 遠征途中是否允許更換飾品遺產
- 遺產唯一性／重複裝備規則
- 敵人 AI 評估模型
- 數值平衡公式

## Prototype Candidates

優先驗證：

1. Class Tree Viewer
2. Mastery Checklist Viewer
3. Relic Collection Viewer
4. Timeline Simulator
5. Battle Grid Editor
6. Expedition Map / Rest Point Editor

## Review Status

現行核心規格已統一為「序章村民 → 正式 Run 遠征準備 → 已解鎖職業自由起始 → 戰鬥累積共享 Mastery → 固定休整點轉職」流程。後續更新應修改對應系統文件，避免把規則分散到舊版草稿。
