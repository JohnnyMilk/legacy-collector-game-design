# LEGACY COLLECTOR｜遠征系統（Expedition System）

## 系統定位

遠征是 LEGACY COLLECTOR 的主要 Roguelike 循環。玩家從遠征準備開始，穿越多個 Region 與分支節點，最後進入 Final Region 並挑戰 Final Boss。

## 序章與正式 Run

遊戲最初有一次序章／教學。四名主角以 Tier 0「村民」開始。序章完成後，村民不再作為一般 Run 起始職業。

## 遠征準備

每次 Run 開始前，只替四名主角選擇合法的起始職業／已解鎖記憶形態。

角色沒有裝備欄，因此遠征準備不包含武器、防具、飾品、Relic／遺產或其他裝備選擇。

第一次正式 Run 可預設戰士、斥候、法師、牧師各一名；後續可使用任何已解鎖的一般職業。已永久覺醒的「XXX 的記憶」可由對應角色直接作為新 Run 起始形態。

## 遠征結構

基本流程：

`遠征準備 → Region 1 → Region 2 → Region 3 → Region 4 → Final Region → Final Boss`

每個主要 Region 的標準節奏仍包含前半段戰鬥／事件、1 個固定中段轉職點、後半段戰鬥／事件與 Region Boss。

## 節點規則

- 地圖採單向不可返回設計。
- 完成節點後不能回頭重複刷取。
- 玩家需要做路線選擇。
- 轉職點是固定節奏節點，不依賴隨機事件。

## 轉職點

每個 Region 固定只有 1 個轉職點，原則上位於路程中段。

轉職點可查看 Mastery、新解鎖職業並依職業樹規則轉職。角色目前職業必須已 Mastered 才能正式轉出。

完成轉職後，新 Build 中所有可用主動技能 Charge 補滿。

## Region 4 記憶神殿

記憶神殿**只會出現在 Region 4**，而且不是必經路線。

- 它是可選分支節點。
- 玩家可以選擇另一條路，因此某次 Run 可以完全不經過神殿。
- 進入神殿時，系統檢查各角色原始職業系是否已完成該系全部 Tier 3 Mastery。
- 符合條件的角色可以首次覺醒自己的「XXX 的記憶」。
- 同一 Run 可以覺醒多名角色，只要各自條件成立且本次路線提供合法機會。
- 首次覺醒後永久解鎖；未來 Run 不需要再次造訪神殿即可直接使用該記憶。

神殿數量、生成方式、是否單一神殿可處理多個職業系與事件演出，留待 Region 4 內容設計。

## Region 設計

目前固定框架：

- Region 1
- Region 2
- Region 3
- Region 4
- Final Region
- Final Boss

Region 4 除一般路線選擇外，額外承擔首次記憶覺醒的後期分支機制。

## 戰鬥結算

每場戰鬥結束後：

- 執行 HP／Charge 等既定戰後恢復。
- 更新 Mastery Checklist 與職業戰績。
- 檢查新的 Tier 3 Inspiration 解鎖。
- 不直接進行轉職。

## 成功、失敗與輪迴

四名角色在所有合法死亡觸發／復活效果結算後仍全部正式死亡時，該 Run 才失敗；敘事上視為本次輪迴失敗。

擊敗 Final Boss 為一次完整 Run 的最終成功條件。成功或失敗都會產生遠征報告。

跨 Run 保留 Mastery、職業解鎖、Tier 3 揭露、已覺醒記憶與長期紀錄；不存在 Relic 收藏或裝備進度。

## TODO

- Region 主題與正式名稱。
- 節點種類與事件列表。
- Region 4 神殿生成與演出。
- Final Region 與 Final Boss 內容。
