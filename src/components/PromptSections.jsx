import { useEffect, useRef, useState } from 'react';
import { copyToClipboard } from '../utils/copyToClipboard.js';
import {
  PROMPT_CONTENT_CLASS_NAME,
  PROMPT_TEXTAREA_CLASS_NAME,
} from './CopyableCodeBlock.jsx';

const helperTextClass = 'text-xs leading-5 text-slate-400';
const copyButtonClass =
  'inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-cyan-200/35 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold text-cyan-100 transition hover:border-cyan-100/70 hover:bg-cyan-300/18';

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

function PromptSections({ sections }) {
  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <PromptSection
          key={section.id}
          section={section}
        />
      ))}
    </div>
  );
}

function PromptSection({ section }) {
  const isCollapsedByDefault = Boolean(section.defaultCollapsed);
  const copyText = getSectionCopyText(section);

  return (
    <details
      open={!isCollapsedByDefault}
      className="group border border-amber-200/20 bg-slate-950/55"
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 border-b border-white/10 bg-amber-300/[0.045] px-3 py-2 transition hover:bg-amber-300/[0.075]">
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-white">{section.title}</h4>
          <p className={`mt-1 ${helperTextClass}`}>
            {getSectionSubtitle(section)}
          </p>
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 group-open:hidden">
          Open
        </span>
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 group-open:inline">
          Close
        </span>
      </summary>
      <PromptSectionContent
        section={section}
        copyText={copyText}
      />
    </details>
  );
}

function PromptSectionContent({ section, copyText }) {
  const [copyState, setCopyState] = useState('idle');
  const [isManualMode, setIsManualMode] = useState(false);
  const manualTextareaRef = useRef(null);
  const isCopyable = Boolean(copyText);

  useEffect(() => {
    if (!isManualMode || !copyText) {
      return;
    }

    window.setTimeout(() => {
      manualTextareaRef.current?.focus();
      manualTextareaRef.current?.select();
      manualTextareaRef.current?.setSelectionRange(0, copyText.length);
    }, 0);
  }, [isManualMode, copyText]);

  async function copySection() {
    if (!copyText) {
      return;
    }

    const result = await copyToClipboard(copyText);

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
    <div className="space-y-3 p-3">
      <div className="border border-white/10 bg-black/18">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.025] px-3 py-2">
          <p className={helperTextClass}>{getContentIntro(section)}</p>
          {isCopyable && (
            <button
              type="button"
              onClick={copySection}
              className={copyButtonClass}
            >
              <CopyIcon />
              {copyState === 'copied'
                ? 'Copied'
                : copyState === 'manual'
                  ? 'Manual'
                  : 'Copy'}
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-auto p-3">
          <PromptSectionBody section={section} />
        </div>
      </div>
      {isManualMode && (
        <div className="border border-amber-200/25 bg-black/24 p-3">
          <p className={`mb-2 ${helperTextClass}`}>
            請長按文字進行複製
          </p>
          <textarea
            ref={manualTextareaRef}
            readOnly
            value={copyText}
            className={`${PROMPT_TEXTAREA_CLASS_NAME} min-h-24 w-full resize-y overflow-auto border border-amber-200/25 bg-black/35 p-3 outline-none selection:bg-cyan-300/35`}
          />
        </div>
      )}
    </div>
  );
}

function PromptSectionBody({ section }) {
  if (section.type === 'quickReplies') {
    const items = section.items ?? [];

    if (items.length === 0) {
      return (
        <p className={PROMPT_CONTENT_CLASS_NAME}>
          這個區塊目前沒有可追加的句子。
        </p>
      );
    }

    return (
      <ul className={`space-y-2 ${PROMPT_CONTENT_CLASS_NAME}`}>
        {items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex gap-2"
          >
            <span
              aria-hidden="true"
              className="mt-[0.75em] h-1.5 w-1.5 shrink-0 bg-amber-200/75"
            />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section.type === 'instruction') {
    return (
      <p className={`whitespace-pre-wrap ${PROMPT_CONTENT_CLASS_NAME}`}>
        {section.content}
      </p>
    );
  }

  return (
    <pre className={`whitespace-pre-wrap ${PROMPT_CONTENT_CLASS_NAME}`}>
      {section.content ?? ''}
    </pre>
  );
}

function getSectionCopyText(section) {
  if (section.type === 'quickReplies') {
    return (section.items ?? []).join('\n');
  }

  if (section.type === 'copyBlock') {
    return section.content ?? '';
  }

  return '';
}

function getSectionSubtitle(section) {
  if (section.type === 'quickReplies') {
    return '展開後可一次複製整組追加提示詞';
  }

  if (section.type === 'instruction') {
    return '展開後閱讀這段操作提醒';
  }

  return '展開後可複製這段提示詞';
}

function getContentIntro(section) {
  if (section.type === 'quickReplies') {
    return `請把下面這段追加給 ${section.target ?? 'AI'}：`;
  }

  if (section.type === 'instruction') {
    return '請先閱讀這段說明';
  }

  return '請複製下面這段提示詞';
}

export default PromptSections;
