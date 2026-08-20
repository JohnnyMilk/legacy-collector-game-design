# 遠征系統（Expedition System）

## 系統定位

遠征是《遺產收集者》的主要 Roguelike 循環。

玩家從起點開始，經過多個 Region 與節點，直到完成最終目標。

## 遠征結構

基本流程：

起點 → Region 1 → Region 2 → Region 3 → Region 4 → Final Region

每個 Region 具有：
- 節點選擇
- 戰鬥
- 特殊事件
- Boss 戰

## 節點規則

- 採用不可返回設計。
- 節點通過後消失。
- 玩家需要做出路線選擇。

## Region 設計

目前規劃：
- 4 個主要 Region
- 1 個 Final Region

每個 Region 主要控制角色 Mastery 成長節奏。

## 戰鬥結算

每場戰鬥結束後：
- 恢復固定 HP。
- 恢復技能 Charge。
- 檢查 Mastery。
- 執行轉職判定。

## 遠征失敗

條件：
- 四名角色全部死亡。

失敗仍會產生 Report，並可能帶來新的解鎖。

## TODO

- Region 主題
- 節點種類
- 事件列表
