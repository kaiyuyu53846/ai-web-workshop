import CopyableCodeBlock from './CopyableCodeBlock.jsx';

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

export default HelpSystem;
