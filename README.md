# 遺產收集者｜Legacy Collector

《遺產收集者》（Legacy Collector）是一款以 **Roguelike 遠征循環 + 戰棋 SLG + 角色養成** 為核心的遊戲企劃。

本 Repository 作為遊戲設計文件（GDD）、系統規格與未來 Prototype 開發基地。

目前階段以建立完整遊戲架構為主，尚未進入完整遊戲製作。

---

## 核心設計理念

《遺產收集者》的核心特色：

- 固定四名主角，建立長期角色連結
- 透過職業 Mastery 進行轉職與成長
- 過去職業留下 Legacy Trait
- 發現、修復並收藏上古遺產（Relic）
- Relationship 跨 Run 保存並影響 Hidden Class
- Tier 3 全部設計為隱藏職業，作為未來長期擴充內容

設計原則：

- MVP 優先
- 先驗證核心循環，再逐步增加內容
- 每個系統獨立製作 Prototype
- 遊戲內容透過更新持續擴充

---

# GDD 文件結構

所有企劃文件皆使用繁體中文，位於 `docs/`。

## overview/

遊戲總體設計：

- 遊戲概念
- 核心循環
- 設計理念

---

## systems/

遊戲系統規格：

### Character / Progression

- Character System
- Class System
- Mastery System
- Legacy Trait System
- Relic System
- Relationship System

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

---

## world/

世界與內容設計：

- 世界設定
- 遺產歷史
- Region 設計
- 未來擴充方向

---

## development/

開發規劃：

- 文件架構
- Prototype Roadmap
- Demo Modules
- GDD Review

---

# Development Progress

目前完成：

- ✅ Phase 1：Character / Relationship / Expedition / Report
- ✅ Phase 2：Combat Framework
- ✅ Phase 3：World Setting
- ✅ Phase 4：Development Documentation
- ✅ Phase 5：GDD Review

---

# TODO

## Phase 6：Prototype Development

尚未開始。

目標：將 GDD 系統轉換為可驗證的小型 Prototype，而非直接製作完整遊戲。

### Prototype 1：Class Tree Viewer

驗證：

- Tier 職業架構
- Mastery 轉職流程
- Hidden Class 條件
- Legacy Trait

### Prototype 2：Relic Collection Viewer

驗證：

- 遺產收藏館
- Relic 狀態
- 修復與激活流程

### Prototype 3：Timeline Simulator

驗證：

- Hidden Agility
- 行動順序計算
- 戰鬥流程

### Prototype 4：Battle Grid Editor

驗證：

- Grid 地圖
- 地形效果
- 移動成本
- 戰棋規則

---

# Future Expansion Direction

未來可透過更新增加：

- 新 Tier 3 Hidden Class
- 新 Relic
- 新 Region
- 新 Event
- 新 Boss
- 特殊系統（例如墓地、復活、特殊轉職）

---

# Project Status

目前定位：

> 建立《遺產收集者》的遊戲設計資料庫與 Prototype 開發基礎。

下一階段將從文件規格進入系統驗證與原型製作。