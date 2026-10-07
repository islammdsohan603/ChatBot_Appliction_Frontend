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
      <div className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm bg-surface border border-line-strong shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot animate-typing-dot inline-block" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot animate-typing-dot inline-block" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary typing-dot animate-typing-dot inline-block" />
      </div>
      {/* Label */}
      <span className="text-xs text-fg-muted italic">{name} is typing…</span>
    </div>
  );
};

export default TypingIndicator;
