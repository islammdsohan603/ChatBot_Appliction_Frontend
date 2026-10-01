import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import About from "./pages/About";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Profile from "./homepage/Profile";
import Settings from "./pages/Settings";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import ChatLayout from "./components/chat/ChatLayout";
import useCurrentUser from "./customHooks/getCurrentUser";
import RouteTransitionWrapper from "./components/ui/RouteTransitionWrapper";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import {
  AuthSkeleton,
  ChatSkeleton,
  ProfileSkeleton,
} from "./components/ui/PageSkeletons";

/* ── Route Guards ── */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user);
  const location = useLocation();

  if (isLoading) {
    if (location.pathname.startsWith("/profile") || location.pathname.startsWith("/settings")) {
      return <ProfileSkeleton />;
    }
    return <ChatSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user);
  const location = useLocation();

  if (isLoading) {
    return <AuthSkeleton type={location.pathname === "/login" ? "login" : "signup"} />;
  }
  if (isAuthenticated) return <Navigate to="/chat" replace />;

  return children;
};

/* ── App Root ── */
function App() {
  // Initialize user fetch on app load
  useCurrentUser();

  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  // Initialize and synchronize theme across app
  useEffect(() => {
    const syncTheme = (theme) => {
      const isDark = theme === "dark";
      setCurrentTheme(isDark ? "dark" : "light");
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      }
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", isDark ? "#060918" : "#f8fafc");
    };

    const initial = localStorage.getItem("theme") || (document.documentElement.classList.contains("dark") ? "dark" : "light");
    syncTheme(initial);

    const handleCustomChange = (e) => {
      syncTheme(e.detail?.theme || "dark");
    };
    const handleStorageChange = (e) => {
      if (e.key === "theme") {
        syncTheme(e.newValue || "dark");
      }
    };

    window.addEventListener("nexoraThemeChange", handleCustomChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("nexoraThemeChange", handleCustomChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <ErrorBoundary>
        <RouteTransitionWrapper>
          <Routes>
            {/* Public marketing pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/documentation" element={<Documentation />} />

            {/* Auth pages — redirect to /chat if already logged in */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected pages */}
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:conversationId"
              element={
                <ProtectedRoute>
                  <ChatLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <ProtectedRoute>
                  <PaymentCancel />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RouteTransitionWrapper>
      </ErrorBoundary>

      <ToastContainer
        theme={currentTheme === "dark" ? "dark" : "light"}
        position="bottom-right"
        toastClassName={
          currentTheme === "dark"
            ? "!bg-[#111840] !border !border-violet-500/20 !text-slate-200"
            : "!bg-white !border !border-violet-300/60 !text-slate-800 !shadow-lg"
        }
      />
    </>
  );
}

export default App;
