import { useState } from 'react';
import TaskCard from './TaskCard.jsx';
import TaskDetailPanel from './TaskDetailPanel.jsx';
import MissionRoute from './MissionRoute.jsx';
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

export default TaskBoard;
