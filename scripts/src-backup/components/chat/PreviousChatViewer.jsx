import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  FiX,
  FiArrowUpRight,
  FiTrash2,
  FiMessageSquare,
  FiCpu,
  FiClock,
  FiCopy,
  FiCheck,
  FiUser,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { LoadingSpinner } from "../common/LoadingSpinner";

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
      <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-700/50">
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-slate-300 text-xs">
          <span className="font-mono text-[11px]">{match[1]}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[11px]"
          >
            {copied ? (
              <FiCheck className="w-3 h-3 text-emerald-400" />
            ) : (
              <FiCopy className="w-3 h-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: "0.85rem", background: "#111827", fontSize: "0.82rem" }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    );
  }
  return (
    <code
      className={`${className || ""} bg-violet-500/10 text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono`}
      {...props}
    >
      {children}
    </code>
  );
};

export const PreviousChatViewer = ({
  conversationId,
  isOpen,
  onClose,
  onDelete,
  serverUrl = "http://localhost:8000",
  onOpenFullChat,
}) => {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !conversationId) {
      setConversation(null);
      setMessages([]);
      setError(null);
      return;
    }

    let isMounted = true;
    const fetchChatDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${serverUrl}/api/conversations/${conversationId}`, {
          withCredentials: true,
        });

        if (isMounted) {
          setConversation(res.data.conversation || null);
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch conversation history:", err);
          setError("Failed to load previous messages for this conversation.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchChatDetails();

    return () => {
      isMounted = false;
    };
  }, [conversationId, isOpen, serverUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[820px] bg-white dark:bg-[#0c102b] rounded-3xl border border-violet-500/20 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-violet-500/15 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#090d24]/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-md shrink-0">
              <FiMessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                {conversation?.title || "Previous Chat Session"}
              </h3>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 font-medium text-violet-600 dark:text-violet-400">
                  <FiCpu className="w-3.5 h-3.5" />
                  {conversation?.model || "Gemini Flash"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiClock className="w-3.5 h-3.5" />
                  {conversation?.updatedAt
                    ? new Date(conversation.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Past conversation"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {conversationId && onOpenFullChat && (
              <button
                type="button"
                onClick={() => onOpenFullChat(conversationId)}
                className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Open in full chat interface"
              >
                <span>Continue Chat</span>
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            )}

            {conversationId && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(conversationId)}
                className="p-2 rounded-xl border border-violet-500/20 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Delete this conversation"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-violet-500/20 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-violet-500/10 transition-colors cursor-pointer"
              title="Close viewer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <LoadingSpinner label="Loading previous chat messages..." />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <p className="text-sm text-rose-500 mb-3">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <FiMessageSquare className="w-10 h-10 mb-2 opacity-40 text-violet-500" />
              <p className="text-sm font-medium">No messages recorded in this conversation.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const timeFormatted = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={msg._id || index}
                  className={`flex gap-3 sm:gap-4 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-md ${
                      isUser
                        ? "bg-gradient-to-tr from-violet-600 to-indigo-600"
                        : "bg-gradient-to-tr from-cyan-500 to-violet-600"
                    }`}
                  >
                    {isUser ? <FiUser className="w-4 h-4" /> : <IoSparkles className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-violet-600 text-white shadow-md rounded-tr-sm"
                        : "bg-slate-100 dark:bg-[#13193e] border border-violet-500/10 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {/* Image Attachment (if any) */}
                    {msg.imageUrl && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-white/20">
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="max-h-60 w-auto rounded-lg object-cover"
                        />
                      </div>
                    )}

                    {/* Text content */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm">
                        <ReactMarkdown
                          components={{
                            code: CodeBlock,
                          }}
                        >
                          {msg.content || ""}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Timestamp */}
                    {timeFormatted && (
                      <div
                        className={`text-[10px] mt-2 font-medium opacity-70 flex items-center gap-1 ${
                          isUser ? "justify-end text-white/80" : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        <FiClock className="w-2.5 h-2.5" />
                        {timeFormatted}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-violet-500/15 bg-slate-50/50 dark:bg-[#090d24]/60 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Viewing historical session • {messages.length} message{messages.length === 1 ? "" : "s"}
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-violet-500/20 text-slate-600 dark:text-slate-300 hover:bg-violet-500/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Viewer
            </button>
            {conversationId && onOpenFullChat && (
              <button
                type="button"
                onClick={() => onOpenFullChat(conversationId)}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue in Chat Room</span>
                <FiArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousChatViewer;
