# GDD Review

## Purpose

此文件用於整理《遺產收集者》完成初版 GDD 拆解後的檢查項目。

## Design Consistency Check

### Core Rules

- 四名固定主角
- 無角色等級系統
- Class Mastery 作為職業成長核心
- Tier 3 全部為隱藏職業
- Relationship 跨 Run 保存
- Relic 作為長期 Meta Progression 核心
- Party Wipe 作為遠征失敗條件

## System Dependency

```
Character
    ↓
Class
    ↓
Mastery
    ↓
Legacy Trait
    ↓
Relic / Relationship
    ↓
Expedition
    ↓
Combat
    ↓
Report
```

## Pending Design TODO

### Content

- 具體職業樹
- Tier 1 / Tier 2 職業列表
- Tier 3 Hidden Class 條件
- 遺產清單
- Region 主題
- Boss 設計

### System Detail

- 敵人 AI 評估模型
- Prototype 第一階段實作順序
- 數值平衡公式

## Prototype Candidates

優先驗證：

1. Class Tree Viewer
2. Relic Collection Viewer
3. Timeline Simulator
4. Battle Grid Editor
5. Expedition Map Editor

## Review Status

Initial GDD structure completed. Future updates should modify specific system documents instead of adding scattered rules.
