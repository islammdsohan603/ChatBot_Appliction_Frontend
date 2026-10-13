import { useState, useRef, useEffect } from "react";
import { FiCpu, FiLock, FiChevronDown, FiCheck } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

export const AVAILABLE_MODELS = [
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    description: "Ultra-fast response speeds, multimodal vision & coding",
    isProOnly: false,
    badge: "Default",
  },
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    description: "High-speed reasoning for concise questions & research",
    isProOnly: false,
    badge: "Fast",
  },
  {
    id: "gemini-3.5-pro",
    name: "Gemini 3.5 Pro",
    description: "Deep thinking LLM for architecture, hard logic & math",
    isProOnly: true,
    badge: "PRO",
  },
  {
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    description: "Hybrid fast-thinking model with dynamic deliberation",
    isProOnly: true,
    badge: "PRO",
  },
];

export const ModelSelector = ({
  currentModel = "gemini-3.8-flash",
  onSelectModel,
  userTier = "free",
  onLockedModelClick,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isPro = userTier === "pro" || userTier === "enterprise";

  const selectedModelInfo =
    AVAILABLE_MODELS.find((m) => m.id === currentModel) || AVAILABLE_MODELS[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (model) => {
    if (model.isProOnly && !isPro) {
      setIsOpen(false);
      onLockedModelClick?.({
        reason: "MODEL_RESTRICTED",
        model: model.name,
        error: `${model.name} is an advanced reasoning engine reserved for Pro subscribers. Upgrade to Pro to unlock it.`,
      });
      return;
    }
    onSelectModel?.(model.id);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-hover/80 hover:bg-surface-hover border border-line-strong hover:border-primary/40 text-[11px] font-semibold text-fg transition-all cursor-pointer shadow-2xs disabled:opacity-50"
        aria-label="Select AI model"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        <span className="truncate max-w-[110px] sm:max-w-none">
          {selectedModelInfo.name}
        </span>
        {selectedModelInfo.isProOnly && (
          <span className="px-1 py-0.2 rounded-md bg-amber-500/15 text-[9px] font-bold text-amber-500">
            PRO
          </span>
        )}
        <FiChevronDown
          className={`w-3 h-3 text-fg-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 rounded-2xl bg-surface border border-line-strong shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-line mb-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
              Select AI Reasoning Engine
            </p>
            <p className="text-[11px] text-fg-secondary mt-0.5">
              Pro members have unlimited access to all models.
            </p>
          </div>

          <div className="space-y-1">
            {AVAILABLE_MODELS.map((m) => {
              const isSelected = m.id === currentModel;
              const isLocked = m.isProOnly && !isPro;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelect(m)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border border-primary/25"
                      : "hover:bg-surface-hover border border-transparent"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isLocked
                        ? "bg-amber-500/10 text-amber-500"
                        : isSelected
                        ? "bg-primary/20 text-primary-text"
                        : "bg-fg-muted/10 text-fg-muted"
                    }`}
                  >
                    {isLocked ? (
                      <FiLock className="w-3.5 h-3.5" />
                    ) : (
                      <FiCpu className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-fg truncate">
                        {m.name}
                      </span>
                      {m.isProOnly ? (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 border border-amber-500/25 text-[9px] font-extrabold text-amber-500 flex items-center gap-0.5">
                          <IoSparkles className="w-2.5 h-2.5" />
                          PRO
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded-md bg-fg-muted/10 text-[9px] font-semibold text-fg-muted">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-fg-muted line-clamp-1 mt-0.5">
                      {m.description}
                    </p>
                  </div>

                  {isSelected && (
                    <FiCheck className="w-4 h-4 text-primary-text shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
