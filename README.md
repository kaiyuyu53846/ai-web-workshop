# AI 協作建站任務卡 — AI Onboarding Guide

> 給未來的 Codex、Claude Code、ChatGPT、Cursor、Copilot 與其他 AI coding assistant：
> 修改本專案前，請先讀完這份 README。這份文件不是學生教學手冊，而是專案交接與 AI onboarding 文件。

---

## 1. 專案定位

這是一個 **AI 協作建站實作課** 的任務卡網站。

請先分清兩個網站：

- **本 repo**：React / Vite 任務卡介面，用來顯示任務卡、提示詞、checklist、進階挑戰與求救提示。
- **學員要做的網站**：另一個由學員在課堂中建立的 Node.js + Express / HTML / CSS / JavaScript 網站。

課程對象是完全沒有程式基礎的新手。課程採 **任務卡驅動**，AI 不應自行決定下一步；學員完成一張任務卡後，必須回到課程網頁勾選 checklist，再依下一張任務卡繼續。

學員網站技術限制：

- 使用 Node.js、Express、HTML、CSS、JavaScript。
- 不使用 React、Vue、TypeScript、Tailwind、Bootstrap。
- 不使用 API、資料庫、localStorage、登入系統、雲端部署或新套件，除非任務卡明確允許。

本任務卡網站本身技術限制不同：它是 React / Vite 前端 app，使用 Tailwind CSS 4。

---

## 2. 目前四個任務流程

1. **啟動網站**
   - 只在這一關第一次確認學員使用 Windows 或 Mac。
   - 建立最基本的 Node.js + Express 網站。
   - 目標是啟動 server 後，在瀏覽器網址列輸入 `http://localhost:3000`，看到 `Hello My Website`。
   - 不要讓 AI 把雙擊 `index.html`、用 `file://` 開 HTML、或使用 Live Server 當成任務目標。

2. **讓手機能連上網站**
   - 沿用任務一確認的作業系統。
   - 電腦瀏覽器可用 `http://localhost:3000` 開啟。
   - 手機瀏覽器使用 `http://電腦IP:3000` 開啟。
   - 需要說明 `localhost` 與電腦 IP 的差異。
   - 手機與電腦要在同一個 Wi-Fi。

3. **修改網站內容**
   - 先在 ChatGPT 討論網站內容需求。
   - ChatGPT 只負責需求整理與產出給 VS Code Codex 的提示詞。
   - 再把 ChatGPT 產出的提示詞貼到 VS Code Codex，由 Codex 修改 HTML / CSS。
   - ChatGPT 不應直接寫程式或教學生修改檔案。

4. **加入互動功能**
   - 先在 ChatGPT 討論互動功能需求。
   - ChatGPT 只負責整理互動功能規格與產出 Codex 提示詞。
   - 再由 VS Code Codex 修改 HTML / CSS / JavaScript。
   - 互動功能應維持前端簡單互動，不使用 API、資料庫、localStorage 或新套件。

---

## 3. 作業系統規則

- 只在任務一第一次確認學員使用 Windows 或 Mac。
- 任務二、三、四沿用任務一確認的作業系統。
- 如果 AI 不知道任務一確認的作業系統，才補問一次。
- 不要每個任務都重新詢問 Windows / Mac。
- 後續操作指引要依照已確認的作業系統。
- 不要混用 Windows 和 Mac 步驟。
- `taskCards.json` 不應殘留固定指定 Windows-only 的舊提示詞。
- 若需要提到 Windows，應是條件式，例如「如果我是 Windows」。
- 若需要提到 Mac，應提供 macOS 對應做法。

任務一 starter prompt 是建立作業系統設定的地方；後續任務只是沿用設定，不重新建檔。

---

## 4. 語言規則

整份課程預設使用繁體中文。

目前 `src/data/taskCards.json` 根層包含：

```json
"promptStyleGuide": {
  "language": "繁體中文",
  "principle": "本課程所有提示詞預設使用繁體中文，不需要在每段提示詞重複聲明。"
}
```

