# LEGACY COLLECTOR｜GDD Review

## Purpose

此文件是現行 GDD 的一致性基準。若舊版 Relic／遺產、收藏館、Legacy Trait 或 Relationship 文件與本頁衝突，以本頁與對應現行系統文件為準。

## Core Rules

### 遊戲與故事

- 正式名稱只使用 **LEGACY COLLECTOR**，不另設中文正式名稱。
- 四名固定主角曾分別站在戰士、敏捷、魔法、支援四大職業系的頂點，故事開始時失去記憶與力量，以 Tier 0「村民」重新開始。
- 四人可自由跨職業系使用 Tier 1～3；原始職業系只決定各自唯一的「XXX 的記憶」。
- Party Wipe 可視為本次輪迴失敗；職業 Mastery、職業解鎖與已覺醒記憶跨 Run 保留。
- 一次完整遠征維持 Region 1～4 + Final Region；擊敗 Final Boss 是 Run 的最終成功條件。
- 最後的 Legacy 不是裝備，而是一句話／一個理解：終點不是旅程唯一的價值，角色與玩家都應在追逐結果的過程中找到意義。

### 角色與 Build

- 四名固定主角，無角色等級、無自由能力配點。
- **角色沒有任何裝備欄。**
- 不存在武器、防具、飾品、Relic／遺產裝備、修復、收藏館、掉落或特殊遺產解鎖。
- 現行 Build 來源：目前職業、完整技能繼承、四人當前職業系組合、記憶形態與戰鬥決策。
- 隊伍職業組合會提供團隊被動，但具體組合與效果尚未定義，只保留獨立 Prototype 頁。

### 職業與 Mastery

- Tier 0「村民」只存在於首次序章／教學，不參與一般 Mastery。
- Tier 1 / Tier 2 使用 6 項 Mastery：3 共通 + 3 職業專屬。
- Tier 3 不使用共通 Mastery；任務只圍繞自己的 Tier 3 專屬主動與被動技能，數量不固定。
- Mastery 四名主角共享、以職業為單位、跨 Run 永久保留；角色死亡不回滾。
- Checklist 達標與 `Mastery X / Y` 即時更新；MASTERED 在戰鬥結束後正式判定。
- 每個正式一般職業自身提供 1 主動 + 1 被動；職業特性只是定位說明。
- Tier 1 自身主動 9 Charge；Tier 2 自身主動 6 Charge；Tier 3 自身主動 3 Charge。
- Tier 2 完整繼承正式連線 Tier 1 主／被動；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與祖先技能，同一來源去重。
- 一般攻擊不繼承。
- Tier 3 全部是隱藏職業；第一次解鎖前正式 UI 不顯示 Tier 3 外圈與 Inspiration Links。

### 「XXX 的記憶」

- 四個最終角色形態不是 Tier 4，也不再稱為一般 Special Class／本源職業；正式機制名稱為角色專屬 **「XXX 的記憶」**。
- 四個記憶分別綁定四名主角與戰士、敏捷、魔法、支援四個原始職業系。
- 其他角色不可使用不屬於自己的記憶。
- 首次覺醒條件：對應職業系**全部 Tier 3 Mastery**完成 + 在 Region 4 實際進入合法記憶神殿節點。
- 神殿只出現在 Region 4，且為可選分支，不是必經路線。
- 同一 Run 可以覺醒多名角色，只要各自條件與路線成立。
- 首次覺醒後永久解鎖；後續 Run 可由對應角色直接以自己的記憶開始，不需再次進神殿。
- 四名主角姓名、記憶形態正式顯示名、過去稱號、技能與數值待後續設計。

### Region / 轉職

- 每個 Region 固定只有 1 個轉職點，原則上位於路程中段。
- 戰鬥結束只處理 Mastery、解鎖與一般戰後結算，不直接轉職。
- 角色目前職業必須已 Mastered 才能正式轉出。
- 完成轉職後，新 Build 所有可用主動技能 Charge 補滿。
- Region 4 額外存在可選記憶神殿分支。

### 行動與戰鬥

