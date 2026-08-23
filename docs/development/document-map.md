# 文件地圖（Document Map）

## 目的
定義遊戲設計文件、網站展示與 Prototype Demo 之間的對應關係。

## 文件分類

- overview：整體理念與核心循環
- systems：遊戲系統規則
- world：世界觀與內容規劃
- development：開發規劃與工具文件

## 設計原則

每個主要遊戲系統應具有：

1. 獨立 Markdown 文件
2. 對應網站頁面
3. 必要時提供可獨立驗證的 Prototype Demo

正式系統說明與互動測試應分離；不在每一張職業說明卡重複塞入同一套測試按鈕。

## 現行獨立 Prototype

- `systems/timeline-system.html`：行動時間軸系統 Prototype
- `systems/class-system.html`：同心圓職業樹 Prototype
- `systems/mastery-system.html`：職業 Mastery 設計瀏覽器
- `development/mastery-flow-demo.html`：Mastery 即時完成／戰後 MASTERED／角色死亡／超額戰績流程測試

## TODO

- 補充完整網站導覽結構
- 定義文件版本管理方式
- Report / Class Combat Archive Viewer
