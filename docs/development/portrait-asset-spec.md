# 角色肖像資產規格（Portrait Asset Spec）

## 用途

角色肖像會共用於多個 UI 場景，不只限於戰場棋盤：

- 戰場單位 Portrait Slot。
- UNIT HUD。
- 劇情對話，人名旁的小型角色肖像。
- 未來其他需要辨識角色或敵方職業的 UI。

同一角色／敵方職業原則上共用同一套肖像資產，由 CSS 依使用場景縮放，不為每個 UI 重畫一張。

## 尺寸與格式

### Source Asset（建議保留母檔）

- 尺寸：512 × 512 px。
- 比例：1:1 正方形。
- 格式：PNG。
- 背景：透明。
- 色彩空間：sRGB。
- 圖片本身不包含文字、邊框、底色、HP Bar 或 UI 裝飾。

512 px 用來保留足夠的再輸出空間；目前戰場與劇情對話的實際顯示尺寸都遠小於 512 px，因此沒有必要使用 1024 × 1024 作為一般 Runtime 圖片。

### Runtime Asset（網站實際載入）

- 建議尺寸：256 × 256 px。
- 建議格式：WebP；若透明品質、工作流程或相容性需要，也可使用 PNG。
- 背景：透明。
- 色彩空間：sRGB。
- Runtime 應由 512 px Source Asset 輸出，不直接覆蓋母檔。

目前戰場顯示約 70–84 px，劇情對話與 UNIT HUD 預期也主要落在約 48–150 px；256 px Runtime Asset 足以支援一般 Retina 顯示，同時降低瀏覽器下載量。

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

### 玩家

目前 Combat Runtime 使用固定角色 ID：

```text
assets/units/players/
  cangyue.png
  longyue.png
  astrea.png
  seilorn.png
```

對應角色：

- `cangyue.png`：蒼岳
- `longyue.png`：朧月
- `astrea.png`：阿斯特蕾雅
- `seilorn.png`：賽洛恩

若未來導入 256 px WebP Runtime Asset，可維持相同 basename，例如：

```text
cangyue.webp
longyue.webp
astrea.webp
seilorn.webp
```

512 px PNG 母檔與 Runtime 圖應放在可清楚區分 Source / Runtime 的資料夾或製作流程中，避免直接覆蓋。

### 敵方

目前 Combat Runtime 依敵方職業名稱讀取：

```text
assets/units/enemies/
  獵兵.png
  劍兵.png
  術士.png
  重衛.png
```

同一職業的所有一般敵人共用同一張肖像。

若未來全面切換 WebP，可保留同名 basename；實際 Runtime extension 需同步調整共用 Portrait Loader，不在個別 Demo 特例處理。

## Runtime 顯示規則

- 圖片優先，載入失敗時使用文字 glyph fallback。
- 戰場 Portrait Slot 保持正方形。
- `object-fit: contain`。
- 玩家肖像依固定 protagonist ID 載入，不依目前職業載入。
- 敵人肖像依敵方職業載入。
- 戰場格只顯示肖像 + HP Bar，不直接顯示姓名與職業文字。
- 邊框、背景、HP Bar、目前行動提示等全部由 HTML/CSS Runtime 繪製，不做進圖片。

## 建議工作流程

1. 製作／保存 512 × 512 transparent PNG Source Asset。
2. 保留 Source Asset，不直接拿來大量網頁載入。
3. 輸出 256 × 256 transparent WebP 或 PNG Runtime Asset。
4. 戰場、UNIT HUD、劇情對話共用 Runtime Asset。
5. 若未來有較大尺寸角色展示需求，再由 512 px Source Asset 重新輸出，不從 256 px 放大。

## 目前狀態

本文件記錄現階段肖像資產規格與命名原則，供後續製作角色圖與劇情 UI 時直接參考。若未來 Runtime 正式全面從 PNG 切換為 WebP，應同步更新本文件與共用 Portrait Loader。