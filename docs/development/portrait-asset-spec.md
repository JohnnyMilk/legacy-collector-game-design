# 角色肖像資產規格（Portrait Asset Spec）

## 用途

角色肖像會共用於多個 UI 場景，不只限於戰場棋盤：

- 戰場單位 Portrait Slot。
- UNIT HUD。
- 劇情對話，人名旁的小型角色肖像。
- 未來其他需要辨識角色或敵方職業的 UI。

同一角色／敵方職業原則上共用同一套肖像資產，由 CSS 依使用場景縮放，不為每個 UI 重畫一張。

## 正式資產策略

角色肖像採三階段資產流程：

1. **Generation Original**：繪圖模型輸出的原始圖，保留足夠解析度供後續去背、修邊與縮圖。
2. **PNG Source Asset**：整理後的正式無損母檔，用於後續重新輸出、裁切或轉換格式。
3. **WebP Runtime Asset**：網站與遊戲實際載入，用於降低 GitHub Pages 與瀏覽器下載量。

正式原則：

- Generation Original 不直接作為遊戲 Runtime。
- PNG Source Asset 不直接作為正式 Runtime。
- WebP 為正式遊戲載入格式。
- 所有階段都必須保留真正透明背景，不接受將棋盤格圖樣直接烘焙進圖片。

## 尺寸與格式

### Generation Original（繪圖原始圖）

為避免後續轉檔、去背、修邊與縮圖時缺乏解析度，繪圖時統一要求：

- 尺寸：**1024 × 1024 px**。
- 比例：1:1 正方形。
- 建議格式：PNG。
- 色彩空間：sRGB。
- 背景：**真正透明背景**。
- 必須具有：**Alpha Channel（RGBA）**。
- Alpha Channel 必須實際存在；不可用白灰棋盤格模擬透明。
- 主體完整保留，不裁切頭髮、帽子、武器尖端、肩甲等重要輪廓。
- 圖片本身不得包含文字、邊框、底色、HP Bar、UI、光框或背景場景。

1024 px 是繪圖與後製階段使用，不代表網站 Runtime 會直接載入 1024 px 圖片。

### Source Asset（正式母檔）

Generation Original 完成去背與必要修邊後，整理為：

- 尺寸：**512 × 512 px**。
- 比例：1:1 正方形。
- 格式：PNG。
- 壓縮：無損。
- 色彩空間：sRGB。
- 背景：透明。
- Channels：RGBA，必須保留 Alpha Channel。
- 圖片本身不包含文字、邊框、底色、HP Bar 或 UI 裝飾。

### Runtime Asset（正式網站載入格式）

- 尺寸：**256 × 256 px**。
- 格式：**WebP**。
- 背景：透明。
- 必須保留透明 Alpha。
- 色彩空間：sRGB。
- 建議 WebP 品質：約 80–85。
- Runtime Asset 應由 512 px PNG Source Asset 輸出，不直接從已壓縮 Runtime 圖再次轉檔。

目前戰場顯示約 70–84 px，劇情對話與 UNIT HUD 預期也主要落在約 48–150 px；256 px WebP 足以支援一般 Retina 顯示，同時有效降低瀏覽器下載量。

若未來出現大於約 200 px 的正式角色展示需求，應重新由 512 px PNG Source Asset 或 1024 px Generation Original 輸出較大 Runtime 版本，不從 256 px WebP 放大。

## 構圖安全區

- 主體建議高度：約畫布 80–88%。
- 四周保留約 6–10% 透明安全區。
- 人物／敵人主體置中或依視覺重心微調。
- 頭髮、帽子、角、武器尖端、肩甲等重要輪廓不要直接碰到畫布邊緣。
- CSS 使用 `object-fit: contain`，避免因不同 UI 比例裁切角色。

## 統一視覺方向

### 整體畫風

整體風格參考《Reigns: Her Majesty》那種極簡、簡約、扁平化的人物表現，但不得直接複製既有角色。

正式視覺關鍵字：

- 原創角色肖像。
- 極簡卡牌人物插畫。
- 扁平化人物設計。
- 剪紙感／圖像化設計感。
- 線條簡潔。
- 細節克制。
- 輪廓鮮明。
- 少量配色。
- 乾淨色塊。
- 小尺寸仍具高辨識度。

**不得使用「中世紀」作為共用風格描述。** 此字樣先前屬誤植，後續玩家、敵方、Boss 肖像提示詞均不應自動加入。

