import { useState, useRef, useEffect, useCallback } from "react";
import { useAiChat } from "../../customHooks/useAiChat";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FiSend,
  FiImage,
  FiUser,
  FiCpu,
  FiSquare,
  FiPlus,
  FiTrash2,
  FiX,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiRefreshCw,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { ScrollReveal, ScrollRevealGroup } from "../common/ScrollReveal";

const CodeBlock = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative group my-4 rounded-xl overflow-hidden border border-line-strong">
        <div className="flex items-center justify-between px-4 py-2 bg-surface text-fg-secondary text-xs">
          <span className="font-mono">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 hover:text-primary-contrast transition-colors"
          >
            {copied ? (
              <FiCheck className="w-3.5 h-3.5 text-success-text" />
            ) : (
              <FiCopy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: "1rem", background: "#1e1e1e" }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }
  return (
    <code
      className={`${className || ""} bg-primary/10 text-primary-text px-1.5 py-0.5 rounded-md text-sm`}
      {...props}
    >
      {children}
    </code>
  );
};

/**
 * Production-ready AI Chatbot Component for Nexora AI
 * Features:
 * - Single, unified input bar at the bottom
 * - Multimodal image attachment with live preview & in-bubble display
 * - Automatic database persistence of user prompt, image, and AI responses under conversations
 * - Real-time SSE streaming with Gemini 2.5 Flash
 */
