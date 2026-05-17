import { useEffect, useState } from 'react';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"%3E%3Cdefs%3E%3ClinearGradient id="a" x1="0" x2="1" y1="0" y2="1"%3E%3Cstop stop-color="%2300e5ff"/%3E%3Cstop offset=".52" stop-color="%2314273f"/%3E%3Cstop offset="1" stop-color="%23ff4da6"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="520" fill="%23070b16"/%3E%3Cpath d="M96 344 260 172l126 112 86-74 232 220H96z" fill="url(%23a)" opacity=".72"/%3E%3Ccircle cx="614" cy="126" r="58" fill="%2300e5ff" opacity=".34"/%3E%3Cg fill="none" stroke="%23e2e8f0" stroke-opacity=".2"%3E%3Cpath d="M64 64h672v392H64z"/%3E%3Cpath d="M112 112h576M112 408h576M112 112v296M688 112v296"/%3E%3C/g%3E%3C/svg%3E';

const INITIAL_CARD_STYLE = {
  '--rotate-x': '0deg',
  '--rotate-y': '0deg',
  '--shine-x': '50%',
  '--shine-y': '50%',
};

function TaskCard({ task, isSelected, onSelect }) {
  const taskImageUrl = task.imageUrl?.trim();
  const [imageSrc, setImageSrc] = useState(taskImageUrl || PLACEHOLDER_IMAGE);

  useEffect(() => {
    setImageSrc(taskImageUrl || PLACEHOLDER_IMAGE);
  }, [taskImageUrl]);

  function handleMouseMove(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    const rotateY = (xPercent - 0.5) * 8;
    const rotateX = (0.5 - yPercent) * 8;

    card.style.setProperty('--rotate-x', `${rotateX.toFixed(2)}deg`);
    card.style.setProperty('--rotate-y', `${rotateY.toFixed(2)}deg`);
    card.style.setProperty('--shine-x', `${(xPercent * 100).toFixed(2)}%`);
    card.style.setProperty('--shine-y', `${(yPercent * 100).toFixed(2)}%`);
  }

  function handleMouseLeave(event) {
    const card = event.currentTarget;

    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--shine-x', '50%');
    card.style.setProperty('--shine-y', '50%');
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={INITIAL_CARD_STYLE}
      className={`group relative flex min-h-[390px] w-full min-w-0 cursor-pointer flex-col overflow-hidden border bg-slate-950/72 shadow-[0_0_28px_rgba(0,229,255,0.08)] outline-none backdrop-blur transition-[transform,box-shadow,border-color] duration-300 ease-out [transform:perspective(900px)_rotateX(var(--rotate-x))_rotateY(var(--rotate-y))] [transform-style:preserve-3d] hover:border-cyan-200/45 hover:shadow-[0_22px_54px_rgba(0,229,255,0.16)] focus-visible:border-cyan-200/70 focus-visible:ring-2 focus-visible:ring-cyan-300/50 md:min-h-[430px] ${
        isSelected
          ? 'border-cyan-200/70 shadow-[0_22px_58px_rgba(0,229,255,0.18)]'
          : 'border-cyan-300/20'
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--shine-x)_var(--shine-y),rgba(255,255,255,0.08),rgba(0,229,255,0.07)_18%,rgba(255,77,166,0.05)_34%,transparent_58%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_14%,rgba(255,255,255,0.05)_26%,transparent_38%,rgba(0,229,255,0.05)_54%,transparent_70%,rgba(255,77,166,0.05)_84%,transparent)] opacity-55" />
      </div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
      <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(0,229,255,0.1),rgba(15,23,42,0.55)_42%,rgba(2,6,23,0.96)_100%)] p-2 sm:p-3">
        <img
          src={imageSrc}
          alt={task.shortTitle || task.title}
          onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
          className="h-full w-full object-contain opacity-90 transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-extrabold leading-tight text-white md:text-xl">
            {task.title}
          </h2>
          <span className="shrink-0 border border-fuchsia-300/30 bg-fuchsia-400/10 px-2.5 py-1 text-xs font-semibold text-fuchsia-100">
            {task.estimatedMinutes}m
          </span>
        </div>

        <p className="line-clamp-4 text-sm leading-6 text-slate-300">
          {task.description}
        </p>

        <div className="mt-auto pt-5">
          <div className="border-l-2 border-cyan-300/70 bg-cyan-300/8 px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              Pass Line
            </p>
            <p className="mt-1 text-sm text-slate-100">{task.minimumPassLine}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
