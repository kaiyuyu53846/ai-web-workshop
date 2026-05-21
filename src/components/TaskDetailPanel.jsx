import { useEffect, useState } from 'react';
import ChallengeHint from './ChallengeHint.jsx';
import { getChallengePrompt } from '../utils/challengeUtils.js';
import Checklist from './Checklist.jsx';
import CopyableCodeBlock from './CopyableCodeBlock.jsx';
import LockIcon from './icons/LockIcon.jsx';
import HelpSystem from './HelpSystem.jsx';
import PromptSections from './PromptSections.jsx';

function TaskDetailPanel({ task, taskProgress, layout = 'sidebar' }) {
  const acceptanceState = taskProgress.getAcceptanceState(task.id);
  const hasPromptSections =
    Array.isArray(task.promptSections) && task.promptSections.length > 0;
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
          {hasPromptSections ? (
            <PromptSections sections={task.promptSections} />
          ) : (
            <CopyableCodeBlock
              label="Fixed Prompt"
              value={task.fixedPrompt}
              maxHeight="max-h-80"
            />
          )}
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