### 玩家角色

玩家四名主角使用固定人物肖像，不隨目前職業或轉職改變。

因肖像也會用於劇情對話，正式圖像應偏向「角色頭像／胸像」而非純戰場 icon；需要保留足夠的臉部、髮型與角色辨識特徵。

### 一般敵人

一般敵人依敵方職業共用肖像，不為每一隻同職業敵人建立不同圖像。

可比主角更簡化，但應從輪廓就能辨識職能，例如：

- 荒路獵手：遠程武器／輕裝輪廓。
- 斷刃兵：近戰劍士輪廓。
- 灰燼術士：法術／法杖／施法者輪廓。
- 石鎧衛：厚重護甲／盾牌輪廓。

Tier 2、Tier 3 與 Boss 日後仍沿用同一組共用視覺規格，再依各單位設定補充角色特徵。

## 共用繪圖提示詞

下列提示詞作為日後繪製玩家角色、敵方單位與 Boss 的共用基底。使用時只需在後方追加該角色／兵種的專屬外觀、服裝、武器、氣質與配色描述。

```text
請繪製一張原創角色肖像，用於網頁戰棋遊戲的戰場圖示、UNIT HUD 與劇情對話頭像。

風格要求：
整體風格參考《Reigns: Her Majesty》那種極簡、簡約、扁平化的人物表現，但不要直接複製任何既有角色；請做成原創角色肖像。畫風偏向極簡卡牌人物插畫、帶有剪紙感與圖像化設計感。線條簡潔，細節克制，輪廓鮮明，辨識度高，配色數量少，色塊乾淨，略帶裝飾性但不要複雜。

構圖要求：
1:1 正方形，角色置中，半身或胸像構圖，主體約佔畫面 80–88%，四周保留約 6–10% 安全邊界。角色的頭髮、帽子、角、武器尖端、肩甲等重要輪廓不可碰到或超出畫布邊緣。角色縮小後仍必須容易辨識。

輸出技術規格：
請輸出 1024 × 1024 px 圖片，sRGB，PNG 優先。背景必須是真正透明背景，圖片必須具有實際 Alpha Channel（RGBA）；不要畫出白灰棋盤格，不要用棋盤格假裝透明背景。透明區域必須可以直接用於後續 PNG / WebP 轉檔與縮圖。

禁止元素：
不要加文字、邊框、UI、血條、底色、背景場景、複雜光效、裝飾框、Logo、水印或複雜透視。不要使用照片寫實風格、3D 渲染感或過度繁複的服裝細節。

視覺優先順序：
優先確保角色外輪廓清楚、臉部與髮型容易辨識、職能特徵明確、小尺寸可讀性高。整體應適合作為遊戲 UI 共用肖像。
```

## 敵方單位提示詞追加模板

日後繪製一般敵方單位時，先貼上「共用繪圖提示詞」，再追加以下格式：

```text
角色類型：一般敵方單位。
職業／兵種：[填入名稱，例如：荒路獵手、斷刃兵、灰燼術士、石鎧衛]
Tier：[Tier 1 / Tier 2 / Tier 3]

角色定位：
[描述這個兵種的戰鬥功能，例如遠程壓制、近戰輸出、魔法攻擊、防禦坦克。]

外觀設定：
[描述性別或不指定性別、體格、髮型／頭盔、服裝、護甲、武器、標誌性輪廓。]

氣質：
[例如冷靜、兇悍、沉重、神秘、敏捷、紀律。]

配色：
[指定 3–5 個低至中飽和主色與少量點綴色。]

辨識要求：
請讓這個兵種即使縮小至約 64–80 px，仍可透過輪廓、武器或服裝特徵快速辨識。一般敵人可以比主角更簡化，但不要失去職業辨識度。
```

## 建議負面提示詞

若使用的繪圖工具支援 Negative Prompt，可使用：

```text
寫實照片、photorealistic、3D render、複雜背景、場景背景、滿版裝飾、過多細節、過度陰影、霓虹光效、文字、水印、logo、UI、血條、邊框、多人、全身遠景、人物太小、裁切頭部、裁切重要輪廓、模糊、低解析度、白灰棋盤格背景、fake transparency、checkerboard background
```

## 透明背景驗收規則

所有新生成肖像在進入轉檔流程前，都必須先確認透明背景是否真實存在。

驗收條件：

