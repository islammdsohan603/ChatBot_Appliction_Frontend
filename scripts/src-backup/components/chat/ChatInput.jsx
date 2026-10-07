/**
 * ChatInput — ChatGPT-style floating prompt and message input bar.
 *
 
 
 */
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMic,
  FiGlobe,
  FiX,
  FiImage,
  FiFileText,
  FiSquare,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

const POPULAR_EMOJIS = [
  "👍", "❤️", "🔥", "🚀", "😂", "✨",
  "💡", "🎉", "👏", "💯", "🙌", "🤖",
  "👀", "⚡", "🤝", "🙏", "😍", "🎯"
];

const ChatInput = ({
  onSend,
  disabled = false,
  isLoading = false,
  placeholder = "Message Nexora…",
  onStop,
  showStarters = false,
  onSelectStarter,
}) => {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [webSearchActive, setWebSearchActive] = useState(false);
  const [deepThinkActive, setDeepThinkActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const newHeight = Math.min(Math.max(el.scrollHeight, 26), 180);
    el.style.height = `${newHeight}px`;
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    adjustTextareaHeight();
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if ((!trimmed && attachments.length === 0) || disabled || isLoading) return;

    if (onSend) {
      onSend({
        text: trimmed,
        attachments,
        webSearch: webSearchActive,
        deepThink: deepThinkActive,
      });
    }

    setText("");
    setAttachments([]);
    setShowEmojiPicker(false);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [
    text,
    attachments,
    disabled,
    isLoading,
    onSend,
    webSearchActive,
    deepThinkActive,
    isRecording,
  ]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSend();
    }
  };

  // File handling
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    e.target.value = "";
  };

  const processFiles = (files) => {
    const mapped = files.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      type: file.type,
      isImage: file.type.startsWith("image/"),
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      raw: file,
    }));
    setAttachments((prev) => [...prev, ...mapped]);
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const removed = prev.find((a) => a.id === id);
      if (removed?.previewUrl) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  // Drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Clipboard paste (image support)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      processFiles(files);
    }
  };

  // Toggle Voice Dictation
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  // Insert emoji
  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    adjustTextareaHeight();
  };

  const canSend = (text.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pt-2 pb-6 sm:pb-7 flex flex-col items-center shrink-0">
      {/* Optional starter chips */}
      {showStarters && (
        <div className="w-full flex items-center justify-center gap-2 mb-3 flex-wrap">
          {[
            { label: "👋 Say hello", prompt: "Hello! Hope you're having a great day." },
            { label: "💡 Brainstorm ideas", prompt: "Let's brainstorm some innovative ideas for our project." },
            { label: "🚀 Project update", prompt: "Can you provide a quick update on current progress?" },
            { label: "📅 Schedule a sync", prompt: "Are you free for a quick sync later today?" },
          ].map((starter, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(starter.prompt);
                onSelectStarter?.(starter.prompt);
                textareaRef.current?.focus();
                adjustTextareaHeight();
              }}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#111840]/90 border border-violet-300/40 dark:border-violet-500/20 text-slate-700 dark:text-slate-300 hover:text-violet-900 dark:hover:text-white hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all shadow-xs"
            >
              {starter.label}
            </button>
          ))}
        </div>
      )}

      {/* Main ChatGPT Input Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full relative rounded-[28px] transition-all duration-300 ${
          isDragging
            ? "border-2 border-dashed border-cyan-400 bg-cyan-950/20 shadow-[0_0_24px_rgba(6,182,212,0.25)]"
            : isFocused
            ? "border border-violet-500/60 bg-white/95 dark:bg-[#0f1430]/95 shadow-[0_8px_32px_rgba(139,92,246,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(168,85,247,0.25)]"
            : "border border-violet-300/40 dark:border-violet-500/20 bg-white/90 dark:bg-[#0d1230]/90 hover:border-violet-400/60 dark:hover:border-violet-500/35 shadow-md dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
        } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Attachment preview chips */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 p-3 pb-1 overflow-x-auto no-scrollbar border-b border-violet-500/10">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="relative group flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-violet-50 dark:bg-[#171e4a] border border-violet-300/40 dark:border-violet-500/20 text-slate-800 dark:text-slate-200 text-xs shrink-0 max-w-[200px]"
              >
                {file.isImage && file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-7 h-7 rounded-lg object-cover border border-violet-500/30"
                  />
                ) : file.isImage ? (
                  <FiImage className="w-4 h-4 text-violet-500 dark:text-violet-400 shrink-0" />
                ) : (
                  <FiFileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{file.size}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.id)}
                  aria-label="Remove attachment"
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Area */}
        <div className="px-4 pt-3 pb-1">
          <textarea
            ref={textareaRef}
            id="chatgpt-prompt-input"
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            aria-label="Prompt input"
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500/70 text-[15px] resize-none outline-none leading-relaxed min-h-[26px] max-h-[180px] overflow-y-auto no-scrollbar"
            style={{ height: "auto" }}
          />
        </div>

        {/* Bottom Toolbar inside the input pill */}
        <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
          {/* Left Action cluster */}
          <div className="flex items-center gap-1.5">
            {/* Plus / Attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach files or images"
              title="Attach files or photos"
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-violet-500/15 border border-transparent hover:border-violet-500/20 transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              <FiPaperclip className="w-4 h-4" />
            </button>

            {/* Web Search toggle (ChatGPT style) */}
            <button
              type="button"
              onClick={() => setWebSearchActive((v) => !v)}
              aria-label="Search the web"
              title="Search the web"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                webSearchActive
                  ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-violet-500/10 border border-transparent"
              }`}
            >
              <FiGlobe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Search</span>
            </button>

            {/* Deep Think / Reason toggle */}
            <button
              type="button"
              onClick={() => setDeepThinkActive((v) => !v)}
              aria-label="Deep Think / Reason"
              title="Deep Think mode"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                deepThinkActive
                  ? "bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-violet-500/10 border border-transparent"
              }`}
            >
              <IoSparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Reason</span>
            </button>

            {/* Emoji popover button */}
            <div className="relative" ref={emojiPickerRef}>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                aria-label="Add emoji"
                title="Add emoji"
                className={`p-2 rounded-full transition-all shrink-0 cursor-pointer ${
                  showEmojiPicker
                    ? "text-violet-600 dark:text-violet-400 bg-violet-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-violet-500/15"
                }`}
              >
                <FiSmile className="w-4 h-4" />
              </button>

              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-2.5 rounded-2xl bg-white dark:bg-[#111840] border border-violet-300/40 dark:border-violet-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-xl z-50 w-64 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 px-1 uppercase tracking-wider">
                    Quick Reactions
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {POPULAR_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 rounded-lg hover:bg-violet-500/15 flex items-center justify-center text-lg hover:scale-125 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action cluster: Dictation & Send Button */}
          <div className="flex items-center gap-1.5">
            {/* Voice Dictation (Mic) */}
            <button
              type="button"
              onClick={toggleRecording}
              aria-label={isRecording ? "Stop dictation" : "Voice dictation"}
              title={isRecording ? "Stop recording" : "Dictate message"}
              className={`p-2 rounded-full transition-all shrink-0 cursor-pointer ${
                isRecording
                  ? "bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/40 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-violet-500/15"
              }`}
            >
              <FiMic className="w-4 h-4" />
            </button>

            {/* Stop Loading Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                aria-label="Stop generating"
                title="Stop generating"
                className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <FiSquare className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              /* Send Button with react-icons FiSend */
              <button
                type="button"
                onClick={handleSend}
                disabled={!canSend}
                aria-label="Send prompt"
                title={canSend ? "Send message (Enter)" : "Type a message to send"}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                  canSend
                    ? "bg-gradient-to-tr from-violet-500 to-cyan-500 text-white shadow-[0_2px_14px_rgba(139,92,246,0.45)] hover:scale-105 active:scale-95"
                    : "bg-black/10 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                }`}
              >
                <FiSend className="w-3.5 h-3.5 translate-x-[-1px] translate-y-[1px]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom disclaimer & shortcut hint */}
      <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-500/80 text-center select-none">
        <span>Nexora can make mistakes. Verify sensitive details.</span>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-600">·</span>
        <span className="hidden sm:inline text-slate-400 dark:text-slate-500/60">
          <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 text-[10px] font-mono text-slate-700 dark:text-slate-400">
            Enter
          </kbd>{" "}
          send,{" "}
          <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 text-[10px] font-mono text-slate-700 dark:text-slate-400">
            Shift+Enter
          </kbd>{" "}
          newline
        </span>
      </div>
    </div>
  );
};

export default ChatInput;
