# 地圖與角色對話渲染研究專區

> 狀態：🔴 進行中 / 尚未定案

這個頁面專門用來研究《遺產收集者》的**戰場地圖視覺渲染、角色對話 UI／渲染，以及兩者最後的整合方式**。

正式研究流程拆成三個彼此獨立、最後再整合的部分：

1. **Map Rendering**：地圖、投影、場景物件、單位與戰術提示。
2. **Dialogue Rendering**：角色肖像、姓名、文字框、選項與劇情對話操作。
3. **Integrated Presentation**：確認前兩者各自穩定後，再研究地圖與角色對話如何共存於同一個遊戲畫面。

目前 Combat Demo 的地圖優先驗證戰鬥規則與操作，因此視覺仍偏功能性；角色對話也不直接綁進 Combat UI。兩個 Renderer 先各自建立清楚邊界，再進行整合。

## 目前基準

- 戰鬥邏輯尺寸：8 × 8。
- 8 × 8 是戰鬥座標與判定基準，不代表畫面最終必須是正方形俯視格。
- 地圖與對話 UI 都必須支援手機、iPad 與桌面瀏覽器。
- 單位、血條、行動提示、移動範圍、攻擊範圍與障礙物必須保持清楚可讀。
- 對話中的角色姓名、肖像、內文與選項必須在小尺寸畫面仍可清楚閱讀與操作。
- Combat Demo 0 / Demo 1 目前的正方形俯視棋盤只作為功能性基準，不視為最終美術方向。
- 現有主角半身透明肖像可繼續作為角色對話研究的第一批測試資產。

# Part A｜Map Rendering

## 核心研究：地圖形狀與投影方式

本專區不只研究「如何把正方形格子畫漂亮」，而是允許重新研究整個戰場的視覺投影方式。

候選方向包含但不限於：

- 現行 90° 正上方正方形 Grid。
- 45° 旋轉的 Diamond Grid。
- Isometric / 2.5D 類型斜視角。
- 非標準角度的斜視投影。
- 其他仍能對應 8 × 8 邏輯座標的呈現方式。

研究時必須把「邏輯格」與「畫面格」分離：戰鬥仍可使用 `(x, y)`、Manhattan Distance、移動與 LOS 等既有規則，但 Renderer 可以把同一個邏輯格投影成菱形、斜視或其他畫面形狀。

## 單位圖片與地圖投影必須一起研究

目前主角使用半身透明肖像，是因為正方形俯視棋盤的單位圖被限制在單格內。這個限制**不是正式角色美術規則**。

若改用 45° Diamond / Isometric 等方式，應測試：

- 角色圖是否可以超出所屬格子的視覺邊界。
- 半身像、3/4 身、全身 Sprite / Illustration 哪一種最適合。
- 腳底／站立點固定在邏輯格中心，但頭部、武器、披風等允許延伸到格外。
- 單位與前後方地形、障礙物之間的遮擋順序。
- 依畫面 Y 座標或格子深度進行 Z-order / depth sorting。
- 血條應跟隨角色、站立點或獨立 HUD Layer。
- 行動黃框、移動範圍與技能範圍應畫在地面層，不被角色圖片完全遮住。
- 手機小尺寸下是否仍能清楚辨認角色、格子歸屬與可操作範圍。

因此未來角色的「戰場用圖片規格」必須等地圖投影方向確認後再定案；目前既有半身肖像仍可繼續作為劇情對話與現行 Combat Demo 的測試資產。

## 地圖研究目標

### 1. 地表渲染

研究如何讓同一種地形不再像完全相同的 64 個方格，例如：

- 基礎地表色差與紋理變化
- 相鄰格視覺連續性
- 地表邊緣與區域過渡
- 非規則的小型裝飾細節
- 保留格線判讀但降低「試算表」感

### 2. 障礙物與場景物件

目前障礙物主要是戰鬥功能標記。後續研究：

- 牆、岩石、樹木、廢墟、箱體等視覺類型
- 可通行／不可通行的視覺語言
- 是否允許物件超出單格視覺邊界
- 物件與角色的前後遮擋
- 多格大型場景物件的視覺表現

### 3. 戰術提示層

地圖美術不能降低操作辨識度。需獨立研究：