- PNG 應具有 4 Channels：RGBA。
- Alpha Channel 不可全部為 255（完全不透明）。
- 圖片背景區域應有 Alpha = 0 或有效透明值。
- 若看見白灰棋盤格，必須確認那是編輯器的透明預覽，而不是圖片實際像素。
- 若棋盤格已經烘焙進 RGB 像素，必須先完成去背後才能產生正式 Source / Runtime Asset。
- 去背後需檢查髮絲、武器、肩甲、披風、圓環等細節是否留下白邊或灰邊。

## 檔案路徑與命名

### 原始繪圖檔

若人工保存 Generation Original，檔名前綴使用 `O-`：

```text
O-cangyue.png
O-longyue.png
O-astrea.png
O-seilorn.png
```

`O-` 僅代表 Original，不作為 Runtime basename。

### 玩家 Runtime Asset

正式 Runtime basename 固定使用角色 ID：

```text
assets/units/players/
  cangyue.webp
  longyue.webp
  astrea.webp
  seilorn.webp
```

對應角色：

- `cangyue.webp`：蒼岳
- `longyue.webp`：朧月
- `astrea.webp`：阿斯特蕾雅
- `seilorn.webp`：賽洛恩

512 × 512 PNG Source Asset 保留同一 basename，建議放置：

```text
assets/units/players/source/
  cangyue.png
  longyue.png
  astrea.png
  seilorn.png
```

### 敵方 Runtime Asset

正式 Runtime 依敵方職業名稱讀取：

```text
assets/units/enemies/
  荒路獵手.webp
  斷刃兵.webp
  灰燼術士.webp
  石鎧衛.webp
```

同一職業的所有一般敵人共用同一張肖像。

未來新增 Tier 2、Tier 3 一般敵人時沿用相同規則：職業顯示名稱作為 basename，正式 Runtime extension 使用 `.webp`。

敵方 PNG Source Asset 建議放置：

```text
assets/units/enemies/source/
```

## Runtime 顯示規則

- 正式 Runtime 優先載入 WebP。
- 圖片載入失敗時使用文字 glyph fallback。
- 戰場 Portrait Slot 保持正方形。
- `object-fit: contain`。
- 玩家肖像依固定 protagonist ID 載入，不依目前職業載入。
- 敵人肖像依敵方職業載入。
- 戰場格只顯示肖像 + HP Bar，不直接顯示姓名與職業文字。
- 邊框、背景、HP Bar、目前行動提示等全部由 HTML/CSS Runtime 繪製，不做進圖片。
- 戰場、UNIT HUD、劇情對話共用同一份 256 × 256 WebP Runtime Asset。

## 正式製作工作流程

1. 依「共用繪圖提示詞」生成 1024 × 1024 PNG Original。
2. 驗證圖片具有真正 Alpha Channel；若為假棋盤格背景，先去背。
3. 檢查角色輪廓、透明邊緣與構圖安全區。
4. 由 Original 產生 512 × 512 transparent PNG Source Asset。
5. Source Asset 永久保留，不直接作為正式網站 Runtime 圖片。
6. 由 512 px Source Asset 輸出 256 × 256 transparent WebP，品質約 80–85。
7. 將 WebP 放入正式 `assets/units/...` Runtime 路徑。
8. 戰場、UNIT HUD、劇情對話共用該 WebP Runtime Asset。
9. 若未來有較大尺寸角色展示需求，再由 512 px Source Asset 或 1024 px Original 重新輸出，不從 256 px WebP 放大。

## 目前 Repo 過渡狀態

現階段 Combat Runtime 是否正式切換為 WebP，必須以對應 WebP 實際存在於 repo 為前提。

正式遷移方式為：

1. 先建立完整的 256 × 256 WebP Runtime Asset。
2. 確認玩家與目前所有需要顯示的敵方職業 WebP 都存在。
3. 一次性修改共用 `CombatApp` Portrait Loader，由舊格式切換為 `.webp`。
4. 不在 Demo 0、Demo 1 或其他個別 Demo 中建立格式特例。
5. 驗證戰場、UNIT HUD 與後續劇情對話都讀取同一套 Runtime Asset。

## 目前狀態

本文件為角色肖像的正式製作與輸出規格。後續玩家角色、一般敵人、Tier 2／Tier 3 敵人與 Boss 肖像皆應從此規格開始，除非個別角色另有明確例外。