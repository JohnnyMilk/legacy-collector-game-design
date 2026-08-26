# LEGACY COLLECTOR｜Region 設計

## 基本架構

一次完整遠征由：

- Region 1
- Region 2
- Region 3
- Region 4
- Final Region
- Final Boss

組成。

## 節點規則

採 Roguelike 單向路徑：

- 玩家選擇前進路線。
- 節點完成後不能返回刷取。
- 每個 Region 只有 1 個固定中段轉職點。
- Region Boss 負責結束該 Region 並推進下一區。

## Region 4：記憶神殿

Region 4 額外存在「記憶神殿」類特殊分支節點。

- 神殿只會在 Region 4 出現。
- 神殿不是必經路線。
- 玩家可以選擇其他路線直接錯過本次神殿。
- 對應職業系全部 Tier 3 Mastery 完成時，合法角色可在神殿首次覺醒自己的「XXX 的記憶」。
- 同一 Run 可以覺醒多名角色，但實際可否做到取決於該 Run 的節點配置與玩家路線。
- 首次覺醒後永久解鎖，後續 Run 不需重複經過神殿。

## Region 目的

每個 Region 都應提供不同的敵人配置、地形、事件與路線取捨，同時讓玩家有機會推進職業 Mastery 與調整隊伍 Build。

Region 4 是一般遠征與最終記憶覺醒交會的區域；Final Region 則專注於通往世界最終謎團與 Final Boss。

## TODO

- 各 Region 主題與正式名稱。
- Boss 設計。
- 節點事件種類。
- Region 4 神殿數量、生成機率與視覺。
- Final Region 結構。
