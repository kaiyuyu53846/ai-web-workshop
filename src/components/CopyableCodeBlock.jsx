import { useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '../utils/copyToClipboard.js';

export const PROMPT_CONTENT_CLASS_NAME =
  'font-mono text-xs font-normal leading-6 tracking-normal text-slate-200';

export const PROMPT_TEXTAREA_CLASS_NAME =
  'font-mono text-xs font-normal leading-6 tracking-normal text-slate-100';

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CopyableCodeBlock({ label = 'Prompt', value, maxHeight = 'max-h-56' }) {
  const [copyState, setCopyState] = useState('idle');
  const [isManualMode, setIsManualMode] = useState(false);
  const manualTextareaRef = useRef(null);

  useEffect(() => {
    if (!isManualMode) {
      return;
    }

    window.setTimeout(() => {
      manualTextareaRef.current?.focus();
      manualTextareaRef.current?.select();
      manualTextareaRef.current?.setSelectionRange(0, value.length);
    }, 0);
  }, [isManualMode, value]);

  async function copyValue() {
    const result = await copyToClipboard(value);

    if (result.status === 'copied') {
      setIsManualMode(false);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1400);
      return;
    }

    setIsManualMode(true);
    setCopyState('manual');
  }

  return (
    <div className="max-w-full min-w-0 overflow-hidden border border-amber-200/20 bg-slate-950/82 shadow-[inset_0_0_24px_rgba(251,191,36,0.04),0_0_22px_rgba(251,191,36,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-amber-300/[0.06] px-3 py-2">
        <span className="min-w-0 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
          {label}
        </span>
        <button
          type="button"
          onClick={copyValue}
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-cyan-200/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100 transition hover:border-cyan-100/70 hover:bg-cyan-300/18"
        >
          <CopyIcon />
          {copyState === 'copied'
            ? 'Copied'
            : copyState === 'manual'
              ? 'Long Press To Copy'
              : 'Copy'}
        </button>
      </div>
      {isManualMode ? (
        <div className="space-y-2 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
            請長按文字進行複製
          </p>
          <textarea
            ref={manualTextareaRef}
            readOnly
            value={value}
            className={`${maxHeight} ${PROMPT_TEXTAREA_CLASS_NAME} min-h-44 w-full resize-y overflow-auto border border-amber-200/25 bg-black/35 p-3 outline-none selection:bg-cyan-300/35`}
          />
        </div>
      ) : (
        <pre
          className={`${maxHeight} ${PROMPT_CONTENT_CLASS_NAME} max-w-full overflow-auto whitespace-pre-wrap p-3`}
        >
          {value}
        </pre>
      )}
    </div>
  );
}

export default CopyableCodeBlock;
