# 角色檔案頁模板（Character Dossier Template）

> **模板狀態：呈現方向已確認**
>
> 本文件定義未來角色專屬頁面的資訊架構與呈現方式。示範頁中的朧月技能與 TOW 式數值只用於展示版面，不代表《LEGACY COLLECTOR》現行角色或 Combat Rule 已變更。

## 目的

每個角色擁有一個單一專屬頁面：

1. 上半部是可直接閱讀的數位角色卡，整合插圖、角色定位、屬性與技能。
2. 下半部是角色背景、故事時間軸、解鎖內容與玩家累積的戰鬥履歷。

角色頁應同時服務玩家閱讀、企劃檢查、戰鬥資料驗證與長期角色紀錄。

## 已確認的頁面結構

### 上半部：戰鬥檔案

- 角色插圖。
- 角色名稱、職業、階級與一句話玩法。
- 戰場定位。
- TOW 啟發的九大屬性：M、WS、BS、S、T、W、I、A、Ld。
- Armour Save、Ward Save、Wizard Level 與威脅距離。
- Tags。
- 優勢對局與反制方式。
- 普通攻擊與技能卡。
- 每個技能顯示 Range、Attacks、命中來源、S、AP、Damage、冷卻及特殊規則。

### 下半部：角色歷程

- 角色代表語句。
- 背景故事。
- 出身、信念與象徵。
- 劇情時間軸。
- Mastery／覺醒／關鍵事件。
- 已解鎖與未解鎖故事。
- 玩家實際累積的出擊、擊倒、Boss 戰與特殊倖存紀錄。

## 資料原則

正式製作時，不應為每個角色手動維護一套互不相干的數字。

建議架構：

```text
共用 Character Dossier Template
＋
角色 JSON
＋
角色插圖
＋
玩家歷程資料
```

角色 JSON 同時作為：

- 戰鬥引擎的角色 Profile。
- 頁面顯示資料。
- 技能卡資料。
- AI 判斷輸入。
- Combat Log 說明來源。

這能避免角色頁、企劃表與實際戰鬥數值不一致。

## 建議資料結構

```js
{
  "id": "longyue",
  "name": "朧月",
  "className": "月影決鬥士",
  "rank": "hero",
  "role": "側翼刺殺",
  "gameplayPromise": "以高移動與高 WS 切入側翼，瓦解重甲目標。",
  "portrait": "../assets/units/players/longyue.webp",
  "stats": {
    "M": 6,
    "WS": 6,
    "BS": 3,
    "S": 3,
    "T": 3,
    "W": 4,
    "I": 7,
    "A": 2,
    "Ld": 7
  },
  "defence": {
    "armourSave": "5+",
    "wardSave": "6+",
    "wizardLevel": 0
  },
  "matchups": {
    "strengths": [],
    "counterplay": []
  },
  "skills": [],
  "story": {
    "quote": "",
    "biography": [],
    "origin": "",
    "belief": "",
    "symbol": "",
    "timeline": [],
    "records": []
  }
}
```

## 響應式原則

### 桌面版

- 插圖與角色 Profile 左右排列。
- 九大屬性保持單列或緊湊網格。
- 技能卡採雙欄。
- 故事區使用語錄、傳記與時間軸建立層次。

### 手機版

- 插圖、名稱、屬性、技能、故事依序改為單欄。
- 九大屬性改為三欄網格。
- 技能參數可換行，不依賴 Hover。
- 導覽提供戰鬥檔案、技能與角色歷程錨點。

## 狀態區分

### 已確認

- 單一角色專屬頁。
- 上方戰鬥資料、下方角色歷程。
- 戰鬥 Profile 與技能 Profile 同頁呈現。
- 支援固定故事與玩家累積紀錄。
- 桌機與手機響應式排版。
- 未解鎖故事可只顯示輪廓。

### 尚未確認

- 正式遊戲是否採用 TOW 式九大屬性。
- 正式角色頁的最終色彩與字體。
- 每名角色的正式技能與數值。
- 玩家戰績保存方式。
- 角色頁是否直接整合進正式遊戲 UI。

## 完整示範

- HTML：`development/character-dossier-template.html`
- 示範角色：朧月
- 圖片已內嵌於 HTML，單獨下載後仍可開啟。
- 所有範例數值與技能均為版面展示資料。
