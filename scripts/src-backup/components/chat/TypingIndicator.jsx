/**
 * TypingIndicator — Shows animated "... is typing" indicator.
 *
 * Props:
 *  - name: string (e.g. "Alex")
 */
const TypingIndicator = ({ name = "Someone" }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 animate-fadeIn">
      {/* Dots bubble */}
      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-white dark:bg-[#111840] border border-violet-200/80 dark:border-violet-500/10 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 typing-dot animate-typing-dot inline-block" />
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 typing-dot animate-typing-dot inline-block" />
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 typing-dot animate-typing-dot inline-block" />
      </div>
      {/* Label */}
      <span className="text-xs text-slate-500 dark:text-slate-400/70 italic">{name} is typing…</span>
    </div>
  );
};

export default TypingIndicator;