export const AiChatBox = ({
  conversationId = null,
  activeConversation = null,
  onSessionCreated,
  onConversationUpdated,
  onNewChat,
  onDeleteConversation,
  systemInstruction = "You are Nexora AI, a brilliant, helpful, and concise AI assistant.",
  model = "gemini-3.5-flash",
  className = "",
}) => {
  const [currentModel, setCurrentModel] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("nexora_user_settings") || "{}",
      );
      if (saved.defaultModel && saved.defaultModel.startsWith("gemini")) {
        if (
          saved.defaultModel === "gemini-2.0-flash" ||
          saved.defaultModel === "gemini-1.5-flash"
        ) {
          return "gemini-3.5-flash";
        }
        return saved.defaultModel;
      }
      return "gemini-3.5-flash";
    } catch {
      return "gemini-3.5-flash";
    }
  });

  const {
    messages,
    input,
    setInput,
    selectedImage,
    setSelectedImage,
    sendMessage,
    stop,
    isLoading,
    isStreaming,
    isHistoryLoading,
    error,
  } = useAiChat({
    conversationId,
    systemInstruction,
    model: currentModel || model,
    onSessionCreated,
    onConversationUpdated,
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom on new tokens or messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-adjust textarea height
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 24), 160)}px`;
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustHeight();
  };

  // Handle image selection & convert to base64
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();

    reader.onload = () => {
      setSelectedImage({
        file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        previewUrl,
        base64: reader.result,
      });
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeSelectedImage = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if ((!input.trim() && !selectedImage) || isLoading || isStreaming) return;

    sendMessage();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`flex flex-col h-full min-h-0 w-full max-w-4xl mx-auto rounded-2xl bg-surface/90 backdrop-blur-xl border border-line-strong shadow-2xl overflow-hidden font-inter ${className}`}
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan p-0.5 shadow-md shadow-primary/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-canvas rounded-[10px] flex items-center justify-center">
              <FiCpu className="w-4 h-4 text-accent-text animate-pulse" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-fg text-sm sm:text-base truncate">
                {activeConversation?.title || "Nexora AI"}
              </h3>
              <div className="relative inline-flex items-center">
                <select
                  value={currentModel}
                  onChange={(e) => {
                    const newModel = e.target.value;
                    setCurrentModel(newModel);
                    try {
                      const saved = JSON.parse(
                        localStorage.getItem("nexora_user_settings") || "{}",
                      );
                      localStorage.setItem(
                        "nexora_user_settings",
                        JSON.stringify({ ...saved, defaultModel: newModel }),
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  title="Select AI Model"
                  className="text-[10px] font-semibold tracking-wider pl-2 pr-5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary-text outline-none cursor-pointer appearance-none hover:bg-primary/25 transition-all"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  <option value="gemini-flash-latest">
                    Gemini Flash Latest
                  </option>
                </select>
                <IoSparkles className="w-2.5 h-2.5 text-primary-text absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <p className="text-[11px] text-fg-muted truncate">
              {isStreaming
                ? "Streaming response..."
                : isLoading
                  ? "Thinking..."
                  : "Real-time AI Chat & Vision"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {conversationId && (
            <button
              type="button"
              onClick={onNewChat}
              title="Start a new chat"
              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-text border border-line-strong transition-all text-xs flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <FiPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          {conversationId && onDeleteConversation && (
            <button
              type="button"
              onClick={() => onDeleteConversation(conversationId)}
              title="Delete this conversation"
              className="p-1.5 rounded-xl text-fg-muted hover:text-error-text hover:bg-error/10 border border-transparent hover:border-error/20 transition-all text-xs cursor-pointer"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable Message View ── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4">
        {isHistoryLoading ? (
          <div className="h-full flex items-center justify-center text-xs text-fg-muted gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            Loading conversation history...
          </div>
        ) : messages.length === 0 ? (
          <ScrollReveal
            animation="fade-up"
            distance="24px"
            className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-violet/20 to-brand-cyan/20 border border-primary/30 flex items-center justify-center shadow-lg">
              <IoSparkles className="w-7 h-7 text-primary-text" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base sm:text-lg font-bold text-fg">
                How can I assist you today?
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Type a prompt, attach an image for visual analysis, and receive
                instant, real-time streamed responses.
              </p>
            </div>

            {/* Quick Starters */}
            <ScrollRevealGroup
              stagger={0.06}
              animation="fade-up"
              distance="16px"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md pt-2"
            >
              {[
                "Explain quantum computing simply",
                "How do Server-Sent Events (SSE) work?",
                "Analyze code architecture for clean apps",
                "Brainstorm 3 tech startup ideas",
              ].map((starter, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="text-left text-xs p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-line hover:border-primary/30 text-fg-secondary transition-all cursor-pointer"
                >
                  {starter} →
                </button>
              ))}
            </ScrollRevealGroup>
          </ScrollReveal>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shrink-0 shadow-md">
                    <FiCpu className="w-4 h-4 text-primary-contrast" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-brand-violet to-brand-indigo text-primary-contrast rounded-br-none shadow-md shadow-primary/20"
                      : "bg-surface border border-line text-fg rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* Uploaded Image Display */}
                  {msg.imageUrl && (
                    <div className="mb-2.5 overflow-hidden rounded-xl border border-line-strong">
                      <img
                        src={msg.imageUrl}
                        alt="Uploaded preview"
                        className="max-h-64 w-full object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="break-words">
                    {!isUser ? (
                      msg.content ? (
                        <div className="prose prose-sm dark:prose-invert prose-violet max-w-none">
                          <ReactMarkdown components={{ code: CodeBlock }}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.isStreaming && (
                          <span className="inline-flex items-center gap-1.5 text-fg-muted text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                            Generating response...
                          </span>
                        )
                      )
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {/* Real-time Blinking Cursor */}
                    {msg.isStreaming && msg.content && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-primary animate-pulse align-middle" />
                    )}
                  </div>
                </div>

                {/* Regenerate Button (only for last AI message, when not streaming) */}
                {!isUser &&
                  !msg.isStreaming &&
                  msg === messages[messages.length - 1] && (
                    <div className="absolute -bottom-8 left-12">
                      <button
                        onClick={() => {
                          const lastUserMsg = [...messages]
                            .reverse()
                            .find((m) => m.role === "user");
                          if (lastUserMsg)
                            sendMessage(lastUserMsg.content, {
                              base64: lastUserMsg.imageUrl,
                            });
                        }}
                        className="flex items-center gap-1.5 px-2 py-1 text-[10px] rounded-lg text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <FiRefreshCw className="w-3 h-3" /> Regenerate
                      </button>
                    </div>
                  )}

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-primary-text">
                    <FiUser className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Error notification banner */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-error/10 border border-error/25 text-error-text text-xs animate-in fade-in duration-200">
            <FiAlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-xs">AI Response Notice</p>
              <p className="text-[11px] opacity-90 leading-relaxed">{error}</p>
              {(error.includes("GOOGLE_API_KEY") ||
                error.includes("API key") ||
                error.includes("quota")) && (
                <p className="text-[11px] text-primary-text font-medium pt-1">
                  Tip: Verify your API key or configure your custom Google
                  Gemini API Key in Settings &rarr; Personalization.
                </p>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Single Unified Input Bar at the Bottom ── */}
      <div className="pt-2 pb-5 sm:pb-6 px-4 sm:px-6 border-t border-line bg-surface/70 backdrop-blur-md shrink-0">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hidden Image File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Selected Image Attachment Preview Chip */}
          {selectedImage && (
            <div className="mb-2.5 inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-primary/10 border border-line-strong shadow-xs animate-in fade-in zoom-in-95 duration-150">
              <img
                src={selectedImage.previewUrl}
                alt="Attachment thumbnail"
                className="w-8 h-8 rounded-lg object-cover border border-primary/30"
              />
              <div className="flex flex-col min-w-0 max-w-[160px] sm:max-w-[220px]">
                <span className="truncate text-xs font-medium text-fg">
                  {selectedImage.name}
                </span>
                <span className="text-[10px] text-fg-muted">
                  {selectedImage.size}
                </span>
              </div>
              <button
                type="button"
                onClick={removeSelectedImage}
                title="Remove image"
                className="p-1 rounded-full text-fg-muted hover:text-error-text hover:bg-error/10 transition-colors ml-1 cursor-pointer"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Unified Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e);
            }}
            className="relative flex items-center rounded-2xl bg-surface/95 border border-primary/25 focus-within:border-primary/60 shadow-[0_4px_20px_rgb(var(--scrim-rgb)/0.06)] dark:shadow-[0_4px_24px_rgb(var(--scrim-rgb)/0.4)] transition-all px-2.5 py-2"
          >
            {/* Image Upload Action Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach an image"
              disabled={isLoading || isStreaming}
              className="p-2 rounded-xl text-fg-muted hover:text-primary-text hover:bg-primary/15 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              <FiImage className="w-5 h-5" />
            </button>

            {/* Prompt Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isStreaming
                  ? "AI is streaming response..."
                  : selectedImage
                    ? "Add a prompt or question about this image..."
                    : "Ask anything (Press Enter to send)..."
              }
              disabled={isLoading || isStreaming}
              className="flex-1 bg-transparent px-2.5 py-1 text-fg placeholder:text-fg-muted text-sm outline-none resize-none leading-relaxed min-h-[24px] max-h-[160px] overflow-y-auto no-scrollbar"
            />

            {/* Action Trigger: Send or Stop Button */}
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {isStreaming || isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  title="Stop generating"
                  className="w-8 h-8 rounded-xl bg-error/20 text-error-text hover:bg-error/30 border border-error/30 flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <FiSquare className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!input.trim() && !selectedImage}
                  title="Send message"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    input.trim() || selectedImage
                      ? "bg-gradient-to-tr from-brand-violet to-brand-cyan text-primary-contrast shadow-md shadow-primary/30 hover:scale-105 active:scale-95"
                      : "bg-surface-hover text-fg-muted cursor-not-allowed opacity-50"
                  }`}
                >
                  <FiSend className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                </button>
              )}
            </div>
          </form>

          {/* Bottom disclaimer & shortcut hint */}
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-fg-muted text-center select-none">
            <span>Nexora AI can make mistakes. Verify sensitive details.</span>
            <span className="hidden sm:inline text-fg-muted">
              ·
            </span>
            <span className="hidden sm:inline text-fg-muted">
              Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-surface-hover border border-line-strong text-[10px] font-mono">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1 py-0.5 rounded bg-surface-hover border border-line-strong text-[10px] font-mono">
                Shift+Enter
              </kbd>{" "}
              for newline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;
