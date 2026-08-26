# LEGACY COLLECTOR

**LEGACY COLLECTOR** 是一款以 Roguelike 遠征、戰棋戰鬥、跨 Run 職業 Mastery、職業轉換與四人隊伍搭配為核心的 Tactical RPG。

## 核心主軸

四名固定主角在故事開始時失去記憶，以 Tier 0「村民」重新開始。他們過去分別代表戰士、敏捷、魔法、支援四大職業系的頂點人物；玩家在一次次輪迴與轉職中，逐步解鎖 Tier 1～3、完成 Mastery，並找回各自專屬的「XXX 的記憶」。

角色沒有等級、自由配點，也**沒有任何裝備欄**。舊版 Relic／遺產裝備、修復、收藏館與特殊遺產解鎖系統已取消；Legacy 只保留為世界觀與最終敘事意象，不再是可裝備或收集的遊戲系統。

## 現行核心設計

- 固定四名主角；無角色等級、自由配點與裝備欄。
- Tier 0「村民」只存在於首次序章／教學。
- 正式 Run 可從任何已永久解鎖且該角色合法使用的職業開始。
- Tier 1 / Tier 2 Mastery 使用共通 + 職業專屬框架；Tier 3 Mastery 只圍繞自身 Tier 3 專屬主動／被動技能。
- Tier 2 完整繼承正式連線 Tier 1 主／被動技能；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與祖先技能。
- 四名角色皆可跨職業系發展；角色原始職業系只決定他自己的最終「XXX 的記憶」。
- 每個職業系的全部 Tier 3 Mastery 完成後，可在 Region 4 的可選記憶神殿路線首次覺醒對應角色的「XXX 的記憶」。
- 記憶首次覺醒後永久解鎖；之後該角色可直接以自己的記憶形態開始新 Run。
- 同一 Run 可以覺醒多名角色記憶。
- 隊伍構築深度改由目前職業、技能繼承與四人當前職業系組合提供；隊伍組合被動的具體效果留待獨立 Prototype 定義。
- 一次 Run 維持 Region 1～4 + Final Region；最終目標是擊敗 Final Boss。
- Party Wipe 代表本次輪迴失敗；職業 Mastery、解鎖與已找回的記憶跨 Run 保留。

## 故事精神

最後的 Legacy 不是一件裝備，而是一句話／一個理解：**終點本身沒有過程重要。** 四名主角追逐失去的力量與身份，玩家追逐全破與 Final Boss；真正要留下的，是在抵達終點以前是否享受了這段路。

完整設定見：

- `docs/world/narrative-core.md`
- `docs/systems/memory-awakening-system.md`
- `docs/systems/party-composition-system.md`

## 現行遊戲循環

```text
序章（首次：四名村民）
→ 遠征準備／選擇已解鎖職業
→ Region 1
→ Region 2
→ Region 3
→ Region 4（可選記憶神殿路線）
→ Final Region
→ Final Boss
→ 遠征報告
→ 下一次輪迴
```

## Source of Truth

Markdown 為正式規格 Source of Truth；HTML 為閱讀與 Prototype 頁面。已取消的 Relic／收藏館等設定只保留於「舊版草稿」，不得覆蓋現行規格。

## 測試網站

https://johnnymilk.github.io/legacy-collector-game-design/
