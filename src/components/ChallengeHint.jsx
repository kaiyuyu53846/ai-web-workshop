import { useState } from 'react';
import CopyableCodeBlock from './CopyableCodeBlock.jsx';

function ChallengeHint({ prompt }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="contents">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto inline-flex min-h-9 shrink-0 items-center gap-2 border border-amber-200/35 bg-amber-300/10 px-3 py-1.5 text-xs font-bold text-amber-100 transition hover:border-amber-100/70 hover:bg-amber-300/18"
      >
        <span aria-hidden="true">?</span>
        {isOpen ? '收合提示' : '提示詞'}
      </button>

      {isOpen && (
        <div className="hint-panel mt-3 w-full basis-full">
          <CopyableCodeBlock label="Challenge Prompt" value={prompt} />
        </div>
      )}
    </div>
  );
}

export default ChallengeHint;