這是語言與提示詞風格的文件性規則。語言偏好是全域預設，不應讓每段提示詞重複變臃腫。

維護原則：

- 不需要在每一段 prompt 都重複寫「請用繁體中文」。
- 「請用繁體中文」不應大量散落在 `advancedChallenges`、`commonErrors`、`fixedPrompt` 或 `promptSections` 裡。
- 刪掉的是語言重複聲明，不是刪掉操作限制、技術限制、停止規則或新手保護規則。

---

## 5. Tech Stack

目前 `package.json`：

| Area | Technology | Notes |
| --- | --- | --- |
| Framework | React | JSX only, no TypeScript |
| Build tool | Vite | `vite --host 0.0.0.0` |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite` | Utility classes plus `src/styles.css` |
| Language | JavaScript / JSX | No TypeScript |
| Package manager | npm | `package-lock.json` exists |
| Backend | None | Static frontend app |
| API / DB | None | Static JSON import only |
| Routing | None | Local React state |
| Progress persistence | None | Refresh resets progress |

Scripts:

```bash
npm run dev
npm run build
npm run preview
```

---

## 6. 專案結構

```text
ai-web-workshop/
├── README.md
├── package.json
├── task_cards_for_codex.json
├── public/images/missions/
├── dist/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── data/taskCards.json
    ├── hooks/useTaskProgress.js
    ├── utils/
    │   ├── challengeUtils.js
    │   └── copyToClipboard.js
    └── components/
        ├── TaskBoard.jsx
        ├── TaskCard.jsx
        ├── MissionRoute.jsx
        ├── TaskDetailPanel.jsx
        ├── PromptSections.jsx
        ├── CopyableCodeBlock.jsx
        ├── ChallengeHint.jsx
        ├── Checklist.jsx
        ├── HelpSystem.jsx
        └── icons/LockIcon.jsx
```

重要路徑：

- `src/data/taskCards.json` 是課程內容主要來源。
- `task_cards_for_codex.json` 不是目前前端 source of truth，除非使用者明確要求，否則不要改它。
- `public/images/missions/` 放任務卡圖片；圖片命名或路徑改動時，必須同步 `imageUrl`。
- `dist/` 目前存在於 repo；build 可能產生額外 diff，需要依專案慣例判斷是否 commit。

---

## 7. Core Architecture

資料流：

```text
src/data/taskCards.json
  -> App.jsx
  -> TaskBoard.jsx
  -> TaskDetailPanel.jsx
     -> Checklist.jsx
     -> PromptSections.jsx
     -> ChallengeHint.jsx
     -> HelpSystem.jsx
