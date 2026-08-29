# 角色肖像資產規格（Portrait Asset Spec）

## 用途

角色肖像會共用於多個 UI 場景，不只限於戰場棋盤：

- 戰場單位 Portrait Slot。
- UNIT HUD。
- 劇情對話，人名旁的小型角色肖像。
- 未來其他需要辨識角色或敵方職業的 UI。

同一角色／敵方職業原則上共用同一套肖像資產，由 CSS 依使用場景縮放，不為每個 UI 重畫一張。

## 正式資產策略

角色肖像採兩層資產：

- **PNG = Source Asset**：保存無損母檔，用於後續重新輸出、裁切或轉換格式。
- **WebP = Runtime Asset**：網站與遊戲實際載入，用於降低 GitHub Pages 與瀏覽器下載量。

不以 512 px PNG 母檔直接作為正式 Runtime 圖片。PNG Runtime 僅屬目前既有資產尚未完成 WebP 轉換前的過渡狀態。

## 尺寸與格式

### Source Asset（正式母檔）

- 尺寸：512 × 512 px。
- 比例：1:1 正方形。
- 格式：PNG。
- 壓縮：無損。
- 背景：透明。
- 色彩空間：sRGB。
- 圖片本身不包含文字、邊框、底色、HP Bar 或 UI 裝飾。

512 px 用來保留足夠的再輸出空間；目前戰場與劇情對話的實際顯示尺寸都遠小於 512 px，因此沒有必要使用 1024 × 1024 作為一般角色肖像母檔。

### Runtime Asset（正式網站載入格式）

- 尺寸：256 × 256 px。
- 格式：**WebP**。
- 背景：透明。
- 色彩空間：sRGB。
- 建議 WebP 品質：約 80–85。
- Runtime Asset 應由 512 px PNG Source Asset 輸出，不直接覆蓋母檔。

目前戰場顯示約 70–84 px，劇情對話與 UNIT HUD 預期也主要落在約 48–150 px；256 px WebP 足以支援一般 Retina 顯示，同時有效降低瀏覽器下載量。

若未來出現大於約 200 px 的正式角色展示需求，應重新由 512 px PNG Source Asset 輸出較大 Runtime 版本，不從 256 px WebP 放大。

## 構圖安全區

- 主體建議高度：約畫布 80–88%。
- 四周保留約 6–10% 透明安全區。
- 人物／敵人主體置中或依視覺重心微調。
- 頭髮、帽子、角、武器尖端、肩甲等重要輪廓不要直接碰到畫布邊緣。
- CSS 使用 `object-fit: contain`，避免因不同 UI 比例裁切角色。

## 視覺方向

### 玩家角色

玩家四名主角使用固定人物肖像，不隨目前職業或轉職改變。

因肖像也會用於劇情對話，正式圖像應偏向「角色頭像／胸像」而非純戰場 icon；需要保留足夠的臉部、髮型與角色辨識特徵。

### 一般敵人

一般敵人依敵方職業共用肖像，不為每一隻同職業敵人建立不同圖像。

可比主角更簡化，但應從輪廓就能辨識職能，例如：

- 獵兵：遠程武器／輕裝輪廓。
- 劍兵：近戰劍士輪廓。
- 術士：法術／法杖／施法者輪廓。
- 重衛：厚重護甲／盾牌輪廓。

## 檔案路徑與命名

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

512 × 512 PNG Source Asset 應保留同一 basename，例如 `cangyue.png`，但應放在明確的 Source Asset 製作位置，不與 Runtime WebP 混淆或互相覆蓋。

### 敵方 Runtime Asset

正式 Runtime 依敵方職業名稱讀取：

```text
assets/units/enemies/
  獵兵.webp
  劍兵.webp
  術士.webp
  重衛.webp
```

同一職業的所有一般敵人共用同一張肖像。

未來新增 Tier 2、Tier 3 一般敵人時沿用相同規則：職業顯示名稱作為 basename，正式 Runtime extension 使用 `.webp`。

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

## 建議工作流程

1. 製作／保存 512 × 512 transparent PNG Source Asset。
2. Source Asset 永久保留，不直接作為正式網站 Runtime 圖片。
3. 由 Source Asset 輸出 256 × 256 transparent WebP，品質約 80–85。
4. 將 WebP 放入正式 `assets/units/...` Runtime 路徑。
5. 戰場、UNIT HUD、劇情對話共用該 WebP Runtime Asset。
6. 若未來有較大尺寸角色展示需求，再由 512 px Source Asset 重新輸出，不從 256 px WebP 放大。

## 目前 Repo 過渡狀態

截至目前，既有 Combat Demo 仍有 PNG 肖像資產與 `.png` Portrait Loader 路徑，因此在 WebP 檔案尚未實際建立前，不直接切換共用 Runtime extension，以免 Demo 0／Demo 1 肖像失效。

正式遷移方式為：

1. 先建立完整的 256 × 256 WebP Runtime Asset。
2. 確認玩家與目前所有敵方職業 WebP 都存在。
3. 一次性修改共用 `CombatApp` Portrait Loader，由 `.png` 切換為 `.webp`。
4. 不在 Demo 0、Demo 1 或其他個別 Demo 中建立格式特例。
5. 驗證戰場、UNIT HUD 與後續劇情對話都讀取同一套 Runtime Asset。

## 目前狀態

本文件已將 **PNG Source / WebP Runtime** 定為正式肖像資產策略。現有 PNG Runtime 僅為遷移前過渡；WebP 資產完成後，應依上述流程統一切換共用 Portrait Loader。