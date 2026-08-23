# 遺產收集者｜Legacy Collector

《遺產收集者》（Legacy Collector）是一款以 **Roguelike 遠征循環 + 戰棋 SLG + 跨 Run 職業養成** 為核心的遊戲企劃。

## 測試網站

👉 [開啟《遺產收集者》GDD / Prototype 測試網站](https://johnnymilk.github.io/legacy-collector-game-design/)

## 目前核心設計

- 固定四名主角；無角色等級與自由配點。
- Tier 0「村民」只用於首次序章／教學。
- 每次正式 Run 預設戰士、斥候、法師、牧師各一名；玩家可改成任何已解鎖職業，也可四人使用同一職業。
- 每名主角在遠征開始前選擇一件飾品遺產。
- Mastery 為四名主角共用、以職業為單位、跨 Run 永久保留。
- 每個一般職業先採 6 項 Mastery Checklist：3 項共通 + 3 項職業專屬；初步目標約兩個 Run 完成。
- 職業特性只做定位說明，不是技能。
- 每個正式職業自身提供 1 個主動技能 + 1 個被動技能。
- Tier 2 完整繼承正式連線 Tier 1 技能；Tier 3 完整繼承 Inspiration Links 對應 Tier 2 與其祖先技能。
- 舊版 Legacy Trait／弱化被動繼承已取消。
- 一般 Tier 3 在所有 Inspiration Links 對應 Tier 2 都完成 Mastery 後永久解鎖。
- Inspiration Links 只是前置／繼承關聯，不是可逆轉職路徑。
- Relationship／親密度系統已取消。
- 遺產直接取得的職業稱為特殊職業，不出現在一般同心圓職業樹。
- 每個 Region 固定只有 1 個轉職點，原則上位於路程中段；戰鬥後不直接轉職。
- 不另設角色轉職次數限制；轉職頻率由每 Region 一個轉職點控制。
- 完成轉職後，新 Build 所有可用主動技能 Charge 補滿。

## 現行遊戲循環

```text
序章（僅首次：村民／教學）
→ 遠征準備
→ 選擇四名角色起始職業 + 飾品遺產
→ Region 前半段
→ 固定轉職點
→ Region 後半段
→ Boss
→ 下一 Region
→ Final Region
→ 遠征報告
→ 下一次 Run
```

## Source of Truth

Markdown 為正式規格 Source of Truth；HTML 為閱讀與 Prototype 頁面。舊版或已取消規則只保留於索引的「舊版草稿」。

## Prototype Progress

已完成確認：

- ✅ Timeline Simulator / 行動時間軸系統
- ✅ Class Tree Viewer / 同心圓職業樹

下一個主要驗證方向：

- Mastery Checklist Viewer
- Tier 1 主動／被動技能設計
- Skill Inheritance Viewer
- Expedition / Transition Point Flow

## Project Status

> 建立《遺產收集者》的遊戲設計資料庫與 Prototype 開發基礎。
