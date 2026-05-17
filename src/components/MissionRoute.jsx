import LockIcon from './icons/LockIcon.jsx';

function MissionRoute({ taskStates, selectedTaskId, onSelectTask }) {
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

export default MissionRoute;