- 目前行動角色提示
- 可移動格
- 攻擊／技能合法目標
- 技能預覽範圍
- 選取格
- 危險區域

這些提示應視為獨立的 **Combat Overlay Layer**，而不是直接寫死在地表美術中。

### 4. 地圖主題與 Region 差異

未來不同 Region 可以共享戰鬥規則，但使用不同的視覺資產與渲染參數。主題內容目前 TBD，不在本頁提前定案。

### 5. 效能與資產策略

Browser-first 是正式限制，因此需要比較：

- CSS procedural / pattern
- 單格 Tile 圖片
- Tile atlas / sprite sheet
- 多層 PNG / WebP
- SVG
- Canvas 2D
- DOM + CSS 與 Canvas 混合方案

評估項目至少包含：手機效能、載入量、縮放品質、透明度、Depth Sorting、維護成本、地圖主題擴充成本。

# Part B｜Dialogue Rendering

角色對話 UI 不直接視為地圖 HUD 的附屬功能，而是獨立的 Presentation Layer。第一階段先建立一個不依賴戰鬥狀態的角色對話實驗區。

## 對話框基本構成

至少研究以下元素：

- **角色肖像**：半身、胸像、3/4 身，以及左右站位。
- **角色姓名**：姓名標籤的位置、字級與辨識性。
- **對話文字框**：寬度、高度、透明度、背景材質與邊界。
- **本文排版**：繁體中文行高、每行字數、標點與長文換頁。
- **繼續操作**：點擊、按鈕或其他明確的下一句提示。
- **選項 UI**：2–4 個選項的排列、可點擊範圍與手機操作。
- **旁白／無角色對話**：不顯示肖像時的另一種框體模式。
- **多人對話**：左右角色切換、目前發言者強調、非發言者弱化。

## 對話肖像研究

目前四名主角已有透明半身肖像，可優先拿來測試：

- 肖像固定左側、右側或依發言者切換。
- 肖像是否從畫面底部延伸到對話框之外。
- 對話框是否覆蓋肖像的一部分。
- 發言角色正常亮度，非發言角色降低亮度／對比。
- 角色表情版本未來是否可直接替換同一個 Portrait Slot。
- 手機直式與 iPad 橫式是否需要不同構圖。

對話用 Portrait Renderer 與戰場 Unit Renderer 應視為兩套用途不同的 Renderer，即使兩者可以暫時共用同一張圖片。

## 對話框版面候選

第一階段至少比較三種方向：

1. **Bottom Dialogue Box**：角色肖像在左右／背景層，文字框固定畫面底部。
2. **Card Dialogue**：肖像與文字整合成一張較集中的卡片式 UI。
3. **Full-width Cinematic Dialogue**：寬幅底部框，角色肖像可大幅超出框體，較接近劇情演出模式。

正式方向尚未定案。

## 對話 UI 的資料與 Renderer 分離

對話內容應由資料描述，而不是寫死在畫面元件中。例如：

```text
Dialogue State
 ├─ speakerId
 ├─ speakerName
 ├─ portrait / expression
 ├─ text
 ├─ side
 ├─ choices[]
 └─ flags / next
        ↓
Dialogue Renderer
 ├─ Portrait Layer
 ├─ Nameplate
 ├─ Text Box
 ├─ Continue Indicator
 └─ Choice Layer
```

未來劇情系統只決定「誰說什麼、下一步去哪裡」，Renderer 決定「畫面如何呈現」。

# Part C｜Map + Dialogue Integration

地圖與角色對話先各自完成研究後，再進入整合。整合時不重新發明第三套 UI，而是讓兩個 Renderer 在同一個 Presentation Shell 中協作。

預定架構方向：

```text
Game / Scene State
        ↓
Presentation Shell
 ├─ Map / Battlefield Renderer
 │   ├─ Ground Layer
 │   ├─ Object Layer
 │   ├─ Unit Layer + Depth Sorting
 │   └─ Combat Overlay Layer
 │
 └─ Dialogue Renderer
     ├─ Portrait Layer
     ├─ Nameplate
     ├─ Text Layer
     └─ Choice Layer
```

整合階段主要研究：

