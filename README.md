# 業務週報表

記錄每次拜訪的時間、地點、客戶、拜訪人與談論內容，並依「業務週報表」範本匯出每週 Excel。

## 線上使用

https://claude.ai/artifact/6gQpdzv7WwQTKLa5noYAkh

## 檔案

- `index.html`：軟體本體（Claude Artifact 頁面；紀錄存在 Artifact 的雲端資料庫）。
- `template/業務預報表範本.xlsx`：Excel 範本原檔（已內嵌於 `index.html`）。
- `template/fill.js`：把一週紀錄填入範本的程式（與頁面內相同，可用 Node + ExcelJS 測試）。

## 功能

- 欄位：日期、地點（台灣各縣市／電洽）、客戶名稱、拜訪人姓名、職位、談論工作內容、後續追蹤事項。
- 按週檢視、搜尋、勾選追蹤完成、複製週報文字。
- 匯出 Excel：套用範本，內容第一句為「前往拜訪○○○職位，」；欄寬 日期 16、地點 13、客戶 15。
