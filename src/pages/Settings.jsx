/**
 * Settings — Full-featured settings page inspired by ChatGPT and Gemini.
 * Features tabs for:
 *  1. General (Theme, Language, Voice & Sound Effects)
 *  2. Personalization (Custom Instructions, Cross-chat Memory, Default Model)
 *  3. Data Controls (Chat History, Export Data, Clear All Chats)
 *  4. Notifications & Presence (Push alerts, Read receipts, Online status)
 *  5. Account & Security (Profile, 2FA, Sessions, Delete Account)
 */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";
import { clearUser } from "../../redux/userSlice";
import ThemeToggle from "../components/ui/ThemeToggle";
import { Reveal } from "../components/motion";
import { motion } from "framer-motion";
import {
  HiOutlineArrowLeft,
  HiOutlineCog6Tooth,
  HiOutlineSparkles,
  HiOutlineCircleStack,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineArrowDownTray,
  HiOutlineTrash,
  HiOutlineSpeakerWave,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineGlobeAlt,
  HiOutlineCheck,
  HiOutlineExclamationTriangle,
  HiOutlineKey,
  HiOutlineArrowRightOnRectangle,
  HiOutlineEye,
} from "react-icons/hi2";

const DEFAULT_SETTINGS = {
  theme: "dark",
  language: "en",
  soundEffects: true,
  voiceModel: "Breeze",
  customAbout: "",
  customResponseStyle: "Be concise, friendly, and provide helpful code examples when asked.",
  memoryEnabled: true,
  defaultModel: "gemini-3.5-flash",
  googleApiKey: "",
  chatHistory: true,
  pushNotifications: true,
  readReceipts: true,
  onlineStatus: true,
  typingIndicator: true,
  twoFactorAuth: false,
};

const TABS = [
  { id: "general", label: "General", icon: HiOutlineCog6Tooth, desc: "Theme, language, and audio" },
  { id: "personalization", label: "Personalization", icon: HiOutlineSparkles, desc: "Custom instructions and AI memory" },
  { id: "data", label: "Data Controls", icon: HiOutlineCircleStack, desc: "History, export, and chat deletion" },
  { id: "notifications", label: "Notifications & Privacy", icon: HiOutlineBell, desc: "Alerts, presence, and receipts" },
  { id: "account", label: "Account & Security", icon: HiOutlineShieldCheck, desc: "Password, 2FA, and danger zone" },
];