- 每名存活角色每輪最多取得 1 次自身行動。
- 一般自身行動由「移動 + 行動（普通攻擊或主動技能）」組成，可移動→行動或行動→移動。
- 僅移動或僅行動都只是結束自身行動，**不等於 Wait**。
- Wait 必須明確選擇；只有真正 Wait 才觸發綁定 Wait 的被動／效果。
- 一般移動不可拆成行動前後兩段；個別技能明確授予的中段／攻擊後移動例外。
- 目前技能位移例外包含遊俠「穿越射擊」與舞刃者「旋舞連斬」。
- 9×9 戰場；角色一般移動固定四方向；技能斜向／8 方向由個別技能定義。

## Tier 3 Current State

Tier 3 外圈目前有 16 個概念節點；**軍團守衛與血煉騎士已完成正式設計**，其餘名稱與定位仍 provisional，必須依 Inspiration Links 的既有 Tier 2 技能包逐一重新設計。

### 已確認：軍團守衛

- Tier 3 / 戰士系 / -135°。
- Inspiration Links：騎士、吟遊詩人、煉金術士。
- 定位：前線戰術核心／區域封鎖／隊伍保護。
- 一般攻擊「戰槍」：前方直線 2 格物理攻擊，可同時命中兩格敵人；阻擋地形可截斷後方格。
- 被動「壁壘陣」：軍團守衛位於自己盾牆周圍 8 格內時，該盾牆周圍 8 格我方 DEF / MDEF +20%，重疊不疊加；4 牆完整可形成 5×5 防護區。
- 主動「盾牆陣」：3 Charge；在四個斜角相鄰格各嘗試生成 HP 1、不可穿越的盾牆；占位／阻擋地形格不生成。
- Mastery：單次生成 4 面盾牆 15 次；壁壘陣防護中的我方單位實際承受敵方傷害 30 次。

### 已確認：血煉騎士

- Tier 3 / 戰士系 / -112.5°。
- Inspiration Links：騎士、狂戰士、煉金術士。
- 定位：前線承傷轉化／低血爆發／生命資源運用。
- 一般攻擊「血刃」：射程 1 的物理近戰普通攻擊，沒有額外效果。
- 被動「赤血之誓」：依目前已損失的最大 HP 比例，提高同等比例的物理攻擊力；治療使 HP 回升時，加成同步下降。
- 主動「血煉分身」：3 Charge；消耗目前 HP 的 50% 生成 1 個分身。分身最大 HP 等於本次實際消耗 HP，生成時複製血煉騎士當下基礎戰鬥能力，僅能移動與使用普通攻擊，且擁有自己的「赤血之誓」。分身不繼承其他技能，同一名血煉騎士同時最多存在 1 個分身；分身死亡不影響本體。
- Mastery：赤血之誓至少提供 +50% 物理攻擊力時成功造成物理傷害 30 次；血煉分身普通攻擊成功造成傷害 30 次。

## Data / Report

- 本次遠征紀錄只保存本 Run，結束後封存為遠征報告。
- 職業戰績檔案以職業為單位跨 Run 永久累積；Mastery 只是其門檻視圖。
- Expedition Record 不再包含任何 Relic／遺產取得、裝備或修復欄位。
- 可新增隊伍職業組合變化、Region 4 神殿、記憶首次覺醒與 Final Boss 結果等事件。

## Archived / Cancelled

以下只保留歷史參考，不得視為現行規格：

- Relic／遺產裝備與收藏系統。
- Reliquary／收藏館。
- 特殊遺產解鎖最終職業。
- Relic History 作為主世界觀。
- Legacy Trait／弱化被動繼承。
- Relationship／親密度。

## Source of Truth

- `docs/overview/design-philosophy.md`
- `docs/overview/game-concept.md`
- `docs/overview/gameplay-loop.md`
- `docs/systems/character-system.md`
- `docs/systems/class-system.md`
- `docs/systems/mastery-system.md`
- `docs/systems/party-composition-system.md`
- `docs/systems/memory-awakening-system.md`
- `docs/systems/expedition-system.md`
- `docs/systems/report-system.md`
- `docs/world/narrative-core.md`
- `docs/world/world-setting.md`
- `docs/world/region-design.md`
- 戰鬥拆分系統文件

## Pending Design TODO

- 逐一完成其餘 Tier 3。
- Party Composition 組合與隊伍被動 Demo。
- 四名主角姓名、原始稱號與四個「XXX 的記憶」。
- 記憶形態技能、一般攻擊、Charge 與限制。
- Region 4 神殿生成／演出。
- Final Region、Final Boss 與最後一句 Legacy。
- 敵人 AI 與數值平衡。
