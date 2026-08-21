# 遺產收集者｜Legacy Collector

《遺產收集者》（Legacy Collector）是一款以 **Roguelike 遠征循環 + 戰棋 SLG + 跨 Run 職業養成** 為核心的遊戲企劃。

本 Repository 作為遊戲設計文件（GDD）、系統規格與 Prototype 開發基地。

## 測試網站

👉 [開啟《遺產收集者》GDD / Prototype 測試網站](https://johnnymilk.github.io/legacy-collector-game-design/)

---

## 目前核心設計

- 固定四名主角。
- 無角色等級與自由配點。
- 遊戲最初序章使用 Tier 0「村民」作為故事與教學前導；村民不參與正式 Run 的一般職業循環。
- 每次正式 Run 預設由戰士、斥候、法師、侍祭四個 Tier 1 各一名開場。
- 玩家可在遠征準備時把任一角色改成任何已解鎖職業，也可以讓多人使用相同職業，例如四名角色全部使用戰士。
- 每名主角在遠征開始前選擇一件飾品遺產。
- Mastery 採職業專屬 Checklist，為四名主角共用、以職業為單位、跨 Run 永久保留的進度。
- 一般 Tier 3 透過 Inspiration Links 解鎖：所有對應 Tier 2 職業都完成 Mastery 後即永久解鎖。
- 不同 Tier 3 可以有不同數量的 Inspiration Links，因此部分職業可能需要 4 個或更多 Tier 2 Mastery。
- Relationship／親密度系統已取消。
- 透過遺產直接取得或啟發的職業稱為「特殊職業」，不出現在一般同心圓職業樹。
- 戰鬥後只更新 Mastery 與職業解鎖；Run 中正式轉職只在 Region 之間的固定休整點進行。
- 過去職業可透過 Legacy Trait 留下職涯痕跡。
- 遺產（Relic）是長期 Meta Progression 與每次 Run Build 構築的核心。

設計原則：

- MVP 優先
- 先驗證核心循環，再逐步增加內容
- 每個系統獨立製作 Prototype
- Markdown 為正式規格 Source of Truth

---

# GDD 文件結構

所有企劃文件皆使用繁體中文，位於 `docs/`。

## overview/

- 遊戲概念
- 核心循環
- 設計理念

## systems/

### Character / Progression

- Character System
- Class System
- Mastery System
- Legacy Trait System
- Relic System

Relationship System 已取消；對應文件只保留取消紀錄與歷史參考。

### Expedition / Meta

- Expedition System
- Report System

### Combat Framework

- Combat System
- Battlefield System
- Timeline System
- Action System
- Skill System
- Status System
- Damage System

## world/

- 世界設定
- 遺產歷史
- Region 設計
- 未來擴充方向

## development/

- 文件架構
- Prototype Roadmap
- Demo Modules
- GDD Review

---

# 現行遊戲循環

```text
序章（僅首次：村民／教學）
→ 遠征準備
→ 選擇四名角色起始職業 + 飾品遺產
→ Region
→ 戰鬥／事件／Mastery 累積
→ 固定休整點／轉職
→ 下一 Region
→ Final Region
→ 遠征報告
→ 下一次 Run
```

跨 Run 永久保留職業 Mastery、職業解鎖、Tier 3 Inspiration、遺產收藏與其他 Meta Progression；每次 Run 的職業與飾品遺產配置則重新決定。

---

# Prototype Progress

已完成確認：

- ✅ Timeline Simulator / 行動時間軸系統
- ✅ Class Tree Viewer / 同心圓職業樹

下一個主要驗證方向：

- Mastery Checklist Viewer
- Relic Collection Viewer
- Expedition / Rest Point Flow
- Battle Grid Editor

---

# Future Expansion Direction

未來可透過更新增加：

- 新 Tier 3 Hidden Class
- 新特殊職業
- 新 Relic
- 新 Region
- 新 Event
- 新 Boss
- 特殊系統（例如墓地、復活、特殊轉職）

---

# Project Status

目前定位：

> 建立《遺產收集者》的遊戲設計資料庫與 Prototype 開發基礎。

現階段持續以「文件規格 → 小型 Prototype → 確認規則」的方式逐步完成核心系統。
