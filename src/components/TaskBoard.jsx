import { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import TaskDetailPanel from './TaskDetailPanel.jsx';
import { useTaskProgress } from '../hooks/useTaskProgress.js';

function TaskBoard({ tasks }) {
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? null);
  const taskProgress = useTaskProgress(tasks);
  const taskStates = taskProgress.getTaskFlowStates();
  const currentTaskState =
    taskStates.find((taskState) => taskState.isCurrentProgress) ??
    [...taskStates].reverse().find((taskState) => taskState.isUnlocked);
  const selectedTaskState =
    taskStates.find(
      (taskState) => taskState.task.id === selectedTaskId && taskState.isUnlocked,
    ) ??
    currentTaskState;
  const selectedTask = selectedTaskState?.task;

  function openTask(taskId) {
    setSelectedTaskId(taskId);
    setIsDetailMode(true);
  }

  function returnToBoard() {
    if (selectedTaskState?.isComplete) {
      const selectedTaskIndex = taskStates.findIndex(
        (taskState) => taskState.task.id === selectedTaskState.task.id,
      );
      const nextTaskState = taskStates[selectedTaskIndex + 1];

      if (nextTaskState?.isUnlocked) {
        setSelectedTaskId(nextTaskState.task.id);
      }
    }

    setIsDetailMode(false);
  }

  if (isDetailMode && selectedTask) {
    return (
      <section className="space-y-5">
        <button
          type="button"
          onClick={returnToBoard}
          className="inline-flex min-h-11 items-center gap-2 border border-cyan-200/35 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(0,229,255,0.1)] transition hover:border-cyan-100/70 hover:bg-cyan-300/18"
        >
          <span aria-hidden="true">&larr;</span>
          返回任務路線
        </button>

        <TaskDetailPanel
          task={selectedTask}
          taskProgress={taskProgress}
          layout="standalone"
        />
      </section>
    );
  }

  return (
    <section className="grid min-w-0 gap-4 lg:gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0 space-y-4 lg:space-y-5">
        <div className="border border-cyan-300/20 bg-slate-950/60 p-4 shadow-[0_0_30px_rgba(0,229,255,0.08)] backdrop-blur md:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Current Mission
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">任務卡預覽</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            從右側任務路線圖切換任務卡；點擊左側卡片即可進入任務詳情。
          </p>
        </div>

        {selectedTaskState && (
          <TaskCard
            task={selectedTaskState.task}
            isSelected={false}
            onSelect={() => openTask(selectedTaskState.task.id)}
          />
        )}
      </div>

      <MissionRoute
        taskStates={taskStates}
        selectedTaskId={selectedTask?.id}
        onSelectTask={setSelectedTaskId}
      />
    </section>
  );
}

function MissionRoute({
  taskStates,
  selectedTaskId,
  onSelectTask,
}) {
  return (
    <aside className="min-w-0 border border-cyan-300/20 bg-slate-950/72 p-4 shadow-[0_0_36px_rgba(0,229,255,0.1)] backdrop-blur md:p-5 xl:sticky xl:top-8 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
        Mission Route
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">任務路線圖</h2>

      <div className="mt-5 space-y-3">
        {taskStates.map(({ task, isUnlocked, isComplete, isCurrentProgress }, index) => (
          <RouteNode
            key={task.id}
            task={task}
            index={index}
            isUnlocked={isUnlocked}
            isComplete={isComplete}
            isSelected={task.id === selectedTaskId}
            isCurrentProgress={isCurrentProgress}
            onSelectTask={onSelectTask}
          />
        ))}
      </div>
    </aside>
  );
}

function RouteNode({
  task,
  index,
  isUnlocked,
  isComplete,
  isSelected,
  isCurrentProgress,
  onSelectTask,
}) {
  const status = !isUnlocked
    ? 'LOCKED'
    : isComplete
      ? 'COMPLETED'
      : isCurrentProgress
        ? 'CURRENT'
        : 'AVAILABLE';

  return (
    <button
      type="button"
      disabled={!isUnlocked}
      onClick={() => onSelectTask(task.id)}
      className={`group min-h-16 w-full border p-4 text-left transition ${
        isSelected
          ? 'border-cyan-200/65 bg-cyan-300/[0.09] shadow-[0_0_26px_rgba(0,229,255,0.14)]'
          : isCurrentProgress
          ? 'border-fuchsia-200/55 bg-fuchsia-300/[0.07] shadow-[0_0_24px_rgba(217,70,239,0.12)]'
          : isUnlocked
          ? 'border-cyan-300/28 bg-cyan-300/[0.045] hover:border-cyan-200/55 hover:bg-cyan-300/[0.08]'
          : 'cursor-not-allowed border-white/10 bg-white/[0.025] opacity-45'
      } ${isComplete && isUnlocked ? 'shadow-[0_0_22px_rgba(0,229,255,0.1)]' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center border text-sm font-black ${
            !isUnlocked
              ? 'border-slate-600 bg-slate-800/60 text-slate-400'
              : isComplete
              ? 'border-cyan-200/70 bg-cyan-300/18 text-cyan-50'
              : isCurrentProgress
                ? 'border-fuchsia-200/60 bg-fuchsia-300/16 text-fuchsia-100'
              : 'border-cyan-200/35 bg-cyan-300/10 text-cyan-100'
          }`}
        >
          {isUnlocked ? index + 1 : <LockIcon />}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{task.shortTitle}</p>
          <p
            className={`mt-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              !isUnlocked
                ? 'text-slate-500'
                : isComplete
                ? 'text-cyan-200'
                : isCurrentProgress
                  ? 'text-fuchsia-200'
                : 'text-cyan-200'
            }`}
          >
            {status}
          </p>
        </div>
      </div>
    </button>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export default TaskBoard;
