# AI 協作任務卡 (AI Collaborative Web Building Workshop)

> **給 AI 助手的提示：** 這個 README 是為了讓未來的 AI 助手能快速掌握專案全貌而設計的。請從頭到尾閱讀，以理解課程內容、技術架構和設計決策。

---

## 專案概述

這是一個 **React 前端互動課程介面**，作為分享會的教學工具。課程名稱為「AI 協作建站實作課」，目標是讓每位學員在課堂上完成一個簡單的個人網站，並可從同一 Wi-Fi 網路的手機上連線瀏覽。

**本專案（`ai-web-workshop`）是課程的任務卡介面**，不是學員要建立的網站本身。學員會看著這個介面上的任務指引，在另一個資料夾建立他們自己的 Node.js + Express 網站。

### 核心用途

- 展示 4 個依序解鎖的任務卡
- 每個任務卡包含：驗收標準 checklist、給 Claude 的 fixed prompt（可複製）、進階挑戰題、常見錯誤說明
- 引導初學者用 Claude 作為 AI 副駕駛，完成 Node.js + Express 個人網站

---

## 技術棧

| 分類 | 技術 |
|------|------|
| 框架 | React 18 |
| 建構工具 | Vite |
| 樣式 | Tailwind CSS 4 |
| 語言 | JavaScript (無 TypeScript) |
| 後端 | 無（純前端介面） |
| 資料儲存 | React state（無 localStorage，頁面重整後進度重置） |

---

## 目錄結構

```
ai-web-workshop/
├── src/
│   ├── main.jsx                  # React 入口點
│   ├── App.jsx                   # 根元件：課程標題、目標說明、TaskBoard
│   ├── styles.css                # 全域樣式 + Tailwind import + 自訂動畫
│   ├── data/
│   │   └── taskCards.json        # 課程核心資料（任務卡內容）
│   ├── components/
│   │   ├── TaskBoard.jsx         # 任務版面管理：任務列表 + 詳細面板路由
│   │   ├── TaskCard.jsx          # 3D 互動任務卡（hover 時有視差光澤效果）
│   │   ├── TaskDetailPanel.jsx   # 任務詳細頁：checklist、fixed prompt、挑戰題、說明
│   │   ├── Checklist.jsx         # 可重用的 checkbox 元件
│   │   ├── ChallengeHint.jsx     # 可展開的挑戰提示區塊
│   │   └── CopyableCodeBlock.jsx # 帶複製按鈕的程式碼區塊（含多層 fallback）
│   ├── hooks/
│   │   └── useTaskProgress.js    # 進度追蹤：任務解鎖邏輯 + checkbox 狀態
│   └── utils/
│       └── copyToClipboard.js    # 剪貼簿工具（Clipboard API → execCommand → 手動）
├── index.html                    # HTML 入口（lang="zh-Hant"）
├── vite.config.js                # Vite 設定
├── package.json                  # 依賴套件清單
├── task_cards_for_codex.json     # taskCards.json 的備用格式（用於 AI 工具）
└── dist/                         # 生產版本輸出（已建置）
```

---

## 課程內容結構

課程分為 **4 個任務（Task）**，依序解鎖：

### Task 1：啟動網站（10 分鐘）
- **目標：** 建立基本 Node.js + Express 網站
- **驗收：** 電腦瀏覽器可看到網站（`http://localhost:3000`）
- **技術：** `npm init`、安裝 express、建立 `server.js` 和 `public/index.html`

### Task 2：修改網站內容（10 分鐘）
- **目標：** 將預設網站改為個人介紹頁
- **驗收：** 網站顯示自己的名字與個人內容
- **技術：** 修改 HTML、CSS 排版

### Task 3：讓手機能連上（10 分鐘）
- **目標：** 同 Wi-Fi 下手機可連上網站
- **驗收：** 用手機連上區域網路 IP（如 `http://192.168.x.x:3000`）
- **技術：** 查詢本機 IP（`ipconfig`）、Express 監聽 `0.0.0.0`、處理防火牆

### Task 4：加入互動功能（10-20 分鐘）
- **目標：** 加入 JavaScript 互動效果
- **驗收：** 按鈕點擊後有反應
- **技術：** `addEventListener`、DOM 操作、`script.js`

---

## 任務卡資料格式（taskCards.json）

每個任務物件的結構：

