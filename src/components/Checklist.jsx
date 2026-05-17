function Checklist({ idPrefix, items, checkedItems, onToggle, disabled = false }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const inputId = `${idPrefix}-criteria-${index}`;
        const isChecked = Boolean(checkedItems[index]);

        return (
          <label
            key={item}
            htmlFor={inputId}
            className={`flex min-h-12 gap-3 border px-3 py-3 text-sm leading-6 transition ${
              disabled
                ? 'cursor-not-allowed border-white/8 bg-white/[0.02] text-slate-500'
                : isChecked
                ? 'border-cyan-300/45 bg-cyan-300/10 text-cyan-50'
                : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-300/30'
            }`}
          >
            <input
              id={inputId}
              type="checkbox"
              checked={isChecked}
              disabled={disabled}
              onChange={() => onToggle(index)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-cyan-300"
            />
            <span className={isChecked ? 'line-through decoration-cyan-200/70' : ''}>
              {item}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default Checklist;