```

主要責任：

- `App.jsx`：載入 `courseData`，顯示課程標題與目標，傳入 `TaskBoard`。
- `TaskBoard.jsx`：控制任務路線與 detail mode，使用 `useTaskProgress`。
- `TaskCard.jsx`：顯示任務預覽卡、圖片、時間、pass line。
- `MissionRoute.jsx`：顯示任務路線、鎖定與目前進度狀態。
- `TaskDetailPanel.jsx`：組合 checklist、prompt、進階挑戰、help system。
- `PromptSections.jsx`：顯示 `task.promptSections`。
- `CopyableCodeBlock.jsx`：共用可複製提示詞區塊與 fallback copy 行為。
- `ChallengeHint.jsx`：顯示進階挑戰提示詞。
- `Checklist.jsx`：顯示任務與挑戰 checklist。
- `HelpSystem.jsx`：顯示常見錯誤與求救提示詞。
- `copyToClipboard.js`：clipboard API 與 textarea fallback。
- `challengeUtils.js`：解析 challenge prompt，包含 options fallback。

---

## 8. taskCards.json Data Model

### Root Level

| Field | Status | Purpose |
| --- | --- | --- |
| `courseTitle` | 前端主要使用 | App header 標題 |
| `courseGoal` | 前端主要使用 | App header 課程說明 |
| `constraints` | 文件性 / 課程規則 | 全域技術限制 |
| `suggestedProjectStructure` | 文件性 | 學員網站建議結構 |
| `antiScopeCreepReminder` | 文件性 / 提示詞規則 | AI 跑偏時修正 |
| `promptStyleGuide` | 文件性 | 全域語言與提示詞風格規則 |
| `stopAfterTaskReminder` | 文件性 | 完成任務後停止原則 |
| `taskCards` | 前端主要使用 | 任務卡資料 |
| `courseSchedule` | 文件性 / 可能未來使用 | 課程時間與階段 metadata |

### Task Card Level

| Field | Status | Purpose |
| --- | --- | --- |
| `id` | 前端主要使用 | progress key 與任務選取 |
| `stage` | 前端主要使用 / 文件性 | 任務順序 |
| `title` | 前端主要使用 | 任務卡標題 |
| `shortTitle` | 前端主要使用 | route/detail 短標 |
| `description` | 前端主要使用 | 任務預覽描述 |
| `imageUrl` | 前端主要使用 | 任務圖片 |
| `estimatedMinutes` | 前端主要使用 | 時間 badge |
| `minimumPassLine` | 前端主要使用 | pass line |
| `goal` | 前端主要使用 | detail panel 任務目標 |
| `fixedPrompt` | fallback 欄位 | 目前 taskCards 已移除；component 仍支援沒有 `promptSections` 時 fallback |
| `promptSections` | 前端主要使用 | 固定提示詞主要顯示來源 |
| `acceptanceCriteria` | 前端主要使用 | 任務 checklist 與解鎖條件 |
| `expectedOutput` | 文件性 | 任務一預期輸出 |
| `exampleMobileUrl` | 文件性 | 任務二示例手機網址 |
| `verificationMethod` | 文件性 | 任務三驗收方式 |
| `expectedInteraction` | 文件性 | 任務四互動預期 |
| `advancedChallenges` | 前端主要使用 | Basic / Plus / Challenge |
| `commonErrors` | 前端主要使用 | HelpSystem |

### Challenge Level

| Field | Status | Purpose |
| --- | --- | --- |
| `level` | 前端主要使用 | `Basic` / `Plus` / `Challenge`，影響解鎖 |
| `title` | 前端主要使用 | 挑戰標題 |
| `goal` | 前端主要使用 | 挑戰說明 |
| `prompt` | 前端主要使用 | 給 AI 的挑戰提示詞 |
| `criteria` | 前端主要使用 | 挑戰 checklist |
| `options` | 前端主要使用 / 條件式 | Challenge 變體提示詞 |

### Common Error Level

| Field | Status | Purpose |
| --- | --- | --- |
| `id` | 前端主要使用 | Help card key |
| `symptom` | 前端主要使用 | 錯誤現象 |
| `possibleCause` | 前端主要使用 | 可能原因 |
| `helpPrompt` | 前端主要使用 | 可複製求救提示詞 |

---

## 9. promptSections 與 fixedPrompt

`taskCards[].promptSections` 是目前固定提示詞的主要顯示來源。

`TaskDetailPanel.jsx` 的行為：

- 有 `promptSections` 時，顯示 `PromptSections`。
- 沒有 `promptSections` 時，才 fallback 到 `fixedPrompt` + `CopyableCodeBlock`。

目前 `taskCards.json` 裡的 task card 已移除 `fixedPrompt`，但 component fallback 仍存在。若未來重新加入 `fixedPrompt`，內容必須和 `promptSections` 最新邏輯同步，避免 fallback 時出現舊流程。

`promptSections` 支援：

- `copyBlock`：一段可複製提示詞。
- `quickReplies`：一組追加提示詞，合併顯示為一個區塊，一次複製全部 `items`。
- `instruction`：純說明文字。

UI 規則：

- `quickReplies` 不是每一句一張小卡。
- `PromptSections` 不顯示 target badge，避免畫面太雜。
- prompt block 字體樣式應與 `ChallengeHint` 的 prompt 樣式一致。
- 若要修改畫面中主要固定提示詞，優先修改 `promptSections`。

---

## 10. Starter Prompt 設計規則

Starter prompt 是給新手最先複製的短提示詞，不能變成過長 SOP。

Starter prompt 必須具備：

- 任務目標清楚。
- 每次只給 1～2 步。
- AI 給完 1～2 步後，要停下來等學員回覆。
- 必須提醒學員：完成後回覆「好了」或描述看到什麼，再繼續下一步。
- 每一步要說明：
  - 在哪裡操作
  - 要做什麼
  - 為什麼要做
  - 做完後應該看到什麼
- 避免新手盲目照做。
- 任務完成後，AI 必須停止，不要自行延伸。

任務一 starter 還必須明確：

- 開始前先問 Windows / Mac。
- 在學員回答前不要開始操作。
- 後續任務沿用這個作業系統設定。
- 任務目標是啟動 Node.js + Express server 並開啟 `http://localhost:3000`。
- 不要引導雙擊 `index.html`、不要用 `file://`、不要使用 Live Server。