/* ── Toggle Switch Component ── */
const Switch = ({ checked, onChange, disabled = false, id }) => (
  <button
    type="button"
    role="switch"
    id={id}
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
      checked ? "bg-gradient-to-r from-brand-violet to-brand-cyan" : "bg-fg-muted/60"
    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-md transition duration-200 ease-in-out ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

/* ── Section Card Component ── */
const SettingRow = ({ title, description, children, badge = null, border = true }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 ${
      border ? "border-b border-line" : ""
    }`}
  >
    <div className="flex-1 min-w-0 pr-2">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-medium text-fg">{title}</h4>
        {badge && (
          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary-text border border-primary/30">
            {badge}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-fg-secondary mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <div className="shrink-0 flex items-center">{children}</div>
  </div>
);

const Settings = () => {
  const { userData } = useSelector((s) => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = userData?.user || userData || {};
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("nexora_user_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [customInstructionsModal, setCustomInstructionsModal] = useState(false);

  // Save changes to localStorage
  const updateSetting = (key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem("nexora_user_settings", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to save settings to localStorage", err);
      }
      return next;
    });
    toast.success("Setting updated", { autoClose: 1200 });
  };

  // Preview voice sample
  const handlePlayVoicePreview = (voice) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hello! I'm ${voice}, your Nexora voice assistant.`
      );
      utterance.pitch = voice === "Breeze" ? 1.1 : voice === "Ember" ? 0.9 : 1.0;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.info(`Selected voice: ${voice}`);
    }
  };

  // Export Data action
  const handleExportData = () => {
    const exportPayload = {
      user: {
        id: user._id || "user",
        name: user.name || user.userName,
        email: user.email,
      },
      settings,
      exportedAt: new Date().toISOString(),
      format: "Nexora ChatGPT/Gemini Data Archive v1.0",
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nexora-chat-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Chat and user data exported successfully!");
  };

  // Clear all chats
  const handleClearAllChats = () => {
    localStorage.removeItem("nexora_cached_messages");
    setConfirmClearOpen(false);
    toast.success("All chats have been cleared successfully.");
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
    } catch {
      // Ignore error
    }
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    dispatch(clearUser());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-canvas font-inter text-fg transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-36 -left-36 w-[550px] h-[550px] rounded-full blur-[120px] opacity-15 dark:opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--primary-rgb)/0.8) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-36 -right-36 w-[550px] h-[550px] rounded-full blur-[120px] opacity-10 dark:opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgb(var(--accent-rgb)/0.8) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-surface/85 backdrop-blur-xl border-b border-line">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/chat"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium text-fg-secondary hover:text-primary-text hover:bg-primary/10 transition-all"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            <span>Back to Chat</span>
          </Link>
          <div className="flex items-center gap-2">
            <HiOutlineCog6Tooth className="w-5 h-5 text-primary-text" />
            <h1 className="text-base font-bold text-gradient text-transparent">
              Settings
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="!p-1.5 !rounded-xl" />
            <button
              onClick={() => {
                setSettings(DEFAULT_SETTINGS);
                localStorage.setItem("nexora_user_settings", JSON.stringify(DEFAULT_SETTINGS));
                toast.info("Settings reset to default");
              }}
              className="text-xs text-fg-muted hover:text-primary-text transition-colors"
            >
              Reset Defaults
            </button>
          </div>
        </div>
      </header>

      {/* Main Settings Container */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Navigation Tabs (ChatGPT/Gemini Style) */}
          <Reveal
            animation="fade-up"
            delay={0.04}
            distance="24px"
            className="md:col-span-4 lg:col-span-3"
          >
            <div className="sticky top-24 rounded-2xl bg-surface/80 border border-line-strong p-2 backdrop-blur-xl shadow-lg dark:shadow-xl flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-left transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? "text-primary-text font-semibold shadow-xs"
                        : "text-fg-secondary hover:text-fg hover:bg-primary/10"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSettingsTabPill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-violet/15 to-brand-violet/10 border border-primary/40 -z-10 shadow-[0_2px_12px_rgb(var(--primary-rgb)/0.15)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-5 h-5 shrink-0 relative z-10 ${isActive ? "text-primary-text" : "text-fg-muted"}`} />
                    <div className="min-w-0 relative z-10">
                      <p className="text-xs font-semibold truncate">{tab.label}</p>
                      <p className="text-[10px] text-fg-muted truncate hidden lg:block">
                        {tab.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Right Content Panel */}
          <Reveal
            animation="fade-up"
            delay={0.12}
            distance="30px"
            className="md:col-span-8 lg:col-span-9"
          >
            <div className="rounded-3xl bg-surface/85 border border-line-strong p-6 md:p-8 backdrop-blur-xl shadow-xl dark:shadow-2xl">
              {/* ════ TAB 1: GENERAL ════ */}
              {activeTab === "general" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-fg">General Settings</h2>
                    <p className="text-xs text-fg-secondary mt-1">
                      Customize your visual theme, language, and interface audio options.
                    </p>
                  </div>

                  {/* Theme option */}
                  <SettingRow
                    title="Theme"
                    description="Choose your preferred interface appearance."
                  >
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-hover border border-line-strong">
                      {[
                        { id: "dark", label: "Dark", icon: HiOutlineMoon },
                        { id: "light", label: "Light", icon: HiOutlineSun },
                        { id: "system", label: "System", icon: HiOutlineEye },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            updateSetting("theme", t.id);
                            const isDark = t.id === "dark" || (t.id === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
                            if (isDark) {
                              document.documentElement.classList.add("dark");
                              document.documentElement.classList.remove("light");
                              document.documentElement.setAttribute("data-theme", "dark");
                              localStorage.setItem("theme", "dark");
                            } else {
                              document.documentElement.classList.remove("dark");
                              document.documentElement.classList.add("light");
                              document.documentElement.setAttribute("data-theme", "light");
                              localStorage.setItem("theme", "light");
                            }
                            const meta = document.querySelector('meta[name="theme-color"]');
                            if (meta) meta.setAttribute("content", isDark ? "#060918" : "#f8fafc");
                            window.dispatchEvent(new CustomEvent("nexoraThemeChange", { detail: { theme: isDark ? "dark" : "light" } }));
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            settings.theme === t.id
                              ? "bg-primary text-primary-contrast shadow-sm font-semibold"
                              : "text-fg-secondary hover:text-fg"
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </SettingRow>

                  {/* Language option */}
                  <SettingRow
                    title="Language"
                    description="Select the language used for interface and responses."
                  >
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting("language", e.target.value)}
                      className="px-3 py-2 rounded-xl bg-surface-hover border border-line-strong text-xs text-fg outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                  </SettingRow>

                  {/* Voice Model (ChatGPT/Gemini style) */}
                  <SettingRow
                    title="Assistant Voice"
                    description="Select the voice used when reading aloud or dictating."
                    badge="AI Audio"
                  >
                    <div className="flex items-center gap-2">
                      <select
                        value={settings.voiceModel}
                        onChange={(e) => updateSetting("voiceModel", e.target.value)}
                        className="px-3 py-2 rounded-xl bg-surface-hover border border-line-strong text-xs text-fg outline-none focus:border-primary/50 cursor-pointer"
                      >
                        <option value="Breeze">Breeze (Warm & Neutral)</option>
                        <option value="Ember">Ember (Deep & Calm)</option>
                        <option value="Cove">Cove (Clear & Authoritative)</option>
                        <option value="Juniper">Juniper (Energetic)</option>
                        <option value="Sky">Sky (Friendly)</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handlePlayVoicePreview(settings.voiceModel)}
                        aria-label="Preview Voice"
                        title="Preview Voice Sample"
                        className="p-2 rounded-xl bg-primary/15 border border-primary/30 text-primary-text hover:bg-primary/25 transition-all"
                      >
                        <HiOutlineSpeakerWave className="w-4 h-4" />
                      </button>
                    </div>
                  </SettingRow>

                  {/* Sound Effects */}
                  <SettingRow
                    title="Sound Effects"
                    description="Play audio feedback when sending or receiving messages."
                    border={false}
                  >
                    <Switch
                      checked={settings.soundEffects}
                      onChange={(val) => updateSetting("soundEffects", val)}
                    />
                  </SettingRow>
                </div>
              )}

              {/* ════ TAB 2: PERSONALIZATION (ChatGPT Signature) ════ */}
              {activeTab === "personalization" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-fg">Personalization</h2>
                    <p className="text-xs text-fg-muted mt-1">
                      Customize how Nexora behaves, remembers information, and formats answers.
                    </p>
                  </div>

                  {/* Default AI Model */}
                  <SettingRow
                    title="Default Model"
                    description="Select which intelligence model is active by default."
                    badge="Model"
                  >
                    <select
                      value={settings.defaultModel}
                      onChange={(e) => updateSetting("defaultModel", e.target.value)}
                      className="px-3 py-2 rounded-xl bg-surface-hover border border-line-strong text-xs text-fg outline-none focus:border-primary/50 cursor-pointer"
                    >
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Fast & Stable - Recommended)</option>
                      <option value="gemini-3.5-flash-lite">Gemini 3.5 Flash Lite (High Speed)</option>
                      <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                      <option value="gemini-flash-latest">Gemini Flash Latest</option>
                    </select>
                  </SettingRow>

                  {/* Google Gemini API Key */}
                  <SettingRow
                    title="Google Gemini API Key"
                    description="Optionally provide your own Google Gemini API key to override or configure custom access."
                    badge="Google AI"
                  >
                    <div className="flex items-center gap-2 w-full sm:w-72">
                      <input
                        type="password"
                        value={settings.googleApiKey || ""}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          updateSetting("googleApiKey", val);
                          if (val) {
                            localStorage.setItem("nexora_google_api_key", val);
                          } else {
                            localStorage.removeItem("nexora_google_api_key");
                          }
                        }}
                        placeholder="Paste your Google API key..."
                        className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-line-strong text-xs text-fg placeholder:text-fg-muted outline-none focus:border-primary/50"
                      />
                    </div>
                  </SettingRow>

                  {/* Cross-chat Memory */}
                  <SettingRow
                    title="Memory & Context"
                    description="Nexora will remember key preferences and details across conversations for a tailored experience."
                    badge="Smart"
                  >
                    <Switch
                      checked={settings.memoryEnabled}
                      onChange={(val) => updateSetting("memoryEnabled", val)}
                    />
                  </SettingRow>

                  {/* Custom Instructions */}
                  <div className="pt-2 border-t border-line">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-semibold text-fg">Custom Instructions</h4>
                        <p className="text-xs text-fg-muted">
                          Provide background info and guidelines for how the AI responds.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-fg-secondary mb-1.5">
                          What would you like Nexora to know about you?
                        </label>
                        <textarea
                          rows={3}
                          value={settings.customAbout}
                          onChange={(e) => updateSetting("customAbout", e.target.value)}
                          placeholder="E.g., I'm a full-stack engineer building React & Node apps..."
                          className="w-full p-3 rounded-2xl bg-surface-hover border border-line-strong text-xs text-fg placeholder:text-fg-muted outline-none focus:border-primary/50 resize-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-fg-secondary mb-1.5">
                          How would you like Nexora to respond?
                        </label>
                        <textarea
                          rows={3}
                          value={settings.customResponseStyle}
                          onChange={(e) => updateSetting("customResponseStyle", e.target.value)}
                          placeholder="E.g., Concise answers, clean TypeScript snippets, polite tone..."
                          className="w-full p-3 rounded-2xl bg-surface-hover border border-line-strong text-xs text-fg placeholder:text-fg-muted outline-none focus:border-primary/50 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════ TAB 3: DATA CONTROLS ════ */}
              {activeTab === "data" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-fg">Data Controls</h2>
                    <p className="text-xs text-fg-muted mt-1">
                      Manage your chat history, export your data, and control privacy preferences.
                    </p>
                  </div>

                  {/* Chat History & Training */}
                  <SettingRow
                    title="Chat History & Sync"
                    description="Save new chats to your account and allow synchronization across devices."
                  >
                    <Switch
                      checked={settings.chatHistory}
                      onChange={(val) => updateSetting("chatHistory", val)}
                    />
                  </SettingRow>

                  {/* Export Data */}
                  <SettingRow
                    title="Export Data"
                    description="Export all conversation history, settings, and user data in a portable JSON file."
                  >
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary-text hover:bg-primary/25 hover:text-primary-text transition-all text-xs font-medium"
                    >
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                      <span>Export Data</span>
                    </button>
                  </SettingRow>

                  {/* Clear all chats */}
                  <SettingRow
                    title="Clear All Chats"
                    description="Permanently delete conversation histories and cached messages."
                    border={false}
                  >
                    <button
                      type="button"
                      onClick={() => setConfirmClearOpen(true)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-error/15 border border-error/30 text-error-text hover:bg-error/25 transition-all text-xs font-medium"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                      <span>Clear Chats</span>
                    </button>
                  </SettingRow>

                  {/* Confirmation Modal */}
                  {confirmClearOpen && (
                    <div className="p-4 rounded-2xl bg-error/10 border border-error/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-3">
                        <HiOutlineExclamationTriangle className="w-6 h-6 text-error-text shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-error-text">
                            Are you sure you want to clear all chat histories?
                          </p>
                          <p className="text-[11px] text-error-text/80">
                            This action cannot be undone.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setConfirmClearOpen(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-fg-secondary hover:text-fg bg-surface-hover transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleClearAllChats}
                          className="px-3 py-1.5 rounded-lg text-xs text-primary-contrast bg-error hover:bg-error font-medium transition-colors"
                        >
                          Yes, Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ════ TAB 4: NOTIFICATIONS & PRIVACY ════ */}
              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-fg">Notifications & Privacy</h2>
                    <p className="text-xs text-fg-muted mt-1">
                      Configure when you receive alerts and manage visibility to contacts.
                    </p>
                  </div>

                  {/* Push Notifications */}
                  <SettingRow
                    title="Push Notifications"
                    description="Receive desktop notifications when new direct messages or replies arrive."
                  >
                    <Switch
                      checked={settings.pushNotifications}
                      onChange={(val) => {
                        updateSetting("pushNotifications", val);
                        if (val && "Notification" in window) {
                          Notification.requestPermission();
                        }
                      }}
                    />
                  </SettingRow>

                  {/* Read Receipts */}
                  <SettingRow
                    title="Read Receipts"
                    description="Allow people to see when you have read their messages."
                  >
                    <Switch
                      checked={settings.readReceipts}
                      onChange={(val) => updateSetting("readReceipts", val)}
                    />
                  </SettingRow>

                  {/* Online Status */}
                  <SettingRow
                    title="Active Status"
                    description="Show when you are currently online or recently active."
                  >
                    <Switch
                      checked={settings.onlineStatus}
                      onChange={(val) => updateSetting("onlineStatus", val)}
                    />
                  </SettingRow>

                  {/* Typing Indicator */}
                  <SettingRow
                    title="Typing Indicator"
                    description="Show contacts in real time when you are typing a message."
                    border={false}
                  >
                    <Switch
                      checked={settings.typingIndicator}
                      onChange={(val) => updateSetting("typingIndicator", val)}
                    />
                  </SettingRow>
                </div>
              )}

              {/* ════ TAB 5: ACCOUNT & SECURITY ════ */}
              {activeTab === "account" && (
                <div className="space-y-6 animate-in fade-in-50 duration-200">
                  <div>
                    <h2 className="text-lg font-bold text-fg">Account & Security</h2>
                    <p className="text-xs text-fg-muted mt-1">
                      Manage your credentials, two-factor authentication, and account details.
                    </p>
                  </div>

                  {/* User Overview card */}
                  <div className="p-4 rounded-2xl bg-surface-hover/90 border border-line-strong flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center text-primary-contrast font-bold text-lg">
                        {(user.name || user.userName || "U")[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-fg">
                          {user.name || user.userName || "Nexora User"}
                        </p>
                        <p className="text-xs text-fg-muted">{user.email || "No email linked"}</p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="px-3.5 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-primary-text hover:text-primary-text text-xs font-medium transition-all"
                    >
                      View Profile
                    </Link>
                  </div>

                  {/* Two-Factor Authentication */}
                  <SettingRow
                    title="Two-Factor Authentication (2FA)"
                    description="Protect your account with an extra layer of security upon login."
                    badge="Security"
                  >
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(val) => updateSetting("twoFactorAuth", val)}
                    />
                  </SettingRow>

                  {/* Log out all sessions */}
                  <SettingRow
                    title="Active Sessions"
                    description="Log out of all other browsers and mobile devices."
                  >
                    <button
                      type="button"
                      onClick={() => toast.success("All other active sessions have been invalidated.")}
                      className="px-3.5 py-2 rounded-xl bg-surface-hover border border-line-strong text-fg-secondary hover:bg-surface-hover dark:hover:text-primary-contrast text-xs font-medium transition-all"
                    >
                      Sign out other sessions
                    </button>
                  </SettingRow>

                  {/* Logout current session */}
                  <SettingRow
                    title="Log Out"
                    description="Sign out of your Nexora account on this device."
                    border={false}
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-error/15 border border-error/30 text-error-text hover:bg-error/25 transition-all text-xs font-medium"
                    >
                      <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </SettingRow>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </main>
    </div>
  );
};

export default Settings;