```json
{
  "id": "task_1",
  "title": "啟動網站",
  "estimatedTime": "10 分鐘",
  "description": "...",
  "passLine": "電腦看得到網站",
  "imageUrl": "/images/missions/mission_1_website_startup.png",
  "acceptanceCriteria": [
    { "id": "ac_1_1", "label": "..." }
  ],
  "fixedPrompt": "你是一個...",
  "challenges": [
    {
      "level": "basic",
      "label": "基本版",
      "description": "...",
      "prompt": "...",
      "unlockAfter": "acceptance"
    },
    {
      "level": "plus",
      "label": "Plus 版",
      "unlockAfter": "basic"
    },
    {
      "level": "challenge",
      "label": "挑戰版",
      "unlockAfter": "plus"
    }
  ],
  "help": [
    {
      "symptom": "看到什麼錯誤",
      "causes": ["可能原因 1", "可能原因 2"],
      "hint": "給 Claude 的 prompt"
    }
  ],
  "constraints": {
    "allowed": ["VS Code", "Node.js", "HTML", "CSS", "JavaScript", "Express"],
    "forbidden": ["React", "Vue", "TypeScript", "資料庫", "登入系統", "雲端部署"]
  }
}
```

---

## 關鍵設計決策

### 任務解鎖邏輯（`useTaskProgress.js`）

```
Task 1（預設開放）
  └─ Task 2（Task 1 驗收全勾才解鎖）
       └─ Task 3（Task 2 驗收全勾才解鎖）
            └─ Task 4（Task 3 驗收全勾才解鎖）

每個 Task 內：
  驗收標準全勾 → 解鎖 Basic 挑戰
  Basic 完成 → 解鎖 Plus 挑戰
  Plus 完成 → 解鎖 Challenge 挑戰
```

### 剪貼簿複製策略（`copyToClipboard.js`）

因應課程環境（區域網路、非 HTTPS），使用三層 fallback：
1. `navigator.clipboard.writeText()` — 現代 API
2. `document.execCommand('copy')` — 傳統 API
3. 顯示 textarea 讓使用者手動複製 — 最終 fallback

### 視覺設計

- **主題：** 深色賽博朋克風（背景 `#060912`、青色 + 洋紅漸層）
- **任務卡：** CSS 3D 透視 + 滑鼠位置動態光澤效果（`--rotX`、`--rotY` CSS 變數）
- **Glassmorphism：** 半透明面板 + `backdrop-blur`
- **動畫：** `challenge-fade-in`（320ms）、`hint-panel-open`（220ms 滑入）

---

## 開發指令

```bash
npm run dev      # 開發伺服器（0.0.0.0，所有介面可連線）
npm run build    # 生產版本建置 → dist/
npm run preview  # 預覽已建置版本
```

---

## 學員建立的網站結構（參考）

這是課程引導學員建立的目標專案結構（不在此 repo 內）：

```
my-website/
├─ package.json
├─ server.js       # Express 伺服器，監聽 0.0.0.0:3000
└─ public/
   ├─ index.html
   ├─ style.css
   └─ script.js
```

**技術限制：**
- 允許：VS Code、Node.js、HTML、CSS、JavaScript、Express
- 禁止：React、Vue、TypeScript、資料庫、登入系統、雲端部署、複雜套件

---

## 進度持久化說明

目前進度（checkbox 狀態）**僅存於 React state**，頁面重整後會重置。這是刻意設計——課程為單次工作坊，不需要跨 session 記憶進度。

若未來需要持久化，可在 `useTaskProgress.js` 加入 `localStorage` 讀寫。

---

## 檔案對應速查

| 想修改的功能 | 對應檔案 |
|------------|---------|
| 課程內容、任務描述、fixed prompt | `src/data/taskCards.json` |
| 任務卡視覺外觀 | `src/components/TaskCard.jsx` |
| 詳細頁面（checklist、挑戰題）| `src/components/TaskDetailPanel.jsx` |
| 任務解鎖/進度邏輯 | `src/hooks/useTaskProgress.js` |
| 複製功能 | `src/utils/copyToClipboard.js` |
| 全域樣式、動畫 | `src/styles.css` |
| 課程標題、頁面描述 | `src/App.jsx` |
| 版面路由（任務列表 vs 詳細頁）| `src/components/TaskBoard.jsx` |
