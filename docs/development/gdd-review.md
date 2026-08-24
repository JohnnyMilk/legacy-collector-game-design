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
- Mastery 任務描述中的「同一場戰鬥」是事件判定範圍，不會自動把計數單位改成「場」；若任務單位為「次」，每次完整符合條件的事件即累積 1 次，未完成序列不跨戰鬥延續。
- 每名存活角色每輪最多取得 1 次自身行動。一般行動由「移動」與「行動（普通攻擊或主動技能）」構成，可移動→行動或行動→移動。
- 僅移動等同移動後等待並結束自身行動；僅行動等同行動後等待並結束自身行動；一般移動不可拆成行動前後兩段。
- 個別技能可以明確授予攻擊後移動、技能中段移動或其他額外位移；這些屬技能效果，不受一般移動不可拆分的限制。目前案例包括遊俠「穿越射擊」與舞刃者「旋舞連斬」。
- 「職業戰績檔案」為每個已揭露職業跨 Run 永久累積的長期戰鬥統計，Mastery 直接以這些統計作門檻判定。
- 職業戰績數值可以超過 Mastery 門檻並持續累積；Mastery 完成不停止底層計數。
- 「本次遠征紀錄」只記錄單一 Run 的統計增量，Run 結束後整理為遠征報告。
- 遠征稱號主要從本次 Run 的突出行為與組合發想，不直接使用跨 Run 長期總量。
- 尚未揭露的隱藏職業不出現在玩家可查看的職業戰績檔案中。
- 職業特性只是定位說明，不是技能。
- 每個正式職業自身提供 1 主動技能 + 1 被動技能。
- Tier 1 自身主動技能統一為 9 Charge；Tier 2 自身主動技能統一為 6 Charge；Tier 3 與最終特殊職業另行定義。
- Tier 2 完整繼承正式連線 Tier 1 的技能；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與其祖先技能；同一來源技能不重複。
- 角色移動固定四方向；技能是否能使用斜向格由個別技能定義，不因某一技能支援 8 方向而全域開放。
- 相同暫時狀態不疊加；不同狀態可同時存在並各自結算。一般暫時狀態戰鬥結束後清除。
- 一般時間型狀態若沒有另行指定解除條件，預設持續至效果來源角色下一次自身行動開始時；個別技能可用事件型解除條件覆寫。
- 傷害除物理／魔法外，另區分直接傷害與轉移傷害；轉移傷害保留原傷害類型，但可在被動與減傷判定上視為不同來源。
- 戰士「堅守」只由敵人直接造成的傷害觸發：第一筆直接傷害不減傷；之後直到戰士下一次自身行動開始前，敵人直接造成的後續傷害 -30%。轉移傷害不觸發也不套用堅守。
- 斥候「游擊」正式閃避加成為 20%，持續至斥候下一次自身行動開始。
- 牧師「治癒」可指定自身；自身 HP 低於 50% 時，自我治療同樣可觸發「恩典」的 +30% 治療量。
- 騎士「守護」替友方承受的傷害屬於轉移傷害，不視為敵人直接對騎士造成的傷害，因此不觸發也不享受繼承自戰士的「堅守」。
- 魔劍士職業玩法 Mastery 為「在同一場戰鬥中，先造成物理傷害，再造成魔法傷害」12 次；每完成 1 次完整「物理 → 魔法」順序後序列立即歸零，必須再次由物理傷害起始新的序列；未完成序列不跨戰鬥。
- 巫師「魔力刻印」固定為先依命中前刻印層數完成傷害，再增加刻印；範圍魔法同時命中多名敵人時，每名受傷敵人都在自己的傷害結算後各自增加 1 層刻印。
- 咒術師「衰咒」採施術者週期：以魔法傷害命中後，使敵人物理與魔法傷害 -30%，持續至該咒術師下一次自身行動開始時。
- 咒術師「束縛咒」維持特殊規則：限制目標下一次自身行動的移動，該次行動完成後解除。
- 吟遊詩人「戰歌」的 +20% 傷害套用於被強化角色下一次自身行動中的所有傷害階段，整個行動完成後才解除。
- 支援系 Tier 2 為神官 150°、吟遊詩人 180°、煉金術士 210°，三者都正式連線牧師並繼承「恩典」與「治癒」。
- 原 210°「守護者」已取消並由「煉金術士」完整取代；現行內部 ID 為 `tier2_alchemist`，不得再使用 `tier2_guardian`。
- 煉金術士一般攻擊為 2 格物理遠距「投擲瓶」。
- 煉金術士被動「再調製」：若本次使用的主動技能與上一次相同，該次技能的數值效果提高 30%；切換其他主動技能後重新判定。
- 煉金術士「藥劑投擲」為 6 Charge、最多 3 格起始投擲、支援 8 方向，命中格後沿同方向延伸 2 格，共影響連續 3 格；不留下地面持續區域。
- 「藥劑投擲」每次施放從衰弱、腐蝕、遲緩三種異常中隨機抽取 1 種，整次 3 格噴濺使用同一異常；基礎效果分別為傷害 -20%、DEF/MDEF -20%、AGI -20%。
- 煉金術士的衰弱、腐蝕、遲緩皆持續至施放該次「藥劑投擲」的煉金術士下一次自身行動開始時。
- 「再調製」強化「藥劑投擲」時，20% 基礎異常幅度提高 30%，即變為 26%，不等同額外加 30 個百分點。
- 煉金術士 Tier 2 Mastery 專屬 3 項已定案：單場讓 3 名不同敵人受到藥劑異常 8 場；觸發「再調製」20 次；單次「藥劑投擲」同時讓至少 2 名敵人獲得異常 10 次。
- 煉金術士目前所有必要技能、Mastery 與異常持續規則均已定案，狀態為 `CONFIRMED`。
- Tier 1 與目前全部 Tier 2 職業已完成全職業一致性審核；現有職業資料均為 `CONFIRMED`，未發現仍會阻斷合法玩法或 Mastery 完成的硬性衝突。
- Legacy Trait／弱化被動繼承已取消並移入舊版草稿，也不再是狀態系統例外。
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
- `docs/systems/action-system.md`
- `docs/systems/battlefield-system.md`
- `docs/systems/status-system.md`
- `docs/systems/damage-system.md`
- `docs/systems/report-system.md`
- `docs/systems/character-system.md`
- `docs/systems/expedition-system.md`
- `docs/overview/gameplay-loop.md`

索引中標記為「舊版草稿」或「已取消」的文件只保留歷史參考，不可覆蓋現行規格。

## Pending Design TODO

- Tier 3 完全職業專屬 Mastery
- 完整 Tier 3 職業列表與 Inspiration Links
- Tier 3 Charge 規則
- 四個最終特殊職業正式名稱、技能、Charge 與繼承方式
- 特殊遺產清單
- 職業戰績檔案完整統計欄位與 UI
- 本次遠征紀錄完整事件欄位
- 遠征稱號規則
- Region 主題與轉職點實際地圖配置
- Tier 3 多技能操作負擔 Prototype
- 敵人 AI 與數值平衡
- 直接傷害／轉移傷害與未來反射、分攤傷害的完整通用結算順序
- 額外行動／插入行動規則（若未來正式加入）

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

Tier 1 與目前 Tier 2 已完成全職業一致性審核；現行技能、Mastery、狀態持續時間、直接／轉移傷害與一般行動經濟已對齊。後續若沒有重新修改 Tier 1 / Tier 2 內容，可把這一層視為進入 Tier 3 設計前的穩定基準。
