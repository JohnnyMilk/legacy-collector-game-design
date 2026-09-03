# 人物角色動畫製作研究

> 狀態：🔴 進行中 / 尚未定案

這個頁面專門研究《遺產收集者》的**戰鬥人物角色設定、動畫資產規格與動畫播放方式**。此頁與「戰鬥地圖渲染研究」分開：地圖研究負責戰場、投影、Dialogue UI 與整體 Presentation；本頁專注在角色本身如何被製作成可在遊戲中播放的動畫。

目前不預先鎖定 Sprite Sheet、逐格圖片、WebP、CSS、Canvas 或其他實作技術。第一階段先建立角色與動作需求，再用 Prototype 驗證最適合 Browser-first 遊戲的製作方式。概念上可參考目前 ChatGPT Codex pet 類型的角色動畫製作流程：以一個角色設定為基礎，建立多個可切換的動作狀態，而不是為每一個畫面重新製作完整角色。

## 角色清單原則

### 我方角色｜已知

我方固定為四名主角：

- 蒼岳
- 朧月
- 阿斯特蕾雅
- 賽洛恩

四名主角的角色身份已固定，但**戰鬥動畫造型是否因職業 / Tier 改變**目前尚未定案，不在本頁提前假設。

### 敵方角色｜待 Region 敵人設計完成後建立

敵方動畫清單不先憑空建立。等各 Region 的一般敵人、Elite、Mini Boss、Region Boss 等角色設定完成後，再把正式敵方角色逐一加入動畫製作清單。

因此 Enemy Animation Roster 是由正式 Enemy / Boss Design 派生，而不是反過來限制敵人設計。

## 目前預計需要的動畫

### 1. Idle / 待機

雖然不是戰鬥指令本身，但正式動畫系統需要一個基礎待機狀態，作為角色沒有執行其他動作時的預設循環。

研究項目：呼吸、衣物／頭髮微動、武器持握、機械單位待機等。

### 2. Move / 移動行走

目前預計需要移動動畫。

若角色直接在戰棋地圖上移動，第一候選規格為四方向：

- Up
- Down
- Left
- Right

四方向目前是**研究基準，不是最終定案**。是否需要斜方向，應等 Map Projection 決定後再判斷。

### 3. Attack / 一般攻擊

一般物理攻擊需要獨立動畫，例如揮劍、刺擊、射擊、敲擊等。

攻擊方向目前**尚未定案**，保留兩種主要方案：

**方案 A｜地圖上直接攻擊**

角色在戰棋地圖原位置執行攻擊，因此可能需要 Up / Down / Left / Right 四方向攻擊動畫，實際需求依最終 Map Projection 與攻擊呈現方式決定。

**方案 B｜獨立 Battle Action View**

當角色攻擊時切換或疊加一個獨立戰鬥演出視窗。我方固定由右側面向左方，敵方固定由左側面向右方。若採此方案，攻擊動畫可能只需要 Left / Right 兩個面向，甚至可依陣營只製作單一主要方向再做必要的鏡像處理。

目前 A / B 都保留，不提前決定。

### 4. Cast / 施放法術

施法必須與一般攻擊分開。

Cast Animation 表現角色的施法動作，例如舉杖、結印、蓄能、吟唱或釋放；實際火焰、奧術、治療、Buff 等效果則應盡量拆成獨立 **VFX / Skill Effect Layer**，避免每一種技能都要求重新製作一整套角色動畫。

基本概念：

```text
Character Cast Animation
        +
Skill VFX / Projectile / Target Effect
        =
Final Spell Presentation
```

這可以讓同一個角色的 Cast 動畫重複服務多個法術技能。

### 5. Hit / 受傷

角色被直接攻擊命中時需要受傷反應。

第一階段研究：

- 短暫後仰／震動
- 武器或身體失衡
- 是否依受擊方向不同
- 是否可只使用一套 Hit 動畫配合畫面位移／閃白等效果

Hit 是否需要四方向目前不定案，應與 Attack Presentation 一起決定。

### 6. Death / 戰鬥不能行動

正式角色動畫系統最終需要處理 HP 歸零後的視覺狀態。Death / Down 動畫目前列為必要研究項目，但具體演出尚未定案。

## 動畫狀態模型

第一階段可以先以共用狀態機思考：

```text
Character Animation State
 ├─ idle
 ├─ move
 ├─ attack
 ├─ cast
 ├─ hit
 └─ death / down

Direction
 ├─ up
 ├─ down
 ├─ left
 └─ right
```

Direction 不代表每個 State 最終都必須有四方向。Renderer / Animation Controller 應允許不同動作使用不同方向數量，例如 Move 使用 4 directions，但 Battle Action View 的 Attack / Cast 只使用 Left / Right。

## 角色設定與動畫資產分離

角色身份、戰鬥資料與動畫資產不能綁死在一起。

預定概念：

```text
Character / Enemy Definition
        ↓
Animation Profile
 ├─ idle
 ├─ move
 ├─ attack
 ├─ cast
 ├─ hit
 └─ death
        ↓
Animation Renderer / Controller
```

例如同一個 Enemy Definition 可以指定自己的 Animation Profile；戰鬥系統只要求 `attack`，不需要知道該動畫是 Sprite Sheet、WebP、DOM 或 Canvas 播放。

## 與戰鬥地圖渲染研究的關係

這兩個研究頁互相依賴，但不合併開發：

1. **戰鬥地圖渲染研究**決定 Map Projection、Unit Layer、角色在格子上的視覺尺寸與是否使用獨立 Battle Action View。
2. **人物角色動畫製作研究**決定角色 Animation Profile、動作狀態、方向數量與資產製作方式。
3. 兩邊各自 Prototype 後，再做整合測試。

尤其 Attack / Cast 的方向數量必須等「地圖內直接演出」或「獨立 Battle Action View」方向確認後才能正式定案。

## 第一階段 Prototype 建議

不需要一開始就替所有角色製作完整動畫。先選 **1 名我方角色 + 1 名敵方測試角色**，建立最小 Animation Prototype：

1. Idle
2. Move（先測四方向）
3. Attack
4. Cast
5. Hit
6. Death / Down

同時比較：

- 逐格 Sprite / Sprite Sheet
- Animated WebP 或序列圖片
- CSS / DOM Transform
- Canvas 2D
- 其他適合目前角色素材的方式

Prototype 的目的不是立即決定正式美術，而是確認：手機效能、檔案大小、動畫切換、透明背景、縮放品質、角色方向切換，以及與 Combat Runtime 串接的成本。

## 尚未定案

- Attack 是否需要四方向。
- Cast 是否需要四方向。
- Hit 是否需要方向差異。
- 是否採獨立 Battle Action View。
- Battle Action View 是切換整個畫面、局部視窗或疊加 Layer。
- Left / Right 是否可安全用水平鏡像共用資產。
- 我方角色是否因職業 / Tier 改變戰鬥造型。
- 每個動作的 Frame 數與 FPS。
- Sprite Sheet / Animated WebP / Canvas / DOM 的正式技術方案。
- Death 是倒地、消散或其他表現。
- 法術 VFX 的正式資產規格。

這些項目在 Prototype 實測前都維持 TBD，不視為正式規格。