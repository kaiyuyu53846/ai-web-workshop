import { useEffect, useState } from 'react';
import ChallengeHint, { getChallengePrompt } from './ChallengeHint.jsx';
import Checklist from './Checklist.jsx';
import CopyableCodeBlock from './CopyableCodeBlock.jsx';

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

function TaskDetailPanel({ task, taskProgress, layout = 'sidebar' }) {
  const acceptanceState = taskProgress.getAcceptanceState(task.id);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const layoutClass =
    layout === 'standalone'
      ? ''
      : 'xl:sticky xl:top-8 xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto';

  useEffect(() => {
    setIsHelpOpen(false);
  }, [task.id]);

  return (
    <aside
      className={`min-w-0 border border-cyan-300/20 bg-slate-950/78 shadow-[0_0_36px_rgba(0,229,255,0.1)] backdrop-blur ${layoutClass}`}
    >
      <div className="border-b border-white/10 p-4 md:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          Detail Panel
        </p>
        <h2 className="mt-2 text-xl font-black text-white md:text-2xl">
          {task.shortTitle}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{task.goal}</p>
      </div>

      <div className="space-y-5 p-4 md:space-y-6 md:p-5">
        <DetailSection title="Acceptance Criteria">
          <Checklist
            idPrefix={`${task.id}-acceptance`}
            items={task.acceptanceCriteria ?? []}
            checkedItems={acceptanceState.checkedItems}
            onToggle={acceptanceState.toggle}
          />
        </DetailSection>

        <DetailSection title="Fixed Prompt">
          <CopyableCodeBlock
            label="Fixed Prompt"
            value={task.fixedPrompt}
            maxHeight="max-h-80"
          />
        </DetailSection>

        <DetailSection title="Advanced Challenges">
          <div className="space-y-3">
            {(task.advancedChallenges ?? []).map((challenge, index) => {
              const challengeState = taskProgress.getChallengeState(
                task.id,
                challenge,
                index,
              );
              const challengePrompt = getChallengePrompt(challenge);

              return (
                <article
                  key={`${challenge.level}-${challenge.title}`}
                  aria-disabled={!challengeState.isUnlocked}
                  className={`min-w-0 border p-4 transition ${
                    challengeState.isUnlocked
                      ? 'challenge-unlocked border-fuchsia-300/35 bg-fuchsia-300/[0.06]'
                      : 'border-white/10 bg-white/[0.025] opacity-45'
                  }`}
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <span
                        className={`border px-2 py-1 text-xs font-bold ${
                          challengeState.isUnlocked
                            ? 'border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100'
                            : 'border-slate-600 bg-slate-800/50 text-slate-400'
                        }`}
                      >
                        {challenge.level}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {challenge.title}
                      </h3>
                    </div>
                    {challengeState.isUnlocked && challengePrompt && (
                      <ChallengeHint prompt={challengePrompt} />
                    )}
                    {!challengeState.isUnlocked && (
                      <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        <LockIcon />
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {challenge.goal}
                  </p>
                  <div className="mt-3">
                    <Checklist
                      idPrefix={`${task.id}-${challenge.level}-${index}`}
                      items={challenge.criteria ?? []}
                      checkedItems={challengeState.checkedItems}
                      onToggle={challengeState.toggle}
                      disabled={!challengeState.isUnlocked}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </DetailSection>

        <HelpSystem
          errors={task.commonErrors ?? []}
          isOpen={isHelpOpen}
          onToggle={() => setIsHelpOpen((current) => !current)}
        />
      </div>
    </aside>
  );
}

function HelpSystem({ errors, isOpen, onToggle }) {
  return (
    <section className="border border-amber-300/25 bg-amber-300/[0.035] p-4 shadow-[0_0_28px_rgba(251,191,36,0.08)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
            Hint System
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            卡關時打開求救訊號，直接複製對應提示詞。
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-amber-200/45 bg-amber-300/12 px-4 py-2 text-sm font-bold text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)] transition hover:border-amber-100/70 hover:bg-amber-300/20"
        >
          <span aria-hidden="true">!</span>
          {isOpen ? '收起求救' : '求救按鈕'}
        </button>
      </div>

      {isOpen && (
        <div className="hint-panel mt-4 space-y-3">
          {errors.map((error) => (
            <HelpErrorCard key={error.id} error={error} />
          ))}
        </div>
      )}
    </section>
  );
}

function HelpErrorCard({ error }) {
  const prompt = error.helpPrompt ?? '';

  return (
    <article className="min-w-0 border border-amber-200/20 bg-black/24 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-amber-200/35 bg-amber-300/10 text-sm font-black text-amber-100">
          ?
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-100">{error.symptom}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            <span className="font-semibold text-slate-100">Cause: </span>
            {error.possibleCause}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <CopyableCodeBlock label="Help Prompt" value={prompt} maxHeight="max-h-52" />
      </div>
    </article>
  );
}

function DetailSection({ title, children }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default TaskDetailPanel;
