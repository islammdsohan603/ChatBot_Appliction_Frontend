import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../../../redux/userSlice";
import { toast } from "react-toastify";
import api, { API_BASE_URL } from "../../lib/api";
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
  FiDownload,
  FiLock,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { Reveal, RevealGroup, RevealItem } from "../motion";
import { motion, useReducedMotion } from "framer-motion";
import { chatUserBubbleMotion, chatBotBubbleMotion } from "../../lib/motion";
import UsageLimitModal from "./UsageLimitModal";
import UsageQuotaBadge from "./UsageQuotaBadge";
import ModelSelector from "./ModelSelector";


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
  model = "gemini-3.8-flash",
  className = "",
}) => {
  const shouldReduceMotion = useReducedMotion();
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);
  const userTier = (
    userData?.user?.subscriptionTier ||
    userData?.subscriptionTier ||
    "free"
  ).toLowerCase();

  const [usageData, setUsageData] = useState(null);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [modalLimitData, setModalLimitData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const [currentModel, setCurrentModel] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("nexora_user_settings") || "{}",
      );
      if (saved.defaultModel && saved.defaultModel.startsWith("gemini")) {
        return saved.defaultModel;
      }
      return "gemini-3.8-flash";
    } catch {
      return "gemini-3.8-flash";
    }
  });

  const fetchUsage = useCallback(async () => {
    try {
      const res = await api.get("/api/user/usage");
      if (res.data?.success) {
        setUsageData(res.data);
      }
    } catch (err) {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage, userTier]);

  const handleInstantUpgrade = async () => {
    try {
      const res = await api.post("/api/pricing/subscribe", {
        planSlug: "pro",
        testUpgrade: true,
      });
      if (res.data?.success && res.data?.user) {
        dispatch(setUserData(res.data.user));
        toast.success("🎉 Upgraded to PRO! Unlimited privileges unlocked.");
        setIsUsageModalOpen(false);
        fetchUsage();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Upgrade failed");
    }
  };

  const handleExport = async (format = "markdown") => {
    if (!conversationId || conversationId === "new") {
      toast.info("Start a conversation first to export it.");
      return;
    }

    if (userTier === "free") {
      setModalLimitData({
        reason: "EXPORT_RESTRICTED",
        error:
          "Conversation history export is an exclusive Pro feature. Upgrade to Pro to export your conversations as Markdown and JSON.",
      });
      setIsUsageModalOpen(true);
      return;
    }

    setIsExporting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/conversations/${conversationId}/export?format=${format}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setModalLimitData({
            reason: "EXPORT_RESTRICTED",
            error: err.error,
          });
          setIsUsageModalOpen(true);
          return;
        }
        throw new Error(err.error || "Failed to export");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `conversation-${conversationId}.${format === "json" ? "json" : "md"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported conversation transcript (${format.toUpperCase()})`);
    } catch (err) {
      toast.error(err.message || "Export failed");
    } finally {
      setIsExporting(false);
    }
  };

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
    limitError,
    clearLimitError,
  } = useAiChat({
    conversationId,
    systemInstruction,
    model: currentModel || model,
    onSessionCreated,
    onConversationUpdated: (updatedText) => {
      onConversationUpdated?.(updatedText);
      fetchUsage();
    },
    onLimitReached: (errData) => {
      setModalLimitData(errData);
      setIsUsageModalOpen(true);
    },
  });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll to bottom on new tokens or messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  // Auto-adjust textarea height
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 44), 180)}px`;
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustHeight();
  };

  // Drag and drop image handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      const file = files[0];
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
    }
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
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-fg text-sm sm:text-base truncate">
                {activeConversation?.title || "Nexora AI"}
              </h3>
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
          {/* Live Quota Badge */}
          <UsageQuotaBadge
            usageData={usageData}
            userTier={userTier}
            onOpenUpgradeModal={(d) => {
              setModalLimitData(d);
              setIsUsageModalOpen(true);
            }}
          />

          {/* Export Transcript Action (Pro Feature) */}
          {conversationId && conversationId !== "new" && (
            <button
              type="button"
              disabled={isExporting}
              onClick={() => handleExport("markdown")}
              title={
                userTier === "free"
                  ? "Export Conversation (Pro Feature)"
                  : "Export Conversation Transcript"
              }
              className="px-2.5 py-1.5 rounded-xl bg-surface-hover/80 hover:bg-surface-hover text-fg-secondary hover:text-fg border border-line-strong transition-all text-xs flex items-center gap-1.5 font-medium cursor-pointer shadow-2xs"
            >
              <FiDownload className="w-3.5 h-3.5 text-primary-text" />
              <span className="hidden sm:inline">Export</span>
              {userTier === "free" && (
                <span className="px-1 py-0.2 rounded bg-amber-500/15 text-[9px] font-bold text-amber-500 flex items-center gap-0.5">
                  <FiLock className="w-2.5 h-2.5" />
                  PRO
                </span>
              )}
            </button>
          )}

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
          <Reveal
            animation="fade-up"
            distance={24}
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
            <RevealGroup
              stagger={0.06}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md pt-2"
            >
              {[
                "Explain quantum computing simply",
                "How do Server-Sent Events (SSE) work?",
                "Analyze code architecture for clean apps",
                "Brainstorm 3 tech startup ideas",
              ].map((starter, idx) => (
                <RevealItem key={idx}>
                  <button
                    type="button"
                    onClick={() => sendMessage(starter)}
                    className="w-full text-left text-xs p-3 rounded-xl bg-primary/5 hover:bg-primary/10 border border-line hover:border-primary/30 text-fg-secondary transition-all cursor-pointer"
                  >
                    {starter} →
                  </button>
                </RevealItem>
              ))}
            </RevealGroup>
          </Reveal>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            const isLiveMessage =
              typeof msg.id === "string" &&
              (msg.id.startsWith("user-") || msg.id.startsWith("assistant-"));

            return (
              <motion.div
                key={msg.id}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : isLiveMessage
                    ? (isUser ? chatUserBubbleMotion.hidden : chatBotBubbleMotion.hidden)
                    : false
                }
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : isLiveMessage
                    ? (isUser ? chatUserBubbleMotion.visible : chatBotBubbleMotion.visible)
                    : { opacity: 1, x: 0, y: 0 }
                }
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
              </motion.div>
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

      {/* ── Professional Floating Input Card at the Bottom ── */}
      <div className="pt-2 pb-4 sm:pb-6 px-3 sm:px-6 shrink-0 bg-gradient-to-t from-canvas via-canvas/90 to-transparent">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hidden Image File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {/* Professional Card Wrapper */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative flex flex-col rounded-3xl bg-surface/95 dark:bg-surface/85 backdrop-blur-2xl
              border transition-all duration-200
              shadow-[0_8px_32px_rgb(var(--scrim-rgb)/0.08)] dark:shadow-[0_12px_44px_rgb(var(--scrim-rgb)/0.45)]
              ${
                isDragging
                  ? "border-primary border-dashed bg-primary/5 ring-4 ring-primary/15 scale-[1.005]"
                  : "border-line-strong hover:border-primary/35 focus-within:border-primary/60 focus-within:shadow-[0_0_0_3px_rgb(var(--primary-rgb)/0.12),0_12px_36px_rgb(var(--scrim-rgb)/0.1)]"
              }
            `}
          >
            {/* Drag overlay notice if dragging */}
            {isDragging && (
              <div className="absolute inset-0 z-20 rounded-3xl bg-primary/10 backdrop-blur-xs flex items-center justify-center border-2 border-dashed border-primary pointer-events-none animate-in fade-in duration-150">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface shadow-md text-primary-text font-semibold text-xs">
                  <FiImage className="w-4 h-4 animate-bounce" />
                  <span>Drop image here to attach</span>
                </div>
              </div>
            )}

            {/* Top Shelf: Image Attachment Pill */}
            {selectedImage && (
              <div className="px-4 pt-3 pb-1 flex items-center">
                <div className="inline-flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-surface-hover border border-line-strong shadow-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-primary/30 shrink-0 bg-surface">
                    <img
                      src={selectedImage.previewUrl}
                      alt="Attachment thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 max-w-[180px] sm:max-w-[240px]">
                    <span className="truncate text-xs font-semibold text-fg">
                      {selectedImage.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-fg-muted">
                      <span>{selectedImage.size}</span>
                      <span>·</span>
                      <span className="text-primary-text font-medium flex items-center gap-0.5">
                        <IoSparkles className="w-2.5 h-2.5" />
                        Vision Ready
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    title="Remove image"
                    className="p-1.5 rounded-full text-fg-muted hover:text-error-text hover:bg-error/10 transition-colors ml-1 cursor-pointer"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Textarea Field */}
            <div className="px-4 pt-3 pb-1">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isStreaming
                    ? "Nexora AI is streaming response..."
                    : selectedImage
                      ? "Ask anything about this image or request analysis..."
                      : "Ask anything, brainstorm ideas, generate code, or drop an image..."
                }
                disabled={isLoading || isStreaming}
                className="w-full rounded-lg bg-transparent p-2 hover:border border-line-strong pointer-events-auto cursor-text text-fg placeholder:text-fg-muted/70 text-sm sm:text-[15px] outline-none resize-none leading-relaxed min-h-[44px] max-h-[180px] overflow-y-auto no-scrollbar"
              />
            </div>

            {/* Integrated Bottom Controls Toolbar */}
            <div className="px-3 pb-2.5 pt-1.5 flex items-center justify-between gap-2 border-t border-line/40">
              {/* Left Action Buttons & Badges */}
              <div className="flex items-center gap-2">
                {/* Image Attach Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach an image for optical analysis"
                  disabled={isLoading || isStreaming}
                  className="px-2.5 py-1.5 rounded-xl text-fg-muted hover:text-primary-text hover:bg-primary/10 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5 group border border-transparent hover:border-line-strong"
                >
                  <FiImage className="w-4 h-4 group-hover:scale-110 transition-transform text-fg-muted group-hover:text-primary-text" />
                  <span className="text-xs font-medium hidden sm:inline">
                    Attach Image
                  </span>
                </button>

                {/* Model Engine Selector with Pro Lock Badges */}
                <ModelSelector
                  currentModel={currentModel}
                  userTier={userTier}
                  disabled={isLoading || isStreaming}
                  onSelectModel={(newModel) => {
                    setCurrentModel(newModel);
                    try {
                      const saved = JSON.parse(
                        localStorage.getItem("nexora_user_settings") || "{}",
                      );
                      localStorage.setItem(
                        "nexora_user_settings",
                        JSON.stringify({ ...saved, defaultModel: newModel }),
                      );
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                  onLockedModelClick={(errData) => {
                    setModalLimitData(errData);
                    setIsUsageModalOpen(true);
                  }}
                />
              </div>

              {/* Right Action: Send / Stop button */}
              <div className="flex items-center gap-2">
                {input.length > 100 && (
                  <span className="text-[10px] text-fg-muted font-mono hidden sm:inline">
                    {input.length} chars
                  </span>
                )}

                {isStreaming || isLoading ? (
                  <button
                    type="button"
                    onClick={stop}
                    title="Stop generating"
                    className="h-9 px-3.5 rounded-xl bg-error/15 text-error-text hover:bg-error/25 border border-error/30 flex items-center gap-1.5 font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-95 animate-pulse"
                  >
                    <FiSquare className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!input.trim() && !selectedImage}
                    title="Send message (Enter)"
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      input.trim() || selectedImage
                        ? "bg-gradient-to-tr from-brand-violet to-brand-cyan text-primary-contrast shadow-md shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95"
                        : "bg-surface-hover text-fg-muted/40 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <FiSend className="w-4 h-4 translate-x-[-0.5px] translate-y-[0.5px]" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bottom disclaimer & shortcut hint */}
          <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] text-fg-muted text-center select-none">
            <span>Nexora AI can make mistakes. Verify sensitive details.</span>
            <span className="hidden sm:inline text-fg-muted/60">·</span>
            <span className="hidden sm:inline text-fg-muted">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface-hover border border-line text-[10px] font-mono shadow-2xs">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="px-1.5 py-0.5 rounded-md bg-surface-hover border border-line text-[10px] font-mono shadow-2xs">
                Shift + Enter
              </kbd>{" "}
              for newline
            </span>
          </div>
        </div>
      </div>

      {/* ── Usage Limit & Pro Privileges Upgrade Modal ── */}
      <UsageLimitModal
        isOpen={isUsageModalOpen}
        onClose={() => setIsUsageModalOpen(false)}
        limitData={modalLimitData}
        onInstantUpgrade={handleInstantUpgrade}
      />
    </div>
  );
};

export default AiChatBox;