---

## 11. 任務完成後停止規則

AI 完成目前任務後，只能做三件事：

1. 告訴學員目前任務已完成。
2. 提醒學員回到課程網頁勾選 checklist。
3. 告訴學員下一步要依照課程網頁的下一張任務卡，而不是由 AI 自行決定。

AI 不應自行延伸：

- 下一個功能
- 下一個任務
- 部署
- Live Server
- ngrok
- Vercel / Netlify
- API
- 資料庫
- localStorage
- 登入系統
- 其他框架或套件
- Plus / Challenge，除非學員從課程網頁複製該挑戰提示詞

---

## 12. Checklist 設計規則

Checklist 是給完全沒有程式經驗的新手勾選的，因此只能放：

- 看得到的畫面結果
- 點得到的操作結果
- 開得起來的頁面
- 手機能不能打開
- 點擊後畫面有沒有變化
- 重新整理後是否仍正常顯示
- 手機上是否清楚可讀

Checklist 不應包含：

- Console
- F12
- 開發者工具
- API
- localStorage
- 資料庫
- React
- Vue
- TypeScript
- Tailwind
- Bootstrap
- server.js
- script.js
- style.css
- package.json
- node_modules
- 沒有使用
- 不使用
- 不修改
- 只修改
- 不新增
- 不安裝
- VS Code 終端機沒有紅色錯誤

**Prompt is for AI constraints. Checklist is for beginner-visible outcomes.**

---

## 13. 中性瀏覽器用語規則

給學員看的描述不應固定指定 Chrome、Edge、Safari 或 Firefox。

除非真的有瀏覽器差異，否則統一使用：

- 瀏覽器
- 電腦瀏覽器
- 手機瀏覽器
- 瀏覽器網址列
- 重新整理瀏覽器頁面

不要在新手 checklist 中要求開啟 Console、F12 或開發者工具。

---

## 14. 欄位清理規則

`taskCards.json` 是課程內容主要來源。刪除欄位前必須先搜尋 `src/`，確認前端是否使用。

不要只因為欄位目前未顯示就直接刪除。欄位可分成：

- 前端使用，必須保留。
- 未使用但有文件或未來用途。
- 舊版 fallback，保留但需同步更新。
- 明顯未使用且無文件價值，可考慮移除。

維護提醒：

- `fixedPrompt` 若仍作為 fallback，不可直接刪除；目前 taskCards 已移除，但 component fallback 仍在。
- `expectedOutput`、`exampleMobileUrl`、`verificationMethod`、`expectedInteraction` 若前端未使用，應先評估是否還有文件用途。
- `constraints`、`antiScopeCreepReminder`、prompt 內限制可能重複，但用途不同：
  - `constraints`：課程全域技術限制。
  - `antiScopeCreepReminder`：AI 跑偏時修正。
  - prompt 內限制：實際給 AI 執行時的任務限制。

---

## 15. 重要元件說明

### `App.jsx`

載入 `src/data/taskCards.json`，顯示 `courseTitle`、`courseGoal`，並將 `taskCards` 傳入 `TaskBoard`。

### `TaskBoard.jsx`

