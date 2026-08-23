# GDD Review

## Purpose

此文件用於整理《遺產收集者》目前 GDD 的一致性基準。

## Design Consistency Check

### Core Rules

- 四名固定主角，無角色等級與自由配點。
- Tier 0「村民」只存在於最初序章／教學。
- 每次正式 Run 預設以戰士、斥候、法師、牧師各一名開場，但玩家可改選任何已解鎖職業。
- 一般職業可多人重複；同一最終特殊職業不可在隊伍中重複。
- 每名主角在遠征準備時選擇一件飾品遺產。
- Class Mastery 為四名主角共用、以職業為單位、跨 Run 永久保留；角色死亡不回滾進度。
- Checklist 達標時立即更新 `Mastery X / Y`；全部項目達標後於戰鬥結束正式判定 MASTERED。
- Tier 1 / Tier 2 固定 6 項 Mastery：3 項共通 + 3 項職業專屬。
- Tier 3 不使用共通 Mastery 模板，完全依職業特色設計，項目數不固定。
- 「職業戰績檔案」為每個已揭露職業跨 Run 永久累積的長期戰鬥統計，Mastery 直接以這些統計作門檻判定。
- 職業戰績數值可以超過 Mastery 門檻並持續累積；Mastery 完成不停止底層計數。
- 「本次遠征紀錄」只記錄單一 Run 的統計增量，Run 結束後整理為遠征報告。
- 遠征稱號主要從本次 Run 的突出行為與組合發想，不直接使用跨 Run 長期總量。
- 尚未揭露的隱藏職業不出現在玩家可查看的職業戰績檔案中。
- 職業特性只是定位說明，不是技能。
- 每個正式職業自身提供 1 主動技能 + 1 被動技能。
- Tier 2 完整繼承正式連線 Tier 1 的技能；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與其祖先技能；同一來源技能不重複。
- Legacy Trait／弱化被動繼承已取消並移入舊版草稿。
- Tier 3 全部為隱藏職業，完成所有 Inspiration Links 對應 Tier 2 Mastery 後解鎖。
- Inspiration Links 不是可逆轉職路徑，UI 必須與一般轉職線區分。
- Relationship／親密度系統已取消。
- 四個最終特殊職業分別代表四大職業系，獨立於 Tier 0～3 同心圓之外，不是 Tier 4。
- 最終特殊職業需同時完成該系要求的全部 Tier 3 Mastery，並取得對應特殊遺產。
- 戰鬥後不直接轉職；每個 Region 固定只有 1 個轉職點，原則上位於路程中段。
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
Combat Event
    ├─→ Current Expedition Record（本 Run）
    └─→ Class Combat Archive（跨 Run）
                ↓
          Mastery Thresholds
                ↓
        Battle-end MASTERED Check
                ↓
      Tier 3 Inspiration / Unlock
                ↓
Region Midpoint Transition Point
                ↓
Inherited Skill Build
                ↓
Expedition Report / Title
```

## Source of Truth

正式規格優先以拆分後系統文件為準，尤其是：

- `docs/systems/class-system.md`
- `docs/systems/skill-system.md`
- `docs/systems/mastery-system.md`
- `docs/systems/report-system.md`
- `docs/systems/character-system.md`
- `docs/systems/expedition-system.md`
- `docs/overview/gameplay-loop.md`

索引中標記為「舊版草稿」或「已取消」的文件只保留歷史參考，不可覆蓋現行規格。

## Pending Design TODO

- Tier 2 職業技能與 Mastery
- Tier 3 完全職業專屬 Mastery
- 完整 Tier 3 職業列表與 Inspiration Links
- 四個最終特殊職業正式名稱、技能與繼承方式
- 特殊遺產清單
- 職業戰績檔案完整統計欄位與 UI
- 本次遠征紀錄完整事件欄位
- 遠征稱號規則
- Region 主題與轉職點實際地圖配置
- Tier 3 多技能操作負擔 Prototype
- 敵人 AI 與數值平衡

## Prototype Candidates

1. Class Tree Viewer
2. Mastery Checklist Viewer
3. Mastery Flow Demo
4. Skill Inheritance Viewer
5. Relic Collection Viewer
6. Timeline Simulator
7. Battle Grid Editor
8. Expedition Map / Transition Point Editor
9. Report / Class Combat Archive Viewer

## Review Status

現行核心規格已統一為：「戰鬥事件同時更新本次遠征紀錄與職業戰績檔案 → Mastery 門檻即時完成 → 戰後判定 MASTERED → 轉職與解鎖沿既定規則進行 → Run 結束由本次遠征紀錄生成遠征報告與稱號」。
