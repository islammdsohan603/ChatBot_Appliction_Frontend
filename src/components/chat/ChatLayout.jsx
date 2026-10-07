/**
 * ChatLayout — Responsive Nexora AI Chat Application with ChatGPT-style conversation history
 * Panels:
 * - Desktop: Sidebar | Main Chat | Profile (optional)
 * - Mobile: Sidebar Drawer | Main Chat
 */
import { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { clearUser } from "../../../redux/userSlice";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import ProfilePanel from "./ProfilePanel";
import AiChatBox from "./AiChatBox";
import { HiOutlineBars3, HiOutlineArrowLeft } from "react-icons/hi2";

const ChatLayout = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeHumanId, setActiveHumanId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping] = useState(false);
  const [aiConversations, setAiConversations] = useState([]);
  const [directUsers, setDirectUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const currentUser = userData?.user || userData || {};
  const currentUserId = currentUser._id || "me";
  const currentUserName = currentUser.name || currentUser.userName || "You";

  const serverUrl =
    import.meta.env.VITE_SERVER_URL ||
    import.meta.env.NEXT_PUBLIC_SERVER_URL ||
    "http://localhost:8000";

  // 1. Fetch AI Conversations for the sidebar
  const fetchAiConversations = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/conversations`, {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setAiConversations(
          response.data.map((c) => ({
            ...c,
            isAi: true,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch AI conversations:", error);
    }
  }, [serverUrl]);

  // 2. Fetch Direct Users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/user/all`, {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setDirectUsers(
          response.data.map((u) => ({
            id: u._id,
            _id: u._id,
            name: u.name || u.userName,
            title: u.name || u.userName,
            lastMessage: "Start a conversation",
            timestamp: u.updatedAt,
            unread: 0,
            status: "offline",
            isGroup: false,
            isAi: false,
            avatar: u.image,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [serverUrl]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAiConversations(), fetchUsers()]);
      setIsLoading(false);
    };
    initializeData();
  }, [fetchAiConversations, fetchUsers]);

  // 3. Sync Human conversation messages when activeHumanId changes
  useEffect(() => {
    if (!activeHumanId) return;

    let isMounted = true;
    const fetchHumanMessages = async () => {
      setIsMessagesLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/chat/${activeHumanId}`, {
          withCredentials: true,
        });

        if (!isMounted) return;

        const formatted = (response.data || []).map((msg) => ({
          id: msg._id,
          text: msg.message,
          attachments: msg.attachments || [],
          timestamp: msg.createdAt,
          senderId: msg.senderId,
          senderName: msg.senderId === currentUserId ? "You" : "User",
          status: "sent",
          reactions: [],
        }));

        setMessages(formatted);
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load direct chat history");
      } finally {
        if (isMounted) {
          setIsMessagesLoading(false);
        }
      }
    };

    fetchHumanMessages();

    return () => {
      isMounted = false;
    };
  }, [activeHumanId, serverUrl, currentUserId]);

  // Handle selecting an item from the sidebar
  const handleSelectConversation = useCallback(
    (id) => {
      const isDirectUser = directUsers.some((u) => (u._id || u.id) === id);

      if (isDirectUser) {
        setActiveHumanId(id);
        navigate("/chat");
      } else {
        setActiveHumanId(null);
        navigate(`/chat/${id}`);
      }
      setSidebarOpen(false);
    },
    [directUsers, navigate]
  );

  // Handle "+ New Chat" action
  const handleNewChat = useCallback(() => {
    setActiveHumanId(null);
    navigate("/chat");
    setSidebarOpen(false);
  }, [navigate]);

  // Handle deletion of an AI conversation
  const handleDeleteConversation = useCallback(
    async (id) => {
      if (!id) return;

      // Guard: Do not attempt to delete direct user contacts via conversations API
      const isDirectUser = directUsers.some((u) => (u._id || u.id) === id);
      if (isDirectUser) {
        return;
      }

      try {
        await axios.delete(`${serverUrl}/api/conversations/${id}`, {
          withCredentials: true,
        });
        setAiConversations((prev) => prev.filter((c) => (c._id || c.id) !== id));
        toast.success("Conversation deleted");

        if (conversationId === id) {
          navigate("/chat");
        }
      } catch (error) {
        // If 404 (already deleted or not found), remove from local state gracefully
        if (error.response?.status === 404) {
          setAiConversations((prev) => prev.filter((c) => (c._id || c.id) !== id));
          toast.info("Conversation removed");
          if (conversationId === id) {
            navigate("/chat");
          }
        } else {
          console.error("Delete conversation error:", error);
          toast.error("Failed to delete conversation");
        }
      }
    },
    [conversationId, directUsers, navigate, serverUrl]
  );

  // Handle renaming of an AI conversation
  const handleRenameConversation = useCallback(
    async (id, newTitle) => {
      if (!id || !newTitle.trim()) return;
      try {
        await axios.put(`${serverUrl}/api/conversations/${id}`, { title: newTitle }, { withCredentials: true });
        setAiConversations((prev) =>
          prev.map((c) => ((c._id || c.id) === id ? { ...c, title: newTitle } : c))
        );
        toast.success("Conversation renamed");
      } catch (error) {
        console.error("Rename error:", error);
        toast.error("Failed to rename conversation");
      }
    },
    [serverUrl]
  );

  // Optimistic update when new session created during streaming
  const handleSessionCreated = useCallback(
    (newConv) => {
      setAiConversations((prev) => [
        { ...newConv, isAi: true },
        ...prev.filter((c) => (c._id || c.id) !== newConv._id),
      ]);
      navigate(`/chat/${newConv._id}`, { replace: true });
    },
    [navigate]
  );

  // Update conversation snippet and order when AI response finishes
  const handleConversationUpdated = useCallback(
    (lastSnippet) => {
      if (conversationId) {
        setAiConversations((prev) => {
          const matchIndex = prev.findIndex((c) => (c._id || c.id) === conversationId);
          if (matchIndex === -1) return prev;

          const updatedItem = {
            ...prev[matchIndex],
            lastMessage: lastSnippet.slice(0, 100),
            updatedAt: new Date().toISOString(),
          };

          const remaining = prev.filter((_, idx) => idx !== matchIndex);
          return [updatedItem, ...remaining];
        });
      }
    },
    [conversationId]
  );

  // Handle peer-to-peer human message submission
  const handleSendHumanMessage = useCallback(
    async (payload) => {
      const textContent = typeof payload === "string" ? payload : payload?.text || "";
      const attachments = typeof payload === "object" ? payload?.attachments || [] : [];
      if (!textContent && attachments.length === 0) return;

      if (!activeHumanId) return;

      try {
        const response = await axios.post(
          `${serverUrl}/api/chat/send/${activeHumanId}`,
          {
            message: textContent,
            attachments,
          },
          { withCredentials: true }
        );

        const savedChat = response.data?.chat;
        const newMessage = {
          id: savedChat?._id || `msg-${Date.now()}`,
          text: savedChat?.message || textContent,
          attachments: savedChat?.attachments || attachments,
          timestamp: savedChat?.createdAt || new Date().toISOString(),
          senderId: currentUserId,
          senderName: currentUserName,
          status: "sent",
          reactions: [],
        };

        setMessages((prev) => [...prev, newMessage]);

        // Update preview in direct users list
        setDirectUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === activeHumanId
              ? {
                  ...u,
                  lastMessage: textContent || "Attachment",
                  timestamp: new Date().toISOString(),
                }
              : u
          )
        );
      } catch (error) {
        console.error("Failed to store chat message:", error);
        toast.error(error.response?.data?.message || "Failed to send chat message");
      }
    },
    [activeHumanId, currentUserId, currentUserName, serverUrl]
  );

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
    } catch {
      // Logout anyway
    }
    dispatch(clearUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const activeAiConversation = aiConversations.find(
    (c) => (c._id || c.id) === conversationId
  );
  const activeHumanContact = directUsers.find(
    (u) => (u._id || u.id) === activeHumanId
  );

  // Combine lists for sidebar
  const sidebarConversations = [...aiConversations, ...directUsers];
  const activeSidebarId = activeHumanId || conversationId || null;

  return (
    <div className="h-screen max-h-screen h-[100dvh] w-full flex bg-canvas overflow-hidden font-inter transition-colors duration-200">
      {/* ════ LEFT SIDEBAR ════ */}
      <ChatSidebar
        user={{
          userName: currentUserName,
          email: currentUser.email,
          image: currentUser.image,
          name: currentUser.name,
        }}
        conversations={sidebarConversations}
        activeId={activeSidebarId}
        onSelect={handleSelectConversation}
        onNewChat={handleNewChat}
        onDelete={handleDeleteConversation}
        onRename={handleRenameConversation}
        onLogout={handleLogout}
        isLoading={isLoading}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ════ MAIN CHAT AREA ════ */}
      <main className="flex-1 min-h-0 min-w-0 flex flex-col h-full max-h-screen overflow-hidden relative">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface/80 backdrop-blur-sm md:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-2 rounded-xl text-fg-secondary hover:text-primary-text hover:bg-primary/10 transition-all cursor-pointer"
          >
            <HiOutlineBars3 className="w-5 h-5" />
          </button>
          <span className="text-base font-bold gradient-text">NEXORA</span>
          <div className="w-9" />
        </div>

        {/* Direct Human Chat View */}
        {activeHumanContact ? (
          <div className="flex-1 min-h-0 flex flex-col h-full max-h-full overflow-hidden">
            <ChatHeader
              contact={{
                name: activeHumanContact.name,
                status: activeHumanContact.status,
              }}
              onProfileToggle={() => setProfileOpen((v) => !v)}
              onBack={() => setActiveHumanId(null)}
              showBack
            />
            <MessageList
              messages={messages}
              isTyping={isTyping}
              typingUser={activeHumanContact.name}
              currentUserId={currentUserId}
              isLoading={isMessagesLoading}
            />
            <ChatInput
              onSend={handleSendHumanMessage}
              placeholder={`Message ${activeHumanContact.name}…`}
            />
          </div>
        ) : (
          /* Nexora AI Chat View (Both for /chat and /chat/:conversationId) */
          <div className="flex-1 min-h-0 flex flex-col h-full max-h-full overflow-hidden">
            <AiChatBox
              conversationId={conversationId || null}
              activeConversation={activeAiConversation}
              onSessionCreated={handleSessionCreated}
              onConversationUpdated={handleConversationUpdated}
              onNewChat={handleNewChat}
              onDeleteConversation={handleDeleteConversation}
              className="flex-1 min-h-0 rounded-none border-0 shadow-none max-w-full bg-transparent dark:bg-transparent"
            />
          </div>
        )}
      </main>

      {/* ════ RIGHT PROFILE PANEL ════ */}
      {activeHumanContact && (
        <ProfilePanel
          contact={{
            name: activeHumanContact.name,
            userName: activeHumanContact.name.toLowerCase().replace(/\s+/g, ""),
            status: activeHumanContact.status,
            about: "Connected via Nexora Direct Messaging.",
          }}
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatLayout;