管理 board/detail 模式、目前選取任務、任務路線狀態。使用 `useTaskProgress(tasks)`。

### `TaskCard.jsx`

顯示任務預覽卡：圖片、標題、描述、預估時間、minimum pass line。圖片失敗時使用 placeholder。

### `MissionRoute.jsx`

顯示任務路線與狀態：`LOCKED`、`AVAILABLE`、`CURRENT`、`COMPLETED`。

### `TaskDetailPanel.jsx`

組合單一任務詳情：

1. `Checklist`
2. `PromptSections` 或 `fixedPrompt` fallback
3. `ChallengeHint`
4. `HelpSystem`

### `PromptSections.jsx`

負責顯示 `promptSections`。

- 優先顯示 `promptSections`。
- 沒有 `promptSections` 時才由 `TaskDetailPanel` fallback 到 `fixedPrompt`。
- `copyBlock` 顯示可複製提示詞。
- `quickReplies` 合併成一個可複製區塊。
- `instruction` 顯示純說明。
- 不顯示 target badge。
- prompt 內容樣式應與 `ChallengeHint` 的 prompt 樣式一致。

### `CopyableCodeBlock.jsx`

共用可複製區塊。包含 clipboard API、textarea fallback、手動複製 fallback。這對非 HTTPS 或區網教室環境很重要。

### `ChallengeHint.jsx`

負責進階挑戰提示詞顯示。

- Basic / Plus / Challenge 按順序解鎖。
- Challenge options 若存在，需能正確解析並顯示。
- challenge prompt 是給 AI 的限制與操作說明。
- challenge criteria 是給新手看的驗收結果。

### `Checklist.jsx`

顯示可勾選清單。用於任務 acceptance criteria 與 challenge criteria。

### `HelpSystem.jsx`

顯示常見錯誤、可能原因與可複製 help prompt。

### `useTaskProgress.js`

高風險區，不要隨便修改。它控制任務與挑戰解鎖。

不要隨便改：

- `CHALLENGE_ORDER`
- `getChallengeId`
- `getTaskFlowStates`
- `getAcceptanceState`
- `getChallengeState`

### `copyToClipboard.js`

封裝 copy 行為與 fallback。

### `challengeUtils.js`

解析進階挑戰提示詞來源。需保留對 challenge `options` 的相容能力。

---

## 16. Development Guide

```bash
npm install
npm run dev
npm run build
npm run preview
```

修改 README 或資料後，至少跑：

```bash
npm run build
```

如果 build 後 `dist/` 有 diff，先判斷本次任務是否應該 commit build output。這個 repo 目前追蹤 `dist/`，但文件-only commit 通常不需要把 build output 放進 commit，除非使用者要求。

---

## 17. Known Pitfalls / Danger Zones

- `taskCards.json` 是課程內容主要來源。
- `promptSections` 是固定提示詞主要顯示來源。
- `fixedPrompt` 是 component fallback；目前 taskCards 已移除它，若未來重新加入，不應過時。
- Checklist 不能放技術檢查。
- 任務完成後 AI 不應自行延伸下一步。
- 任務一完成目標是 `http://localhost:3000`，不是單純開啟 HTML 檔案。
- 只在任務一確認 Windows / Mac。
- 任務二、三、四沿用作業系統。
- 不要在每段 prompt 重複「請用繁體中文」。
- 不要固定指定特定瀏覽器。
- `quickReplies` 應合併顯示。
- 任務三、四要區分 ChatGPT 需求整理與 VS Code Codex 實作。
- 學員網站技術限制是 Node.js / Express / HTML / CSS / JavaScript。
- 本課程任務卡網站本身是 React / Vite。
- 修改圖片命名後要同步 `imageUrl`。
- 如果 `dist/` 被追蹤，build 可能產生額外 diff，需要依專案做法判斷是否 commit。
- `task_cards_for_codex.json` 不是前端目前的 source of truth。

最後記住：

```text
Prompt = constraints and instructions for AI.
Checklist = visible outcomes a beginner can verify.
Progression = controlled by the course page, not by AI improvisation.
```
