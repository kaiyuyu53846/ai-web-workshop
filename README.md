# AI 協作任務卡 — AI Onboarding README

> **For AI assistants (Claude Code, Codex, ChatGPT, Cursor, Copilot):**
> This README is designed as an onboarding document. Read it top to bottom before touching any file.
> The most critical sections for safe editing are **§4 Core Architecture**, **§6 State / Progress Logic**, and **§9 AI Collaboration Notes**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Core Architecture](#4-core-architecture)
5. [Important Components](#5-important-components)
6. [State / Progress Logic](#6-state--progress-logic)
7. [Styling Rules](#7-styling-rules)
8. [Development Guide](#8-development-guide)
9. [AI Collaboration Notes](#9-ai-collaboration-notes)
10. [Future Expansion](#10-future-expansion)
11. [Architecture Improvement Suggestions](#11-architecture-improvement-suggestions)

---

## 1. Project Overview

### What Is This?

This is a **React-based interactive workshop interface** — a task card system for an in-person workshop titled *"AI 協作建站實作課"* (AI Collaborative Web Building Practical Course). The workshop is run at Quanta Computer as an internal tech sharing session.

**This project is the instructor interface / course guide**, not the website that students build. Students look at this interface for step-by-step instructions, then create their own Node.js + Express website in a separate folder.

### Core Features

- **4 sequentially-unlocking task cards** — students must complete each task before the next one unlocks
- **Acceptance criteria checklists** — structured pass/fail requirements per task
- **Fixed Prompts** — pre-written, copy-ready prompts for Claude; students paste these into Claude to get started
- **Advanced Challenges** — 3 difficulty levels (Basic → Plus → Challenge) per task, unlocked progressively
- **Help / Hint System** — common errors with expandable copy-ready debug prompts
- **Clipboard support with 3-tier fallback** — works on LAN (non-HTTPS) environments

### Use Context

| Who | What they do |
|-----|-------------|
| Instructor | Runs this interface on a projected screen or shared URL |
| Students | Follow tasks on their own device; open the detail panel to copy prompts into Claude |
| Claude (AI) | Receives the Fixed Prompt from students, guides them step by step |

Students are absolute beginners. The interface is deliberately opinionated: only 4 tasks, fixed technology constraints, pre-written prompts.

### Completion Status

| Area | Status |
|------|--------|
| UI / visual design | Complete |
| All 4 task cards with content | Complete |
| Unlock / progression logic | Complete |
| Clipboard copy (incl. LAN fallback) | Complete |
| Mobile responsive layout | Complete |
| Production build | Complete (`dist/` committed) |
| Progress persistence (localStorage) | **Not implemented** (intentional — single-session workshop) |
| Backend / API | **Not applicable** (pure frontend) |

---

## 2. Tech Stack

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | **React** | 18 (latest) | Component rendering, state management |
| Language | **JavaScript** | ES2022+ | No TypeScript; JSX only |
| Build tool | **Vite** | 8 (latest) | Dev server, HMR, production bundle |
| Styling | **Tailwind CSS** | 4 (latest) | Utility-first styling via `@tailwindcss/vite` plugin |
| Animation | *(none — pure CSS)* | — | `@keyframes` in `styles.css`; no Framer Motion or GSAP |
| State management | **React `useState`** | built-in | No Context, no Redux, no Zustand |
| Routing | *(none)* | — | View switching is state-driven (`isDetailMode` boolean in `TaskBoard`) |
| Package manager | **npm** | — | `package-lock.json` present |
| Icons | *(inline SVG)* | — | No icon library; icons are hand-authored SVG components |
| CSS reset | *(minimal)* | — | `box-sizing`, `margin: 0`, `font-family` in `styles.css` |

> **⚠️ Assumption:** All dependencies use `"latest"` in `package.json`. This means versions are not pinned. See §11 for the risk this poses.

---

## 3. Project Structure

```
ai-web-workshop/
│
├── index.html                        # HTML entry point (lang="zh-Hant", CSP meta tag)
├── vite.config.js                    # Vite config: react() + tailwindcss() plugins
├── package.json                      # Scripts + dependencies (all pinned to "latest")
├── package-lock.json                 # Locked dependency tree
├── .gitignore                        # Ignores: node_modules/, .env*, .claude/settings.local.json
│
├── task_cards_for_codex.json         # ⚠️ Duplicate of src/data/taskCards.json (see §11)
│
├── dist/                             # Production build output (committed to git)
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   └── index-*.js
│   └── images/missions/              # 4 task card PNG images
│
├── public/
│   └── images/missions/              # Source images served by dev server
│       ├── mission_1_website_startup.png
│       ├── mission_2_customize_website.png
│       ├── mission_3_mobile_connection.png
│       └── mission_4_interactive_features.png
│
└── src/
    ├── main.jsx                      # React root: createRoot → <App /> with StrictMode
    ├── App.jsx                       # Root component: background, header, <TaskBoard>
    ├── styles.css                    # Global styles + Tailwind import + CSS animations
    │
    ├── data/
    │   └── taskCards.json            # ★ SINGLE SOURCE OF TRUTH for all course content
    │
    ├── hooks/
    │   └── useTaskProgress.js        # ★ Core progression logic (unlock rules, state)
    │
    ├── utils/
    │   ├── copyToClipboard.js        # Clipboard API with 3-tier fallback
    │   └── challengeUtils.js         # getChallengePrompt() — resolves prompt field from challenge object
    │
    └── components/
        ├── icons/
        │   └── LockIcon.jsx          # Shared SVG lock icon (used in MissionRoute + TaskDetailPanel)
        │
        ├── TaskBoard.jsx             # ★ View router: board mode ↔ detail mode
        ├── MissionRoute.jsx          # Right sidebar: task route list + RouteNode buttons
        ├── TaskCard.jsx              # 3D animated task card (board preview)
        ├── TaskDetailPanel.jsx       # ★ Detail view: checklist, prompt, challenges, help
        ├── HelpSystem.jsx            # Collapsible help section + error cards
        ├── ChallengeHint.jsx         # Expandable "提示詞" button per challenge
        ├── Checklist.jsx             # Reusable checkbox list (acceptance + challenge criteria)
        └── CopyableCodeBlock.jsx     # Code/prompt display block with copy button
```

### Folder Responsibilities

| Folder | Responsibility |
|--------|---------------|
| `src/data/` | **All course content lives here.** Editing `taskCards.json` changes what students see. Nothing else needs changing for content updates. |
| `src/hooks/` | Business logic only. `useTaskProgress.js` owns the entire progression state machine. No UI code here. |
| `src/utils/` | Pure functions with no React dependencies. Safe to unit test in isolation. |
| `src/components/icons/` | Shared SVG icon components. Add new icons here when needed. |
| `src/components/` | All React UI components. Each file has a single primary responsibility after refactoring. |
| `public/images/` | Static assets served at `/images/…` path. Referenced by `imageUrl` in `taskCards.json`. |
| `dist/` | Committed build output. Regenerate with `npm run build` after changes. |

---

## 4. Core Architecture

### Rendering Flow

```
main.jsx
  └─ <App />                          (layout shell: background gradients, header, page padding)
       └─ <TaskBoard tasks={...} />   (view state machine)
            │
            ├─ [Board Mode]           isDetailMode === false
            │    ├─ <TaskCard />      (selected task preview, left column)
            │    └─ <MissionRoute />  (task route sidebar, right column)
            │         └─ <RouteNode /> × 4
            │
            └─ [Detail Mode]          isDetailMode === true
                 ├─ Back button
                 └─ <TaskDetailPanel />
                      ├─ <Checklist />          (acceptance criteria)
                      ├─ <CopyableCodeBlock />   (fixed prompt)
                      ├─ <ChallengeHint /> × 3  (per challenge)
                      │    └─ <CopyableCodeBlock />
                      └─ <HelpSystem />
                           └─ <HelpErrorCard /> × N
                                └─ <CopyableCodeBlock />
```

### Data Flow

```
taskCards.json (static JSON)
    │
    ▼
App.jsx  ──imports──►  courseData.taskCards (array)
    │
    ▼
TaskBoard.jsx
    │
    ├──► useTaskProgress(tasks)        [hook — owns all mutable state]
    │         │
    │         ├── getTaskFlowStates()  → taskStates[]   (used by MissionRoute, TaskBoard logic)
    │         ├── getAcceptanceState() → {checkedItems, isComplete, toggle}
    │         └── getChallengeState()  → {checkedItems, isComplete, isUnlocked, toggle}
    │
    ├──► <MissionRoute taskStates={...} />   (read-only display)
    ├──► <TaskCard task={...} />             (read-only display)
    └──► <TaskDetailPanel taskProgress={taskProgress} />
              │
              ├── taskProgress.getAcceptanceState(task.id)
              └── taskProgress.getChallengeState(task.id, challenge, index)
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| No URL routing | Single-session workshop tool; back/forward browser buttons are not expected |
| No localStorage | Progress intentionally resets on refresh; workshop is one session |
| No React Context | Only one `useTaskProgress` hook instance; prop drilling is shallow (2 levels max) |
| Static JSON data | All content in one file; no backend needed; easy to edit without touching components |
| CSS-only animations | No animation library dependency; simpler bundle, fewer updates to maintain |

---

## 5. Important Components

### `TaskBoard.jsx` — View State Machine

**Purpose:** Owns the `isDetailMode` boolean that switches between board view and detail view. Also manages `selectedTaskId` for which task is currently previewed.

**Dependencies:** `useTaskProgress`, `TaskCard`, `MissionRoute`, `TaskDetailPanel`

**Critical behavior:**
- When returning to board from a completed task, auto-advances `selectedTaskId` to the next unlocked task
- `selectedTask` falls back to `currentTaskState` if the selected task becomes locked

**Danger zone:** Do not add more view states here without understanding how `selectedTaskState` is derived — it has a double-fallback chain.

---

### `useTaskProgress.js` — Progression Engine

**Purpose:** The entire unlock logic, state tracking, and progression rules. This is the most important non-UI file.

**Returns three functions:**

| Function | Returns | Used by |
|----------|---------|---------|
| `getTaskFlowStates()` | Array of task states with `isUnlocked`, `isComplete`, `isCurrentProgress` | `TaskBoard`, `MissionRoute` |
| `getAcceptanceState(taskId)` | `{checkedItems, isComplete, toggle}` | `TaskDetailPanel` |
| `getChallengeState(taskId, challenge, index)` | `{checkedItems, isComplete, isUnlocked, toggle}` | `TaskDetailPanel` |

**Internal helpers:**
- `areAllItemsChecked(items, checkedItems)` — core completion check
- `getChallengeId(challenge, index)` — stable key for challenge progress storage
- `getTaskProgress(task, progress)` — safe accessor with default empty state

**Do not refactor** `getTaskFlowStates` without re-reading §6 carefully.

---

### `TaskDetailPanel.jsx` — Task Detail View

**Purpose:** Renders everything a student sees when they open a task card. Composes 6 different sub-components.

**Dependencies:** `Checklist`, `CopyableCodeBlock`, `ChallengeHint`, `HelpSystem`, `LockIcon`, `challengeUtils`

**Sections rendered (in order):**
1. Task header (shortTitle, goal)
2. Acceptance Criteria → `<Checklist>`
3. Fixed Prompt → `<CopyableCodeBlock>`
4. Advanced Challenges → `<ChallengeHint>` per challenge
5. Help System → `<HelpSystem>`

**Note:** `isHelpOpen` state resets to `false` whenever `task.id` changes (via `useEffect`).

---

### `CopyableCodeBlock.jsx` — Prompt Display

**Purpose:** Renders any text (prompts, code) with a copy button. Handles 3 copy states: `idle` → `copied` or `manual`.

**States:**

| State | UI |
|-------|----|
| `idle` | "Copy" button |
| `copied` | "Copied" button (resets after 1400ms) |
| `manual` | Shows `<textarea>` for long-press copy on non-HTTPS |

**Used in:** `TaskDetailPanel` (fixed prompt), `ChallengeHint`, `HelpSystem`

---

### `MissionRoute.jsx` — Task Route Sidebar

**Purpose:** Right sidebar showing all 4 tasks as clickable nodes. Each `RouteNode` shows a status badge (LOCKED / AVAILABLE / CURRENT / COMPLETED) and locks interaction when not yet unlocked.

**Visual states per node:**

| Status | Border color | Background |
|--------|-------------|------------|
| LOCKED | white/10 | white/2.5%, opacity 45% |
| AVAILABLE | cyan/28 | cyan/4.5% |
| CURRENT | fuchsia/55 | fuchsia/7% |
| COMPLETED | cyan/65 | cyan/9% |

---

### `Checklist.jsx` — Reusable Checkbox List

**Purpose:** Renders a list of checkbox items. When `disabled={true}`, all items are visually grayed out and non-interactive.

**Checked state visual:** Line-through text + cyan border + cyan background.

**Used in:** Acceptance criteria (TaskDetailPanel), challenge criteria (TaskDetailPanel via challenge loop)

---

## 6. State / Progress Logic

> **⚠️ This section is critical. Do not modify `useTaskProgress.js` without fully understanding the rules below.**

### Task Unlock Chain

Tasks unlock in a strict linear sequence:

```
Task 1 ──[all acceptance criteria checked]──► Task 2 unlocks
Task 2 ──[all acceptance criteria checked]──► Task 3 unlocks
Task 3 ──[all acceptance criteria checked]──► Task 4 unlocks
```

Implementation: `getTaskFlowStates()` iterates tasks in order, maintaining a `dependencyChainComplete` boolean. Once it hits an incomplete task, all subsequent tasks remain locked.

### Challenge Unlock Chain (within a task)

```
acceptanceCriteria all checked
    └──► Basic challenge unlocks
              └──► Plus challenge unlocks (after Basic criteria all checked)
                        └──► Challenge challenge unlocks (after Plus criteria all checked)
```

Implementation: `getChallengeState()` checks:
1. `acceptanceComplete` — all acceptance criteria of the parent task are checked
2. `previousComplete` — all criteria of the previous challenge are checked (or index === 0)
3. `followsKnownOrder` — `CHALLENGE_ORDER = ['Basic', 'Plus', 'Challenge']` matches array position

### Task Status Derivation

```javascript
// In getTaskFlowStates():
isUnlocked = dependencyChainComplete (at the time this task is processed)
isComplete  = areAllItemsChecked(task.acceptanceCriteria, progress.acceptance)

// Derived after the map:
isCurrentProgress = task is the first task that is (isUnlocked && !isComplete)
```

| Condition | Display Status |
|-----------|---------------|
| `!isUnlocked` | LOCKED |
| `isUnlocked && !isComplete && isCurrentProgress` | CURRENT |
| `isUnlocked && !isComplete && !isCurrentProgress` | AVAILABLE |
| `isUnlocked && isComplete` | COMPLETED |

### Progress State Shape

```javascript
// Internal state (React useState)
progress = {
  "task_1": {
    acceptance: { 0: true, 1: false, 2: true },   // index → boolean
    challenges: {
      "Basic-0": { 0: true },                      // challengeId → index → boolean
      "Plus-1":  {},
    }
  },
  "task_2": { acceptance: {}, challenges: {} },
  // ...
}
```

**Challenge ID formula:** `getChallengeId(challenge, index)` = `"${challenge.level}-${index}"`

### Progress Persistence

**None.** All progress lives in `useState` inside `useTaskProgress`. A page refresh resets everything. This is intentional for a single-session workshop.

**To add persistence:** Add `localStorage` read in the `useState` initializer and a `useEffect` to write back on every progress change.

---

## 7. Styling Rules

### Color System

| Semantic Role | Color | Tailwind Token | Usage |
|--------------|-------|---------------|-------|
| Primary / interactive | Cyan | `cyan-*` | Buttons, borders, focus rings, task nodes |
| Highlight / active | Fuchsia / Magenta | `fuchsia-*` | CURRENT task, advanced challenges |
| Warning / help | Amber | `amber-*` | Help system, fixed prompt labels |
| Background | Near-black | `#060912` | Global background (custom value) |
| Surface | Dark navy | `slate-950` | Component backgrounds |
| Text primary | White | `white` | Headings |
| Text secondary | Slate | `slate-300` | Body text |

### Visual Design Language

- **Cyberpunk / sci-fi aesthetic** — dark background, neon accent colors, uppercase tracking labels
- **Glassmorphism** — `backdrop-blur` + semi-transparent backgrounds on all panels
- **Label style** — `text-xs font-semibold uppercase tracking-[0.24em]` for all section headers (NEVER lowercase)
- **Border style** — all borders use `border-{color}/{opacity}` with low opacity (e.g., `border-cyan-300/20`)

### 3D Card Effect (`TaskCard.jsx`)

The task card uses CSS custom properties updated on `mousemove`:

```
--rotate-x  → perspective tilt (vertical axis)
--rotate-y  → perspective tilt (horizontal axis)
--shine-x   → radial gradient center X
--shine-y   → radial gradient center Y
```

These are set via `card.style.setProperty()` — **not via React state** (avoids re-render on every mouse move). Do not convert to state.

### CSS Animations (`styles.css`)

Two named keyframe animations are used:

| Class | Animation | Duration | Trigger |
|-------|-----------|----------|---------|
| `.challenge-unlocked` | `challenge-fade-in` | 320ms ease-out | Applied when challenge article becomes unlocked |
| `.hint-panel` | `hint-panel-open` | 220ms ease-out | Applied to the hint panel div on expand |

**Do not rename these classes** — they are referenced directly in JSX classNames and are not Tailwind utilities.

### Spacing Principles

- Outer page padding: `px-5 py-8 sm:px-8 lg:px-10 lg:py-12`
- Component internal padding: `p-4 md:p-5`
- Section gaps: `space-y-5 md:space-y-6`
- All spacing uses Tailwind scale (multiples of 4px)

### Responsive Breakpoints

| Breakpoint | Layout change |
|------------|--------------|
| Default (mobile) | Single column, detail mode always full-width |
| `xl` (1280px+) | Board mode: 2-column grid (`1fr 420px`); sidebar becomes sticky |

---

## 8. Development Guide

### Start Development

```bash
npm install        # first time only
npm run dev        # starts at http://0.0.0.0:5173 (all interfaces, accessible on LAN)
```

### Build for Production

```bash
npm run build      # outputs to dist/
npm run preview    # preview the built output
```

> **Note:** The dev server listens on `0.0.0.0` intentionally, so students on the same Wi-Fi can access the interface from their phones.

---

### How to Add a New Task Card

1. Open `src/data/taskCards.json`
2. Append a new object to the `taskCards` array following this schema:

```json
{
  "id": "task_5",
  "title": "完整任務標題",
  "shortTitle": "短標題（用於路線圖）",
  "goal": "這個任務的目標是...",
  "estimatedMinutes": 15,
  "minimumPassLine": "最低通過標準",
  "imageUrl": "/images/missions/mission_5_your_image.png",
  "acceptanceCriteria": [
    { "id": "ac_5_1", "label": "第一個驗收條件" },
    { "id": "ac_5_2", "label": "第二個驗收條件" }
  ],
  "fixedPrompt": "給 Claude 的完整 prompt 文字...",
  "advancedChallenges": [
    {
      "level": "Basic",
      "title": "挑戰標題",
      "goal": "挑戰說明",
      "criteria": ["完成條件 1", "完成條件 2"],
      "prompt": "給 Claude 的挑戰 prompt"
    },
    { "level": "Plus",      "title": "...", "goal": "...", "criteria": [], "prompt": "..." },
    { "level": "Challenge", "title": "...", "goal": "...", "criteria": [], "prompt": "..." }
  ],
  "commonErrors": [
    {
      "id": "err_5_1",
      "symptom": "學員看到什麼錯誤",
      "possibleCause": "可能原因",
      "helpPrompt": "給 Claude 的求救 prompt"
    }
  ]
}
```

3. Add the corresponding image to `public/images/missions/`
4. Run `npm run build` to regenerate `dist/`

**No component changes needed** — all components are driven entirely by the JSON data.

---

### How to Add a CSS Animation

1. Open `src/styles.css`
2. Add a `@keyframes` block and a class that applies it:

```css
.your-animation-class {
  animation: your-animation-name 300ms ease-out;
}

@keyframes your-animation-name {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

3. Apply the class in the relevant JSX component

---

### How to Add a New Section to TaskDetailPanel

1. Open `src/components/TaskDetailPanel.jsx`
2. Add a new `<DetailSection title="Your Title">` block inside the `<div className="space-y-5 ...">` container
3. If the section is large (>50 lines), create a new component file under `src/components/`

---

### How to Modify Course Content Only

| Goal | File to edit |
|------|-------------|
| Change task title / description / prompt | `src/data/taskCards.json` |
| Add/remove acceptance criteria | `src/data/taskCards.json` → `acceptanceCriteria[]` |
| Change challenge prompts | `src/data/taskCards.json` → `advancedChallenges[].prompt` |
| Add a help error | `src/data/taskCards.json` → `commonErrors[]` |
| Change course title / goal | `src/data/taskCards.json` → `courseTitle` / `courseGoal` |

---

## 9. AI Collaboration Notes

### Recommended Reading Order (Before Making Changes)

```
1. README.md (this file)
2. src/data/taskCards.json         — understand the data shape
3. src/hooks/useTaskProgress.js    — understand the state machine
4. src/components/TaskBoard.jsx    — understand view routing
5. src/components/TaskDetailPanel.jsx  — understand the detail view
6. The specific component you need to change
```

### Risk Map

| File | Risk Level | Reason |
|------|-----------|--------|
| `src/hooks/useTaskProgress.js` | 🔴 HIGH | Core progression logic. Subtle unlock chain. A small change can break all task unlocking. |
| `src/components/TaskBoard.jsx` | 🟡 MEDIUM | View routing + `selectedTaskState` fallback chain. Dual-fallback logic is easy to misread. |
| `src/components/TaskDetailPanel.jsx` | 🟡 MEDIUM | Composes many sub-components. The challenge loop uses both `getChallengeState` and `getChallengePrompt`. |
| `src/data/taskCards.json` | 🟡 MEDIUM | All content lives here. Schema must match what components expect. |
| `src/styles.css` | 🟢 LOW | CSS only. Renaming `.challenge-unlocked` or `.hint-panel` will break animations. |
| All other component files | 🟢 LOW | Single-responsibility, easy to read in isolation. |

### Coupling Map

```
useTaskProgress.js
    ↑ consumed by
    TaskBoard.jsx  ──────────────────────► MissionRoute.jsx
    TaskDetailPanel.jsx  ────────────────► Checklist.jsx
                         ────────────────► CopyableCodeBlock.jsx
                         ────────────────► ChallengeHint.jsx ──► CopyableCodeBlock.jsx
                         ────────────────► HelpSystem.jsx ───► CopyableCodeBlock.jsx
                         ────────────────► challengeUtils.js (getChallengePrompt)
                         ────────────────► LockIcon.jsx

taskCards.json
    ↑ consumed by
    App.jsx ──► TaskBoard.jsx ──► (all components above)
```

### Danger Zones — Do Not Change Without Full Understanding

1. **`CHALLENGE_ORDER` in `useTaskProgress.js`** — The array `['Basic', 'Plus', 'Challenge']` is used to validate that challenge level matches its array position. Reordering or renaming challenge levels in `taskCards.json` **must** be accompanied by updating this constant.

2. **`getChallengeId()` in `useTaskProgress.js`** — The formula `"${challenge.level}-${index}"` is the key used to store challenge progress. Changing this formula silently resets all challenge progress.

3. **`.challenge-unlocked` and `.hint-panel` CSS classes** — These are referenced directly in JSX. They are not Tailwind utilities. Do not rename or move them without updating both `styles.css` and the JSX.

4. **`3D card style properties`** in `TaskCard.jsx` — `--rotate-x`, `--rotate-y`, `--shine-x`, `--shine-y` are CSS custom properties set imperatively via `card.style.setProperty()`. Do not convert to `useState` — doing so triggers a re-render on every mousemove event.

5. **`task_cards_for_codex.json` at root** — This is an undocumented duplicate of `src/data/taskCards.json`. It appears to have been created for external AI tool use. **Do not treat it as the source of truth.** Always edit `src/data/taskCards.json`. See §11.

### Modification Sequence (Safe Approach)

When modifying the progression logic:
1. Write down the exact behavior change you want in plain language
2. Read `useTaskProgress.js` in full
3. Identify which of the three returned functions needs changing
4. Change only that function's logic
5. Manually test: check, uncheck, re-check acceptance items; verify task unlock/lock
6. Run `npm run build` to confirm no import errors

When modifying visual design:
1. Change Tailwind classes in the target component
2. Verify no class is a custom CSS class from `styles.css` (check before removing)
3. Check the change at multiple breakpoints (mobile / desktop)

---

## 10. Future Expansion

### Near-Term Enhancements

| Feature | Complexity | Notes |
|---------|-----------|-------|
| **Progress persistence (localStorage)** | Low | Add to `useTaskProgress.js` only; no component changes needed |
| **More task cards** | Low | Edit `taskCards.json` only; add image to `public/images/` |
| **Instructor view (show all student progress)** | High | Requires backend or shared state (e.g., WebSocket, Firebase) |
| **Pinned version dependencies** | Low | Replace `"latest"` with specific semver in `package.json` |

### Medium-Term Expansion Ideas

| Feature | Notes |
|---------|-------|
| **Mobile-first task guide** | The current UI is already responsive, but a dedicated mobile layout (bottom sheet instead of sidebar) would improve the student experience on phones |
| **Tailscale / LAN sharing** | The dev server already listens on `0.0.0.0`; adding a QR code display with the local IP would reduce setup friction |
| **Task timer** | Show elapsed time per task; track if `estimatedMinutes` was exceeded |
| **Animated task unlock celebration** | Trigger a visual effect when a task transitions from LOCKED to AVAILABLE |

### Longer-Term Possibilities

| Feature | Complexity | Notes |
|---------|-----------|-------|
| **Multi-language support** | Medium | Currently hardcoded in Traditional Chinese; i18n layer needed |
| **AI agent integration** | High | Pass student progress state to a Claude API call for dynamic hints |
| **Multiplayer / class view** | High | Show all students' progress simultaneously (requires backend) |
| **Teaching mode** | Medium | Instructor can force-unlock specific tasks for demo purposes |
| **Custom workshop builder** | High | UI for non-technical instructors to create new task card sets without editing JSON |
| **Offline PWA** | Low-Medium | Add a service worker; the app is already static and LAN-friendly |
| **TypeScript migration** | Medium | Add types for `Task`, `Challenge`, `TaskProgress`, `TaskFlowState`; the data shapes are well-defined |

---

## 11. Architecture Improvement Suggestions

The following issues were observed during analysis. None affect current functionality, but are worth addressing before scaling the project.

### Issue 1: Unpinned Dependencies (`package.json`)

**Current state:** All six dependencies use `"latest"`:
```json
"react": "latest",
"vite": "latest",
"tailwindcss": "latest"
```

**Risk:** A breaking change in any upstream package will silently break the build on next `npm install`. Tailwind CSS 4 introduced significant breaking changes from v3; the same risk exists for future major versions.

**Recommendation:** Run `npm install` once to get the current `package-lock.json` versions, then pin each dependency to its resolved version (e.g., `"react": "^18.3.1"`).

---

### Issue 2: Duplicate JSON File (`task_cards_for_codex.json`)

**Current state:** `task_cards_for_codex.json` at the project root is a copy of `src/data/taskCards.json`. There is no documented relationship between them.

**Risk:** If `taskCards.json` is updated but `task_cards_for_codex.json` is not, an AI assistant reading the root-level file will have stale data and give wrong advice.

**Recommendation:** Either delete `task_cards_for_codex.json` and reference `src/data/taskCards.json` directly in AI tool configurations, or add a comment at the top of the file documenting that it must be kept in sync with `src/data/taskCards.json`.

---

### Issue 3: `dist/` Committed to Git

**Current state:** The production build output is tracked in git.

**Risk:** Every `npm run build` produces content-hashed filenames (e.g., `index-DCVfpOGn.js`). Git diffs become noisy with binary image files and large JS/CSS bundles.

**Recommendation:** Add `dist/` to `.gitignore` if the project is deployed via CI/CD. Keep it committed only if the deployment method is "serve directly from the git repository" (e.g., GitHub Pages from the `dist/` folder).

---

### Issue 4: Slight Logic Duplication in `useTaskProgress.js`

**Current state:** The acceptance state object (checkedItems, isComplete, toggle) is constructed in two places: `getAcceptanceState()` (line ~63) and inside `getTaskFlowStates()` (line ~112). They are nearly identical.

**Risk:** Low — both read from the same `progress` state. But if the shape of the acceptance state object changes, both sites must be updated.

**Recommendation:** This is a deliberate trade-off (calling `getAcceptanceState` inside `getTaskFlowStates` would work but adds indirection). Only fix if `getAcceptanceState`'s shape needs to change.

---

*This README was generated as an AI onboarding document. Last updated: 2026-05-17.*