- 對話開始時地圖是否保持可見。
- 地圖是否暫停互動但保留動畫。
- 對話框是覆蓋地圖、壓縮地圖，或進入獨立 Cinematic Mode。
- 戰鬥前／戰鬥中／戰鬥後對話是否使用同一套 Renderer。
- 角色肖像是否遮擋重要戰場資訊。
- 手機直式畫面是否需要自動切換不同 Dialogue Layout。
- Choice UI 出現時必須阻止誤觸地圖。
- Scene Transition、對話、戰場之間的 Layer 與輸入優先順序。

**整合不代表把 Dialogue Renderer 寫進 Map Renderer。** 兩者保持獨立，僅由上層 Scene / Presentation State 控制顯示與互動。

## 重構原則

視覺研究**不得把 Demo 專用寫法繼續堆進共用 Combat UI**。正式實作前仍需重構。

原則：

1. `combat-model.js` 保持戰鬥規則與狀態，不承擔地圖美術、投影或對話框呈現。
2. 地圖資料描述「是什麼、在哪個邏輯格」，Map Renderer 決定「怎麼畫」。
3. Dialogue State 描述「誰說什麼、有哪些選項」，Dialogue Renderer 決定「怎麼呈現」。
4. Demo 0、Demo 1 與未來 Demo 共用同一套 Map Renderer，不複製渲染邏輯。
5. Region / Map Theme 應以資料或資產設定切換，不建立一套新的 Combat App。
6. 視覺提示層與地表層分離，避免未來換地圖美術時破壞戰鬥操作。
7. Unit Renderer 與 Map Projection 解耦。
8. Dialogue Renderer 與 Combat / Map Renderer 解耦。
9. 最後由 Scene / Presentation Shell 負責控制 Map、Dialogue、HUD 的顯示優先權與輸入鎖定。
10. 正式增加渲染功能前，先檢查並拆分目前 `combat-app.js` / Combat UI 中過度集中的責任。

## 第一階段研究順序

### A. 地圖

1. **盤點現有 Battlefield DOM / CSS 結構**。
2. **重構 Map Renderer / Unit Renderer 邊界**，先保持目前畫面完全不變。
3. 建立一個不影響正式 Demo 規則的地圖視覺實驗區。
4. 同一份 8 × 8 測試地圖至少比較：正方形俯視、45° Diamond，以及一種斜視／2.5D 候選方案。
5. 每種投影都同時測試單位圖片尺寸、超格、Depth Sorting、血條與 Combat Overlay。
6. 確認手機與 iPad 的可讀性與效能。

### B. 角色對話

1. 建立獨立 Dialogue Rendering Demo，不依賴 Combat Runtime。
2. 使用四名主角現有透明肖像測試 Portrait Layer。
3. 比較 Bottom Dialogue Box、Card Dialogue、Full-width Cinematic 三種版面。
4. 測試姓名、長短對話、旁白、左右角色切換與 2–4 個選項。
5. 驗證手機直式、iPad 與桌面版面。
6. 決定 Dialogue Data Schema 與 Dialogue Renderer 的責任邊界。

### C. 整合

1. Map Renderer 與 Dialogue Renderer 各自穩定後才開始。
2. 先測「地圖保持可見 + 對話覆蓋」模式。
3. 測試對話期間地圖輸入鎖定與戰場資訊遮擋。
4. 再研究是否需要獨立 Cinematic Mode。
5. 最後才把正式 Scene Flow 接進戰鬥前／中／後對話。

## 暫不定案

以下項目目前只列為研究題目，不視為正式規格：

- 最終採用 90°、45° 或其他投影方式
- 是否使用手繪 Tile
- 是否使用程序式地圖紋理
- 是否改用 Canvas
- 戰場角色使用半身、3/4 身或全身圖
- 角色圖片可超出格子的最大範圍
- 地形高度差
- 動態光影、天候、粒子
- Region 的正式美術風格
- 對話框正式版型
- 對話角色肖像正式尺寸與站位
- 對話是否逐字顯示
- 對話框動畫與轉場方式
- 地圖與對話整合時是否進入 Cinematic Mode

本頁是獨立的渲染研究與重構工作區，不改動已確認的戰鬥邏輯規則。